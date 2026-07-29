import { useState } from "react";
import { MapPin, Heart, QrCode, Baby, Camera } from "lucide-react";
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
    <div
      className="relative min-h-screen overflow-x-hidden bg-black text-white"
      style={{
        background: "#0a0a0a",
      }}
    >
      <SprayParticles />
      <MusicToggle active={opened} />

      {/* 1. الظرف */}
      <Envelope onOpen={() => setOpened(true)} />

      {/* 2. محتوى الموقع */}
      <main className="relative z-10">
        
        {/* الصورة الأولى */}
        <section className="w-full">
          <img
            src={invitationImg}
            alt="صورة الدعوة الأولى"
            className="w-full h-auto block"
          />
        </section>

        {/* الصورة الثانية (sos.png) */}
        <section className="relative w-full">
          <img
            src={sosImg}
            alt="الصورة الثانية"
            className="w-full h-auto block"
          />

          {/* التعديل: المربع الزجاجي الأبيض والخط بلون #5F4F41 */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div
              className="w-[92%] max-w-md p-6 sm:p-8 rounded-3xl text-center backdrop-blur-md border border-white/40 shadow-2xl space-y-3"
              style={{
                background: "rgba(255, 255, 255, 0.65)", // مربع زجاجي أبيض راقي
                color: "#5F4F41", // تطبيق لون الخط المطلوبة على كافة النصوص الداخلية
              }}
            >
              {/* السطر الأول - حجم كبير */}
              <p
                className="font-arabic text-lg sm:text-xl font-bold leading-snug"
                style={{ color: "#5F4F41" }}
              >
                بارك الله لهما وبارك عليهما وجمع بينهما في خير
              </p>

              {/* السطر الثاني */}
              <p className="font-arabic text-sm" style={{ color: "#5F4F41" }}>
                بمشاعر مليئة بالفرح والسعادة
              </p>

              {/* السطر الثالث */}
              <p className="font-arabic text-sm" style={{ color: "#5F4F41" }}>
                ولأن الفرحة لا تكتمل الابرويتكم
              </p>

              {/* السطر الرابع */}
              <p className="font-arabic text-sm opacity-90" style={{ color: "#5F4F41" }}>
                تتشرف
              </p>

              {/* السطر الخامس - بنفس حجم السطر الأول */}
              <p
                className="font-arabic text-lg sm:text-xl font-bold py-1"
                style={{ color: "#5F4F41" }}
              >
                أم محمد السلماني & أم طلال السعيد
              </p>

              {/* السطر السادس */}
              <p className="font-arabic text-sm" style={{ color: "#5F4F41" }}>
                بدعوتكن لحضور حفل عقد قران نجليهما
              </p>

              {/* السطر السابع - بنفس حجم السطر الأول واكبر */}
              <p
                className="font-arabic text-xl sm:text-2xl font-extrabold pt-1"
                style={{ color: "#5F4F41" }}
              >
                محمد & عهود
              </p>
            </div>
          </div>
        </section>

        {/* التعديل الثاني: الموقع والتقويم باللون #5F4F41 */}
        <section className="px-4 py-10 text-center space-y-6">
          
          {/* تفاصيل الموقع باللون المطلوب */}
          <div className="space-y-1">
            <h3
              className="font-arabic text-lg font-bold"
              style={{ color: "#5F4F41" }}
            >
              الموقع
            </h3>
            <p
              className="font-arabic text-sm font-medium"
              style={{ color: "#5F4F41" }}
            >
              قاعـة فرح
            </p>
            <p
              className="font-arabic text-sm opacity-80"
              style={{ color: "#5F4F41" }}
            >
              جدة
            </p>
          </div>

          {/* مربع التقويم الفاخر بتدرج أبيض ناعم والخط #5F4F41 */}
          <Reveal>
            <div
              className="mx-auto max-w-xs rounded-2xl p-5 text-center backdrop-blur-md border border-white/30 shadow-xl"
              style={{
                background: "rgba(255, 255, 255, 0.75)",
                color: "#5F4F41",
              }}
            >
              {/* الشريط العلوي للتقويم */}
              <div
                className="flex justify-between items-center font-display text-xs mb-3 px-3 py-1.5 rounded-lg text-white font-bold"
                dir="ltr"
                style={{
                  background: "#5F4F41",
                }}
              >
                <span>Tuesday</span>
                <span>December</span>
                <span>2026</span>
              </div>

              {/* أيام الأسبوع */}
              <div className="grid grid-cols-7 gap-1 text-[10px] font-display mb-2 opacity-75" dir="ltr" style={{ color: "#5F4F41" }}>
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <div key={i} className="py-0.5">{d}</div>
                ))}
              </div>

              {/* شبكة أيام شهر ديسمبر 2026 */}
              <div className="grid grid-cols-7 gap-1 text-xs font-display" dir="ltr" style={{ color: "#5F4F41" }}>
                {[null, null, 1, 2, 3, 4, 5,
                  6, 7, 8, 9, 10, 11, 12,
                  13, 14, 15, 16, 17, 18, 19,
                  20, 21, 22, 23, 24, 25, 26,
                  27, 28, 29, 30, 31, null, null].map((d, i) => (
                  <div
                    key={i}
                    className={`aspect-square flex items-center justify-center rounded-md font-semibold ${
                      d === 22
                        ? "text-white font-extrabold shadow-md scale-110"
                        : ""
                    }`}
                    style={
                      d === 22
                        ? { backgroundColor: "#5F4F41" }
                        : {}
                    }
                  >
                    {d ?? ""}
                  </div>
                ))}
              </div>

              {/* التاريخ */}
              <div
                className="font-arabic text-sm mt-4 font-bold"
                style={{ color: "#5F4F41" }}
              >
                الثلاثاء 22 ديسمبر 2026
              </div>
            </div>
          </Reveal>
        </section>

        {/* العداد التنازلي */}
        <section className="px-4 py-12">
          <Reveal>
            <h2 className="text-center font-arabic text-2xl mb-8" style={{ color: "#5F4F41" }}>العدّ التنازلي</h2>
          </Reveal>
          <Reveal delay={150}>
            <Countdown />
          </Reveal>
        </section>

        {/* الموقع على الخريطة */}
        <section className="px-4 py-12">
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
                title="موقع الحفل - قاعة فرح جدة"
                src="https://www.google.com/maps?q=The+Ritz-Carlton+Riyadh&output=embed"
                width="100%"
                height="300"
                loading="lazy"
                style={{ border: 0 }}
              />
            </div>
          </Reveal>
        </section>

        {/* برنامج الحفل */}
        <section className="px-4 py-12">
          <Reveal>
            <h2 className="text-center font-arabic text-2xl mb-6" style={{ color: "#5F4F41" }}>برنامج الحفل</h2>
          </Reveal>
          <Timeline />
        </section>

        {/* تفاصيل الحفل */}
        <section className="px-4 py-12">
          <Reveal>
            <h2 className="text-center font-arabic text-2xl mb-8" style={{ color: "#5F4F41" }}>تفاصيل الحفل</h2>
          </Reveal>
          <div className="relative max-w-xl mx-auto">
            <div className="space-y-4">
              {[
                { icon: QrCode, text: "يرجى إبراز الباركود عند الدخول" },
                { icon: Baby, text: "يمنع اصطحاب الأطفال" },
                { icon: Camera, text: "يمنع دخول جوالات الكاميرا" },
              ].map((d, i) => (
                <Reveal key={i} delay={i * 120}>
                  <div
                    className="rounded-xl p-4 backdrop-blur-md bg-white/60 border border-white/40 flex items-center justify-between gap-4"
                    style={{ color: "#5F4F41" }}
                  >
                    <span className="font-arabic text-base font-semibold flex-1 text-right">
                      {d.text}
                    </span>
                    <d.icon className="w-6 h-6 shrink-0" style={{ color: "#5F4F41" }} />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* تأكيد الحضور */}
        <section className="px-4 py-12">
          <Reveal>
            <h2 className="text-center font-arabic text-2xl mb-2" style={{ color: "#5F4F41" }}>أكّد حضورك</h2>
            <p className="text-center font-arabic text-xs opacity-80 mb-8" style={{ color: "#5F4F41" }}>
              نتشرف بحضوركم — سيتم إصدار باركود خاص لكل ضيف
            </p>
          </Reveal>
          <RSVP />
        </section>

        {/* الفوتر */}
        <footer className="px-4 py-8 text-center border-t border-white/10">
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
