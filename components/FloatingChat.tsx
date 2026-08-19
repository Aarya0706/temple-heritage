import Link from "next/link";

export function FloatingChat() {
  return (
    <Link href="/assistant" className="floating-chat" aria-label="Open Temple AI Assistant">
      🤖
    </Link>
  );
}
