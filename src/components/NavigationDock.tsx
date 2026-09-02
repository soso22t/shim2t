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

import bgMusic from "@/assets/m.m4a";

import { supabase } from "@/integrations/supabase/client";
import { QRCodeCanvas } from "qrcode.react";

interface GuestMember {
  id: string;
  name: string;
  device_id: string | null;
  status: string | null;
}

interface NavigationDockProps {
  active: boolean;
  guestName: string;
  inviteCode: string;
  selectedGuestId: string;
  guests: GuestMember[];
  onGuestSelected: (guest: GuestMember) => void;
  onWrongDevice: () => void;
}

const NavigationDock = ({
  active,
  guestName,
  inviteCode,
  selectedGuestId,
  guests,
  onGuestSelected,
  onWrongDevice,
}: NavigationDockProps) => {
  const [isPlaying, setIsPlaying] =
    useState(false);

  const [showCamera, setShowCamera] =
    useState(false);

  const [capturedImage, setCapturedImage] =
    useState<string | null>(null);

  const [showRSVP, setShowRSVP] =
    useState(false);

  const [showContact, setShowContact] =
    useState(false);

  const [rsvpStatus, setRsvpStatus] =
    useState<
      "attending" | "declined" | ""
    >("");

  const [rsvpSent, setRsvpSent] =
    useState(false);

  const [qrToken, setQrToken] =
    useState<string | null>(null);

  const [rsvpLoading, setRsvpLoading] =
    useState(false);

  const [choosingGuest, setChoosingGuest] =
    useState(false);

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] =
    useState<MediaStream | null>(null);

  useEffect(() => {
    if (
      active &&
      audioRef.current
    ) {
      audioRef.current
        .play()
        .then(() =>
          setIsPlaying(true)
        )
        .catch(() =>
          setIsPlaying(false)
        );
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

  const openCamera = async () => {
    try {
      setShowCamera(true);
      setCapturedImage(null);

      const mediaStream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              facingMode: {
                ideal: "environment",
              },
            },
            audio: false,
          }
        );

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject =
          mediaStream;
      }
    } catch (err) {
      alert(
        "يرجى السماح للمتصفح بالوصول إلى الكاميرا."
      );

      setShowCamera(false);
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream
        .getTracks()
        .forEach((track) =>
          track.stop()
        );
    }

    setStream(null);
    setShowCamera(false);
    setCapturedImage(null);
  };

  const capturePhoto = () => {
    if (
      !videoRef.current ||
      !canvasRef.current
    )
      return;

    const video =
      videoRef.current;

    const canvas =
      canvasRef.current;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1920;

    const vRatio =
      video.videoWidth /
        video.videoHeight ||
      9 / 16;

    const cRatio =
      canvas.width /
      canvas.height;

    let renderWidth =
      canvas.width;

    let renderHeight =
      canvas.height;

    let offsetX = 0;
    let offsetY = 0;

    if (vRatio > cRatio) {
      renderWidth =
        canvas.height *
        vRatio;

      offsetX =
        (canvas.width -
          renderWidth) /
        2;
    } else {
      renderHeight =
        canvas.width /
        vRatio;

      offsetY =
        (canvas.height -
          renderHeight) /
        2;
    }

    ctx.fillStyle = "#000000";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.drawImage(
      video,
      offsetX,
      offsetY,
      renderWidth,
      renderHeight
    );

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#FFFFFF";

    ctx.font =
      "bold 80px IranNastaliq";

    ctx.shadowColor =
      "rgba(0,0,0,0.45)";

    ctx.shadowBlur = 10;

    ctx.fillText(
      "محمـد & اميمـه",
      canvas.width / 2,
      canvas.height - 180
    );

    ctx.shadowColor =
      "transparent";

    ctx.shadowBlur = 0;

    const imageUrl =
      canvas.toDataURL(
        "image/png"
      );

    setCapturedImage(imageUrl);
  };

  const handleShare = async () => {
    if (!capturedImage) return;

    try {
      const response =
        await fetch(
          capturedImage
        );

      const blob =
        await response.blob();

      const file = new File(
        [blob],
        "wedding-filter.png",
        {
          type: "image/png",
        }
      );

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [file],
        })
      ) {
        await navigator.share({
          files: [file],
          title:
            "محمـد & اميمـه",
        });
      } else {
        alert(
          "المشاركة غير مدعومة مباشرة على هذا المتصفح، يمكنك استخدام زر الحفظ."
        );
      }
    } catch (error) {
      console.log(
        "إلغاء المشاركة أو خطأ:",
        error
      );
    }
  };

  const handlePhoneClick = () => {
    setShowContact(true);
  };

  const handleCall = () => {
    window.location.href =
      "tel:0545252599";
  };

  const openRSVP = async () => {
    // إذا كان هناك أكثر من شخص
    // نعرض اختيار الأسماء داخل نافذة الحضور
    if (
      guests.length > 1 &&
      !selectedGuestId
    ) {
      setChoosingGuest(true);
      setShowRSVP(true);
      return;
    }

    if (!selectedGuestId) {
      alert(
        "تعذر تحديد اسم المدعو."
      );
      return;
    }

    setRsvpLoading(true);

    const { data } =
      await supabase
        .from("guests")
        .select(
          "status, qr_token"
        )
        .eq(
          "id",
          selectedGuestId
        )
        .eq(
          "invite_code",
          inviteCode
        )
        .maybeSingle();

    if (data) {
      setQrToken(
        data.qr_token
      );

      if (
        data.status ===
          "attending" ||
        data.status ===
          "declined"
      ) {
        setRsvpStatus(
          data.status
        );

        setRsvpSent(true);
      } else {
        setRsvpStatus("");
        setRsvpSent(false);
      }
    } else {
      setRsvpStatus("");
      setRsvpSent(false);
      setQrToken(null);
    }

    setRsvpLoading(false);
    setShowRSVP(true);
  };

  const selectGuest = async (
    guest: GuestMember
  ) => {
    let deviceId =
      localStorage.getItem(
        "guest_device_id"
      );

    if (!deviceId) {
      deviceId = crypto.randomUUID();

      localStorage.setItem(
        "guest_device_id",
        deviceId
      );
    }

    if (
      guest.device_id &&
      guest.device_id !== deviceId
    ) {
      setChoosingGuest(false);
      setShowRSVP(false);
      onWrongDevice();
      return;
    }

    if (!guest.device_id) {
      const { error } =
        await supabase
          .from("guests")
          .update({
            device_id:
              deviceId,
          })
          .eq(
            "id",
            guest.id
          )
          .is(
            "device_id",
            null
          );

      if (error) {
        console.error(
          "DEVICE ERROR:",
          error
        );

        alert(
          "تعذر اختيار الاسم، يرجى المحاولة مرة أخرى."
        );

        return;
      }
    }

    onGuestSelected(guest);

    setChoosingGuest(false);

    setRsvpStatus(
      guest.status ===
        "attending" ||
      guest.status ===
        "declined"
        ? guest.status
        : ""
    );

    setRsvpSent(
      guest.status ===
        "attending" ||
      guest.status ===
        "declined"
    );

    setQrToken(null);

    // جلب الباركود الحالي للشخص
    const { data } =
      await supabase
        .from("guests")
        .select(
          "status, qr_token"
        )
        .eq(
          "id",
          guest.id
        )
        .eq(
          "invite_code",
          inviteCode
        )
        .maybeSingle();

    if (data) {
      setQrToken(
        data.qr_token
      );

      if (
        data.status ===
          "attending" ||
        data.status ===
          "declined"
      ) {
        setRsvpStatus(
          data.status
        );

        setRsvpSent(true);
      } else {
        setRsvpStatus("");
        setRsvpSent(false);
      }
    }
  };

  const handleRSVPSubmit =
    async () => {
      if (
        !inviteCode ||
        !guestName.trim() ||
        !selectedGuestId ||
        !rsvpStatus
      ) {
        alert(
          "فضلاً اختر الرد."
        );

        return;
      }

      setRsvpLoading(true);

      try {
        const {
          data: guest,
          error: guestError,
        } = await supabase
          .from("guests")
          .select(
            "id, name, status, qr_token, scanned"
          )
          .eq(
            "id",
            selectedGuestId
          )
          .eq(
            "invite_code",
            inviteCode
          )
          .maybeSingle();

        if (
          guestError ||
          !guest
        ) {
          alert(
            "تعذر العثور على بيانات الدعوة."
          );

          return;
        }

        let token =
          guest.qr_token;

        if (
          rsvpStatus ===
          "attending"
        ) {
          if (!token) {
            token =
              crypto.randomUUID();
          }

          const { error } =
            await supabase
              .from("guests")
              .update({
                status:
                  "attending",
                qr_token:
                  token,
                scanned: false,
              })
              .eq(
                "id",
                guest.id
              );

          if (error) {
            throw error;
          }

          setQrToken(token);
        } else {
          const { error } =
            await supabase
              .from("guests")
              .update({
                status:
                  "declined",
                qr_token:
                  null,
                scanned: false,
              })
              .eq(
                "id",
                guest.id
              );

          if (error) {
            throw error;
          }

          setQrToken(null);
        }

        const formData =
          new URLSearchParams();

        formData.append(
          "entry.1456442516",
          guestName.trim()
        );

        formData.append(
          "entry.2082093714",
          rsvpStatus ===
            "attending"
            ? "تاكيد الحضور"
            : "الاعتذار عن الحضور"
        );

        await fetch(
          "https://docs.google.com/forms/d/e/1FAIpQLSeXZ4ZlKGRpjYRxylObWh32sctV27XBmcsR5hFIDuNLdfBZ5A/formResponse",
          {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded",
            },
            body:
              formData.toString(),
          }
        );

        setRsvpSent(true);
      } catch (error) {
        console.error(
          "RSVP ERROR:",
          error
        );

        alert(
          "تعذر إرسال الرد، يرجى المحاولة مرة أخرى."
        );
      } finally {
        setRsvpLoading(false);
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

      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="relative w-full h-full max-w-[500px] aspect-[9/16] bg-black flex items-center justify-center overflow-hidden">

            <button
              onClick={
                closeCamera
              }
              className="absolute top-6 right-6 z-30 p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md cursor-pointer"
              style={{
                border: "none",
              }}
            >
              <X className="w-6 h-6" />
            </button>

            {!capturedImage ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover scale-100"
                />

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

                <div className="absolute bottom-6 z-20">
                  <button
                    onClick={
                      capturePhoto
                    }
                    className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform shadow-2xl"
                    style={{
                      backgroundColor:
                        "#B08A3C",
                      border: "none",
                      boxShadow:
                        "0 0 15px rgba(176, 138, 60, 0.6)",
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center">

                <img
                  src={capturedImage}
                  alt="الصورة الملتقطة"
                  className="w-full h-full object-cover"
                />

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

                    <div className="w-full flex items-center justify-center gap-3">

                      <a
                        href={
                          capturedImage
                        }
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
                          setCapturedImage(
                            null
                          )
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

                    <button
                      onClick={
                        handleShare
                      }
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-arabic text-sm font-bold shadow-lg transition-all active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor:
                          "#B08A3C",
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

      {showContact && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-5">

          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() =>
              setShowContact(
                false
              )
            }
          />

          <div
            className="relative w-full max-w-[380px] rounded-[32px] px-7 py-8 shadow-2xl backdrop-blur-xl"
            style={{
              background:
                "rgba(24, 18, 20, 0.88)",
              color: "#FFFFFF",
              border: "none",
              boxShadow:
                "0 0 16px rgba(176, 138, 60, 0.4), 0 20px 50px rgba(0, 0, 0, 0.5)",
            }}
          >

            <div
              className="absolute top-3 right-4 text-xl opacity-60"
              style={{
                color: "#B08A3C",
              }}
            >
              ❈
            </div>

            <div
              className="absolute top-3 left-4 text-xl opacity-60"
              style={{
                color: "#B08A3C",
              }}
            >
              ❈
            </div>

            <div className="text-center py-5">

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

              <button
                type="button"
                onClick={handleCall}
                className="w-full py-3.5 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                style={{
                  fontFamily:
                    "'Almarai', sans-serif",
                  background:
                    "#B08A3C",
                  color: "#FFFFFF",
                  border: "none",
                }}
              >
                <Phone className="w-5 h-5" />
                اتصال
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowContact(
                    false
                  )
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

            </div>

            <div
              className="absolute bottom-3 right-4 text-xl opacity-60"
              style={{
                color: "#B08A3C",
              }}
            >
              ❈
            </div>

            <div
              className="absolute bottom-3 left-4 text-xl opacity-60"
              style={{
                color: "#B08A3C",
              }}
            >
              ❈
            </div>

          </div>
        </div>
      )}

      {showRSVP && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-5">

          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() =>
              setShowRSVP(
                false
              )
            }
          />

          <div
            className="relative w-full max-w-[380px] rounded-[32px] px-7 py-8 shadow-2xl backdrop-blur-xl"
            style={{
              background:
                "rgba(24, 18, 20, 0.88)",
              color: "#FFFFFF",
              border: "none",
              boxShadow:
                "0 0 16px rgba(176, 138, 60, 0.4), 0 20px 50px rgba(0, 0, 0, 0.5)",
            }}
          >

            <div
              className="absolute top-3 right-4 text-xl opacity-60"
              style={{
                color: "#B08A3C",
              }}
            >
              ❈
            </div>

            <div
              className="absolute top-3 left-4 text-xl opacity-60"
              style={{
                color: "#B08A3C",
              }}
            >
              ❈
            </div>

            {!rsvpSent ? (
              <>
                {!choosingGuest ? (
                  <>
                    <div className="text-center mb-7">

                      <h2
                        className="text-2xl font-bold"
                        style={{
                          fontFamily:
                            "'IranNastaliq', sans-serif",
                          color:
                            "#B08A3C",
                        }}
                      >
                        تاكيـد الحضور
                      </h2>

                      <p
                        className="mt-2 text-sm opacity-90"
                        style={{
                          fontFamily:
                            "'Almarai', sans-serif",
                          color:
                            "#FFFFFF",
                        }}
                      >
                        يسعدنا ويشرفنا حضوركم
                      </p>

                    </div>

                    <div className="mb-5 text-center">

                      <p
                        className="font-arabic text-2xl font-bold"
                        style={{
                          color:
                            "#B08A3C",
                        }}
                      >
                        {guestName}
                      </p>

                    </div>

                    <div className="flex gap-3 mb-6">

                      <button
                        type="button"
                        onClick={() =>
                          setRsvpStatus(
                            "attending"
                          )
                        }
                        className="flex-1 py-3 rounded-2xl transition-all cursor-pointer"
                        style={{
                          fontFamily:
                            "'Almarai', sans-serif",
                          background:
                            rsvpStatus ===
                            "attending"
                              ? "#B08A3C"
                              : "rgba(255, 255, 255, 0.1)",
                          color:
                            "#FFFFFF",
                          border:
                            "none",
                          boxShadow:
                            rsvpStatus ===
                            "attending"
                              ? "0 0 10px rgba(176, 138, 60, 0.5)"
                              : "none",
                        }}
                      >
                        تاكيد الحضور
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setRsvpStatus(
                            "declined"
                          )
                        }
                        className="flex-1 py-3 rounded-2xl transition-all cursor-pointer"
                        style={{
                          fontFamily:
                            "'Almarai', sans-serif",
                          background:
                            rsvpStatus ===
                            "declined"
                              ? "#641414"
                              : "rgba(255, 255, 255, 0.1)",
                          color:
                            "#FFFFFF",
                          border:
                            "none",
                          boxShadow:
                            rsvpStatus ===
                            "declined"
                              ? "0 0 10px rgba(100, 20, 20, 0.5)"
                              : "none",
                        }}
                      >
                        الاعتذار عن الحضور
                      </button>

                    </div>

                    <button
                      type="button"
                      onClick={
                        handleRSVPSubmit
                      }
                      disabled={
                        rsvpLoading
                      }
                      className="w-full py-3.5 rounded-2xl font-bold transition-all active:scale-95 cursor-pointer shadow-lg disabled:opacity-60"
                      style={{
                        fontFamily:
                          "'Almarai', sans-serif",
                        background:
                          "#B08A3C",
                        color:
                          "#FFFFFF",
                        border:
                          "none",
                      }}
                    >
                      {rsvpLoading
                        ? "جارٍ الإرسال..."
                        : "إرسال"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setShowRSVP(
                          false
                        )
                      }
                      className="w-full mt-3 py-2 text-sm opacity-80 cursor-pointer"
                      style={{
                        fontFamily:
                          "'Almarai', sans-serif",
                        color:
                          "#FFFFFF",
                      }}
                    >
                      إلغاء
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-7">

                      <h2
                        className="text-2xl font-bold"
                        style={{
                          fontFamily:
                            "'IranNastaliq', sans-serif",
                          color:
                            "#B08A3C",
                        }}
                      >
                        تاكيـد الحضور
                      </h2>

                      <p
                        className="mt-2 text-sm opacity-90"
                        style={{
                          fontFamily:
                            "'Almarai', sans-serif",
                          color:
                            "#FFFFFF",
                        }}
                      >
                        فضلاً اختر اسمك
                      </p>

                    </div>

                    <div className="space-y-3">

                      {guests.map(
                        (guest) => (
                          <button
                            key={
                              guest.id
                            }
                            type="button"
                            onClick={() =>
                              selectGuest(
                                guest
                              )
                            }
                            className="w-full py-4 px-5 rounded-2xl transition-all active:scale-95 cursor-pointer"
                            style={{
                              background:
                                "rgba(255,255,255,0.08)",
                              color:
                                "#FFFFFF",
                              border:
                                "none",
                              boxShadow:
                                "0 0 12px rgba(176,138,60,0.25)",
                            }}
                          >
                            <span className="font-arabic text-xl font-bold">
                              {guest.name}
                            </span>
                          </button>
                        )
                      )}

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowRSVP(
                          false
                        )
                      }
                      className="w-full mt-5 py-2 text-sm opacity-80 cursor-pointer"
                      style={{
                        fontFamily:
                          "'Almarai', sans-serif",
                        color:
                          "#FFFFFF",
                      }}
                    >
                      إلغاء
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-6">

                <div
                  className="text-4xl mb-5"
                  style={{
                    color:
                      "#B08A3C",
                  }}
                >
                  ♡
                </div>

                <h2
                  className="text-2xl font-bold mb-4"
                  style={{
                    fontFamily:
                      "'IranNastaliq', sans-serif",
                    color:
                      "#B08A3C",
                  }}
                >
                  {rsvpStatus ===
                  "attending"
                    ? "تم تأكيـد حضــوركم"
                    : "تم تسجيـل اعتـذاركم"}
                </h2>

                <p
                  className="text-sm leading-8 opacity-90"
                  style={{
                    fontFamily:
                      "'Almarai', sans-serif",
                    color:
                      "#FFFFFF",
                  }}
                >
                  {rsvpStatus ===
                  "attending"
                    ? "نسعد بحضوركم ومشاركتكم لنا هذه الفرحة"
                    : "نشكر لكم تواصلكم، ونسأل الله أن يجمعنا بكم على خير"}
                </p>

                {rsvpStatus ===
                  "attending" &&
                  qrToken && (
                    <div className="mt-6 flex flex-col items-center">

                      <div className="bg-white p-4 rounded-2xl">
                        <QRCodeCanvas
                          value={`${window.location.origin}/scan/${qrToken}`}
                          size={220}
                          level="H"
                        />
                      </div>

                      <p
                        className="mt-4 text-sm"
                        style={{
                          fontFamily:
                            "'Almarai', sans-serif",
                          color:
                            "#FFFFFF",
                        }}
                      >
                        هذا الباركود مخصص لك ويُستخدم مرة واحدة فقط
                      </p>

                    </div>
                  )}

                <button
                  type="button"
                  onClick={() =>
                    setShowRSVP(
                      false
                    )
                  }
                  className="w-full mt-7 py-3.5 rounded-2xl font-bold cursor-pointer shadow-lg"
                  style={{
                    fontFamily:
                      "'Almarai', sans-serif",
                    background:
                      "#B08A3C",
                    color:
                      "#FFFFFF",
                    border:
                      "none",
                  }}
                >
                  العودة إلى الدعوة
                </button>

                <div
                  className="absolute bottom-3 right-4 text-xl opacity-60"
                  style={{
                    color:
                      "#B08A3C",
                  }}
                >
                  ❈
                </div>

                <div
                  className="absolute bottom-3 left-4 text-xl opacity-60"
                  style={{
                    color:
                      "#B08A3C",
                  }}
                >
                  ❈
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md pointer-events-auto">

        <div
          className="w-full px-3 py-2.5 rounded-3xl shadow-2xl flex items-center justify-around backdrop-blur-md"
          style={{
            background:
              "transparent",
            border: "none",
            boxShadow:
              "0 0 12px rgba(176, 138, 60, 0.4), 0 10px 25px rgba(0, 0, 0, 0.3)",
          }}
        >

          <button
            onClick={
              handlePhoneClick
            }
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <Phone
              className="w-5 h-5"
              style={{
                color:
                  "#FFFFFF",
              }}
            />

            <span
              className="font-arabic text-[11px] font-bold"
              style={{
                color:
                  "#FFFFFF",
              }}
            >
              تواصل
            </span>
          </button>

          <button
            onClick={
              toggleMusic
            }
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <Music
              className={`w-5 h-5 transition-opacity ${
                isPlaying
                  ? "opacity-100 animate-pulse"
                  : "opacity-50"
              }`}
              style={{
                color:
                  "#FFFFFF",
              }}
            />

            <span
              className="font-arabic text-[11px] font-bold"
              style={{
                color:
                  "#FFFFFF",
              }}
            >
              موسيقى
            </span>
          </button>

          <button
            onClick={
              openCamera
            }
            className="flex items-center justify-center cursor-pointer transition-transform active:scale-95"
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
              style={{
                backgroundColor:
                  "#B08A3C",
                boxShadow:
                  "0 0 10px rgba(176, 138, 60, 0.5)",
              }}
            >
              <Camera
                className="w-5 h-5"
                style={{
                  color:
                    "#FFFFFF",
                }}
              />
            </div>
          </button>

          <button
            onClick={() => {
              window.location.href =
                "https://maps.app.goo.gl/hg7hXZAC4AoeKaYL9?g_st=ic";
            }}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <MapPin
              className="w-5 h-5"
              style={{
                color:
                  "#FFFFFF",
              }}
            />

            <span
              className="font-arabic text-[11px] font-bold"
              style={{
                color:
                  "#FFFFFF",
              }}
            >
              الموقع
            </span>
          </button>

          <button
            onClick={
              openRSVP
            }
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            <Heart
              className="w-5 h-5"
              style={{
                color:
                  "#FFFFFF",
              }}
            />

            <span
              className="font-arabic text-[11px] font-bold"
              style={{
                color:
                  "#FFFFFF",
              }}
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
