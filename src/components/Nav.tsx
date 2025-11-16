import Link from "next/link";

export default function Nav() {
  return (
    <nav className="border-b border-[#2d2d2a] border-opacity-5 bg-[#f8f7f4]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-light italic tracking-tight text-[#2d2d2a] transition-opacity hover:opacity-60">
            Muse
          </Link>
          <div className="flex gap-8 text-[#6b6b66]">
            <Link href="/friends" className="text-sm font-light transition-colors hover:text-[#2d2d2a]">
              Friends
            </Link>
            <Link href="/focus" className="text-sm font-light transition-colors hover:text-[#2d2d2a]">
              Focus
            </Link>
            <Link href="/profile" className="text-sm font-light transition-colors hover:text-[#2d2d2a]">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

