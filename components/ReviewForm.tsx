"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X, ImagePlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import StarRating from "./StarRating";

const MAX_PHOTOS = 3;
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB, checked before upload starts
const MAX_DIMENSION = 1600;

// Downscale large photos client-side before upload so a 12MP phone photo
// doesn't turn into a slow upload and a bloated storage bill.
function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Compression failed"))),
        "image/jpeg",
        0.8
      );
    };
    img.onerror = () => reject(new Error("Could not read image"));
    img.src = url;
  });
}

export default function ReviewForm({
  templeSlug,
  onSubmitted,
}: {
  templeSlug: string;
  onSubmitted?: () => void;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setError(null);

    const room = MAX_PHOTOS - files.length;
    const next = Array.from(incoming).slice(0, room);

    for (const file of next) {
      if (file.size > MAX_FILE_BYTES) {
        setError(`"${file.name}" is over 5MB — please choose a smaller photo.`);
        continue;
      }
      setFiles((prev) => [...prev, file]);
      setPreviews((prev) => [...prev, URL.createObjectURL(file)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating < 1) {
      setError("Please select a star rating.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/login?redirect=/temples/${templeSlug}#reviews`);
        return;
      }

      const reviewId = crypto.randomUUID();
      const photoPaths: string[] = [];

      for (const [i, file] of files.entries()) {
        const compressed = await resizeImage(file);
        const path = `${user.id}/${reviewId}/${i}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("review-photos")
          .upload(path, compressed, { contentType: "image/jpeg" });

        if (uploadError) throw new Error(uploadError.message);
        photoPaths.push(path);
      }

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: reviewId,
          temple_slug: templeSlug,
          rating,
          review_text: text.trim() || null,
          photo_paths: photoPaths,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          res.status === 409
            ? "You've already reviewed this temple."
            : data.error || "Something went wrong."
        );
      }

      setRating(0);
      setText("");
      setFiles([]);
      setPreviews([]);
      onSubmitted?.();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "white",
        border: "1px solid #f0ddc8",
        borderRadius: 14,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        marginBottom: 28,
      }}
    >
      <div>
        <span style={{ display: "block", fontSize: 13, color: "#9b6958", marginBottom: 6 }}>
          Your rating
        </span>
        <StarRating value={rating} onChange={setRating} size={24} />
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={1000}
        rows={4}
        placeholder="Share what your visit was like — timings, crowd, atmosphere..."
        style={{
          width: "100%",
          border: "1px solid #f0ddc8",
          borderRadius: 10,
          padding: 12,
          font: "inherit",
          resize: "vertical",
        }}
      />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {previews.map((src, i) => (
          <div key={i} style={{ position: "relative", width: 72, height: 72 }}>
            <img
              src={src}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
            />
            <button
              type="button"
              onClick={() => removeFile(i)}
              aria-label="Remove photo"
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#4d0909",
                color: "white",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {files.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: 72,
              height: 72,
              borderRadius: 8,
              border: "1px dashed #d8b79c",
              background: "#fff8f1",
              color: "#a52d15",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ImagePlus size={20} />
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {error && <p style={{ color: "#a52d15", fontSize: 14, margin: 0 }}>{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary"
        style={{
          background: "#a52d15",
          color: "white",
          alignSelf: "flex-start",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {submitting && <Loader2 size={15} className="animate-spin" />}
        {submitting ? "Posting..." : "Post review"}
      </button>
    </form>
  );
}