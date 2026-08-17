import { useState, useEffect, useRef } from "react";

interface EventItem {
  time: string;
  title: string;
}

const events: EventItem[] = [
  { time: "9:30 PM", title: "الاستقبال" },
  { time: "12:00 AM", title: "الـزفــة" },
 // { time: "10:30 PM", title: "العشاء" },
];

const EventTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // حساب مدى ظهور المكون أثناء التمرير
      const start = windowHeight * 0.8;
      const end = windowHeight * 0.2;
      const current = rect.top;

      let progress = (start - current) / (start - end);
      progress = Math.max(0, Math.min(1, progress));

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-[92%] max-w-md p-6 sm:p-8 rounded-3xl text-center backdrop-blur-md border border-white/40 shadow-xl relative overflow-hidden my-4"
      style={{
        background: "rgba(255, 255, 255, 0.25)",
        color: "#641414",
      }}
    >
      {/* عنوان برنامج المناسبة */}
      <h3 className="font-arabic text-xl sm:text-2xl font-bold mb-8" style={{ color: "#B08A3C" }}>
        برنامج المناسبة
      </h3>

      {/* منطقة الخط والدوائر */}
      <div className="relative max-w-xs mx-auto py-2">
        {/* الخط الخلفي الباهت */}
        <div
          className="absolute left-1/2 top-3 bottom-3 -translate-x-1/2 w-[2px] opacity-30"
          style={{ backgroundColor: "#641414" }}
        />

        {/* الخط المضيء الذهبي الذي ينزل مع السكرول */}
        <div
          className="absolute left-1/2 top-3 -translate-x-1/2 w-[2.5px] rounded-full transition-all duration-150 ease-out"
          style={{
            height: `${scrollProgress * 88}%`,
            backgroundColor: "#B08A3C",
            boxShadow: "0 0 10px rgba(176, 138, 60, 0.8)",
          }}
        />

        {/* الفقرات والدوائر */}
        <div className="space-y-12 relative z-10">
          {events.map((event, index) => {
            // حساب متى تتوهج كل دائرة بناءً على نزول الخط
            const threshold = index / (events.length - 1 || 1);
            const isActive = scrollProgress >= threshold - 0.1;

            return (
              <div key={index} className="grid grid-cols-5 items-center dir-rtl">
                {/* اسم المناسبة */}
                <div
                  className="col-span-2 text-left pl-2 sm:pl-3 font-arabic text-sm sm:text-base font-bold transition-opacity duration-300"
                  style={{ color: "#641414", opacity: isActive ? 1 : 0.5 }}
                >
                  {event.title}
                </div>

                {/* الدائرة المتوهجة باللون الذهبي الفاخر */}
                <div className="col-span-1 flex justify-center items-center">
                  <div
                    className="w-4 h-4 rounded-full border-2 transition-all duration-500 ease-out"
                    style={{
                      borderColor: isActive ? "#B08A3C" : "#641414",
                      backgroundColor: isActive ? "#B08A3C" : "rgba(255, 255, 255, 0.4)",
                      transform: isActive ? "scale(1.3)" : "scale(1)",
                      /* توهج ذهبي قوي وواضح */
                      boxShadow: isActive
                        ? "0 0 12px 3px rgba(176, 138, 60, 0.9), 0 0 22px 6px rgba(176, 138, 60, 0.5)"
                        : "none",
                    }}
                  />
                </div>

                {/* الوقت */}
                <div
                  className="col-span-2 text-right pr-2 sm:pr-3 font-display text-xs sm:text-sm font-semibold tracking-wider dir-ltr transition-opacity duration-300"
                  style={{ color: "#641414", opacity: isActive ? 1 : 0.5 }}
                >
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
