import { useState, useEffect } from "react";

interface EnvelopeProps {
  onOpen: () => void;
}

const Envelope = ({ onOpen }: EnvelopeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // منع السكرول والتمرير ما دام الظرف مفتوحاً/موجوداً
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none"; // لمنع السحب في الجوال
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
    }, 1000);
  };

  if (isHidden) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-1000 ${
        isOpen ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      }`}
      style={{
        backgroundColor: "rgba(233, 221, 212, 0.92)", // خلفية شفافة ناعمة
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/3] flex items-center justify-center">
        {/* جسم الظرف بشفافية مخففة ناعمة */}
        <div
          className="absolute inset-0 rounded-3xl border border-white/50 shadow-2xl transition-all duration-700"
          style={{
            background: "rgba(255, 255, 255, 0.35)", // شفافية مخففة للظرف
            backdropFilter: "blur(12px)",
          }}
        />

        {/* ختم فتح الدعوة */}
        <button
          onClick={handleOpen}
          className="relative z-10 flex flex-col items-center justify-center gap-2 group cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          {/* دائرة الختم الزجاجية الشفافة */}
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/60 shadow-xl flex items-center justify-center transition-all duration-300 group-hover:shadow-2xl"
            style={{
              background: "rgba(255, 255, 255, 0.45)",
              backdropFilter: "blur(10px)",
            }}
          >
            <span
              className="font-arabic text-xl sm:text-2xl font-bold"
              style={{ color: "#5F4F41" }}
            >
              افتح
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Envelope;
