import { useState } from "react";
import waxSeal from "@/assets/0F85550C-A3B7-4BAC-9FAC-EAC702C30B90.png";

interface EnvelopeProps {
  onOpen: () => void;
}

const Envelope = ({ onOpen }: EnvelopeProps) => {
  const [opening, setOpening] = useState(false);

  // دالة تشغيل الفتح عند الضغط على الختم فقط
  const handleSealClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // منع الضغط عن باقي الصفحة
    if (opening) return;
    setOpening(true);
    setTimeout(onOpen, 2100);
  };

  return (
    <div
      className="fixed inset-0 z-40 overflow-hidden pointer-events-auto"
      style={{ perspective: "2000px" }}
    >
      {/* نصفين الظرف المتلاقين في المنتصف */}
      <div className="absolute inset-0 flex">
        
        {/* النصف الأيمن: شفاف + تمويه خفيف ليتضح خلفه أول جزء من الموقع */}
        <div
          className="absolute top-0 right-0 h-full w-1/2"
          style={{
            transition: "transform 2s cubic-bezier(0.65, 0, 0.35, 1) 0.08s",
            transform: opening ? "translateX(110%)" : "translateX(0)",
            backgroundColor: "rgba(0, 0, 0, 0.25)", // لون داكن خفيف جداً لإبراز الشفافية
            backdropFilter: "blur(12px)", // تمويه يعكس الصورة اللي تحته بشكل ضبابي
            WebkitBackdropFilter: "blur(12px)",
          }}
        />

        {/* النصف الأيسر: شفاف + تمويه خفيف */}
        <div
          className="absolute top-0 left-0 h-full w-1/2"
          style={{
            transition: "transform 2s cubic-bezier(0.65, 0, 0.35, 1)",
            transform: opening ? "translateX(-110%)" : "translateX(0)",
            backgroundColor: "rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        />

        {/* خط المنتصف العمودي الفاصل */}
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px pointer-events-none"
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            opacity: opening ? 0 : 1,
            transition: "opacity 0.6s ease-out",
          }}
        />

        {/* الختم/الملصق الدائري - بدون أي ظل نهائياً وبدون حواف + إيحاء انقراص عند النقر */}
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
            style={{ 
              border: "none", 
              outline: "none", 
              boxShadow: "none",
              WebkitTapHighlightColor: "transparent"
            }}
          >
            <div className="animate-float-slow">
              <img
                src={waxSeal}
                alt="ختم الدعوة"
                className="w-44 h-44 sm:w-52 sm:h-52 object-contain"
                style={{
                  filter: "none", // إلغاء جميع الظلال تماماً
                  boxShadow: "none",
                  border: "none"
                }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* نص التوجيه بالأسفل */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-sm font-arabic animate-pulse z-10 pointer-events-none drop-shadow-sm"
        style={{ color: "#FFFFFF", opacity: opening ? 0 : 1 }}
      >
        اضغط على الختم لفتح الدعوة
      </div>
    </div>
  );
};

export default Envelope;
