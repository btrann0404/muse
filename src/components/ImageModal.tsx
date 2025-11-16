"use client";

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function ImageModal({ src, alt, onClose }: ImageModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d2d2a] bg-opacity-95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-h-[90vh] max-w-[90vw] border-[12px] border-[#f0ede6] shadow-2xl">
        <img
          src={src}
          alt={alt}
          className="max-h-[90vh] max-w-[90vw] object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={onClose}
          className="absolute right-4 top-4 border border-[#fdfcfa] border-opacity-30 bg-[#2d2d2a] bg-opacity-80 px-4 py-2 text-xs font-light uppercase tracking-wider text-[#fdfcfa] backdrop-blur-sm transition-all hover:bg-[#fdfcfa] hover:text-[#2d2d2a]"
        >
          Close
        </button>
      </div>
    </div>
  );
}

