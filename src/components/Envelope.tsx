import { useState, useEffect } from "react";
import waxSealImg from "@/assets/0F85550C-A3B7-4BAC-9FAC-EAC702C30B90.png";

interface EnvelopeProps {
  onOpen: () => void;
}

const Envelope = ({ onOpen }: EnvelopeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // منع التمرير والسحب قبل فتح الظرف
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
    }, 1000);
  };

  if (isHidden) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-1000 ${
        isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* 1. الطية اليسرى الشفافة */}
      <div
        className={`absolute top-0 bottom-0 left-0 w-1/2 border-r border-white/30 backdrop-blur-sm transition-transform duration-1000 ease-in-out z-10 ${
          isOpen ? "-translate-x-full" : "translate-x-0"
        }`}
        style={{
          background: "rgba(255, 255, 255, 0.20)",
        }}
      />

      {/* 2. الطية اليمنى الشفافة */}
      <div
        className={`absolute top-0 bottom-0 right-0 w-1/2 border-l border-white/30 backdrop-blur-sm transition-transform duration-1000 ease-in-out z-10 ${
          isOpen ? "translate-x-full" : "translate-x-0"
        }`}
        style={{
          background: "rgba(255, 255, 255, 0.20)",
        }}
      />

      {/* 3. الملصق الدائري بظل أكثر تغميقاً وبروزاً */}
      <button
        onClick={handleOpen}
        className={`relative z-20 flex items-center justify-center cursor-pointer transition-all duration-700 ${
          isOpen ? "scale-150 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <img
          src={waxSealImg}
          alt="الختم"
          className="w-44 h-44 sm:w-52 sm:h-52 rounded-full object-contain transition-transform duration-300 hover:scale-105 active:scale-95"
          style={{
            filter: "drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.55))",
          }}
        />
      </button>
    </div>
  );
};

export default Envelope;
