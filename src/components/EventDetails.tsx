import { useRef, useState, useEffect } from "react";
import { Baby, CameraOff, QrCode } from "lucide-react";

interface DetailItem {
  title: string;
  icon: React.ReactNode;
}

const details: DetailItem[] = [
  { title: "جنة الأطفال منازلهم", icon: <Baby className="w-5 h-5 opacity-80" style={{ color: "#5F4F41" }} /> },
  { title: "يمنع التصوير", icon: <CameraOff className="w-5 h-5 opacity-80" style={{ color: "#5F4F41" }} /> },
  {/* { title: "الدخول فقط بالباركود", icon: <QrCode className="w-5 h-5 opacity-80" style={{ color: "#5F4F41" }} /> },*/{
];

const EventDetails = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // حساب التمرير لتفعيل إضاءة الدوائر والخط
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
      className="w-[92%] max-w-md flex flex-col items-center my-4 relative dir-rtl"
    >
      {/* عنوان تفاصيل الحفل بدون خلفية زجاجية */}
      <h3
        className="font-arabic text-xl sm:text-2xl font-bold text-center mb-6"
        style={{ color: "#5F4F41" }}
      >
        تفاصيل الحفل
      </h3>

      {/* منطقة المستطيلات مع الخط والدوائر الخارجة على اليسار */}
      <div className="w-full relative pl-8 pr-1">
        
        {/* 1. الخط العمودي الخلفي الباهت (خارج المستطيلات على اليسار) */}
        <div
          className="absolute left-2.5 top-6 bottom-6 w-[2px] opacity-30"
          style={{ backgroundColor: "#5F4F41" }}
        />

        {/* 2. الخط المضيء المتحرك مع السكرول */}
        <div
          className="absolute left-2.5 top-6 w-[2px] rounded-full transition-all duration-150 ease-out"
          style={{
            height: `${scrollProgress * 82}%`,
            backgroundColor: "#5F4F41",
            boxShadow: "0 0 10px rgba(95, 79, 65, 0.8)",
          }}
        />

        {/* 3. قائمة المستطيلات والدوائر المضيئة */}
        <div className="space-y-4">
          {details.map((item, index) => {
            const threshold = index / (details.length - 1 || 1);
            const isActive = scrollProgress >= threshold - 0.1;

            return (
              <div key={index} className="relative flex items-center">
                
                {/* الدائرة المضيئة التفاعلية (على الخط خارج المستطيل من اليسار) */}
                <div
                  className="absolute -left-[27px] w-4 h-4 rounded-full border-2 transition-all duration-500 ease-out z-20"
                  style={{
                    borderColor: "#5F4F41",
                    backgroundColor: isActive ? "#5F4F41" : "rgba(255, 255, 255, 0.5)",
                    transform: isActive ? "scale(1.25)" : "scale(1)",
                    boxShadow: isActive
                      ? "0 0 12px 3px rgba(95, 79, 65, 0.9), 0 0 20px 5px rgba(255, 255, 255, 0.8)"
                      : "none",
                  }}
                />

                {/* المستطيل الزجاجي لكل عنصر */}
                <div
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all duration-300 shadow-md backdrop-blur-md"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    borderColor: "rgba(255, 255, 255, 0.4)",
                  }}
                >
                  {/* النص على اليمين */}
                  <span
                    className="font-arabic text-sm sm:text-base font-bold"
                    style={{ color: "#5F4F41" }}
                  >
                    {item.title}
                  </span>

                  {/* الأيقونة على اليسار داخل المستطيل */}
                  <div className="p-1.5 rounded-full flex justify-center items-center">
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
