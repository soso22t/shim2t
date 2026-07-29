import { useState, useEffect, useRef } from "react";

// أيقونات مبسطة ومتناسقة مع التصميم
const BabyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H9a6 6 0 016-6h-6a6 6 0 016 6z" />
  </svg>
);

const CameraOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.5 5.5h3a2 2 0 012 2v1m1.5 5.5A2 2 0 0119 16H5a2 2 0 01-2-2V9.5a2 2 0 012-2h1.5l1.2-1.8A2 2 0 019.3 5h1.4" />
  </svg>
);

const QrCodeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4M6 6h.01M18 6h.01M6 18h.01M18 18h.01" />
  </svg>
);

interface DetailItem {
  title: string;
  icon: React.ReactNode;
}

const details: DetailItem[] = [
  { title: "جنة الأطفال منازلهم", icon: <BabyIcon /> },
  { title: "يمنع التصوير", icon: <CameraOffIcon /> },
  { title: "الدخول فقط بالباركود", icon: <QrCodeIcon /> },
];

const EventDetails = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // حساب التمرير لتوهج الدوائر والخط
      const start = windowHeight * 0.85;
      const end = windowHeight * 0.25;
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
      className="w-[92%] max-w-md p-6 sm:p-8 rounded-3xl text-center backdrop-blur-md border border-white/40 shadow-xl relative overflow-hidden my-4 dir-rtl"
      style={{
        background: "rgba(255, 255, 255, 0.25)",
        color: "#5F4F41",
      }}
    >
      {/* عنوان تفاصيل الحفل */}
      <h3 className="font-arabic text-xl sm:text-2xl font-bold mb-8" style={{ color: "#5F4F41" }}>
        تفاصيل الحفل
      </h3>

      {/* منطقة المستطيلات والخط على اليسار */}
      <div className="relative pl-7 pr-1 py-2">
        {/* الخط الخلفي الباهت على اليسار */}
        <div
          className="absolute left-3 top-5 bottom-5 w-[2px] opacity-30"
          style={{ backgroundColor: "#5F4F41" }}
        />

        {/* الخط المضيء البني المتناغم مع التمرير */}
        <div
          className="absolute left-3 top-5 w-[2.5px] rounded-full transition-all duration-150 ease-out"
          style={{
            height: `${scrollProgress * 88}%`,
            backgroundColor: "#5F4F41",
            boxShadow: "0 0 10px rgba(95, 79, 65, 0.8)",
          }}
        />

        {/* المستطيلات الثلاثة */}
        <div className="space-y-5 relative z-10">
          {details.map((item, index) => {
            const threshold = index / (details.length - 1 || 1);
            const isActive = scrollProgress >= threshold - 0.1;

            return (
              <div key={index} className="relative flex items-center">
                {/* الدائرة المتوهجة على يسار المستطيل (على الخط) */}
                <div
                  className="absolute -left-[23px] w-4 h-4 rounded-full border-2 transition-all duration-500 ease-out z-20"
                  style={{
                    borderColor: "#5F4F41",
                    backgroundColor: isActive ? "#5F4F41" : "rgba(255, 255, 255, 0.4)",
                    transform: isActive ? "scale(1.3)" : "scale(1)",
                    boxShadow: isActive
                      ? "0 0 12px 3px rgba(95, 79, 65, 0.9), 0 0 22px 6px rgba(95, 79, 65, 0.5)"
                      : "none",
                  }}
                />

                {/* المستطيل الشفاف بنفس نظام ونمط الصورة */}
                <div
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all duration-300 shadow-sm"
                  style={{
                    backgroundColor: isActive
                      ? "rgba(255, 255, 255, 0.4)"
                      : "rgba(255, 255, 255, 0.2)",
                    borderColor: isActive
                      ? "rgba(255, 255, 255, 0.6)"
                      : "rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {/* النص على اليمين */}
                  <span
                    className="font-arabic text-sm sm:text-base font-bold transition-opacity duration-300"
                    style={{
                      color: "#5F4F41",
                      opacity: isActive ? 1 : 0.6,
                    }}
                  >
                    {item.title}
                  </span>

                  {/* الأيقونة على اليسار داخل دائرة بسيطة مثل الصورة */}
                  <div
                    className="p-1.5 rounded-full flex justify-center items-center opacity-80"
                    style={{
                      color: "#5F4F41",
                      backgroundColor: "rgba(95, 79, 65, 0.1)",
                    }}
                  >
                    {item.icon}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
