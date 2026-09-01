import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
type Guest = {
  id: string;
  name: string;
  phone: string;
  status: string | null;
  invite_code: string;
  replaced?: string | null;
  created_at?: string;
};
const Manage = () => {
  const { id } = useParams();
  const [maxGuests, setMaxGuests] = useState(0);
  const [invitationId, setInvitationId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  useEffect(() => {
    const loadInvitation = async () => {
      if (!id) {
        setError("رابط الإدارة غير صحيح");
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data: invitation, error: invitationError } =
        await supabase
          .from("invitations")
          .select("id, guest_limit, manage_code")
          .eq("manage_code", id)
          .maybeSingle();
      if (invitationError) {
        console.error(invitationError);
        setError("حدث خطأ أثناء تحميل الدعوة");
        setLoading(false);
        return;
      }
      if (!invitation) {
        setError("لم يتم العثور على الدعوة");
        setLoading(false);
        return;
      }
      setMaxGuests(invitation.guest_limit ?? 0);
      setInvitationId(invitation.id);
      const { data: guestsData, error: guestsError } =
        await supabase
          .from("guests")
          .select(
            "id, name, phone, status, invite_code, replaced, created_at"
          )
          .eq("invitation_id", invitation.id)
          .order("created_at", { ascending: true });
      if (guestsError) {
        console.error(guestsError);
        setError("حدث خطأ أثناء تحميل المدعوين");
        setLoading(false);
        return;
      }
      setGuests((guestsData as Guest[]) || []);
      setError("");
      setLoading(false);
    };
    loadInvitation();
  }, [id]);
  const generateInviteCode = () => {
    return crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 8)
      .toUpperCase();
  };
  const addGuest = async () => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    setError("");
    if (!cleanName) {
      setError("يرجى كتابة اسم المدعو");
      return;
    }
    if (!cleanPhone) {
      setError("يرجى كتابة رقم الجوال");
      return;
    }
    if (!/^05\d{8}$/.test(cleanPhone)) {
      setError("رقم الجوال يجب أن يتكون من 10 أرقام ويبدأ بـ 05");
      return;
    }
    if (!invitationId) {
      setError("لم يتم العثور على الدعوة");
      return;
    }
    if (guests.length >= maxGuests) {
      setError("تم الوصول للحد الأقصى من المدعوين");
      return;
    }
    const exists = guests.some(
      (guest) => guest.phone === cleanPhone
    );
    if (exists) {
      setError("رقم الجوال مضاف مسبقًا");
      return;
    }
    const inviteCode = generateInviteCode();
    const { data, error: insertError } = await supabase
      .from("guests")
      .insert({
        invitation_id: invitationId,
        name: cleanName,
        phone: cleanPhone,
        invite_code: inviteCode,
        status: "pending",
      })
      .select(
        "id, name, phone, status, invite_code, replaced, created_at"
      )
      .single();
    if (insertError || !data) {
      console.error(insertError);
      setError("حدث خطأ أثناء إضافة المدعو");
      return;
    }
    setGuests((prev) => [...prev, data as Guest]);
    setName("");
    setPhone("");
    setError("");
  };
  const confirmedCount = guests.filter(
    (guest) => guest.status === "attending"
  ).length;
  const declinedCount = guests.filter(
    (guest) => guest.status === "declined"
  ).length;
  const pendingCount = guests.filter(
    (guest) =>
      guest.status === "pending" ||
      !guest.status
  ).length;
  const replaceGuest = async (guest: Guest) => {
    if (!invitationId) return;
    const newName = window.prompt(
      "اكتب اسم المدعو الجديد"
    );
    if (!newName?.trim()) return;
    const newPhone = window.prompt(
      "اكتب رقم جوال المدعو الجديد\nمثال: 05xxxxxxxx"
    );
    if (!newPhone) return;
    const cleanNewName = newName.trim();
    const cleanNewPhone = newPhone.replace(/\D/g, "");
    if (!/^05\d{8}$/.test(cleanNewPhone)) {
      window.alert(
        "رقم الجوال يجب أن يتكون من 10 أرقام ويبدأ بـ 05"
      );
      return;
    }
    const exists = guests.some(
      (item) => item.phone === cleanNewPhone
    );
    if (exists) {
      window.alert("رقم الجوال مضاف مسبقًا");
      return;
    }
    if (guests.length >= maxGuests) {
      window.alert("تم الوصول للحد الأقصى من المدعوين");
      return;
    }
    const newInviteCode = generateInviteCode();
    const { data, error: insertError } = await supabase
      .from("guests")
      .insert({
        invitation_id: invitationId,
        name: cleanNewName,
        phone: cleanNewPhone,
        invite_code: newInviteCode,
        status: "pending",
      })
      .select(
        "id, name, phone, status, invite_code, replaced, created_at"
      )
      .single();
    if (insertError || !data) {
      console.error(insertError);
      window.alert("حدث خطأ أثناء استبدال المدعو");
      return;
    }
    const { error: updateError } = await supabase
      .from("guests")
      .update({
        replaced: data.id,
      })
      .eq("id", guest.id);
    if (updateError) {
      console.error(updateError);
      window.alert(
        "تمت الإضافة ولكن حدث خطأ في ربط الاستبدال"
      );
      return;
    }
    setGuests((prev) => [
      ...prev,
      data as Guest,
    ]);
  };
  if (loading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center font-arabic"
        style={{
          background: "#F7F4EF",
          color: "#26343B",
        }}
      >
        <div
          className="text-sm"
          style={{ color: "#748A99" }}
        >
          جاري تحميل الدعوة...
        </div>
      </div>
    );
  }
  if (error && !invitationId) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center px-5 font-arabic"
        style={{
          background: "#F7F4EF",
          color: "#26343B",
        }}
      >
        <div className="text-center">
          <div
            className="text-3xl font-light"
            style={{
              color: "#748A99",
              letterSpacing: "0",
            }}
          >
            غيمة
          </div>
          <div
            className="mx-auto mt-5 h-px w-12"
            style={{ background: "#748A99" }}
          />
          <div
            className="mt-7 text-lg font-medium"
            style={{ color: "#26343B" }}
          >
            تعذر فتح صفحة الإدارة
          </div>
          <div
            className="mt-2 text-sm"
            style={{ color: "#A8757D" }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      dir="rtl"
      className="min-h-screen font-arabic"
      style={{
        background: "#F7F4EF",
        color: "#26343B",
      }}
    >
      <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-7">
        {/* Header */}
        <header className="mb-12 text-center">
          <div
            className="text-4xl font-light"
            style={{
              color: "#748A99",
              letterSpacing: "0",
            }}
          >
            غيمة
          </div>
          <div
            className="mt-3 text-sm font-light"
            style={{ color: "#87949C" }}
          >
            مساحة دعوتك
          </div>
          <div
            className="mx-auto mt-5 h-px w-12"
            style={{ background: "#748A99" }}
          />
        </header>
        {/* Invitation Preview */}
        <section className="mb-12">
          <div
            className="mb-4 text-center text-sm"
            style={{ color: "#60747D" }}
          >
            دعوتك
          </div>
          <div
            className="overflow-hidden rounded-[28px]"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5E1DA",
              boxShadow:
                "0 18px 45px rgba(65,80,88,.10)",
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                minHeight: "180px",
                background:
                  "linear-gradient(145deg,#FFFFFF,#F3F5F5)",
              }}
            >
              <span
                className="text-sm"
                style={{ color: "#9BAEB5" }}
              >
                معاينة الدعوة
              </span>
            </div>
            <div className="p-5">
              <button
                onClick={() => {
                  window.open("/", "_blank");
                }}
                className="w-full rounded-2xl py-3 text-sm font-medium transition-all active:scale-[.99]"
                style={{
                  background: "#748A99",
                  color: "#FFFFFF",
                  boxShadow:
                    "0 8px 22px rgba(116,138,153,.22)",
                }}
              >
                معاينة الدعوة
              </button>
            </div>
          </div>
        </section>
        {/* Statistics */}
        <section className="mb-12">
          <div className="mb-5 text-center">
            <div
              className="text-sm"
              style={{ color: "#60747D" }}
            >
              ملخص الدعوة
            </div>
            <div
              className="mt-3 text-5xl font-light tracking-tight"
              style={{ color: "#26343B" }}
            >
              {guests.length}
              <span
                className="mx-1 text-2xl"
                style={{ color: "#B2C2C8" }}
              >
                /
              </span>
              <span
                className="text-2xl"
                style={{ color: "#81939B" }}
              >
                {maxGuests}
              </span>
            </div>
            <div
              className="mt-1 text-xs"
              style={{ color: "#94A5AB" }}
            >
              المدعوون
            </div>
          </div>
          <div
            className="h-[2px] w-full overflow-hidden rounded-full"
            style={{ background: "#E2DED7" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${
                  maxGuests
                    ? Math.min(
                        (guests.length / maxGuests) * 100,
                        100
                      )
                    : 0
                }%`,
                background: "#748A99",
              }}
            />
          </div>
          <div
            className="mt-7 grid grid-cols-3 text-center"
            style={{ color: "#6F8189" }}
          >
            <div>
              <div
                className="text-2xl font-light"
                style={{ color: "#26343B" }}
              >
                {confirmedCount}
              </div>
              <div className="mt-1 text-xs">
                تم التأكيد
              </div>
            </div>
            <div
              className="border-x"
              style={{ borderColor: "#DEDAD3" }}
            >
              <div
                className="text-2xl font-light"
                style={{ color: "#26343B" }}
              >
                {pendingCount}
              </div>
              <div className="mt-1 text-xs">
                بانتظار الرد
              </div>
            </div>
            <div>
              <div
                className="text-2xl font-light"
                style={{ color: "#26343B" }}
              >
                {declinedCount}
              </div>
              <div className="mt-1 text-xs">
                اعتذروا
              </div>
            </div>
          </div>
        </section>
        {/* Add Guest */}
        <section className="mb-12">
          <div className="mb-5 text-center">
            <div
              className="text-lg font-medium"
              style={{ color: "#26343B" }}
            >
              إضافة مدعو
            </div>
            <div
              className="mt-1 text-xs"
              style={{ color: "#94A5AB" }}
            >
              أضف الاسم ورقم الجوال لإرسال الدعوة
            </div>
          </div>
          <div
            className="rounded-[26px] p-5 sm:p-6"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5E1DA",
              boxShadow:
                "0 16px 40px rgba(65,80,88,.07)",
            }}
          >
            <div className="space-y-3">
              <input
                placeholder="اسم المدعو"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                className="w-full rounded-2xl px-4 py-3 outline-none text-sm"
                style={{
                  background: "#FCFBF9",
                  border: "1px solid #E2DED7",
                  color: "#26343B",
                }}
              />
              <input
                placeholder="05xxxxxxxx"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => {
                  setPhone(
                    e.target.value.replace(/\D/g, "")
                  );
                  setError("");
                }}
                className="w-full rounded-2xl px-4 py-3 outline-none text-sm"
                style={{
                  background: "#FCFBF9",
                  border: "1px solid #E2DED7",
                  color: "#26343B",
                }}
              />
              <button
                onClick={addGuest}
                className="w-full rounded-2xl py-3 text-sm font-medium transition-all active:scale-[.99]"
                style={{
                  background: "#748A99",
                  color: "#FFFFFF",
                  boxShadow:
                    "0 8px 22px rgba(116,138,153,.22)",
                }}
              >
                إضافة المدعو
              </button>
              {error && (
                <p
                  className="pt-1 text-center text-xs"
                  style={{ color: "#A8757D" }}
                >
                  {error}
                </p>
              )}
            </div>
          </div>
        </section>
        {/* Guests */}
        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div
                className="text-lg font-medium"
                style={{ color: "#26343B" }}
              >
                المدعوون
              </div>
              <div
                className="mt-1 text-xs"
                style={{ color: "#94A5AB" }}
              >
                قائمة المدعوين وحالة الرد
              </div>
            </div>
            <div
              className="text-xs"
              style={{ color: "#81939B" }}
            >
              {guests.length} / {maxGuests}
            </div>
          </div>
          <div
            className="overflow-hidden rounded-[26px]"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5E1DA",
              boxShadow:
                "0 16px 40px rgba(65,80,88,.06)",
            }}
          >
            {guests.length === 0 ? (
              <div
                className="py-12 text-center text-sm"
                style={{ color: "#9BAEB5" }}
              >
                لم تتم إضافة أي مدعو بعد
              </div>
            ) : (
              guests.map((guest, index) => {
                const status =
                  guest.status === "attending"
                    ? "تم التأكيد"
                    : guest.status === "declined"
                    ? "اعتذر"
                    : "بانتظار الرد";
                const dotColor =
                  guest.status === "attending"
                    ? "#748A99"
                    : guest.status === "declined"
                    ? "#B99AA3"
                    : "#B9C4C8";
                return (
                  <div
                    key={guest.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                    style={{
                      borderBottom:
                        index !== guests.length - 1
                          ? "1px solid #EEEAE4"
                          : "none",
                    }}
                  >
                    <div className="min-w-0">
                      <div
                        className="truncate text-sm font-medium"
                        style={{ color: "#26343B" }}
                      >
                        {guest.name}
                      </div>
                      <div
                        className="mt-1 text-xs"
                        style={{ color: "#91A1A7" }}
                      >
                        {guest.phone}
                      </div>
                      <div
                        className="mt-1 text-[10px]"
                        style={{ color: "#B0BDC2" }}
                      >
                        كود الدعوة: {guest.invite_code}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <div
                        className="flex items-center gap-1.5 text-xs"
                        style={{ color: "#7E9097" }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            background: dotColor,
                          }}
                        />
                        {status}
                      </div>
                      {guest.status === "declined" && (
                        <button
                          onClick={() =>
                            replaceGuest(guest)
                          }
                          className="text-xs font-medium transition-opacity hover:opacity-70"
                          style={{
                            color: "#748A99",
                          }}
                        >
                          استبدال
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
        <footer
          className="mt-14 pb-4 text-center text-xs"
          style={{ color: "#A2AAA9" }}
        >
          غيمة · دعوات تليق بتفاصيلك
        </footer>
      </div>
    </div>
  );
};
export default Manage;
