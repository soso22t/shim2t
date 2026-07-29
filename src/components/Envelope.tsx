import { useState, useEffect } from "react";
import waxSealImg from "@/assets/wax-seal.png";

interface EnvelopeProps {
  onOpen: () => void;
}

const Envelope = ({ onOpen }: EnvelopeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // قفل السكرول والتمرير تماماً حتى يتم فتح الظرف
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    onOpen();
    setTimeout(() => {
      setIsHidden(true);
    }, 1200);
  };

  if (isHidden) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-1000 ${
        isOpen ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      }`}
      style={{
        backgroundColor: "rgba(233, 221, 212, 0.85)", // تخفيف الشفافية
        backdropFilter: "blur(6px)",
      }}
    >
      <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/3] flex items-center justify-center">
        {/* خلفية الظرف الأصلية مع تخفيف الشفافية فقط */}
        <div
          className="absolute inset-0 rounded-3xl border border-white/60 shadow-2xl transition-all duration-700"
          style={{
            background: "rgba(255, 255, 255, 0.45)", // الشفافية الجديدة المخففة
            backdropFilter: "blur(10px)",
          }}
        />

        {/* ملصق / ختم الشمع الأصلي بدون النص السفلّي */}
        <button
          onClick={handleOpen}
          className="relative z-10 flex flex-col items-center justify-center group cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          <img
            src={waxSealImg}
            alt="الختم"
            className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-xl transition-transform duration-500 group-hover:rotate-12"
          />
        </button>
      </div>
    </div>
  );
};

export default Envelope;
