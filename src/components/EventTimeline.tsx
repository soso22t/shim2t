import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface EventItem {
  time: string;
  title: string;
}

const events: EventItem[] = [
  { time: "8:00 PM", title: "الاستقبال" },
  { time: "11:00 PM", title: "الزفة" },
  { time: "1:00 AM", title: "العشاء" },
];

const EventTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // تتبع التمرير (Scroll) الخاص بالمكون
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 50%"],
  });

  // حساب ارتفاع الخط الذهبي المكتمل بناءً على التمرير
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={containerRef}
      className="w-[92%] max-w-md p-6 sm:p-8 rounded-3xl text-center backdrop-blur-md border border-white/40 shadow-xl relative overflow-hidden"
      style={{
        background: "rgba(255, 255, 255, 0.25)",
        color: "#5F4F41",
      }}
    >
      {/* عنوان برنامج الحفل */}
      <h3 className="font-arabic text-xl sm:text-2xl font-bold mb-8" style={{ color: "#5F4F41" }}>
        برنامج المناسبة
      </h3>

      {/* منطقة الخط والفقرات */}
      <div className="relative max-w-xs mx-auto py-2">
        {/* الخط الخلفي الباهت */}
        <div
          className="absolute left-1/2 top-2 bottom-2 -translate-x-1/2 w-[2px] opacity-30"
          style={{ backgroundColor: "#5F4F41" }}
        />

        {/* الخط الملون المكتمل مع التمرير */}
        <motion.div
          className="absolute left-1/2 top-2 -translate-x-1/2 w-[2px] rounded-full shadow-[0_0_8px_#5F4F41]"
          style={{
            height: lineHeight,
            backgroundColor: "#5F4F41",
          }}
        />

        {/* عناصر الأحداث (الاستقبال، الزفة، العشاء) */}
        <div className="space-y-12 relative z-10">
          {events.map((event, index) => {
            // حساب متى تبدأ كل نقطة بالتوهج بناءً على ترتيبها
            const thresholdStart = index / (events.length - 1 || 1) - 0.15;
            const thresholdEnd = index / (events.length - 1 || 1) + 0.15;

            const dotOpacity = useTransform(
              scrollYProgress,
              [Math.max(0, thresholdStart), Math.min(1, thresholdEnd)],
              [0.3, 1]
            );

            const dotScale = useTransform(
              scrollYProgress,
              [Math.max(0, thresholdStart), Math.min(1, thresholdEnd)],
              [0.9, 1.3]
            );

            const glow = useTransform(
              scrollYProgress,
              [Math.max(0, thresholdStart), Math.min(1, thresholdEnd)],
              [
                "0px 0px 0px rgba(95, 79, 65, 0)",
                "0px 0px 15px 4px rgba(255, 255, 255, 0.9), 0px 0px 25px 6px rgba(95, 79, 65, 0.6)",
              ]
            );

            return (
              <div key={index} className="grid grid-cols-5 items-center dir-rtl">
                {/* اسم المناسبة (على اليمين) */}
                <div className="col-span-2 text-left pl-3 font-arabic text-sm sm:text-base font-bold" style={{ color: "#5F4F41" }}>
                  {event.title}
                </div>

                {/* الدائرة المضيئة على الخط في المنتصف */}
                <div className="col-span-1 flex justify-center items-center">
                  <motion.div
                    className="w-4 h-4 rounded-full border-2 bg-white/40 backdrop-blur-sm transition-colors"
                    style={{
                      borderColor: "#5F4F41",
                      opacity: dotOpacity,
                      scale: dotScale,
                      boxShadow: glow,
                    }}
                  />
                </div>

                {/* الوقت (على اليسار) */}
                <div className="col-span-2 text-right pr-3 font-display text-xs sm:text-sm font-semibold tracking-wider dir-ltr" style={{ color: "#5F4F41" }}>
                  {event.time}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventTimeline;
