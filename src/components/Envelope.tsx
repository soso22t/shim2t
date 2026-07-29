import { useState, useEffect } from "react";
import waxSealImg from "@/assets/0F85550C-A3B7-4BAC-9FAC-EAC702C30B90.png";

interface EnvelopeProps {
  onOpen: () => void;
}

const Envelope = ({ onOpen }: EnvelopeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // منع السكرول والحركة في الصفحة تماماً أثناء وجود الظرف مغلقاً
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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-1000 ${
        isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        backgroundColor: "rgba(233, 221, 212, 0.4)", // تخفيف شفافية خلفية الشاشة
        backdropFilter: "blur(4px)",
      }}
    >
      <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/3] flex items-center justify-center overflow-hidden rounded-3xl shadow-2xl">
        
        {/* الطية اليسرى للظرف الشفاف */}
        <div
          className={`absolute top-0 bottom-0 left-0 w-1/2 border-r border-white/40 backdrop-blur-md transition-transform duration-1000 ease-in-out z-10 ${
            isOpen ? "-translate-x-full" : "translate-x-0"
          }`}
          style={{
            background: "rgba(255, 255, 255, 0.25)", // شفافية خفيفة ناعمة
          }}
        />

        {/* الطية اليمنى للظرف الشفاف */}
        <div
          className={`absolute top-0 bottom-0 right-0 w-1/2 border-l border-white/40 backdrop-blur-md transition-transform duration-1000 ease-in-out z-10 ${
            isOpen ? "translate-x-full" : "translate-x-0"
          }`}
          style={{
            background: "rgba(255, 255, 255, 0.25)", // شفافية خفيفة ناعمة
          }}
        />

        {/* ملصق / ختم الشمع الأصلي بالصورة المطلوبة */}
        <button
          onClick={handleOpen}
          className={`relative z-20 flex flex-col items-center justify-center group cursor-pointer transition-all duration-700 ${
            isOpen ? "scale-150 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          <img
            src={waxSealImg}
            alt="الختم"
            className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-xl transition-transform duration-300 group-hover:scale-105 active:scale-95"
          />
        </button>

      </div>
    </div>
  );
};

export default Envelope;
