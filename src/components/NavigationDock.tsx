import { useState, useEffect, useRef } from "react";
import { Phone, Music, Camera, MapPin, Heart, X, Download, RefreshCw, Share2 } from "lucide-react";

// 🎵 استيراد ملف الصوت m4a
import bgMusic from "@/assets/rh.m4a";

interface NavigationDockProps {
  active: boolean;
}

const NavigationDock = ({ active }: NavigationDockProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showRSVP, setShowRSVP] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<"attending" | "declined" | "">("");
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
    const savedName = localStorage.getItem("wedding_rsvp_name");

    if (savedStatus === "attending" || savedStatus === "declined") {
      setRsvpStatus(savedStatus);
      setRsvpSent(true);
    }

    if (savedName) {
      setGuestName(savedName);
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
    ctx.fillStyle = "#B08A3C";
    ctx.font = "bold 52px IranNastaliq";

    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 10;

    ctx.fillText(
      "عبـدالرحيم & آيسـات",
      canvas.width / 2,
      canvas.height - 150
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
          title: "عبـدالرحيم & آيسـات",
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

  const handlePhoneClick = () => {
    window.location.href = "tel:0554129943";
  };

  // إرسال الرد مباشرة إلى Google Form
  const handleRSVPSubmit = async () => {
    if (!guestName.trim() || !rsvpStatus) {
      alert("فضلاً اكتب الاسم واختر الرد.");
      return;
    }

    const formData = new URLSearchParams();

    // حقل الاسم
    formData.append(
      "entry.1242947391",
      guestName.trim()
    );

    // حقل الرد
    formData.append(
      "entry.861158564",
      rsvpStatus === "attending"
        ? "تاكيد الحضور"
        : "الاعتذار عن الحضور"
    );

    try {
      await fetch(
        "https://docs.google.com/forms/d/e/1FAIpQLSfry0we-Wq4O4N4ngl7CasWDEvKqV3_kGkI3Lp_nqFXdQvBXg/formResponse",
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
      console.error("حدث خطأ أثناء إرسال الرد:", error);
      alert("تعذر إرسال الرد، يرجى المحاولة مرة أخرى.");
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
              className="absolute top-6 right-6 z-30 p-2.5 rounded-full bg-black/40 text-white border border-white/20 backdrop-blur-md cursor-pointer"
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
                  <div className="pb-16 flex flex-col items-center gap-1.5 drop-shadow-2xl">
                    <p
                      style={{
                        fontFamily:
                          "'IranNastaliq', sans-serif",
                        color: "#B08A3C",
                      }}
                      className="text-3xl font-bold"
                    >
                      عبـدالرحيم & آيسـات
                    </p>
                  </div>
                </div>

                {/* زر التقاط الصورة */}
                <div className="absolute bottom-6 z-20">
                  <button
                    onClick={capturePhoto}
                    className="w-20 h-20 rounded-full border-4 border-white/80 bg-white/20 flex items-center justify-center cursor-pointer active:scale-95 transition-transform backdrop-blur-sm"
                  >
                    <div
                      className="w-16 h-16 rounded-full shadow-xl"
                      style={{
                        backgroundColor: "#B08A3C",
                      }}
                    />
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
                    className="w-full p-4 rounded-3xl backdrop-blur-xl border border-white/30 flex flex-col items-center gap-3 shadow-2xl"
                    style={{
                      background:
                        "rgba(35, 28, 23, 0.82)",
                    }}
                  >

                    {/* الصف الأول: حفظ وإعادة */}
                    <div className="w-full flex items-center justify-center gap-3">

                      <a
                        href={capturedImage}
                        download="mohammed-ahood.png"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-white/20 text-white font-arabic text-sm font-semibold transition-all active:scale-95"
                        style={{
                          background:
                            "rgba(255, 255, 255, 0.12)",
                        }}
                      >
                        <Download className="w-4 h-4" />
                        حفظ
                      </a>

                      <button
                        onClick={() =>
                          setCapturedImage(null)
                        }
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-white/20 text-white font-arabic text-sm font-semibold transition-all active:scale-95 cursor-pointer"
                        style={{
                          background:
                            "rgba(255, 255, 255, 0.12)",
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

      {/* نافذة تأكيد الحضور */}
      {showRSVP && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-5">

          {/* الخلفية المموهة */}
          <div
            className="absolute inset-0 bg-black/25 backdrop-blur-md"
            onClick={() => setShowRSVP(false)}
          />

          {/* المربع */}
          <div
            className="relative w-full max-w-[380px] rounded-[32px] px-7 py-8 shadow-2xl border border-white/30"
            style={{
              background:
                "rgba(245, 239, 231, 0.96)",
              color: "#641414",
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
                    className="mt-2 text-sm"
                    style={{
                      fontFamily:
                        "'Almarai', sans-serif",
                      color: "#641414",
                    }}
                  >
                    يسعدنا ويشرفنا حضوركم
                  </p>

                </div>

                {/* الاسم */}
                <div className="mb-5">

                  <label
                    className="block text-right mb-2 text-sm font-bold"
                    style={{
                      fontFamily:
                        "'Almarai', sans-serif",
                      color: "#641414",
                    }}
                  >
                    الاسم الكريم
                  </label>

                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) =>
                      setGuestName(e.target.value)
                    }
                    placeholder="اكتب اسمك"
                    className="w-full rounded-2xl px-4 py-3 text-right outline-none border"
                    style={{
                      fontFamily:
                        "'Almarai', sans-serif",
                      background:
                        "rgba(255,255,255,0.65)",
                      borderColor:
                        "rgba(100,20,20,0.25)",
                      color: "#641414",
                    }}
                  />

                </div>

                {/* خيارات الحضور */}
                <div className="flex gap-3 mb-6">

                  <button
                    type="button"
                    onClick={() =>
                      setRsvpStatus("attending")
                    }
                    className="flex-1 py-3 rounded-2xl border transition-all"
                    style={{
                      fontFamily:
                        "'Almarai', sans-serif",
                      background:
                        rsvpStatus === "attending"
                          ? "#641414"
                          : "rgba(255,255,255,0.65)",
                      color:
                        rsvpStatus === "attending"
                          ? "#FFFFFF"
                          : "#641414",
                      borderColor: "#641414",
                    }}
                  >
                    تاكيد الحضور
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setRsvpStatus("declined")
                    }
                    className="flex-1 py-3 rounded-2xl border transition-all"
                    style={{
                      fontFamily:
                        "'Almarai', sans-serif",
                      background:
                        rsvpStatus === "declined"
                          ? "#641414"
                          : "rgba(255,255,255,0.65)",
                      color:
                        rsvpStatus === "declined"
                          ? "#FFFFFF"
                          : "#641414",
                      borderColor: "#641414",
                    }}
                  >
                    الاعتذار عن الحضور
                  </button>

                </div>

                {/* إرسال */}
                <button
                  type="button"
                  onClick={handleRSVPSubmit}
                  className="w-full py-3.5 rounded-2xl font-bold transition-all active:scale-95"
                  style={{
                    fontFamily:
                      "'Almarai', sans-serif",
                    background: "#641414",
                    color: "#FFFFFF",
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
                  className="w-full mt-3 py-2 text-sm"
                  style={{
                    fontFamily:
                      "'Almarai', sans-serif",
                    color: "#641414",
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
                  className="text-sm leading-8"
                  style={{
                    fontFamily:
                      "'Almarai', sans-serif",
                    color: "#641414",
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
                  className="w-full mt-7 py-3.5 rounded-2xl font-bold"
                  style={{
                    fontFamily:
                      "'Almarai', sans-serif",
                    background: "#641414",
                    color: "#FFFFFF",
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

      {/* الشريط السفلي الرئيسي */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md pointer-events-auto">

        <div
          className="w-full px-3 py-2.5 rounded-3xl border border-white/50 shadow-2xl flex items-center justify-around backdrop-blur-md"
          style={{
            background:
              "rgba(255, 255, 255, 0.45)",
            boxShadow:
              "0 10px 30px rgba(100, 20, 20, 0.2)",
          }}
        >

          {/* 1. تواصل */}
          <button
            onClick={handlePhoneClick}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <Phone
              className="w-5 h-5"
              style={{ color: "#641414" }}
            />

            <span
              className="font-arabic text-[11px] font-bold"
              style={{ color: "#641414" }}
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
              style={{ color: "#641414" }}
            />

            <span
              className="font-arabic text-[11px] font-bold"
              style={{ color: "#641414" }}
            >
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
              style={{ background: "#641414" }}
            >
              <Camera className="w-6 h-6 text-white" />
            </div>
          </button>

          {/* 4. الموقع */}
          <button
            onClick={() => {
              window.location.href =
                "https://maps.app.goo.gl/nyTQL8RY9NaFwFEu5?g_st=ic";
            }}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <MapPin
              className="w-5 h-5"
              style={{ color: "#641414" }}
            />

            <span
              className="font-arabic text-[11px] font-bold"
              style={{ color: "#641414" }}
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
              const savedName = localStorage.getItem(
                "wedding_rsvp_name"
              );

              if (
                savedStatus === "attending" ||
                savedStatus === "declined"
              ) {
                setRsvpStatus(savedStatus);
                setRsvpSent(true);

                if (savedName) {
                  setGuestName(savedName);
                }
              } else {
                setRsvpSent(false);
                setGuestName("");
                setRsvpStatus("");
              }

              setShowRSVP(true);
            }}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <Heart
              className="w-5 h-5"
              style={{ color: "#641414" }}
            />

            <span
              className="font-arabic text-[11px] font-bold"
              style={{ color: "#641414" }}
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
