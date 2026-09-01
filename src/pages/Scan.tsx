import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import scanSuccess from "@/assets/photo-output.jpeg";

type State =
  | { kind: "loading" }
  | { kind: "ok"; name: string }
  | { kind: "already"; name: string }
  | { kind: "not_found" }
  | { kind: "error" };

const Scan = () => {
  const { token } = useParams<{ token: string }>();
  const cleanToken = decodeURIComponent(token || "");

  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!cleanToken) {
        if (isMounted) setState({ kind: "not_found" });
        return;
      }

      if (isMounted) setState({ kind: "loading" });

      // البحث عن الباركود
      const { data, error } = await supabase
        .from("guests")
        .select("name, scanned")
        .eq("qr_token", cleanToken)
        .maybeSingle();

      console.log("TOKEN:", cleanToken);
      console.log("DATA:", data);
      console.log("ERROR:", error);

      if (!isMounted) return;

      if (error || !data) {
        setState({ kind: "not_found" });
        return;
      }

      // إذا كان الباركود مستخدمًا مسبقًا
      if (data.scanned) {
        setState({ kind: "already", name: data.name });
        return;
      }

      // محاولة تسجيل المسح مرة واحدة فقط
      const { data: updatedData, error: updateError } = await supabase
        .from("guests")
        .update({ scanned: true })
        .eq("qr_token", cleanToken)
        .eq("scanned", false)
        .select("name")
        .maybeSingle();

      if (updateError) {
        console.error("UPDATE ERROR:", updateError);

        if (isMounted) {
          setState({ kind: "error" });
        }

        return;
      }

      // إذا لم يتم تحديث أي صف، فهذا يعني أن الباركود
      // تم استخدامه في نفس اللحظة من جهاز آخر
      if (!updatedData) {
        if (isMounted) {
          const { data: latestData } = await supabase
            .from("guests")
            .select("name, scanned")
            .eq("qr_token", cleanToken)
            .maybeSingle();

          if (latestData?.scanned) {
            setState({
              kind: "already",
              name: latestData.name,
            });
          } else {
            setState({ kind: "not_found" });
          }
        }

        return;
      }

      if (isMounted) {
        setState({
          kind: "ok",
          name: updatedData.name,
        });
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [cleanToken]);

  if (state.kind === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <p>جارٍ التحقق...</p>
      </div>
    );
  }

  if (state.kind === "ok") {
    return (
      <div className="min-h-screen w-full">
        <img src={scanSuccess} className="w-full block" />
      </div>
    );
  }

  if (state.kind === "already") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5efe6] px-6">
        <div className="bg-white border-2 border-red-500 rounded-2xl p-8 text-center shadow-lg max-w-md w-full">
          <div className="text-red-500 text-5xl mb-4">✕</div>

          <p className="text-red-600 text-2xl font-bold mb-2">
            تم مسح الباركود مسبقاً
          </p>

          {state.name && (
            <p className="text-gray-700 text-base">
              الاسم: {state.name}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (state.kind === "not_found") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5efe6]">
        <div className="bg-white border-2 border-red-500 rounded-2xl p-8 text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⛔</div>

          <p className="text-red-600 text-2xl font-bold mb-2">
            الباركود غير صالح
          </p>
        </div>
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5efe6]">
        <div className="bg-white border-2 border-red-500 rounded-2xl p-8 text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>

          <p className="text-red-600 text-2xl font-bold mb-2">
            حدث خطأ أثناء التحقق
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default Scan;
