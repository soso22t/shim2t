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
        className="min-h-screen flex items-center justify-center font-arabic relative overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, #E8F8FD 0%, #F8FCFE 42%, #FFFFFF 100%)",
          color: "#26343B",
        }}
      >
        <div
          className="absolute -top-32 -right-24 h-72 w-72 rounded-full blur-3xl"
          style={{
            background: "rgba(169,220,235,.25)",
          }}
        />
        <div
          className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full blur-3xl"
          style={{
            background: "rgba(115,195,220,.14)",
          }}
        />
        <div className="relative text-center">
          <div
            className="text-4xl font-light tracking-[0.16em]"
            style={{ color: "#68B7D0" }}
          >
            غيمة
          </div>
          <div
            className="mt-4 text-sm"
            style={{ color: "#8BA4AE" }}
          >
            جاري تحميل دعوتك...
          </div>
        </div>
      </div>
    );
  }
  if (error && !invitationId) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center px-5 font-arabic relative overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, #E8F8FD 0%, #F8FCFE 42%, #FFFFFF 100%)",
          color: "#26343B",
        }}
      >
        <div
          className="absolute -top-32 -right-24 h-72 w-72 rounded-full blur-3xl"
          style={{
            background: "rgba(169,220,235,.22)",
          }}
        />
        <div className="relative text-center">
          <div
            className="text-4xl font-light tracking-[0.16em]"
            style={{ color: "#68B7D0" }}
          >
            غيمة
          </div>
          <div
            className="mx-auto mt-7 h-px w-14"
            style={{
              background:
                "linear-gradient(to left, transparent, #A9DCEB, transparent)",
            }}
          />
          <div
            className="mt-7 text-lg font-medium"
            style={{ color: "#26343B" }}
          >
            تعذر فتح صفحة الإدارة
          </div>
          <div
            className="mt-2 text-sm"
            style={{ color: "#C77F8A" }}
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
      className="min-h-screen font-arabic relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 50% -10%, #E7F8FD 0%, #F7FCFE 35%, #FFFFFF 72%)",
        color: "#26343B",
      }}
    >
      {/* Cloud atmosphere */}
      <div
        className="pointer-events-none absolute -top-40 -right-40 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{
          background: "rgba(169,220,235,.20)",
        }}
      />
      <div
        className="pointer-events-none absolute top-[420px] -left-52 h-[430px] w-[430px] rounded-full blur-3xl"
        style={{
          background: "rgba(115,195,220,.10)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[-220px] right-[20%] h-[430px] w-[430px] rounded-full blur-3xl"
        style={{
          background: "rgba(220,244,250,.55)",
        }}
      />
      <div className="relative mx-auto w-full max-w-2xl px-5 py-10 sm:px-7">
        {/* Header */}
        <header className="mb-12 text-center">
          <div
            className="text-4xl font-light tracking-[0.16em]"
            style={{
              color: "#68B7D0",
              textShadow:
                "0 4px 18px rgba(104,183,208,.18)",
            }}
          >
            غيمة
          </div>
          <div
            className="mt-3 text-sm font-light tracking-wide"
            style={{ color: "#829BA5" }}
          >
            مساحة دعوتك الخاصة
          </div>
          <div
            className="mx-auto mt-6 h-px w-16"
            style={{
              background:
                "linear-gradient(to left, transparent, #A9DCEB, transparent)",
            }}
          />
        </header>
        {/* Invitation Preview */}
        <section className="mb-12">
          <div className="mb-5 text-center">
            <div
              className="text-sm font-medium"
              style={{ color: "#58727D" }}
            >
              دعوتك
            </div>
            <div
              className="mt-1 text-[11px]"
              style={{ color: "#9AAEB6" }}
            >
              معاينة سريعة للدعوة
            </div>
          </div>
          <div
            className="overflow-hidden rounded-[30px]"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,.98), rgba(244,251,253,.96))",
              border: "1px solid rgba(213,234,240,.9)",
              boxShadow:
                "0 25px 70px rgba(76,139,158,.10), inset 0 1px 0 rgba(255,255,255,.95)",
            }}
          >
            {/* Luxury invitation mockup */}
            <div
              className="relative flex items-center justify-center overflow-hidden"
              style={{
                minHeight: "230px",
                background:
                  "radial-gradient(circle at 50% 25%, #FFFFFF 0%, #F5FBFD 48%, #EAF7FB 100%)",
              }}
            >
              <div
                className="absolute h-44 w-36 rounded-[22px]"
                style={{
                  background:
                    "linear-gradient(150deg, #FFFFFF 0%, #F8FCFD 60%, #E8F6FA 100%)",
                  border:
                    "1px solid rgba(183,218,228,.75)",
                  boxShadow:
                    "0 20px 45px rgba(72,130,147,.13), inset 0 0 0 6px rgba(255,255,255,.7)",
                  transform: "rotate(-2deg)",
                }}
              >
                <div
                  className="absolute left-1/2 top-7 -translate-x-1/2 h-px w-16"
                  style={{
                    background: "#B7DDE7",
                  }}
                />
                <div
                  className="absolute left-1/2 top-11 -translate-x-1/2 whitespace-nowrap text-[10px] tracking-[0.18em]"
                  style={{
                    color: "#6FAFC2",
                  }}
                >
                  دعوة خاصة
                </div>
                <div
                  className="absolute left-1/2 top-[88px] -translate-x-1/2 h-1 w-20 rounded-full"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, #C8E7EE, transparent)",
                  }}
                />
                <div
                  className="absolute left-1/2 top-[112px] -translate-x-1/2 text-[8px]"
                  style={{
                    color: "#9DB5BD",
                  }}
                >
                  بكل حب
                </div>
                <div
                  className="absolute bottom-7 left-1/2 -translate-x-1/2 h-px w-12"
                  style={{
                    background: "#C3E2EA",
                  }}
                />
              </div>
              <div
                className="absolute bottom-4 left-1/2 h-8 w-28 -translate-x-1/2 rounded-full blur-xl"
                style={{
                  background: "rgba(92,168,190,.18)",
                }}
              />
            </div>
            <div className="p-5">
              <button
                onClick={() => {
                  window.open("/", "_blank");
                }}
                className="w-full rounded-2xl py-3.5 text-sm font-medium transition-all active:scale-[.99]"
                style={{
                  background:
                    "linear-gradient(135deg, #79C8DE, #62B4CE)",
                  color: "#FFFFFF",
                  boxShadow:
                    "0 10px 25px rgba(98,180,206,.20)",
                }}
              >
                فتح الدعوة
              </button>
            </div>
          </div>
        </section>
        {/* Statistics */}
        <section className="mb-12">
          <div
            className="rounded-[30px] p-6 sm:p-7"
            style={{
              background:
                "rgba(255,255,255,.78)",
              border:
                "1px solid rgba(218,235,240,.9)",
              boxShadow:
                "0 22px 60px rgba(76,139,158,.07)",
              backdropFilter: "blur(14px)",
            }}
          >
            <div className="text-center">
              <div
                className="text-sm font-medium"
                style={{ color: "#58727D" }}
              >
                ملخص الدعوة
              </div>
              <div
                className="mt-3 text-5xl font-light tracking-tight"
                style={{ color: "#26343B" }}
              >
                {guests.length}
                <span
                  className="mx-2 text-2xl"
                  style={{ color: "#B9CDD4" }}
                >
                  /
                </span>
                <span
                  className="text-2xl"
                  style={{ color: "#78939D" }}
                >
                  {maxGuests}
                </span>
              </div>
              <div
                className="mt-1 text-xs"
                style={{ color: "#95A9B0" }}
              >
                المدعوون
              </div>
            </div>
            <div
              className="mt-6 h-2 w-full overflow-hidden rounded-full"
              style={{
                background: "#EAF3F6",
              }}
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
                  background:
                    "linear-gradient(to left, #68B9D3, #9DD9E8)",
                }}
              />
            </div>
            <div className="mt-7 grid grid-cols-3 text-center">
              <div>
                <div
                  className="text-2xl font-light"
                  style={{ color: "#26343B" }}
                >
                  {confirmedCount}
                </div>
                <div
                  className="mt-1 text-xs"
                  style={{ color: "#80959E" }}
                >
                  تم التأكيد
                </div>
              </div>
              <div
                className="border-x"
                style={{ borderColor: "#E2EDF1" }}
              >
                <div
                  className="text-2xl font-light"
                  style={{ color: "#26343B" }}
                >
                  {pendingCount}
                </div>
                <div
                  className="mt-1 text-xs"
                  style={{ color: "#80959E" }}
                >
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
                <div
                  className="mt-1 text-xs"
                  style={{ color: "#80959E" }}
                >
                  اعتذروا
                </div>
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
              style={{ color: "#94A8B0" }}
            >
              أضف الاسم ورقم الجوال لإرسال الدعوة
            </div>
          </div>
          <div
            className="rounded-[30px] p-5 sm:p-6"
            style={{
              background:
                "rgba(255,255,255,.82)",
              border:
                "1px solid rgba(218,235,240,.9)",
              boxShadow:
                "0 22px 60px rgba(76,139,158,.07)",
              backdropFilter: "blur(14px)",
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
                className="w-full rounded-2xl px-4 py-3.5 outline-none text-sm transition-all"
                style={{
                  background: "#FBFDFE",
                  border: "1px solid #DDECF0",
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
                className="w-full rounded-2xl px-4 py-3.5 outline-none text-sm transition-all"
                style={{
                  background: "#FBFDFE",
                  border: "1px solid #DDECF0",
                  color: "#26343B",
                }}
              />
              <button
                onClick={addGuest}
                className="w-full rounded-2xl py-3.5 text-sm font-medium transition-all active:scale-[.99]"
                style={{
                  background:
                    "linear-gradient(135deg, #79C8DE, #62B4CE)",
                  color: "#FFFFFF",
                  boxShadow:
                    "0 10px 25px rgba(98,180,206,.20)",
                }}
              >
                إضافة المدعو
              </button>
              {error && (
                <p
                  className="pt-1 text-center text-xs"
                  style={{ color: "#C77F8A" }}
                >
                  {error}
                </p>
              )}
            </div>
          </div>
        </section>
        {/* Guests */}
        <section>
          <div className="mb-5 flex items-end justify-between px-1">
            <div>
              <div
                className="text-lg font-medium"
                style={{ color: "#26343B" }}
              >
                المدعوون
              </div>
              <div
                className="mt-1 text-xs"
                style={{ color: "#94A8B0" }}
              >
                قائمة المدعوين وحالة الرد
              </div>
            </div>
            <div
              className="rounded-full px-3 py-1 text-xs"
              style={{
                background: "#EDF8FB",
                color: "#6FAFC2",
                border: "1px solid #D9EDF2",
              }}
            >
              {guests.length} / {maxGuests}
            </div>
          </div>
          <div
            className="overflow-hidden rounded-[30px]"
            style={{
              background:
                "rgba(255,255,255,.84)",
              border:
                "1px solid rgba(218,235,240,.9)",
              boxShadow:
                "0 22px 60px rgba(76,139,158,.07)",
              backdropFilter: "blur(14px)",
            }}
          >
            {guests.length === 0 ? (
              <div className="px-5 py-14 text-center">
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
                  style={{
                    background:
                      "linear-gradient(145deg, #F0FAFC, #E4F5F9)",
                    border:
                      "1px solid #D8EDF2",
                  }}
                >
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{
                      background: "#88C9DC",
                    }}
                  />
                </div>
                <div
                  className="mt-4 text-sm"
                  style={{ color: "#718890" }}
                >
                  لم تتم إضافة أي مدعو بعد
                </div>
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
                    ? "#73C3DC"
                    : guest.status === "declined"
                    ? "#C7A0AC"
                    : "#B7C8CE";
                return (
                  <div
                    key={guest.id}
                    className="flex items-center justify-between gap-4 px-5 py-5"
                    style={{
                      borderBottom:
                        index !== guests.length - 1
                          ? "1px solid #EDF3F5"
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
                        style={{ color: "#91A4AB" }}
                      >
                        {guest.phone}
                      </div>
                      <div
                        className="mt-1.5 text-[10px]"
                        style={{ color: "#B0BDC2" }}
                      >
                        كود الدعوة: {guest.invite_code}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <div
                        className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs"
                        style={{
                          background:
                            guest.status === "attending"
                              ? "#EEF9FC"
                              : guest.status === "declined"
                              ? "#FBF3F5"
                              : "#F4F7F8",
                          color: "#718890",
                        }}
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
                            color: "#62AEC7",
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
          className="mt-16 pb-5 text-center text-xs"
          style={{ color: "#A2B0B5" }}
        >
          <div
            className="mx-auto mb-3 h-px w-12"
            style={{
              background:
                "linear-gradient(to left, transparent, #D5E9EE, transparent)",
            }}
          />
          غيمة · دعوات تليق بتفاصيلك
        </footer>
      </div>
    </div>
  );
};
export default Manage;
