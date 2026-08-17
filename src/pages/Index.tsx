import { useState, useEffect } from "react";
import { Heart, Calendar } from "lucide-react";
import invitationImg from "@/assets/1.png";
import sosImg from "@/assets/Rn.jpeg";

import footerBgImg from "@/assets/96AF05E8-7D83-48B7-B124-4763797873E0.png";
import cardImg from "@/assets/IMG_5716.jpeg";

import Envelope from "@/components/Envelope";
import SprayParticles from "@/components/SprayParticles";
import Reveal from "@/components/Reveal";
import Countdown from "@/components/Countdown";
import EventTimeline from "@/components/EventTimeline";
import EventDetails from "@/components/EventDetails";
import NavigationDock from "@/components/NavigationDock";

const Index = () => {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (opened) {
      const startPosition = window.pageYOffset;
      const targetPosition =
        document.documentElement.scrollHeight - window.innerHeight;
      const distance = targetPosition - startPosition;
      let startTime: number;
      const duration = 18000; // 18 ثانية

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

  return (
    <div
      className={`relative min-h-screen text-white ${
        !opened ? "overflow-hidden h-screen" : "overflow-x-hidden"
      }`}
      style={{ backgroundColor: "#E9DDD4" }}
    >
      <SprayParticles />

      {/* الشريط السفلي للتنقل والموسيقى */}
      <NavigationDock active={opened} />

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
            <div
              className="w-[92%] max-w-md p-5 sm:p-7 rounded-3xl text-center backdrop-blur-md border border-white/50 shadow-2xl space-y-2.5"
              style={{
                background: "rgba(233, 221, 212, 0.85)",
                color: "#641414",
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
                style={{ color: "#641414" }}
              >
                بمشاعر مليئة بالفرح والسعادة
              </p>

              <p
                className="font-arabic text-sm sm:text-base"
                style={{ color: "#641414" }}
              >
                ولأن الفرحة لا تكتمل الا برويتكم
              </p>

              <p
                className="font-arabic text-base sm:text-lg opacity-90 pb-2"
                style={{ color: "#641414" }}
              >
                وبكل الحـب والــود تتــشرف
              </p>

              {/* السيدة فوق منتصف كل اسم */}
              <div className="flex items-center justify-center gap-1 py-2">
                <div className="w-[45%] flex justify-center">
                  <span
                    className="font-arabic text-sm sm:text-base font-bold"
                    style={{ color: "#641414" }}
                  >
                    السيدة
                  </span>
                </div>

                <div className="w-[10%]" />

                <div className="w-[45%] flex justify-center">
                  <span
                    className="font-arabic text-sm sm:text-base font-bold"
                    style={{ color: "#641414" }}
                  >
                    السيدة
                  </span>
                </div>
              </div>

              {/* أسماء الأمهات بنفس الحجم والمساحة ومتوازية */}
              <div className="flex items-center justify-center gap-1">
                <div className="w-[45%] flex justify-center">
                  <span
                    className="font-arabic text-lg sm:text-xl font-bold whitespace-nowrap text-center"
                    style={{ color: "#B08A3C" }}
                  >
                    كوكب عبدالله الحميصي
                  </span>
                </div>

                <div className="w-[10%] flex items-center justify-center">
                  <span
                    className="text-2xl"
                    style={{
                      fontFamily: "'WaFont', sans-serif",
                      color: "#641414",
                    }}
                  >
                    &
                  </span>
                </div>

                <div className="w-[45%] flex justify-center">
                  <span
                    className="font-arabic text-lg sm:text-xl font-bold whitespace-nowrap text-center"
                    style={{ color: "#B08A3C" }}
                  >
                    مريم باخشوين
                  </span>
                </div>
              </div>

              {/* السطر السادس */}
              <p
                className="font-arabic text-sm sm:text-base pt-2"
                style={{ color: "#641414" }}
              >
                بدعوتكم لحضور حفل زفاف
              </p>

              {/* مسافة واضحة ومقصودة قبل سطر أسماء العروسين */}
              <div className="h-6"></div>

              {/* السطر الاخير في المربع: عبـداللّٰه & ريسـان */}
              <div className="py-2 flex items-center justify-center gap-2">
                <span
                  className="text-4xl sm:text-5xl"
                  style={{
                    fontFamily: "'IranNastaliq', sans-serif",
                    color: "#B08A3C",
                  }}
                >
                  عبـدالرحيم
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
                  آيسـات
                </span>
              </div>
            </div>

            {/* قسم الموقع */}
            <div id="location" className="text-center space-y-0.5 py-1">
              <h3
                className="font-arabic text-base sm:text-lg font-bold"
                style={{ color: "#B08A3C" }}
              >
                الموقع
              </h3>

              <p
                className="font-arabic text-sm font-semibold"
                style={{ color: "#641414" }}
              >
                قاعة الف ليلة وليلة
              </p>

              <p
                className="font-arabic text-xs font-medium opacity-90"
                style={{ color: "#641414" }}
              >
                فندق تاج سيلين
              </p>
            </div>

            {/* التقويم */}
            <div className="flex flex-col items-center space-y-3">
              <div
                className="w-60 sm:w-68 rounded-3xl overflow-hidden backdrop-blur-md border border-white/50 shadow-2xl text-center"
                style={{
                  background: "rgba(233, 221, 212, 0.85)",
                  color: "#641414",
                }}
              >
                <div
                  className="relative px-4 py-2 flex justify-between items-center font-arabic text-xs sm:text-sm font-bold"
                  style={{
                    background: "#641414",
                    color: "#FFFFFF",
                  }}
                >
                  <span>الجمعة</span>

                  <span
                    className="text-sm font-extrabold"
                    style={{ color: "#B08A3C" }}
                  >
                    سبتمبر
                  </span>

                  <span className="font-display">2026</span>
                </div>

                <div className="py-4 px-4 space-y-0.5">
                  <div
                    className="font-display text-4xl font-extrabold tracking-tight"
                    style={{ color: "#B08A3C" }}
                  >
                    18
                  </div>

                  <div
                    className="font-arabic text-sm font-bold"
                    style={{ color: "#641414" }}
                  >
                    الجمعة
                  </div>

                  {/* <div className="font-display text-xs font-semibold opacity-80" style={{ color: "#641414" }}>PM 8:00</div>*/}
                </div>
              </div>

              <button
                onClick={() => {
                  window.location.href = "/wedding.ics";
                }}
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-full backdrop-blur-md border border-white/50 shadow-md transition-transform active:scale-95 hover:scale-105 cursor-pointer"
                style={{
                  background: "rgba(233, 221, 212, 0.85)",
                  color: "#641414",
                }}
              >
                <Calendar
                  className="w-4 h-4"
                  style={{ color: "#641414" }}
                />

                <span
                  className="font-arabic text-xs sm:text-sm font-bold"
                  style={{ color: "#641414" }}
                >
                  احفظ الموعد
                </span>
              </button>
            </div>

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

              {/* السطر المكبر في الفوتر */}
              <p
                className="text-6xl sm:text-7xl font-bold text-center mb-3"
                style={{
                  fontFamily: "'Sull', sans-serif",
                  color: "#B08A3C",
                }}
              >
                ننتظركم بكل حُب
              </p>

              <div className="w-[92%] max-w-md rounded-3xl overflow-hidden backdrop-blur-md border border-white/40 shadow-xl mb-6">
                <img
                  src={cardImg}
                  alt="بطاقة تذكارية"
                  className="w-full h-auto object-cover block"
                />
              </div>

              <div id="rsvp" className="w-full text-center space-y-1.5">
                <Reveal>

                  {/* عبـداللّٰه & ريسـان في الذيل */}
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className="text-2xl sm:text-3xl"
                      style={{
                        fontFamily: "'IranNastaliq', sans-serif",
                        color: "#B08A3C",
                      }}
                    >
                      عبـدالرحيم
                    </span>

                    <span
                      className="text-xl"
                      style={{
                        fontFamily: "'WaFont', sans-serif",
                        color: "#641414",
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
                      آيسـات
                    </span>
                  </div>
                </Reveal>

                <Reveal delay={100}>
                  <div
                    className="flex items-center justify-center gap-2 pt-0.5"
                  style={{
                      color: "#641414",
                      transform: "translateY(100px)"
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
