import { useState, useEffect, useRef } from "react";
import { Phone, Music, Camera, MapPin, Heart, X, Download, RefreshCw, Share2 } from "lucide-react";

// 🎵 استيراد ملف الصوت m4a
import bgMusic from "@/assets/music.m4a";

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

  // تشغيل الموسيقى تلقائياً فور فتح الظرف
  useEffect(() => {
    if (active && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
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

  // فتح الكاميرا الخلفية بمقاس طبيعي (بدون تكبير)
  const openCamera = async () => {
    try {
      setShowCamera(true);
      setCapturedImage(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" }, // الكاميرا الخلفية
          width: { ideal: 1080 },
          height: { ideal: 1920 },
        },
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

  // التقاط الصورة بدون عكس (لأنها كاميرا خلفية)
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1920;

    // رسم الكاميرا أفقياً ورأسياً بالشكل الطبيعي
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // تظليل ناعم في الأسفل
    const gradient = ctx.createLinearGradient(0, canvas.height - 400, 0, canvas.height);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(0,0,0,0.6)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, canvas.height - 400, canvas.width, 400);

    // كتابة الاسم "محمد & عهود" في الأسفل
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 60px Tajawal, sans-serif";
    ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
    ctx.shadowBlur = 12;
    ctx.fillText("محمد & عهود", canvas.width / 2, canvas.height - 120);

    const imageUrl = canvas.toDataURL("image/png");
    setCapturedImage(imageUrl);
  };

  // مشاركة الصورة
  const handleShare = async () => {
    if (!capturedImage) return;

    try {
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], "wedding-filter.png", { type: "image/png" });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "محمد & عهود",
          text: "دعوة عقد قران محمد & عهود",
        });
      } else {
        alert("المشاركة غير مدعومة مباشرة على هذا المتصفح، يمكنك استخدام زر الحفظ.");
      }
    } catch (error) {
      console.log("إلغاء المشاركة أو خطأ:", error);
    }
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
      <audio ref={audioRef} loop src={bgMusic} preload="auto" />
      <canvas ref={canvasRef} className="hidden" />

      {/* شاشة الكاميرا والفلتر */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="relative w-full h-full max-w-[500px] aspect-[9/16] bg-black flex items-center justify-center overflow-hidden">
            
            {/* زر الإغلاق */}
            <button
              onClick={closeCamera}
              className="absolute top-6 right-6 z-30 p-2.5 rounded-full bg-black/40 text-white border border-white/20 backdrop-blur-md cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {!capturedImage ? (
              <>
                {/* الكاميرا الخلفية العادية */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* نص الفلتر السفلي قبل التقاط الصورة */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-8 text-center bg-gradient-to-t from-black/60 via-transparent to-transparent">
                  <div className="pb-24">
                    <h2 className="font-arabic text-3xl sm:text-4xl font-extrabold text-white drop-shadow-2xl">
                      محمد & عهود
                    </h2>
                  </div>
                </div>

                {/* زر التقاط الصورة */}
                <div className="absolute bottom-8 z-20">
                  <button
                    onClick={capturePhoto}
                    className="w-20 h-20 rounded-full border-4 border-white/80 bg-white/20 flex items-center justify-center cursor-pointer active:scale-95 transition-transform backdrop-blur-sm"
                  >
                    <div className="w-16 h-16 rounded-full bg-white shadow-xl" />
                  </button>
                </div>
              </>
            ) : (
              /* شاشة عرض الصورة الملتقطة مع شريط الأزرار بتصميم الصورة المرفقة */
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <img
                  src={capturedImage}
                  alt="الصورة الملتقطة"
                  className="w-full h-full object-cover"
                />

                {/* الشريط السفلي بتصميم مطابق تماماً مع ألوان التصميم */}
                <div className="absolute bottom-6 z-30 w-[90%] max-w-[360px]">
                  <div
                    className="w-full p-4 rounded-3xl backdrop-blur-xl border border-white/30 flex flex-col items-center gap-3 shadow-2xl"
                    style={{ background: "rgba(35, 28, 23, 0.82)" }}
                  >
                    {/* الصف الأول: حفظ وإعادة */}
                    <div className="w-full flex items-center justify-center gap-3">
                      <a
                        href={capturedImage}
                        download="mohammed-ahood.png"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-white/20 text-white font-arabic text-sm font-semibold transition-all active:scale-95"
                        style={{ background: "rgba(255, 255, 255, 0.12)" }}
                      >
                        <Download className="w-4 h-4" />
                        حفظ
                      </a>

                      <button
                        onClick={() => setCapturedImage(null)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-white/20 text-white font-arabic text-sm font-semibold transition-all active:scale-95 cursor-pointer"
                        style={{ background: "rgba(255, 255, 255, 0.12)" }}
                      >
                        <RefreshCw className="w-4 h-4" />
                        إعادة
                      </button>
                    </div>

                    {/* الصف الثاني: زر المشاركة السفلي الأنيق */}
                    <button
                      onClick={handleShare}
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-arabic text-sm font-bold shadow-lg transition-all active:scale-95 cursor-pointer"
                      style={{
                        background: "linear-[#5F4F41]",
                        backgroundColor: "#8C7A6B",
                        color: "#FFFFFF",
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                      مشاركة
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* الشريط السفلي الرئيسي للتطبيق */}
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
              className={`w-5 h-5 transition-opacity ${isPlaying ? "opacity-100 animate-pulse" : "opacity-50"}`}
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
