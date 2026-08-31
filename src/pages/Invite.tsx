import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Index from "./Index";

const Invite = () => {
  const { code } = useParams();

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const loadGuest = async () => {
      if (!code) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("guests")
        .select("id")
        .eq("invite_code", code)
        .single();

      if (!error && data) {
        setValid(true);
      }

      setLoading(false);
    };

    loadGuest();
  }, [code]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#24000D" }}
      />
    );
  }

  if (!valid) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center px-6 text-center"
        style={{
          backgroundColor: "#24000D",
          color: "#FFFFFF",
        }}
      >
        <div>
          <p className="font-arabic text-xl">
            رابط الدعوة غير صالح
          </p>
        </div>
      </div>
    );
  }

  return <Index />;
};

export default Invite;
