import { useState } from "react";
import { Heart, Calendar } from "lucide-react";
import invitationImg from "@/assets/photo-output.png";
import sosImg from "@/assets/sos.png";

// 📸 استيراد الصور السفلية
import footerBgImg from "@/assets/96AF05E8-7D83-48B7-B124-4763797873E0.png";
import cardImg from "@/assets/IMG_5482.jpeg";

import Envelope from "@/components/Envelope";
import SprayParticles from "@/components/SprayParticles";
import Reveal from "@/components/Reveal";
import Countdown from "@/components/Countdown";
import EventTimeline from "@/components/EventTimeline";
import EventDetails from "@/components/EventDetails";
import MusicToggle from "@/components/MusicToggle";

const Index = () => {
  const [opened, setOpened] = useState(false);

  return (
    <div
      className={`relative min-h-screen text-white ${
        !opened ? "overflow-hidden h-screen" : "overflow-x-hidden"
      }`}
      style={{ backgroundColor: "#E9DDD4" }}
    >
      <SprayParticles />
      <MusicToggle active={opened} />

      {/* 1. الظرف */}
      <Envelope onOpen={() => setOpened(true)} />

      {/* 2. محتوى الموقع */}
      <main className="relative z-10 w-full">
        
        {/* الصورة الأولى */}
        <section className="w-full">
          <img
            src={invitationImg}
            alt="صورة الدعوة الأولى"
            className="w-full h-auto block"
          />
        </section>

        {/* الصورة الثانية الطويلة الخلفية */}
        <section className="relative w-full flex flex-col items-center justify-start pb-12">
          
          <img
            src={sosImg}
            alt="الصورة الثانية"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          <div className="relative z-10 w-full flex flex-col items-center pt-20 sm:pt-32 px-4 space-y-6">
            
            {/* أ. المربع الزجاجي للكتابة */}
            <div
              className="w-[92%] max-w-md p-5 sm:p-7 rounded-3xl text-center backdrop-blur-md border border-white/50 shadow-2xl space-y-2"
              style={{ background: "rgba(255, 255, 255, 0.65)", color: "#5F4F41" }}
            >
              <p className="font-arabic text-base sm:text-lg font-bold leading-snug" style={{ color: "#5F4F41" }}>
                بارك الله لهما وبارك عليهما وجمع بينهما في خير
              </p>
              <p className="font-arabic text-xs sm:text-sm" style={{ color: "#5F4F41" }}>
                بمشاعر مليئة بالفرح والسعادة
              </p>
              <p className="font-arabic text-xs sm:text-sm" style={{ color: "#5F4F41" }}>
                ولأن الفرحة لا تكتمل الابرويتكم
              </p>
              <p className="font-arabic text-xs sm:text-sm opacity-90" style={{ color: "#5F4F41" }}>
                تتشرف
              </p>
              <p className="font-arabic text-base sm:text-lg font-bold py-0.5" style={{ color: "#5F4F41" }}>
                أم محمد السلماني & أم طلال السعيد
              </p>
              <p className="font-arabic text-xs sm:text-sm" style={{ color: "#5F4F41" }}>
                بدعوتكن لحضور حفل عقد قران نجليهما
              </p>
              <p className="font-arabic text-lg sm:text-2xl font-extrabold pt-1" style={{ color: "#5F4F41" }}>
                محمد & عهود
              </p>
            </div>

            {/* ب. تفاصيل الموقع */}
            <div className="text-center space-y-0.5 py-1">
              <h3 className="font-arabic text-base sm:text-lg font-bold" style={{ color: "#5F4F41" }}>الموقع</h3>
              <p className="font-arabic text-sm font-semibold" style={{ color: "#5F4F41" }}>قاعـة فرح</p>
              <p className="font-arabic text-xs font-medium opacity-90" style={{ color: "#5F4F41" }}>جدة</p>
            </div>

            {/* ج. كارت التقويم + زر احفظ الموعد */}
            <div className="flex flex-col items-center space-y-3">
              <div
                className="w-60 sm:w-68 rounded-3xl overflow-hidden backdrop-blur-md border border-white/40 shadow-2xl text-center"
                style={{ background: "rgba(255, 255, 255, 0.75)", color: "#5F4F41" }}
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

              {/* زر احفظ الموعد */}
              <button
                onClick={() => alert("تم حفظ الموعد في التقويم!")}
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-full backdrop-blur-md border border-white/50 shadow-md transition-transform active:scale-95 hover:scale-105 cursor-pointer"
                style={{ background: "rgba(255, 255, 255, 0.65)", color: "#5F4F41" }}
              >
                <Calendar className="w-4 h-4" style={{ color: "#5F4F41" }} />
                <span className="font-arabic text-xs sm:text-sm font-bold">احفظ الموعد</span>
              </button>
            </div>

            {/* د. العد التنازلي */}
            <div className="w-full max-w-md text-center space-y-2 pt-1">
              <h3 className="font-arabic text-base sm:text-lg font-bold" style={{ color: "#5F4F41" }}>
                العدّ التنازلي
              </h3>
              <Countdown />
            </div>

            {/* هـ. برنامج المناسبة */}
            <EventTimeline />

            {/* و. تفاصيل الحفل */}
            <EventDetails />

          </div>
        </section>

        {/* 3. قسم الصورة السفلية الممتدة */}
        <section className="relative w-full flex flex-col items-center justify-start">
          <div className="relative w-full flex items-center justify-center">
            <img
              src={footerBgImg}
              alt="صورة خلفية الفوتر"
              className="w-full h-auto block"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-6">
              
              <p
                className="font-arabic text-lg sm:text-xl font-bold text-center mb-3"
                style={{ color: "#5F4F41" }}
              >
                &#123; ننتظركم بكل حُب &#125;
              </p>

              <div className="w-[92%] max-w-md rounded-3xl overflow-hidden backdrop-blur-md border border-white/40 shadow-xl mb-6">
                <img
                  src={cardImg}
                  alt="بطاقة تذكارية"
                  className="w-full h-auto object-cover block"
                />
              </div>

              <div className="w-full text-center space-y-1.5">
                <Reveal>
                  <p
                    className="font-arabic text-xl sm:text-2xl font-extrabold"
                    style={{ color: "#5F4F41" }}
                  >
                    محمد & عهود
                  </p>
                </Reveal>

                <Reveal delay={100}>
                  <div
                    className="flex items-center justify-center gap-2 pt-0.5"
                    style={{ color: "#5F4F41" }}
                  >
                    <Heart className="w-4 h-4 fill-current text-[#5F4F41]" />
                    <span className="font-arabic text-xs sm:text-sm font-semibold">
                      صُنع بحب بواسطة{" "}
                      <a
                        href="https://www.tiktok.com/@shim2t?_r=1&_t=ZS-95w0d8f7vnk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 font-bold hover:opacity-80 transition-opacity"
                        style={{ color: "#5F4F41" }}
                      >
                        متجر غيمة
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
