import { useState, useEffect, useRef } from "react";
import {
  Phone,
  Music,
  Camera,
  MapPin,
  Heart,
  X,
  Download,
  RefreshCw,
  Share2,
} from "lucide-react";

// 🎵 استيراد ملف الصوت m4a
import bgMusic from "@/assets/m.m4a";

interface NavigationDockProps {
  active: boolean;
  guestName: string;
}

const NavigationDock = ({ active, guestName }: NavigationDockProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const [showRSVP, setShowRSVP] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const [rsvpStatus, setRsvpStatus] = useState<
    "attending" | "declined" | ""
  >("");
  const [rsvpSent, setRsvpSent] = useState(false);

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

  // استرجاع رد الحضور المحفوظ
  useEffect(() => {
    const savedStatus = localStorage.getItem("wedding_rsvp_status");

    if (savedStatus === "attending" || savedStatus === "declined") {
      setRsvpStatus(savedStatus);
      setRsvpSent(true);
    }
  }, []);

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

  // فتح الكاميرا الخلفية بالعدسة الطبيعية بدون أي زووم
  const openCamera = async () => {
    try {
      setShowCamera(true);
      setCapturedImage(null);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
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

  // التقاط الصورة
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1920;

    const vRatio =
      video.videoWidth / video.videoHeight || 9 / 16;

    const cRatio = canvas.width / canvas.height;

    let renderWidth = canvas.width;
    let renderHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (vRatio > cRatio) {
      renderWidth = canvas.height * vRatio;
      offsetX = (canvas.width - renderWidth) / 2;
    } else {
      renderHeight = canvas.width / vRatio;
      offsetY = (canvas.height - renderHeight) / 2;
    }

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      video,
      offsetX,
      offsetY,
      renderWidth,
      renderHeight
    );

    // الاسم
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 80px IranNastaliq";

    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 10;

    ctx.fillText(
      "محمـد & اميمـه",
      canvas.width / 2,
      canvas.height - 180
    );

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    const imageUrl = canvas.toDataURL("image/png");
    setCapturedImage(imageUrl);
  };

  // مشاركة الصورة
  const handleShare = async () => {
    if (!capturedImage) return;

    try {
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      const file = new File(
        [blob],
        "wedding-filter.png",
        { type: "image/png" }
      );

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: "محمـد & اميمـه",
        });
      } else {
        alert(
          "المشاركة غير مدعومة مباشرة على هذا المتصفح، يمكنك استخدام زر الحفظ."
        );
      }
    } catch (error) {
      console.log("إلغاء المشاركة أو خطأ:", error);
    }
  };

  // فتح نافذة التواصل
  const handlePhoneClick = () => {
    setShowContact(true);
  };

  // الاتصال بالرقم
  const handleCall = () => {
    window.location.href = "tel:0545252599";
  };

  // إرسال الرد مباشرة إلى Google Form
  const handleRSVPSubmit = async () => {
    if (!guestName.trim() || !rsvpStatus) {
      alert("فضلاً اختر الرد.");
      return;
    }

    const formData = new URLSearchParams();

    // حقل الاسم - الفورم الجديد
    formData.append(
      "entry.1456442516",
      guestName.trim()
    );

    // حقل الرد - الفورم الجديد
    formData.append(
      "entry.2082093714",
      rsvpStatus === "attending"
        ? "تاكيد الحضور"
        : "الاعتذار عن الحضور"
    );

    try {
      await fetch(
        "https://docs.google.com/forms/d/e/1FAIpQLSeXZ4ZlKGRpjYRxylObWh32sctV27XBmcsR5hFIDuNLdfBZ5A/formResponse",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      // حفظ الرد والاسم حتى يبقى بعد تحديث الصفحة
      localStorage.setItem(
        "wedding_rsvp_status",
        rsvpStatus
      );

      localStorage.setItem(
        "wedding_rsvp_name",
        guestName.trim()
      );

      setRsvpSent(true);
    } catch (error) {
      console.error(
        "حدث خطأ أثناء إرسال الرد:",
        error
      );

      alert(
        "تعذر إرسال الرد، يرجى المحاولة مرة أخرى."
      );
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop
        src={bgMusic}
        preload="auto"
      />

      <canvas
        ref={canvasRef}
        className="hidden"
      />

      {/* شاشة الكاميرا والفلتر */}
      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="relative w-full h-full max-w-[500px] aspect-[9/16] bg-black flex items-center justify-center overflow-hidden">

            {/* زر الإغلاق */}
            <button
              onClick={closeCamera}
              className="absolute top-6 right-6 z-30 p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md cursor-pointer"
              style={{ border: "none" }}
            >
              <X className="w-6 h-6" />
            </button>

            {!capturedImage ? (
              <>
                {/* الكاميرا الخلفية */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover scale-100"
                />

                {/* النص */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-6 text-center bg-gradient-to-t from-black/80 via-black/25 to-transparent">
                  <div className="pb-24 flex flex-col items-center gap-1.5 drop-shadow-2xl">
                    <p
                      style={{
                        fontFamily:
                          "'IranNastaliq', sans-serif",
                        color: "#FFFFFF",
                      }}
                      className="text-5xl font-bold"
                    >
                      محمـد & اميمـه
                    </p>
                  </div>
                </div>

                {/* زر التقاط الصورة */}
                <div className="absolute bottom-6 z-20">
                  <button
                    onClick={capturePhoto}
                    className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform shadow-2xl"
                    style={{
                      backgroundColor: "#B08A3C",
                      border: "none",
                      boxShadow:
                        "0 0 15px rgba(176, 138, 60, 0.6)",
                    }}
                  >
                  </button>
                </div>
              </>
            ) : (
              /* شاشة عرض الصورة الملتقطة */
              <div className="relative w-full h-full flex flex-col items-center justify-center">

                <img
                  src={capturedImage}
                  alt="الصورة الملتقطة"
                  className="w-full h-full object-cover"
                />

                {/* الكارت السفلي بأزرار التحكم */}
                <div className="absolute bottom-6 z-30 w-[90%] max-w-[360px]">
                  <div
                    className="w-full p-4 rounded-3xl backdrop-blur-xl flex flex-col items-center gap-3 shadow-2xl"
                    style={{
                      background:
                        "rgba(35, 28, 23, 0.82)",
                      border: "none",
                      boxShadow:
                        "0 0 12px rgba(176, 138, 60, 0.4)",
                    }}
                  >

                    {/* الصف الأول: حفظ وإعادة */}
                    <div className="w-full flex items-center justify-center gap-3">

                      <a
                        href={capturedImage}
                        download="mohammed-ahood.png"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white font-arabic text-sm font-semibold transition-all active:scale-95"
                        style={{
                          background:
                            "rgba(255, 255, 255, 0.12)",
                          border: "none",
                        }}
                      >
                        <Download className="w-4 h-4" />
                        حفظ
                      </a>

                      <button
                        onClick={() =>
                          setCapturedImage(null)
                        }
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white font-arabic text-sm font-semibold transition-all active:scale-95 cursor-pointer"
                        style={{
                          background:
                            "rgba(255, 255, 255, 0.12)",
                          border: "none",
                        }}
                      >
                        <RefreshCw className="w-4 h-4" />
                        إعادة
                      </button>

                    </div>

                    {/* الصف الثاني: زر المشاركة */}
                    <button
                      onClick={handleShare}
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-arabic text-sm font-bold shadow-lg transition-all active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: "#B08A3C",
                        color: "#FFFFFF",
                        border: "none",
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

      {/* نافذة التواصل */}
      {showContact && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-5">

          {/* الخلفية المموهة */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setShowContact(false)}
          />

          {/* المربع بدون حدود مع توهج ذهبي */}
          <div
            className="relative w-full max-w-[380px] rounded-[32px] px-7 py-8 shadow-2xl backdrop-blur-xl"
            style={{
              background: "rgba(24, 18, 20, 0.88)",
              color: "#FFFFFF",
              border: "none",
              boxShadow:
                "0 0 16px rgba(176, 138, 60, 0.4), 0 20px 50px rgba(0, 0, 0, 0.5)",
            }}
          >

            {/* زخرفة الركن العلوي */}
            <div
              className="absolute top-3 right-4 text-xl opacity-60"
              style={{ color: "#B08A3C" }}
            >
              ❈
            </div>

            <div
              className="absolute top-3 left-4 text-xl opacity-60"
              style={{ color: "#B08A3C" }}
            >
              ❈
            </div>

            <div className="text-center py-5">

              {/* عنوان */}
              <h2
                className="text-2xl font-bold mb-6"
                style={{
                  fontFamily:
                    "'IranNastaliq', sans-serif",
                  color: "#B08A3C",
                }}
              >
                للتواصل
              </h2>

              {/* الرقم */}
              <p
                dir="ltr"
                className="text-2xl font-bold mb-3"
                style={{
                  fontFamily:
                    "'Almarai', sans-serif",
                  color: "#FFFFFF",
                }}
              >
                0545252599
              </p>

              {/* وقت الاتصال */}
              {/* <p
                className="text-sm mb-7 opacity-80"
                style={{
                  fontFamily:
                    "'Almarai', sans-serif",
                  color: "#FFFFFF",
                }}
              >
                الاتصال من الساعة 5:00 م الى 8:00 م
              </p> */}

              {/* زر الاتصال */}
              <button
                type="button"
                onClick={handleCall}
                className="w-full py-3.5 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                style={{
                  fontFamily:
                    "'Almarai', sans-serif",
                  background: "#B08A3C",
                  color: "#FFFFFF",
                  border: "none",
                }}
              >
                <Phone className="w-5 h-5" />
                اتصال
              </button>

              {/* إلغاء */}
              <button
                type="button"
                onClick={() => setShowContact(false)}
                className="w-full mt-3 py-2 text-sm opacity-80 cursor-pointer"
                style={{
                  fontFamily:
                    "'Almarai', sans-serif",
                  color: "#FFFFFF",
                }}
              >
                إلغاء
              </button>

            </div>

            {/* زخارف سفلية */}
            <div
              className="absolute bottom-3 right-4 text-xl opacity-60"
              style={{ color: "#B08A3C" }}
            >
              ❈
            </div>

            <div
              className="absolute bottom-3 left-4 text-xl opacity-60"
              style={{ color: "#B08A3C" }}
            >
              ❈
            </div>

          </div>
        </div>
      )}

      {/* نافذة تأكيد الحضور */}
      {showRSVP && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-5">

          {/* الخلفية المموهة */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setShowRSVP(false)}
          />

          {/* المربع بدون حدود مع توهج ذهبي */}
          <div
            className="relative w-full max-w-[380px] rounded-[32px] px-7 py-8 shadow-2xl backdrop-blur-xl"
            style={{
              background: "rgba(24, 18, 20, 0.88)",
              color: "#FFFFFF",
              border: "none",
              boxShadow:
                "0 0 16px rgba(176, 138, 60, 0.4), 0 20px 50px rgba(0, 0, 0, 0.5)",
            }}
          >

            {/* زخرفة الركن العلوي */}
            <div
              className="absolute top-3 right-4 text-xl opacity-60"
              style={{ color: "#B08A3C" }}
            >
              ❈
            </div>

            <div
              className="absolute top-3 left-4 text-xl opacity-60"
              style={{ color: "#B08A3C" }}
            >
              ❈
            </div>

            {!rsvpSent ? (
              <>
                {/* العنوان */}
                <div className="text-center mb-7">

                  <h2
                    className="text-2xl font-bold"
                    style={{
                      fontFamily:
                        "'IranNastaliq', sans-serif",
                      color: "#B08A3C",
                    }}
                  >
                    تاكيـد الحضور
                  </h2>

                  <p
                    className="mt-2 text-sm opacity-90"
                    style={{
                      fontFamily:
                        "'Almarai', sans-serif",
                      color: "#FFFFFF",
                    }}
                  >
                    يسعدنا ويشرفنا حضوركم
                  </p>

                </div>

                {/* اسم الضيف */}
                <div className="mb-5 text-center">
                  <p
                    className="text-2xl font-bold"
                    style={{
                      fontFamily:
                        "'IranNastaliq', sans-serif",
                      color: "#B08A3C",
                    }}
                  >
                    {guestName}
                  </p>
                </div>

                {/* خيارات الحضور */}
                <div className="flex gap-3 mb-6">

                  <button
                    type="button"
                    onClick={() =>
                      setRsvpStatus("attending")
                    }
                    className="flex-1 py-3 rounded-2xl transition-all cursor-pointer"
                    style={{
                      fontFamily:
                        "'Almarai', sans-serif",
                      background:
                        rsvpStatus === "attending"
                          ? "#B08A3C"
                          : "rgba(255, 255, 255, 0.1)",
                      color: "#FFFFFF",
                      border: "none",
                      boxShadow:
                        rsvpStatus === "attending"
                          ? "0 0 10px rgba(176, 138, 60, 0.5)"
                          : "none",
                    }}
                  >
                    تاكيد الحضور
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setRsvpStatus("declined")
                    }
                    className="flex-1 py-3 rounded-2xl transition-all cursor-pointer"
                    style={{
                      fontFamily:
                        "'Almarai', sans-serif",
                      background:
                        rsvpStatus === "declined"
                          ? "#641414"
                          : "rgba(255, 255, 255, 0.1)",
                      color: "#FFFFFF",
                      border: "none",
                      boxShadow:
                        rsvpStatus === "declined"
                          ? "0 0 10px rgba(100, 20, 20, 0.5)"
                          : "none",
                    }}
                  >
                    الاعتذار عن الحضور
                  </button>

                </div>

                {/* إرسال */}
                <button
                  type="button"
                  onClick={handleRSVPSubmit}
                  className="w-full py-3.5 rounded-2xl font-bold transition-all active:scale-95 cursor-pointer shadow-lg"
                  style={{
                    fontFamily:
                      "'Almarai', sans-serif",
                    background: "#B08A3C",
                    color: "#FFFFFF",
                    border: "none",
                  }}
                >
                  إرسال
                </button>

                {/* إغلاق */}
                <button
                  type="button"
                  onClick={() =>
                    setShowRSVP(false)
                  }
                  className="w-full mt-3 py-2 text-sm opacity-80 cursor-pointer"
                  style={{
                    fontFamily:
                      "'Almarai', sans-serif",
                    color: "#FFFFFF",
                  }}
                >
                  إلغاء
                </button>
              </>
            ) : (
              /* رسالة النجاح */
              <div className="text-center py-6">

                <div
                  className="text-4xl mb-5"
                  style={{ color: "#B08A3C" }}
                >
                  ♡
                </div>

                <h2
                  className="text-2xl font-bold mb-4"
                  style={{
                    fontFamily:
                      "'IranNastaliq', sans-serif",
                    color: "#B08A3C",
                  }}
                >
                  {rsvpStatus === "attending"
                    ? "تم تأكيـد حضــوركم"
                    : "تم تسجيـل اعتـذاركم"}
                </h2>

                <p
                  className="text-sm leading-8 opacity-90"
                  style={{
                    fontFamily:
                      "'Almarai', sans-serif",
                    color: "#FFFFFF",
                  }}
                >
                  {rsvpStatus === "attending"
                    ? "نسعد بحضوركم ومشاركتكم لنا هذه الفرحة"
                    : "نشكر لكم تواصلكم، ونسأل الله أن يجمعنا بكم على خير"}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setShowRSVP(false)
                  }
                  className="w-full mt-7 py-3.5 rounded-2xl font-bold cursor-pointer shadow-lg"
                  style={{
                    fontFamily:
                      "'Almarai', sans-serif",
                    background: "#B08A3C",
                    color: "#FFFFFF",
                    border: "none",
                  }}
                >
                  العودة إلى الدعوة
                </button>

                {/* زخارف */}
                <div
                  className="absolute bottom-3 right-4 text-xl opacity-60"
                  style={{ color: "#B08A3C" }}
                >
                  ❈
                </div>

                <div
                  className="absolute bottom-3 left-4 text-xl opacity-60"
                  style={{ color: "#B08A3C" }}
                >
                  ❈
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* الشريط السفلي الرئيسي بدون حدود مع توهج ذهبي */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md pointer-events-auto">

        <div
          className="w-full px-3 py-2.5 rounded-3xl shadow-2xl flex items-center justify-around backdrop-blur-md"
          style={{
            background: "transparent",
            border: "none",
            boxShadow:
              "0 0 12px rgba(176, 138, 60, 0.4), 0 10px 25px rgba(0, 0, 0, 0.3)",
          }}
        >

          {/* 1. تواصل */}
          <button
            onClick={handlePhoneClick}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <Phone
              className="w-5 h-5"
              style={{ color: "#FFFFFF" }}
            />

            <span
              className="font-arabic text-[11px] font-bold"
              style={{ color: "#FFFFFF" }}
            >
              تواصل
            </span>
          </button>

          {/* 2. موسيقى */}
          <button
            onClick={toggleMusic}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <Music
              className={`w-5 h-5 transition-opacity ${
                isPlaying
                  ? "opacity-100 animate-pulse"
                  : "opacity-50"
              }`}
              style={{ color: "#FFFFFF" }}
            />

            <span
              className="font-arabic text-[11px] font-bold"
              style={{ color: "#FFFFFF" }}
            >
              موسيقى
            </span>
          </button>

          {/* 3. الكاميرا والفلتر */}
          <button
            onClick={openCamera}
            className="flex items-center justify-center cursor-pointer transition-transform active:scale-95"
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: "#B08A3C",
                boxShadow:
                  "0 0 10px rgba(176, 138, 60, 0.5)",
              }}
            >
              <Camera
                className="w-5 h-5"
                style={{ color: "#FFFFFF" }}
              />
            </div>
          </button>

          {/* 4. الموقع */}
          <button
            onClick={() => {
              window.location.href =
                "https://maps.app.goo.gl/hg7hXZAC4AoeKaYL9?g_st=ic";
            }}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <MapPin
              className="w-5 h-5"
              style={{ color: "#FFFFFF" }}
            />

            <span
              className="font-arabic text-[11px] font-bold"
              style={{ color: "#FFFFFF" }}
            >
              الموقع
            </span>
          </button>

          {/* 5. تأكيد الحضور */}
          <button
            onClick={() => {
              const savedStatus = localStorage.getItem(
                "wedding_rsvp_status"
              );

              if (
                savedStatus === "attending" ||
                savedStatus === "declined"
              ) {
                setRsvpStatus(savedStatus);
                setRsvpSent(true);
              } else {
                setRsvpSent(false);
                setRsvpStatus("");
              }

              setShowRSVP(true);
            }}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <Heart
              className="w-5 h-5"
              style={{ color: "#FFFFFF" }}
            />

            <span
              className="font-arabic text-[11px] font-bold"
              style={{ color: "#FFFFFF" }}
            >
              تأكيد الحضور
            </span>
          </button>

        </div>
      </div>
    </>
  );
};

export default NavigationDock;
