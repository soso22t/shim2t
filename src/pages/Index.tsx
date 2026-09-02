import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Calendar } from "lucide-react";
import invitationImg from "@/assets/B.jpeg";
import sosImg from "@/assets/xx.png";

import footerBgImg from "@/assets/N.jpeg";
import cardImg from "@/assets/IMG_6742.jpeg";

import Envelope from "@/components/Envelope";
import SprayParticles from "@/components/SprayParticles";
import Reveal from "@/components/Reveal";
import Countdown from "@/components/Countdown";
import EventTimeline from "@/components/EventTimeline";
import EventDetails from "@/components/EventDetails";
import NavigationDock from "@/components/NavigationDock";

interface GuestMember {
  id: string;
  name: string;
  device_id: string | null;
  status: string | null;
}

const Index = () => {
  const [opened, setOpened] = useState(false);

  const inviteCode = new URLSearchParams(
    window.location.search
  ).get("invite");

  const [guestName, setGuestName] = useState("");
  const [selectedGuestId, setSelectedGuestId] = useState("");
  const [guests, setGuests] = useState<GuestMember[]>([]);

  const [inviteLoading, setInviteLoading] = useState(
    !!inviteCode
  );

  const [inviteValid, setInviteValid] = useState(
    !inviteCode
  );

  const [wrongDevice, setWrongDevice] = useState(false);

  useEffect(() => {
    const loadGuests = async () => {
      if (!inviteCode) {
        setInviteLoading(false);
        return;
      }

      let deviceId =
        localStorage.getItem("guest_device_id");

      if (!deviceId) {
        deviceId = crypto.randomUUID();

        localStorage.setItem(
          "guest_device_id",
          deviceId
        );
      }

      const { data: guestRows, error } =
        await supabase
          .from("guests")
          .select(
            "id, name, device_id, status"
          )
          .eq("invite_code", inviteCode)
          .order("created_at", {
            ascending: true,
          });

      if (
        error ||
        !guestRows ||
        guestRows.length === 0
      ) {
        console.error(
          "INVITE ERROR:",
          error
        );

        setInviteValid(false);
        setInviteLoading(false);
        return;
      }

      const members =
        guestRows as GuestMember[];

      setGuests(members);

      // إذا كان شخص واحد فقط
      if (members.length === 1) {
        const guest = members[0];

        if (
          guest.device_id &&
          guest.device_id !== deviceId
        ) {
          setWrongDevice(true);
          setInviteValid(false);
          setInviteLoading(false);
          return;
        }

        if (!guest.device_id) {
          const { error: updateError } =
            await supabase
              .from("guests")
              .update({
                device_id: deviceId,
              })
              .eq("id", guest.id)
              .is("device_id", null);

          if (updateError) {
            console.error(
              updateError
            );

            setInviteValid(false);
            setInviteLoading(false);
            return;
          }
        }

        setSelectedGuestId(guest.id);
        setGuestName(guest.name);
      }

      // إذا أكثر من شخص، لا نختار أحد هنا
      // الاختيار سيكون من نافذة تأكيد الحضور

      setInviteValid(true);
      setInviteLoading(false);
    };

    loadGuests();
  }, [inviteCode]);

  useEffect(() => {
    if (opened) {
      const startPosition =
        window.pageYOffset;

      const targetPosition =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const distance =
        targetPosition - startPosition;

      let startTime: number;

      const duration = 40000;

      const animation = () => {
        const elapsed =
          Date.now() - startTime;

        const progress = Math.min(
          elapsed / duration,
          1
        );

        const run =
          startPosition +
          distance * progress;

        window.scrollTo({
          top: run,
          behavior: "instant",
        });

        if (progress < 1) {
          requestAnimationFrame(
            animation
          );
        }
      };

      setTimeout(() => {
        startTime = Date.now();

        requestAnimationFrame(
          animation
        );
      }, 1500);
    }
  }, [opened]);

  if (inviteLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: "#24000D",
        }}
      />
    );
  }

  if (wrongDevice) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center px-6 text-center"
        style={{
          backgroundColor: "#24000D",
          color: "#FFFFFF",
        }}
      >
        <div>
          <p className="font-arabic text-xl">
            عذراً، هذه الدعوة مخصصة لشخص آخر
          </p>
        </div>
      </div>
    );
  }

  if (inviteCode && !inviteValid) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center px-6 text-center"
        style={{
          backgroundColor: "#24000D",
          color: "#FFFFFF",
        }}
      >
        <div>
          <p className="font-arabic text-xl">
            رابط الدعوة غير صالح
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-screen text-white ${
        !opened
          ? "overflow-hidden h-screen"
          : "overflow-x-hidden"
      }`}
      style={{
        backgroundColor: "#24000D",
      }}
    >
      <SprayParticles />

      <NavigationDock
        active={opened}
        guestName={guestName}
        inviteCode={inviteCode || ""}
        selectedGuestId={selectedGuestId}
        guests={guests}
        onGuestSelected={(guest) => {
          setSelectedGuestId(guest.id);
          setGuestName(guest.name);
        }}
        onWrongDevice={() => {
          setWrongDevice(true);
          setInviteValid(false);
        }}
      />

      <Envelope
        onOpen={() => setOpened(true)}
      />

      <main className="relative z-10 w-full pb-24">

        <section className="w-full">
          <img
            src={invitationImg}
            alt="صورة الدعوة الأولى"
            className="w-full h-auto block"
          />
        </section>

        <section className="relative w-full flex flex-col items-center justify-start pb-12">
          <img
            src={sosImg}
            alt="الصورة الثانية"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          <div className="relative z-10 w-full flex flex-col items-center pt-20 sm:pt-32 px-4 space-y-6">

            <div
              className="w-[92%] max-w-md p-5 sm:p-7 rounded-3xl text-center backdrop-blur-xl shadow-2xl space-y-2.5"
              style={{
                background: "transparent",
                color: "#FFFFFF",
                border: "none",
                boxShadow:
                  "0 0 12px rgba(176, 138, 60, 0.4), 0 20px 50px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div className="flex items-center justify-center my-4">
                <span
                  className="inline-block text-6xl sm:text-7xl font-normal leading-none select-none"
                  style={{
                    fontFamily:
                      "'Monasabat', sans-serif",
                    color: "#B08A3C",
                    transform: "scale(3.4)",
                    transformOrigin: "center",
                    textRendering:
                      "geometricPrecision",
                  }}
                >
                  2
                </span>
              </div>

              <p
                className="font-arabic text-sm sm:text-base pt-2"
                style={{
                  color: "#FFFFFF",
                }}
              >
                في ليلة يكتمل بها أنسنا، وتحت سماء تتلألأ فرحاً
              </p>

              <p
                className="font-arabic text-sm sm:text-base"
                style={{
                  color: "#FFFFFF",
                }}
              >
                ولأن الفرحة لا تكتمل إلا بجميل حضوركم
              </p>

              <p
                className="font-arabic text-base sm:text-lg opacity-90 pb-2"
                style={{
                  color: "#FFFFFF",
                }}
              >
                تتــشرف
              </p>

              <div className="flex items-center justify-center gap-1">
                <div className="w-[45%] flex justify-center">
                  <span
                    className="font-arabic text-lg sm:text-xl font-bold whitespace-nowrap text-center"
                    style={{
                      color: "#B08A3C",
                    }}
                  >
                    أم يزيد
                  </span>
                </div>
              </div>

              <p
                className="font-arabic text-sm sm:text-base pt-2"
                style={{
                  color: "#FFFFFF",
                }}
              >
                بدعوتكم لحضور حفل زفاف اميرها
              </p>

              <div className="h-6"></div>

              <div className="py-2 flex items-center justify-center gap-2">
                <span
                  className="text-4xl sm:text-5xl"
                  style={{
                    fontFamily:
                      "'IranNastaliq', sans-serif",
                    color: "#B08A3C",
                  }}
                >
                  محمـد
                </span>

                <span
                  className="text-2xl"
                  style={{
                    fontFamily:
                      "'WaFont', sans-serif",
                    color: "#B08A3C",
                  }}
                >
                  &
                </span>

                <span
                  className="text-4xl sm:text-5xl"
                  style={{
                    fontFamily:
                      "'IranNastaliq', sans-serif",
                    color: "#B08A3C",
                  }}
                >
                  اميمـه
                </span>
              </div>
            </div>

            <div
              id="location"
              className="text-center space-y-1 py-2"
            >
              <h3
                className="font-arabic text-xl sm:text-2xl font-bold"
                style={{
                  color: "#B08A3C",
                }}
              >
                الموقع
              </h3>

              <p
                className="font-arabic text-xl sm:text-xl font-bold"
                style={{
                  color: "#FFFFFF",
                }}
              >
                قاعة رسال للمناسبات والاحتفالات
              </p>

              <p
                className="font-arabic text-lg sm:text-xl font-semibold"
                style={{
                  color: "#FFFFFF",
                }}
              >
                الرياض
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3">

              <div
                className="w-60 sm:w-68 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl text-center"
                style={{
                  background: "transparent",
                  color: "#FFFFFF",
                  border: "none",
                  boxShadow:
                    "0 0 12px rgba(176, 138, 60, 0.4), 0 20px 50px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div
                  className="relative px-4 py-2 flex justify-between items-center font-arabic text-xs sm:text-sm font-bold backdrop-blur-md"
                  style={{
                    background:
                      "rgba(0, 0, 0, 0.15)",
                    color: "#FFFFFF",
                  }}
                >
                  <span>
                    الخميس
                  </span>

                  <span
                    className="text-sm font-extrabold"
                    style={{
                      color: "#B08A3C",
                    }}
                  >
                    اكتوبر
                  </span>

                  <span className="font-display">
                    2026
                  </span>
                </div>

                <div className="py-4 px-4 space-y-0.5">
                  <div
                    className="font-display text-4xl font-extrabold tracking-tight"
                    style={{
                      color: "#B08A3C",
                    }}
                  >
                    8
                  </div>

                  <div
                    className="font-arabic text-sm font-bold"
                    style={{
                      color: "#FFFFFF",
                    }}
                  >
                    الخميس
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  window.location.href =
                    "/wedding.ics";
                }}
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-full backdrop-blur-xl shadow-md transition-transform active:scale-95 hover:scale-105 cursor-pointer"
                style={{
                  background: "transparent",
                  color: "#FFFFFF",
                  border: "none",
                  boxShadow:
                    "0 0 10px rgba(176, 138, 60, 0.35)",
                }}
              >
                <Calendar
                  className="w-4 h-4"
                  style={{
                    color: "#FFFFFF",
                  }}
                />

                <span
                  className="font-arabic text-xs sm:text-sm font-bold"
                  style={{
                    color: "#FFFFFF",
                  }}
                >
                  احفظ الموعد
                </span>
              </button>
            </div>

            <div className="w-full max-w-md text-center space-y-2 pt-1">
              <h3
                className="font-arabic text-base sm:text-lg font-bold"
                style={{
                  color: "#B08A3C",
                }}
              >
                العدّ التنازلي
              </h3>

              <Countdown />
            </div>

            <EventTimeline />
            <EventDetails />

          </div>
        </section>

        <section
          id="gallery"
          className="relative w-full flex flex-col items-center justify-start"
        >
          <div className="relative w-full flex items-center justify-center">

            <img
              src={footerBgImg}
              alt="صورة خلفية الفوتر"
              className="w-full h-auto block"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-6">

              <div
                className="w-[92%] max-w-md p-4 rounded-3xl text-center backdrop-blur-xl shadow-2xl mb-6 flex flex-col items-center justify-center gap-2"
                style={{
                  background: "transparent",
                  border: "none",
                  boxShadow:
                    "0 0 12px rgba(176, 138, 60, 0.4), 0 20px 50px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Heart
                  className="w-5 h-5 fill-current"
                  style={{
                    color: "#B08A3C",
                  }}
                />

                <p
                  className="font-arabic text-xs sm:text-sm font-semibold"
                  style={{
                    color: "#FFFFFF",
                  }}
                >
                  نرجو تأكيد الحضور لاستلام بطاقات الدخول الشخصية
                </p>
              </div>

              <p
                className="text-6xl sm:text-7xl font-bold text-center mb-3"
                style={{
                  fontFamily: "'Sull', sans-serif",
                  color: "#FFFFFF",
                }}
              >
                ننتظركم بكل حُب
              </p>

              <div
                className="w-[92%] max-w-md rounded-3xl overflow-hidden backdrop-blur-md shadow-xl mb-6"
                style={{
                  border: "none",
                  boxShadow:
                    "0 0 12px rgba(176, 138, 60, 0.3)",
                }}
              >
                <img
                  src={cardImg}
                  alt="بطاقة تذكارية"
                  className="w-full h-auto object-cover block"
                />
              </div>

              <div
                id="rsvp"
                className="w-full text-center space-y-1.5"
              >
                <Reveal>
                  <div className="flex items-center justify-center gap-2">

                    <span
                      className="text-2xl sm:text-3xl"
                      style={{
                        fontFamily:
                          "'IranNastaliq', sans-serif",
                        color: "#B08A3C",
                      }}
                    >
                      محمـد
                    </span>

                    <span
                      className="text-xl"
                      style={{
                        fontFamily:
                          "'WaFont', sans-serif",
                        color: "#FFFFFF",
                      }}
                    >
                      &
                    </span>

                    <span
                      className="text-2xl sm:text-3xl"
                      style={{
                        fontFamily:
                          "'IranNastaliq', sans-serif",
                        color: "#B08A3C",
                      }}
                    >
                      اميمـه
                    </span>

                  </div>
                </Reveal>

                <Reveal delay={100}>
                  <div
                    className="flex items-center justify-center gap-2 pt-0.5"
                    style={{
                      transform:
                        "translateY(100px)",
                    }}
                  >
                    <Heart
                      className="w-4 h-4 fill-current"
                      style={{
                        color: "#641414",
                      }}
                    />

                    <span className="font-arabic text-xs sm:text-sm font-semibold">

                      <a
                        href="https://www.tiktok.com/@shim2t?_r=1&_t=ZS-95w0d8f7vnk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 font-bold hover:opacity-80 transition-opacity"
                        style={{
                          color: "#B08A3C",
                        }}
                      >
                        غيمة
                      </a>

                    </span>
                  </div>
                </Reveal>

              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Index;
