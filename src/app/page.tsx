import Link from "next/link";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f4] text-[#2d2d2a]">
      <Nav />

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-6">
        <div className="w-full max-w-2xl space-y-5 text-center">
          {/* Main heading */}
          <div>
            <h1 className="font-serif text-5xl font-light italic leading-[1.15] tracking-tight text-[#2d2d2a]">
              Make work feel like art
            </h1>
          </div>

          {/* Divider */}
          <div className="mx-auto w-20 border-t border-[#2d2d2a] opacity-10"></div>

          {/* Garden Image - Museum Frame */}
          <div className="relative overflow-hidden border-[16px] border-[#f0ede6] shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            <div className="border border-[#d4cfc3]">
              <img
                src="/garden-wallpaper.jpeg"
                alt="Whimsical garden"
                className="h-auto w-full max-h-[340px] object-cover object-center"
              />
            </div>
          </div>

          {/* Poetry */}
          <div className="space-y-2.5 font-light leading-relaxed">
            <p className="text-[13px] italic text-[#6b6b66] tracking-wide">
              Each hour, a seed planted.
            </p>
            <p className="text-[13px] italic text-[#6b6b66] tracking-wide">
              Each session, tending to what grows.
            </p>
            <p className="text-[13px] italic text-[#6b6b66] tracking-wide">
              Watch your garden bloom.
            </p>
          </div>

          {/* Divider */}
          <div className="mx-auto w-20 border-t border-[#2d2d2a] opacity-10"></div>

          {/* CTA */}
          <div>
            <Link
              href="/focus"
              className="inline-block border border-[#2d2d2a] border-opacity-20 bg-[#fdfcfa] px-14 py-3.5 text-[11px] font-light uppercase tracking-[0.2em] text-[#2d2d2a] transition-all hover:border-opacity-40 hover:bg-[#f5f4f1] hover:shadow-md"
            >
              Begin
            </Link>
          </div>
        </div>
      </main>

    </div>
  );
}
