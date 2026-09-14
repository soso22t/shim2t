import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
      const { data, error } = await supabase
        .from("shim2t")
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
      if (data.scanned) {
        setState({ kind: "already", name: data.name });
        return;
      }
      const { data: updatedData, error: updateError } = await supabase
        .from("shim2t")
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
      if (!updatedData) {
        if (isMounted) {
          const { data: latestData } = await supabase
            .from("shim2t")
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#25000C", color: "white" }}
      >
        <p>جارٍ التحقق...</p>
      </div>
    );
  }
  if (state.kind === "ok") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: "#25000C", color: "white" }}
      >
        <div className="text-8xl mb-6">✅</div>
        <p className="text-3xl font-bold">
          تم مسح الباركود بنجاح
        </p>
        {state.name && (
          <p className="text-xl mt-4">
            {state.name}
          </p>
        )}
      </div>
    );
  }
  if (state.kind === "already") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: "#25000C", color: "white" }}
      >
        <div className="text-8xl mb-6">❌</div>
        <p className="text-3xl font-bold">
          الباركود غير صالح
        </p>
        {state.name && (
          <p className="text-xl mt-4">
            {state.name}
          </p>
        )}
      </div>
    );
  }
  if (state.kind === "not_found") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: "#25000C", color: "white" }}
      >
        <div className="text-8xl mb-6">❌</div>
        <p className="text-3xl font-bold">
          الباركود غير صالح
        </p>
      </div>
    );
  }
  if (state.kind === "error") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: "#25000C", color: "white" }}
      >
        <div className="text-8xl mb-6">❌</div>
        <p className="text-3xl font-bold">
          الباركود غير صالح
        </p>
      </div>
    );
  }
  return null;
};
export default Scan;
