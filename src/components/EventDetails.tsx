import { QrCode, CameraOff } from "lucide-react";

const EventDetails = () => {
  return (
    <div className="w-full flex flex-col items-center space-y-4 my-2">
      {/* عنوان تفاصيل الحفل مباشرة على خلفية الصورة */}
      <h3
        className="font-arabic text-xl sm:text-2xl font-bold text-center"
        style={{ color: "#5F4F41" }}
      >
        تفاصيل الحفل
      </h3>

      {/* المستطيل الأول: الدخول عبر رمز QR */}
      <div
        className="w-[92%] max-w-md p-4 rounded-2xl flex items-center justify-between backdrop-blur-md border border-white/40 shadow-md dir-rtl"
        style={{
          background: "rgba(255, 255, 255, 0.25)",
          color: "#5F4F41",
        }}
      >
        <div className="flex items-center gap-3">
          {/* دائرة الخيار البنية */}
          <div
            className="w-3.5 h-3.5 rounded-full border-2"
            style={{ borderColor: "#5F4F41", backgroundColor: "#5F4F41" }}
          />
          <span className="font-arabic text-sm sm:text-base font-bold" style={{ color: "#5F4F41" }}>
            الدخول عبر رمز QR فقط
          </span>
        </div>
        <QrCode className="w-5 h-5 opacity-80" style={{ color: "#5F4F41" }} />
      </div>

      {/* المستطيل الثاني: يمنع التصوير */}
      <div
        className="w-[92%] max-w-md p-4 rounded-2xl flex items-center justify-between backdrop-blur-md border border-white/40 shadow-md dir-rtl"
        style={{
          background: "rgba(255, 255, 255, 0.25)",
          color: "#5F4F41",
        }}
      >
        <div className="flex items-center gap-3">
          {/* دائرة الخيار البنية */}
          <div
            className="w-3.5 h-3.5 rounded-full border-2"
            style={{ borderColor: "#5F4F41", backgroundColor: "#5F4F41" }}
          />
          <span className="font-arabic text-sm sm:text-base font-bold" style={{ color: "#5F4F41" }}>
            يُمنع التصوير
          </span>
        </div>
        <CameraOff className="w-5 h-5 opacity-80" style={{ color: "#5F4F41" }} />
      </div>
    </div>
  );
};

export default EventDetails;
