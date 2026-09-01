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

const Index = () => {
  const [opened, setOpened] = useState(false);
const inviteCode = new URLSearchParams(window.location.search).get("invite");

const [guestName, setGuestName] = useState("");
const [inviteLoading, setInviteLoading] = useState(!!inviteCode);
const [inviteValid, setInviteValid] = useState(!inviteCode);
const [wrongDevice, setWrongDevice] = useState(false);

useEffect(() => {
  const loadGuest = async () => {
    if (!inviteCode) {
      setInviteLoading(false);
      return;
    }

    let deviceId = localStorage.getItem("guest_device_id");

    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem("guest_device_id", deviceId);
    }

    const { data: guest, error } = await supabase
      .from("guests")
      .select("id, name, device_id")
      .eq("invite_code", inviteCode)
      .maybeSingle();

    if (error || !guest) {
      setInviteValid(false);
      setInviteLoading(false);
      return;
    }

    setGuestName(guest.name);

    // إذا الدعوة مرتبطة بجهاز آخر
    if (guest.device_id && guest.device_id !== deviceId) {
      setWrongDevice(true);
      setInviteValid(false);
      setInviteLoading(false);
      return;
    }

    // أول جهاز يفتح الدعوة يصبح الجهاز المسموح له
    if (!guest.device_id) {
      const { error: updateError } = await supabase
        .from("guests")
        .update({
          device_id: deviceId,
        })
        .eq("id", guest.id)
        .is("device_id", null);

      if (updateError) {
        console.error(updateError);
        setInviteValid(false);
        setInviteLoading(false);
        return;
      }
    }

    setInviteValid(true);
    setInviteLoading(false);
  };

  loadGuest();
}, [inviteCode]);
  useEffect(() => {
    if (opened) {
      const startPosition = window.pageYOffset;
      const targetPosition =
        document.documentElement.scrollHeight - window.innerHeight;
      const distance = targetPosition - startPosition;
      let startTime: number;
      const duration = 40000; // 50 ثانية

      const animation = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const run = startPosition + distance * progress;

        window.scrollTo({
          top: run,
          behavior: "instant",
        });

        if (progress < 1) {
          requestAnimationFrame(animation);
        }
      };

      setTimeout(() => {
        startTime = Date.now();
        requestAnimationFrame(animation);
      }, 1500);
    }
  }, [opened]);
if (inviteLoading) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#24000D" }}
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
        !opened ? "overflow-hidden h-screen" : "overflow-x-hidden"
      }`}
      style={{ backgroundColor: "#24000D" }}
    >
      <SprayParticles />

      {/* الشريط السفلي للتنقل والموسيقى */}
     <NavigationDock
  active={opened}
  guestName={guestName}
  inviteCode={inviteCode || ""}
/>

      {/* 1. الظرف */}
      <Envelope onOpen={() => setOpened(true)} />

      {/* 2. محتوى الموقع */}
      <main className="relative z-10 w-full pb-24">

        {/* الصورة الأولى */}
        <section className="w-full">
          <img
            src={invitationImg}
            alt="صورة الدعوة الأولى"
            className="w-full h-auto block"
          />
        </section>

        {/* المربع الأول بالنصوص الأصلية */}
        <section className="relative w-full flex flex-col items-center justify-start pb-12">
          <img
            src={sosImg}
            alt="الصورة الثانية"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          <div className="relative z-10 w-full flex flex-col items-center pt-20 sm:pt-32 px-4 space-y-6">

            {/* مربع الزجاج الأول */}
            <div
              className="w-[92%] max-w-md p-5 sm:p-7 rounded-3xl text-center backdrop-blur-xl shadow-2xl space-y-2.5"
              style={{
                background: "transparent",
                color: "#FFFFFF",
                border: "none",
                boxShadow: "0 0 12px rgba(176, 138, 60, 0.4), 0 20px 50px rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* الرقم 2 */}
              <div className="flex items-center justify-center my-4">
                <span
                  className="inline-block text-6xl sm:text-7xl font-normal leading-none select-none"
                  style={{
                    fontFamily: "'Monasabat', sans-serif",
                    color: "#B08A3C",
                    transform: "scale(3.4)",
                    transformOrigin: "center",
                    textRendering: "geometricPrecision",
                  }}
                >
                  2
                </span>
              </div>

              {/* الثلاث سطور تحته */}
              <p
                className="font-arabic text-sm sm:text-base pt-2"
                style={{ color: "#FFFFFF" }}
              >
                في ليلة يكتمل بها أنسنا، وتحت سماء تتلألأ فرحاً
              </p>

              <p
                className="font-arabic text-sm sm:text-base"
                style={{ color: "#FFFFFF" }}
              >
                ولأن الفرحة لا تكتمل إلا بجميل حضوركم
              </p>

              <p
                className="font-arabic text-base sm:text-lg opacity-90 pb-2"
                style={{ color: "#FFFFFF" }}
              >
               تتــشرف
              </p>

              {/* السيدة فوق منتصف كل اسم */}
              {/*   <div className="flex items-center justify-center gap-1 py-2">
                <div className="w-[45%] flex justify-center">
                  <span
                    className="font-arabic text-sm sm:text-base font-bold"
                    style={{ color: "#FFFFFF" }}
                  >
                    السيدة
                  </span>
                </div>

                <div className="w-[10%]" />

                <div className="w-[45%] flex justify-center">
                  <span
                    className="font-arabic text-sm sm:text-base font-bold"
                    style={{ color: "#FFFFFF" }}
                  >
                    السيدة
                  </span>
                </div>
              </div> */}

              {/* أسماء الأمهات بنفس الحجم والمساحة ومتوازية */}
              <div className="flex items-center justify-center gap-1">
                <div className="w-[45%] flex justify-center">
                  <span
                    className="font-arabic text-lg sm:text-xl font-bold whitespace-nowrap text-center"
                    style={{ color: "#B08A3C" }}
                  >
                    أم يزيد
                  </span>
                </div>

                {/*     <div className="w-[10%] flex items-center justify-center">
                  <span
                    className="text-2xl"
                    style={{
                      fontFamily: "'WaFont', sans-serif",
                      color: "#FFFFFF",
                    }}
                  >
                    &
                  </span>
                </div>*/}

                {/*   <div className="w-[45%] flex justify-center">
                  <span
                    className="font-arabic text-lg sm:text-xl font-bold whitespace-nowrap text-center"
                    style={{ color: "#B08A3C" }}
                  >
                    مريم باخشوين
                  </span>
                </div>*/}
              </div>

              {/* السطر السادس */}
              <p
                className="font-arabic text-sm sm:text-base pt-2"
                style={{ color: "#FFFFFF" }}
              >
                بدعوتكم لحضور حفل زفاف اميرها
              </p>

              {/* مسافة واضحة ومقصودة قبل سطر أسماء العروسين */}
              <div className="h-6"></div>

              {/* السطر الاخير في المربع: عبـدالرحيم & آيسـات */}
              <div className="py-2 flex items-center justify-center gap-2">
                <span
                  className="text-4xl sm:text-5xl"
                  style={{
                    fontFamily: "'IranNastaliq', sans-serif",
                    color: "#B08A3C",
                  }}
                >
                 محمـد
                </span>

                <span
                  className="text-2xl"
                  style={{
                    fontFamily: "'WaFont', sans-serif",
                    color: "#B08A3C",
                  }}
                >
                  &
                </span>

                <span
                  className="text-4xl sm:text-5xl"
                  style={{
                    fontFamily: "'IranNastaliq', sans-serif",
                    color: "#B08A3C",
                  }}
                >
                  اميمـه
                </span>
              </div>
            </div>

            {/* قسم الموقع */}
            <div id="location" className="text-center space-y-1 py-2">
              <h3
                className="font-arabic text-xl sm:text-2xl font-bold"
                style={{ color: "#B08A3C" }}
              >
                الموقع
              </h3>

              <p
                className="font-arabic text-xl sm:text-xl font-bold"
                style={{ color: "#FFFFFF" }}
              >
               قاعة رسال للمناسبات والاحتفالات
              </p>

              <p
                className="font-arabic text-lg sm:text-xl font-semibold"
                style={{ color: "#FFFFFF" }}
              >
                الرياض 
              </p>
            </div>

            {/* التقويم */}
            <div className="flex flex-col items-center space-y-3">

              {/* مربع التاريخ */}
              <div
                className="w-60 sm:w-68 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl text-center"
                style={{
                  background: "transparent",
                  color: "#FFFFFF",
                  border: "none",
                  boxShadow: "0 0 12px rgba(176, 138, 60, 0.4), 0 20px 50px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div
                  className="relative px-4 py-2 flex justify-between items-center font-arabic text-xs sm:text-sm font-bold backdrop-blur-md"
                  style={{
                    background: "rgba(0, 0, 0, 0.15)",
                    color: "#FFFFFF",
                  }}
                >
                  <span>الخميس</span>

                  <span
                    className="text-sm font-extrabold"
                    style={{ color: "#B08A3C" }}
                  >
                    اكتوبر
                  </span>

                  <span className="font-display">2026</span>
                </div>

                <div className="py-4 px-4 space-y-0.5">
                  <div
                    className="font-display text-4xl font-extrabold tracking-tight"
                    style={{ color: "#B08A3C" }}
                  >
                    8
                  </div>

                  <div
                    className="font-arabic text-sm font-bold"
                    style={{ color: "#FFFFFF" }}
                  >
                    الخميس
                  </div>
                </div>
              </div>

              {/* زر حفظ الموعد */}
              <button
                onClick={() => {
                  window.location.href = "/wedding.ics";
                }}
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-full backdrop-blur-xl shadow-md transition-transform active:scale-95 hover:scale-105 cursor-pointer"
                style={{
                  background: "transparent",
                  color: "#FFFFFF",
                  border: "none",
                  boxShadow: "0 0 10px rgba(176, 138, 60, 0.35)",
                }}
              >
                <Calendar
                  className="w-4 h-4"
                  style={{ color: "#FFFFFF" }}
                />

                <span
                  className="font-arabic text-xs sm:text-sm font-bold"
                  style={{ color: "#FFFFFF" }}
                >
                  احفظ الموعد
                </span>
              </button>
            </div>

            {/* العد التنازلي */}
            <div className="w-full max-w-md text-center space-y-2 pt-1">
              <h3
                className="font-arabic text-base sm:text-lg font-bold"
                style={{ color: "#B08A3C" }}
              >
                العدّ التنازلي
              </h3>

              <Countdown />
            </div>

            <EventTimeline />
            <EventDetails />
          </div>
        </section>

        {/* القسم السفلي والذيل */}
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

              {/* مربع زجاج للتنبيه بتأكيد الحضور */}
              <div
                className="w-[92%] max-w-md p-4 rounded-3xl text-center backdrop-blur-xl shadow-2xl mb-6 flex flex-col items-center justify-center gap-2"
                style={{
                  background: "transparent",
                  border: "none",
                  boxShadow: "0 0 12px rgba(176, 138, 60, 0.4), 0 20px 50px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Heart
                  className="w-5 h-5 fill-current"
                  style={{ color: "#B08A3C" }}
                />
                <p
                  className="font-arabic text-xs sm:text-sm font-semibold"
                  style={{ color: "#FFFFFF" }}
                >
                  نرجو تأكيد الحضور لاستلام بطاقات الدخول الشخصية
                </p>
              </div>

              {/* السطر المكبر في الفوتر */}
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
                  boxShadow: "0 0 12px rgba(176, 138, 60, 0.3)",
                }}
              >
                <img
                  src={cardImg}
                  alt="بطاقة تذكارية"
                  className="w-full h-auto object-cover block"
                />
              </div>

              <div id="rsvp" className="w-full text-center space-y-1.5">
                <Reveal>

                  {/* عبـدالرحيم & آيسـات في الذيل */}
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className="text-2xl sm:text-3xl"
                      style={{
                        fontFamily: "'IranNastaliq', sans-serif",
                        color: "#B08A3C",
                      }}
                    >
                      محمـد
                    </span>

                    <span
                      className="text-xl"
                      style={{
                        fontFamily: "'WaFont', sans-serif",
                        color: "#FFFFFF",
                      }}
                    >
                      &
                    </span>

                    <span
                      className="text-2xl sm:text-3xl"
                      style={{
                        fontFamily: "'IranNastaliq', sans-serif",
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
                      transform: "translateY(100px)",
                    }}
                  >
                    <Heart
                      className="w-4 h-4 fill-current"
                      style={{ color: "#641414" }}
                    />

                    <span className="font-arabic text-xs sm:text-sm font-semibold">
                      <a
                        href="https://www.tiktok.com/@shim2t?_r=1&_t=ZS-95w0d8f7vnk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 font-bold hover:opacity-80 transition-opacity"
                        style={{ color: "#B08A3C" }}
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
