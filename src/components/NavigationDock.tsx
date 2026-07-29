import { useState, useEffect, useRef } from "react";
import { Phone, Music, Camera, MapPin, Heart, X, Download, RefreshCw } from "lucide-react";

interface NavigationDockProps {
  active: boolean;
}

const NavigationDock = ({ active }: NavigationDockProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // تشغيل الموسيقى تلقائياً بعد فتح الظرف
  useEffect(() => {
    if (active && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [active]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // فتح كاميرا الجوال
  const openCamera = async () => {
    try {
      setShowCamera(true);
      setCapturedImage(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1920 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      alert("يرجى السماح للمتصفح بالوصول إلى الكاميرا.");
      setShowCamera(false);
    }
  };

  // إغلاق الكاميرا
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setShowCamera(false);
    setCapturedImage(null);
  };

  // التقاط الصورة وتطبيق الفلتر عليها
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 1280;

    // رسم الكاميرا (مع عكس الاتجاه للسيلفي)
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // إضافة الفلتر والنصوص فوق الصورة الملتقطة
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";

    // العنوان العلوي
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 32px Tajawal, sans-serif";
    ctx.fillText("حفل عقد قران", canvas.width / 2, 90);

    ctx.font = "bold 48px Tajawal, sans-serif";
    ctx.fillText("محمد & عهود", canvas.width / 2, 160);

    // العبارة السفلية
    ctx.font = "bold 36px Tajawal, sans-serif";
    ctx.fillText("{ ننتظركم بكل حُب }", canvas.width / 2, canvas.height - 100);

    const imageUrl = canvas.toDataURL("image/png");
    setCapturedImage(imageUrl);
  };

  const handlePhoneClick = () => {
    window.location.href = "tel:0554129943";
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <audio ref={audioRef} loop src="/music.mp3" preload="auto" />
      <canvas ref={canvasRef} className="hidden" />

      {/* شاشة الكاميرا والفلتر */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
          {/* زر الإغلاق */}
          <button
            onClick={closeCamera}
            className="absolute top-6 right-6 z-30 p-3 rounded-full bg-black/50 text-white border border-white/30 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* المعاينة المباشرة للكاميرا أو الصورة الملتقطة */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {!capturedImage ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover -scale-x-100"
                />

                {/* طبقة الفلتر فوق الفيديو */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 text-center bg-gradient-to-b from-black/50 via-transparent to-black/60">
                  <div className="pt-10 space-y-1">
                    <p className="font-arabic text-sm text-white/90 font-medium">
                      حفل عقد قران
                    </p>
                    <h2 className="font-arabic text-3xl font-extrabold text-white drop-shadow-lg">
                      محمد & عهود
                    </h2>
                  </div>

                  <div className="pb-24">
                    <p className="font-arabic text-xl font-bold text-white drop-shadow-lg">
                      &#123; ننتظركم بكل حُب &#125;
                    </p>
                  </div>
                </div>

                {/* زر التقاط الصورة */}
                <div className="absolute bottom-8 z-20">
                  <button
                    onClick={capturePhoto}
                    className="w-18 h-18 rounded-full border-4 border-white bg-white/30 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="w-14 h-14 rounded-full bg-white shadow-lg" />
                  </button>
                </div>
              </>
            ) : (
              /* إظهار الصورة الملتقطة مع خيار التنزيل وإعادة التصوير */
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <img
                  src={capturedImage}
                  alt="الصورة الملتقطة"
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-8 z-30 flex items-center gap-6">
                  {/* إعادة التصوير */}
                  <button
                    onClick={() => setCapturedImage(null)}
                    className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white font-arabic text-sm font-bold cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    إعادة
                  </button>

                  {/* تنزيل الصورة */}
                  <a
                    href={capturedImage}
                    download="mohammed-ahood-wedding.png"
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#5F4F41] font-arabic text-sm font-bold shadow-xl cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    حفظ الصورة
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* الشريط السفلي الثابت */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md pointer-events-auto">
        <div
          className="w-full px-3 py-2.5 rounded-3xl border border-white/50 shadow-2xl flex items-center justify-around backdrop-blur-md"
          style={{
            background: "rgba(255, 255, 255, 0.45)",
            boxShadow: "0 10px 30px rgba(95, 79, 65, 0.2)",
          }}
        >
          {/* 1. تواصل */}
          <button
            onClick={handlePhoneClick}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <Phone className="w-5 h-5" style={{ color: "#5F4F41" }} />
            <span className="font-arabic text-[11px] font-bold" style={{ color: "#5F4F41" }}>
              تواصل
            </span>
          </button>

          {/* 2. موسيقى */}
          <button
            onClick={toggleMusic}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <Music
              className={`w-5 h-5 transition-opacity ${isPlaying ? "opacity-100" : "opacity-50"}`}
              style={{ color: "#5F4F41" }}
            />
            <span className="font-arabic text-[11px] font-bold" style={{ color: "#5F4F41" }}>
              موسيقى
            </span>
          </button>

          {/* 3. الكاميرا والفلتر */}
          <button
            onClick={openCamera}
            className="relative -top-2 flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-95"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-white/40"
              style={{ background: "#5F4F41" }}
            >
              <Camera className="w-6 h-6 text-white" />
            </div>
          </button>

          {/* 4. الموقع */}
          <button
            onClick={() => scrollToSection("location")}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <MapPin className="w-5 h-5" style={{ color: "#5F4F41" }} />
            <span className="font-arabic text-[11px] font-bold" style={{ color: "#5F4F41" }}>
              الموقع
            </span>
          </button>

          {/* 5. تأكيد الحضور */}
          <button
            onClick={() => scrollToSection("rsvp")}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <Heart className="w-5 h-5" style={{ color: "#5F4F41" }} />
            <span className="font-arabic text-[11px] font-bold" style={{ color: "#5F4F41" }}>
              تأكيد الحضور
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default NavigationDock;
