import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Guest = {
  id: string;
  name: string;
  phone: string;
  status: string | null;
};

const Manage = () => {
  const { id } = useParams();

  const [maxGuests, setMaxGuests] = useState(0);
  const [invitationId, setInvitationId] = useState("");
  const [error, setError] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const loadInvitation = async () => {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("manage_code", id)
        .single();

      if (error) {
        console.log(error);
        return;
      }

      setMaxGuests(data.guest_limit);
      setInvitationId(data.id);

      const { data: guestsData, error: guestsError } = await supabase
        .from("guests")
        .select("*")
        .eq("invitation_id", data.id)
        .order("created_at");

      if (!guestsError && guestsData) {
        setGuests(guestsData);
      }
    };

    loadInvitation();
  }, [id]);

  const addGuest = async () => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

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

    const inviteCode = crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 8)
      .toUpperCase();

    const { data, error } = await supabase
      .from("guests")
      .insert({
        invitation_id: invitationId,
        name: cleanName,
        phone: cleanPhone,
        invite_code: inviteCode,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.log(error);
      setError("حدث خطأ أثناء إضافة المدعو");
      return;
    }

    setGuests((prev) => [...prev, data]);
    setError("");
    setName("");
    setPhone("");
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
    const newName = window.prompt("اكتب اسم المدعو الجديد");

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

    const newInviteCode = crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 8)
      .toUpperCase();

    const { data, error } = await supabase
      .from("guests")
      .insert({
        invitation_id: invitationId,
        name: cleanNewName,
        phone: cleanNewPhone,
        invite_code: newInviteCode,
        status: "pending",
      })
      .select()
      .single();

    if (error || !data) {
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
      window.alert("تمت الإضافة ولكن حدث خطأ في ربط الاستبدال");
      return;
    }

    setGuests((prev) => [...prev, data]);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen font-arabic"
      style={{
        background: "#F9FBFC",
        color: "#26343B",
      }}
    >
      <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-7">

        {/* Header */}
        <header className="mb-12 text-center">
          <div
            className="text-3xl font-light tracking-[0.12em]"
            style={{ color: "#67B8D2" }}
          >
            غيمة
          </div>

          <div
            className="mt-3 text-sm font-light"
            style={{ color: "#81939B" }}
          >
            مساحة دعوتك
          </div>

          <div
            className="mx-auto mt-5 h-px w-12"
            style={{ background: "#A9DCEB" }}
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
              border: "1px solid #E5EEF1",
              boxShadow: "0 18px 45px rgba(75, 120, 135, 0.08)",
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                minHeight: "180px",
                background:
                  "linear-gradient(145deg,#FFFFFF,#F2F9FB)",
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
                className="w-full rounded-2xl py-3 text-sm font-medium transition-all"
                style={{
                  background: "#73C3DC",
                  color: "#FFFFFF",
                  boxShadow:
                    "0 7px 20px rgba(115,195,220,.22)",
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
            style={{ background: "#E6F0F3" }}
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
                background: "#73C3DC",
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
              style={{ borderColor: "#E2ECEF" }}
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
              border: "1px solid #E5EEF1",
              boxShadow:
                "0 16px 40px rgba(75,120,135,.06)",
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
                  background: "#FAFCFD",
                  border: "1px solid #E3EDF0",
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
                  background: "#FAFCFD",
                  border: "1px solid #E3EDF0",
                  color: "#26343B",
                }}
              />

              <button
                onClick={addGuest}
                className="w-full rounded-2xl py-3 text-sm font-medium transition-all"
                style={{
                  background: "#73C3DC",
                  color: "#FFFFFF",
                  boxShadow:
                    "0 7px 20px rgba(115,195,220,.2)",
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
              border: "1px solid #E5EEF1",
              boxShadow:
                "0 16px 40px rgba(75,120,135,.05)",
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
                    ? "#73C3DC"
                    : guest.status === "declined"
                    ? "#C7A0AC"
                    : "#B9C4C8";

                return (
                  <div
                    key={guest.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                    style={{
                      borderBottom:
                        index !== guests.length - 1
                          ? "1px solid #EEF3F5"
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
                          className="text-xs font-medium"
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
          className="mt-14 pb-4 text-center text-xs"
          style={{ color: "#A2B0B5" }}
        >
          غيمة · دعوات تليق بتفاصيلك
        </footer>
      </div>
    </div>
  );
};

export default Manage;
