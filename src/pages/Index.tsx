import { useState, useRef } from "react";
import { Heart, Calendar } from "lucide-react";
import invitationImg from "@/assets/photo-output.png";
import sosImg from "@/assets/sos.png";

import footerBgImg from "@/assets/96AF05E8-7D83-48B7-B124-4763797873E0.png";
import cardImg from "@/assets/IMG_5482.jpeg";

import Envelope from "@/components/Envelope";
import SprayParticles from "@/components/SprayParticles";
import Reveal from "@/components/Reveal";
import Countdown from "@/components/Countdown";
import EventTimeline from "@/components/EventTimeline";
import EventDetails from "@/components/EventDetails";
import NavigationDock from "@/components/NavigationDock";

const Index = () => {
  const [opened, setOpened] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const handleOpenEnvelope = () => {
    setOpened(true);
    // التمرير التلقائي الهادئ والمناسب لأسفل بمجرد فتح الظرف
    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight * 0.9,
        behavior: "smooth"
      });
    }, 400);
  };

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
      <Envelope onOpen={handleOpenEnvelope} />

      {/* 2. محتوى الموقع */}
      <main ref={mainRef} className="relative z-10 w-full pb-24">
        
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
              style={{ background: "rgba(233, 221, 212, 0.85)", color: "#5F4F41" }}
            >
              {/* الرقم 2 */}
              <div className="flex items-center justify-center my-4">
                <span
                  className="inline-block text-6xl sm:text-7xl font-normal leading-none select-none"
                  style={{
                    fontFamily: "'Monasabat', sans-serif",
                    color: "#5F4F41",
                    transform: "scale(3.4)",
                    transformOrigin: "center",
                    textRendering: "geometricPrecision"
                  }}
                >
                  2
                </span>
              </div>

              {/* الثلاث سطور تحته */}
              <p className="font-arabic text-sm sm:text-base pt-2" style={{ color: "#5F4F41" }}>
                بمشاعر مليئة بالفرح والسعادة
              </p>
              <p className="font-arabic text-sm sm:text-base" style={{ color: "#5F4F41" }}>
                ولأن الفرحة لا تكتمل الا برويتكم
              </p>
              <p className="font-arabic text-base sm:text-lg opacity-90 pb-2" style={{ color: "#5F4F41" }}>
                تتشرف
              </p>

              {/* السطر الخامس مقسم: أم محمد السلماني (Almarai) + & (wa.ttf) + أم طلال السعيد (Almarai) */}
              <div className="flex items-center justify-center gap-1 text-lg sm:text-xl font-bold py-2" style={{ color: "#5F4F41" }}>
                <span style={{ fontFamily: "'Almarai', sans-serif" }}>أم محمد السلماني</span>
                <span className="text-2xl" style={{ fontFamily: "'WaFont', sans-serif" }}>&</span>
                <span style={{ fontFamily: "'Almarai', sans-serif" }}>أم طلال السعيد</span>
              </div>

              {/* السطر السادس */}
              <p className="font-arabic text-sm sm:text-base pt-2" style={{ color: "#5F4F41" }}>
                بدعوتكن لحضور حفل عقد قران نجليهما
              </p>

              {/* مسافة واضحة ومقصودة قبل سطر أسماء العروسين */}
              <div className="h-6"></div>

              {/* السطر الاخير في المربع: محمد & عهود */}
              <div className="py-2 flex items-center justify-center gap-2">
                <span className="text-4xl sm:text-5xl" style={{ fontFamily: "'IranNastaliq', sans-serif", color: "#5F4F41" }}>محمـد</span>
                <span className="text-2xl" style={{ fontFamily: "'WaFont', sans-serif", color: "#5F4F41" }}>&</span>
                <span className="text-4xl sm:text-5xl" style={{ fontFamily: "'IranNastaliq', sans-serif", color: "#5F4F41" }}>عتـاب</span>
              </div>
            </div>

            {/* قسم الموقع */}
            <div id="location" className="text-center space-y-0.5 py-1">
              <h3 className="font-arabic text-base sm:text-lg font-bold" style={{ color: "#5F4F41" }}>الموقع</h3>
              <p className="font-arabic text-sm font-semibold" style={{ color: "#5F4F41" }}>قاعـة فرح</p>
              <p className="font-arabic text-xs font-medium opacity-90" style={{ color: "#5F4F41" }}>جدة</p>
            </div>

            {/* التقويم */}
            <div className="flex flex-col items-center space-y-3">
              <div
                className="w-60 sm:w-68 rounded-3xl overflow-hidden backdrop-blur-md border border-white/50 shadow-2xl text-center"
                style={{ background: "rgba(233, 221, 212, 0.85)", color: "#5F4F41" }}
              >
                <div className="relative px-4 py-2 flex justify-between items-center font-arabic text-xs sm:text-sm font-bold" style={{ background: "#5F4F41", color: "#FFFFFF" }}>
                  <span>الثلاثاء</span>
                  <span className="text-sm font-extrabold">ديسمبر</span>
                  <span className="font-display">2026</span>
                </div>
                <div className="py-4 px-4 space-y-0.5">
                  <div className="font-display text-4xl font-extrabold tracking-tight" style={{ color: "#5F4F41" }}>22</div>
                  <div className="font-arabic text-sm font-bold" style={{ color: "#5F4F41" }}>الثلاثاء</div>
                  <div className="font-display text-xs font-semibold opacity-80" style={{ color: "#5F4F41" }}>PM 7:00</div>
                </div>
              </div>

              <button
                onClick={() => alert("تم حفظ الموعد في التقويم!")}
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-full backdrop-blur-md border border-white/50 shadow-md transition-transform active:scale-95 hover:scale-105 cursor-pointer"
                style={{ background: "rgba(233, 221, 212, 0.85)", color: "#5F4F41" }}
              >
                <Calendar className="w-4 h-4" style={{ color: "#5F4F41" }} />
                <span className="font-arabic text-xs sm:text-sm font-bold">احفظ الموعد</span>
              </button>
            </div>

            <div className="w-full max-w-md text-center space-y-2 pt-1">
              <h3 className="font-arabic text-base sm:text-lg font-bold" style={{ color: "#5F4F41" }}>
                العدّ التنازلي
              </h3>
              <Countdown />
            </div>

            <EventTimeline />
            <EventDetails />
          </div>
        </section>

        {/* القسم السفلي والذيل */}
        <section id="gallery" className="relative w-full flex flex-col items-center justify-start">
          <div className="relative w-full flex items-center justify-center">
            <img
              src={footerBgImg}
              alt="صورة خلفية الفوتر"
              className="w-full h-auto block"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-6">
              {/* السطر المكبر في الفوتر */}
              <p
                className="text-2xl sm:text-3xl font-bold text-center mb-3"
                style={{ fontFamily: "'Sull', sans-serif", color: "#5F4F41" }}
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
                  {/* محمد & عهود في الذيل */}
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl sm:text-3xl" style={{ fontFamily: "'IranNastaliq', sans-serif", color: "#5F4F41" }}>محمـد</span>
                    <span className="text-xl" style={{ fontFamily: "'WaFont', sans-serif", color: "#5F4F41" }}>&</span>
                    <span className="text-2xl sm:text-3xl" style={{ fontFamily: "'IranNastaliq', sans-serif", color: "#5F4F41" }}>عتـاب</span>
                  </div>
                </Reveal>

                <Reveal delay={100}>
                  <div
                    className="flex items-center justify-center gap-2 pt-0.5"
                    style={{ color: "#5F4F41" }}
                  >
                    <Heart className="w-4 h-4 fill-current text-[#5F4F41]" />
                    <span className="font-arabic text-xs sm:text-sm font-semibold">
                      <a
                        href="https://www.tiktok.com/@shim2t?_r=1&_t=ZS-95w0d8f7vnk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 font-bold hover:opacity-80 transition-opacity"
                        style={{ color: "#5F4F41" }}
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
