import { useState } from "react";
import { MapPin, Heart, QrCode, Baby, Camera, Calendar } from "lucide-react";
import invitationImg from "@/assets/photo-output.png";
import sosImg from "@/assets/sos.png";
import Envelope from "@/components/Envelope";
import SprayParticles from "@/components/SprayParticles";
import Reveal from "@/components/Reveal";
import Countdown from "@/components/Countdown";
import Timeline from "@/components/Timeline";
import RSVP from "@/components/RSVP";
import MusicToggle from "@/components/MusicToggle";

const Index = () => {
  const [opened, setOpened] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white" style={{ background: "#0a0a0a" }}>
      <SprayParticles />
      <MusicToggle active={opened} />

      {/* 1. الظرف */}
      <Envelope onOpen={() => setOpened(true)} />

      {/* 2. محتوى الموقع */}
      <main className="relative z-10">
        
        {/* الصورة الأولى */}
        <section className="w-full">
          <img src={invitationImg} alt="صورة الدعوة الأولى" className="w-full h-auto block" />
        </section>

        {/* الصورة الثانية */}
        <section className="relative w-full">
          <img src={sosImg} alt="الصورة الثانية" className="w-full h-auto block min-h-[1600px] object-cover" />

          {/* العناصر المتراكبة بالترتيب المضبوط */}
          <div className="absolute inset-0 flex flex-col items-center justify-start pt-36 sm:pt-48 px-4 space-y-7">
            
            {/* أ. المربع الزجاجي للكتابة */}
            <div
              className="w-[92%] max-w-md p-5 sm:p-7 rounded-3xl text-center backdrop-blur-md border border-white/50 shadow-2xl space-y-2.5"
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
            <div className="flex flex-col items-center space-y-4 pt-1">
              <div
                className="w-60 sm:w-68 rounded-3xl overflow-hidden backdrop-blur-md border border-white/40 shadow-2xl text-center"
                style={{ background: "rgba(255, 255, 255, 0.75)", color: "#5F4F41" }}
              >
                <div className="relative px-4 py-2.5 flex justify-between items-center font-arabic text-xs sm:text-sm font-bold" style={{ background: "#5F4F41", color: "#FFFFFF" }}>
                  <div className="absolute top-1.5 left-8 w-2.5 h-3.5 rounded-full bg-white/30 border border-white/50" />
                  <div className="absolute top-1.5 right-8 w-2.5 h-3.5 rounded-full bg-white/30 border border-white/50" />
                  <span>الثلاثاء</span>
                  <span className="text-sm font-extrabold">ديسمبر</span>
                  <span className="font-display">2026</span>
                </div>
                <div className="py-5 px-4 space-y-1">
                  <div className="font-display text-5xl font-extrabold tracking-tight" style={{ color: "#5F4F41" }}>22</div>
                  <div className="font-arabic text-base font-bold" style={{ color: "#5F4F41" }}>الثلاثاء</div>
                  <div className="font-display text-xs font-semibold opacity-80" style={{ color: "#5F4F41" }}>PM 7:00</div>
                </div>
              </div>

              {/* زر احفظ الموعد */}
              <button
                onClick={() => alert("تم حفظ الموعد في التقويم!")}
                className="flex items-center justify-center gap-2 px-6 py-2 rounded-full backdrop-blur-md border border-white/50 shadow-md transition-transform active:scale-95 hover:scale-105 cursor-pointer"
                style={{ background: "rgba(255, 255, 255, 0.65)", color: "#5F4F41" }}
              >
                <Calendar className="w-4 h-4" style={{ color: "#5F4F41" }} />
                <span className="font-arabic text-xs sm:text-sm font-bold">احفظ الموعد</span>
              </button>
            </div>

            {/* د. العد التنازلي المفرغ مباشرة تحت زر احفظ الموعد */}
            <div className="w-full max-w-md text-center pt-2 space-y-2">
              <h3 className="font-arabic text-base sm:text-lg font-bold" style={{ color: "#5F4F41" }}>
                العدّ التنازلي
              </h3>
              <Countdown />
            </div>

          </div>
        </section>

        {/* باقي عناصر الصفحات (الخريطة والبرنامج وتأكيد الحضور)... */}
        <section className="px-4 py-10">
          <Reveal>
            <h2 className="text-center font-arabic text-2xl mb-6" style={{ color: "#5F4F41" }}>موقع الحفل</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="text-center mb-6">
              <MapPin className="mx-auto w-8 h-8 mb-2" style={{ color: "#5F4F41" }} />
              <div className="font-arabic text-xl font-bold" style={{ color: "#5F4F41" }}>قاعـة فرح</div>
              <div className="font-arabic text-sm opacity-80 mt-0.5" style={{ color: "#5F4F41" }}>جدة</div>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-white/20 shadow-lg">
              <iframe
                title="موقع الحفل"
                src="https://www.google.com/maps?q=The+Ritz-Carlton+Riyadh&output=embed"
                width="100%"
                height="300"
                loading="lazy"
                style={{ border: 0 }}
              />
            </div>
          </Reveal>
        </section>

        <section className="px-4 py-10">
          <Reveal><h2 className="text-center font-arabic text-2xl mb-6" style={{ color: "#5F4F41" }}>برنامج الحفل</h2></Reveal>
          <Timeline />
        </section>

        <section className="px-4 py-10">
          <Reveal><h2 className="text-center font-arabic text-2xl mb-8" style={{ color: "#5F4F41" }}>تفاصيل الحفل</h2></Reveal>
          <div className="relative max-w-xl mx-auto space-y-4">
            {[
              { icon: QrCode, text: "يرجى إبراز الباركود عند الدخول" },
              { icon: Baby, text: "يمنع اصطحاب الأطفال" },
              { icon: Camera, text: "يمنع دخول جوالات الكاميرا" },
            ].map((d, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="rounded-xl p-4 backdrop-blur-md bg-white/60 border border-white/40 flex items-center justify-between gap-4" style={{ color: "#5F4F41" }}>
                  <span className="font-arabic text-base font-semibold flex-1 text-right">{d.text}</span>
                  <d.icon className="w-6 h-6 shrink-0" style={{ color: "#5F4F41" }} />
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="px-4 py-10">
          <Reveal>
            <h2 className="text-center font-arabic text-2xl mb-2" style={{ color: "#5F4F41" }}>أكّد حضورك</h2>
            <p className="text-center font-arabic text-xs opacity-80 mb-8" style={{ color: "#5F4F41" }}>نتشرف بحضوركم — سيتم إصدار باركود خاص لكل ضيف</p>
          </Reveal>
          <RSVP />
        </section>

        <footer className="px-4 py-8 text-center border-t border-white/10">
          <Reveal>
            <div className="flex items-center justify-center gap-2" style={{ color: "#5F4F41" }}>
              <Heart className="w-4 h-4 fill-current" />
              <span className="font-arabic text-xs">
                صُنع بحب بواسطة <a href="https://www.tiktok.com/@shim2t?_r=1&_t=ZS-95w0d8f7vnk" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 font-bold" style={{ color: "#5F4F41" }}>متجر غيمة</a>
              </span>
            </div>
          </Reveal>
        </footer>
      </main>
    </div>
  );
};

export default Index;
