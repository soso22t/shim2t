import { useState } from "react";
import waxSeal from "@/assets/0F85550C-A3B7-4BAC-9FAC-EAC702C30B90.png";

interface EnvelopeProps {
  onOpen: () => void;
}

const Envelope = ({ onOpen }: EnvelopeProps) => {
  const [opening, setOpening] = useState(false);

  // دالة تشغيل الفتح عند الضغط على الختم فقط
  const handleSealClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (opening) return;
    setOpening(true);
    setTimeout(onOpen, 2100);
  };

  return (
    <div
      className="fixed inset-0 z-40 overflow-hidden pointer-events-auto"
      style={{ perspective: "2000px" }}
    >
      {/* نصفين الظرف (شفافين بدون ألوان خلفية) */}
      <div className="absolute inset-0 flex">
        
        {/* النصف الأيمن - شفاف تماماً يظهر الموقع خلفه */}
        <div
          className="absolute top-0 right-0 h-full w-1/2 bg-transparent backdrop-blur-[2px]"
          style={{
            transition: "transform 2s cubic-bezier(0.65, 0, 0.35, 1) 0.08s, box-shadow 2s ease-out 0.08s",
            transform: opening ? "translateX(110%)" : "translateX(0)",
            boxShadow: opening ? "-30px 0 60px rgba(0,0,0,0.5)" : "none",
          }}
        >
          {/* انعكاس خفيف جداً لإعطاء إيحاء خام مادي بدون لون */}
          <div className="absolute inset-0 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
        </div>

        {/* النصف الأيسر - شفاف تماماً يظهر الموقع خلفه */}
        <div
          className="absolute top-0 left-0 h-full w-1/2 bg-transparent backdrop-blur-[2px]"
          style={{
            transition: "transform 2s cubic-bezier(0.65, 0, 0.35, 1), box-shadow 2s ease-out",
            transform: opening ? "translateX(-110%)" : "translateX(0)",
            boxShadow: opening ? "30px 0 60px rgba(0,0,0,0.5)" : "none",
          }}
        >
          {/* انعكاس خفيف جداً */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
        </div>

        {/* خط المنتصف العمودي */}
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px pointer-events-none"
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            opacity: opening ? 0 : 1,
            transition: "opacity 0.6s ease-out",
          }}
        />

        {/* الختم الدائري - بدون إطار ولا ظل ضخم، مع تأثير ضغط يصغر عند النقر */}
        <div
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50 pointer-events-none"
          style={{
            opacity: opening ? 0 : 1,
            transition: "opacity 0.5s ease-out",
          }}
        >
          <button
            onClick={handleSealClick}
            className="pointer-events-auto cursor-pointer border-none outline-none bg-transparent p-0 transition-transform duration-150 ease-in-out active:scale-90 hover:scale-105"
            style={{ border: "none", outline: "none", boxShadow: "none" }}
          >
            <div className="animate-float-slow">
              <img
                src={waxSeal}
                alt="ختم الدعوة"
                className="w-44 h-44 sm:w-52 sm:h-52 object-contain filter-none"
                style={{
                  filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))",
                }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* نص التوجيه */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-sm font-arabic animate-pulse z-10 pointer-events-none drop-shadow-md"
        style={{ color: "#FFFFFF", opacity: opening ? 0 : 1 }}
      >
        اضغط على الختم لفتح الدعوة
      </div>
    </div>
  );
};

export default Envelope;
