import { useState } from "react";
import { Heart, Calendar } from "lucide-react";
import invitationImg from "@/assets/photo-output.png";
import sosImg from "@/assets/sos.png";
import Envelope from "@/components/Envelope";
import SprayParticles from "@/components/SprayParticles";
import Reveal from "@/components/Reveal";
import Countdown from "@/components/Countdown";
import EventTimeline from "@/components/EventTimeline"; // <-- إضافة الاستيراد هنا
import MusicToggle from "@/components/MusicToggle";

const Index = () => {
  const [opened, setOpened] = useState(false);

  return (
    <div
      className="relative min-h-screen overflow-x-hidden text-white"
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

        {/* الصورة الثانية مع العناصر التراكبية */}
        <section className="relative w-full overflow-hidden">
          <img
            src={sosImg}
            alt="الصورة الثانية"
            className="w-full h-auto block"
          />

          {/* العناصر المتراكبة فوق الصورة الثانية */}
          <div className="absolute inset-x-0 top-0 flex flex-col items-center justify-start pt-44 sm:pt-60 px-4 space-y-7 pb-20">
            
            {/* أ. المربع الزجاجي للكتابة */}
            <div
              className="w-[92%] max-w-md p-5 sm:p-7 rounded-3xl text-center backdrop-blur-md border border-white/40 shadow-xl space-y-2"
              style={{ background: "rgba(255, 255, 255, 0.25)", color: "#5F4F41" }}
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
                className="w-60 sm:w-68 rounded-3xl overflow-hidden backdrop-blur-md border border-white/40 shadow-xl text-center"
                style={{ background: "rgba(255, 255, 255, 0.25)", color: "#5F4F41" }}
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
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-full backdrop-blur-md border border-white/40 shadow-md transition-transform active:scale-95 hover:scale-105 cursor-pointer"
                style={{ background: "rgba(255, 255, 255, 0.25)", color: "#5F4F41" }}
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

            {/* هـ. مربع برنامج المناسبة التفاعلي الجديد */}
            <EventTimeline />

          </div>
        </section>

        {/* الذيل (Footer) */}
        <footer className="px-4 py-8 text-center border-t border-[#5F4F41]/20">
          <Reveal>
            <div className="flex items-center justify-center gap-2" style={{ color: "#5F4F41" }}>
              <Heart className="w-4 h-4 fill-current" />
              <span className="font-arabic text-xs">
                صُنع بحب بواسطة{" "}
                <a
                  href="https://www.tiktok.com/@shim2t?_r=1&_t=ZS-95w0d8f7vnk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 font-bold"
                  style={{ color: "#5F4F41" }}
                >
                  متجر غيمة
                </a>
              </span>
            </div>
          </Reveal>
        </footer>
      </main>
    </div>
  );
};

export default Index;
