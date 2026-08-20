/**
 * Temple Heritage PDF logo helpers.
 * Loads public/logo.png at PDF download time.
 */

export const LOGO_FORMAT: "PNG" | "JPEG" = "PNG";
export const LOGO_WIDTH_PX = 1536;
export const LOGO_HEIGHT_PX = 1536;

export async function getLogoDataUrl(): Promise<string> {
  const response = await fetch("/logo.png", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Unable to load PDF logo (${response.status}).`);
  }

  const blob = await response.blob();

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Unable to convert logo to a data URL."));
        return;
      }

      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(new Error("Unable to read the PDF logo."));
    };

    reader.readAsDataURL(blob);
  });
}
