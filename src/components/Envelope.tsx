import { useState, useRef } from "react";
import envelopeVideo from "@/assets/video-output-F33084AB-889B-43FF-A197-8E335CE20FA0-1.mp4";

interface EnvelopeProps {
  onOpen: () => void;
}

const Envelope = ({ onOpen }: EnvelopeProps) => {
  const [opening, setOpening] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const trigger = async () => {
    if (opening) return;

    setOpening(true);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      await videoRef.current.play();
    }
  };

  const handleEnded = () => {
    setFadeOut(true);

    setTimeout(() => {
      onOpen();
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-40 cursor-pointer overflow-hidden"
      style={{
        background: "hsl(30 35% 18%)",
      }}
      onClick={trigger}
    >

      <video
        ref={videoRef}
        src={envelopeVideo}
        muted
        playsInline
        preload="auto"
        onEnded={handleEnded}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
      />


      {!opening && (
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-sm font-arabic animate-pulse z-10"
          style={{
            color: "white",
            textShadow: "0 2px 8px rgba(0,0,0,.5)",
          }}
        >
          اضغط لفتح الدعوة
        </div>
      )}

    </div>
  );
};

export default Envelope;