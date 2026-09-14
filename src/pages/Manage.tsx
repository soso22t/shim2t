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
  qr_token?: string | null;
  scanned?: boolean | null;
  device_id?: string | null;
};

type ModalState = {
  type: "message" | "confirm";
  title: string;
  message: string;
  action?: () => void | Promise<void>;
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
  // إضافة: حالة لحفظ أسماء المرافقين
  const [companions, setCompanions] = useState<string[]>([]);

  const [modal, setModal] = useState<ModalState | null>(null);

  const [replaceModalOpen, setReplaceModalOpen] = useState(false);
  const [replaceTarget, setReplaceTarget] = useState<Guest | null>(null);
  const [replaceName, setReplaceName] = useState("");
  const [replacePhone, setReplacePhone] = useState("");
  const [replaceError, setReplaceError] = useState("");

  const showMessage = (title: string, message: string) => {
    setModal({
      type: "message",
      title,
      message,
    });
  };

  const showConfirm = (
    title: string,
    message: string,
    action: () => void | Promise<void>
  ) => {
    setModal({
      type: "confirm",
      title,
      message,
      action,
    });
  };

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
          .from("shim")
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
          .from("shim2t")
          .select(
            "id, name, phone, status, invite_code, replaced, created_at, qr_token, scanned, device_id"
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

  /*
   * إنشاء رابط واتساب
   */
  const createWhatsAppUrl = (
    guestName: string,
    guestPhone: string,
    inviteCode: string
  ) => {
    const invitationUrl =
      `https://shim.shim2t.com/?invite=${encodeURIComponent(
        inviteCode
      )}`;

    const message =
      `${guestName}\n\n` +
      `يسعدنا دعوتك لمشاركتنا فرحة زفاف غالينا، فحضورك يزيد فرحتنا جمالًا ♥️💍.\n\n` +
      `${invitationUrl}`;

    const cleanPhone = guestPhone.replace(/\D/g, "");

    let whatsappPhone = cleanPhone;

    if (cleanPhone.startsWith("0")) {
      whatsappPhone = "966" + cleanPhone.slice(1);
    }

    return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
      message
    )}`;
  };

  /*
   * فتح واتساب
   */
  const prepareWhatsAppWindow = () => {
    return window.open("", "_blank");
  };

  const openWhatsApp = (
    whatsappWindow: Window | null,
    guestName: string,
    guestPhone: string,
    inviteCode: string
  ) => {
    const whatsappUrl = createWhatsAppUrl(
      guestName,
      guestPhone,
      inviteCode
    );

    if (whatsappWindow) {
      whatsappWindow.location.href = whatsappUrl;
    } else {
      window.location.href = whatsappUrl;
    }
  };

  const addGuest = async () => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    
    // فلترة المرافقين (تجاهل الحقول الفارغة)
    const validCompanions = companions
      .map((c) => c.trim())
      .filter((c) => c !== "");

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
      setError(
        "رقم الجوال يجب أن يتكون من 10 أرقام ويبدأ بـ 05"
      );
      return;
    }

    if (!invitationId) {
      setError("لم يتم العثور على الدعوة");
      return;
    }

    // حساب العدد الإجمالي (الأساسي + المرافقين)
    const totalGuestsToAdd = 1 + validCompanions.length;

    if (guests.length + totalGuestsToAdd > maxGuests) {
      setError(
        `تم الوصول للحد الأقصى. المساحة المتبقية تكفي لـ ${maxGuests - guests.length} مدعو فقط.`
      );
      return;
    }

    const exists = guests.some(
      (guest) => guest.phone === cleanPhone
    );

    if (exists) {
      setError("رقم الجوال مضاف مسبقًا");
      return;
    }

    const whatsappWindow = prepareWhatsAppWindow();

    const inviteCode = generateInviteCode();

    // تجهيز مصفوفة لجميع الأسماء للإضافة دفعة واحدة
    const guestsToInsert = [cleanName, ...validCompanions].map((n) => ({
      invitation_id: invitationId,
      name: n,
      phone: cleanPhone,
      invite_code: inviteCode,
      status: "pending",
    }));

    const { data, error: insertError } = await supabase
      .from("shim2t")
      .insert(guestsToInsert)
      .select(
        "id, name, phone, status, invite_code, replaced, created_at, qr_token, scanned, device_id"
      );

    if (insertError || !data) {
      console.error(insertError);

      if (whatsappWindow) {
        whatsappWindow.close();
      }

      setError("حدث خطأ أثناء إضافة المدعو");
      return;
    }

    setGuests((prev) => [...prev, ...(data as Guest[])]);

    setName("");
    setPhone("");
    setCompanions([]);
    setError("");

    // جمع الأسماء لرسالة الواتساب
    const allNamesJoined = [cleanName, ...validCompanions].join(" و ");

    openWhatsApp(
      whatsappWindow,
      allNamesJoined,
      cleanPhone,
      inviteCode
    );
  };

  const addFromContacts = async () => {
    try {
      const nav = navigator as Navigator & {
        contacts?: {
          select: (
            properties: string[],
            options?: { multiple?: boolean }
          ) => Promise<
            Array<{
              name?: string[];
              tel?: string[];
            }>
          >;
        };
      };

      if (!nav.contacts?.select) {
        showMessage(
          "إضافة من جهات الاتصال",
          "هذه الخاصية غير مدعومة في المتصفح الحالي. يمكنك كتابة الاسم ورقم الجوال يدويًا."
        );
        return;
      }

      const contacts = await nav.contacts.select(
        ["name", "tel"],
        { multiple: false }
      );

      if (!contacts.length) return;

      const contact = contacts[0];

      const contactName = contact.name?.[0] || "";
      const contactPhone = contact.tel?.[0] || "";

      const cleanPhone = contactPhone.replace(/\D/g, "");

      let finalPhone = cleanPhone;

      if (
        cleanPhone.startsWith("9665") &&
        cleanPhone.length === 12
      ) {
        finalPhone = "0" + cleanPhone.slice(3);
      }

      if (
        cleanPhone.startsWith("5") &&
        cleanPhone.length === 9
      ) {
        finalPhone = "0" + cleanPhone;
      }

      setName(contactName);
      setPhone(finalPhone);
      setCompanions([]);
      setError("");
    } catch (contactError) {
      console.error(contactError);

      showMessage(
        "إضافة من جهات الاتصال",
        "تعذر الوصول إلى جهات الاتصال. يمكنك كتابة الاسم ورقم الجوال يدويًا."
      );
    }
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

  const resetAllDevices = async () => {
    if (!invitationId) return;

    const { error: updateError } = await supabase
      .from("shim2t")
      .update({
        device_id: null,
      })
      .eq("invitation_id", invitationId);

    if (updateError) {
      console.error(updateError);
      showMessage(
        "تعذر إعادة التعيين",
        "حدث خطأ أثناء إعادة تعيين الأجهزة. حاول مرة أخرى."
      );
      return;
    }

    setGuests((prev) =>
      prev.map((guest) => ({
        ...guest,
        device_id: null,
      }))
    );

    showMessage(
      "تمت إعادة التعيين",
      "تمت إعادة تعيين الأجهزة لجميع الدعوات بنجاح."
    );
  };

  const resetGuestDevice = async (guest: Guest) => {
    const { error: updateError } = await supabase
      .from("shim2t")
      .update({
        device_id: null,
      })
      .eq("id", guest.id);

    if (updateError) {
      console.error(updateError);
      showMessage(
        "تعذر إعادة تعيين الجهاز",
        "حدث خطأ أثناء إعادة تعيين جهاز المدعو. حاول مرة أخرى."
      );
      return;
    }

    setGuests((prev) =>
      prev.map((item) =>
        item.id === guest.id
          ? {
              ...item,
              device_id: null,
            }
          : item
      )
    );

    showMessage(
      "تمت إعادة تعيين الجهاز",
      `تم فصل دعوة ${guest.name} عن الجهاز الحالي ويمكن فتحها من جهاز جديد.`
    );
  };

  const resetBarcode = async (guest: Guest) => {
    const newQrToken = crypto.randomUUID();

    const { error: updateError } = await supabase
      .from("shim2t")
      .update({
        qr_token: newQrToken,
        scanned: false,
      })
      .eq("id", guest.id);

    if (updateError) {
      console.error(updateError);
      showMessage(
        "تعذر إعادة تعيين الباركود",
        "حدث خطأ أثناء إعادة تعيين الباركود. حاول مرة أخرى."
      );
      return;
    }

    setGuests((prev) =>
      prev.map((item) =>
        item.id === guest.id
          ? {
              ...item,
              qr_token: newQrToken,
              scanned: false,
            }
          : item
      )
    );

    showMessage(
      "تمت إعادة تعيين الباركود",
      `تم إنشاء باركود جديد لـ ${guest.name} ويمكن استخدامه من جديد.`
    );
  };

  const deleteGuest = async (guest: Guest) => {
    const { error: deleteError } = await supabase
      .from("shim2t")
      .delete()
      .eq("id", guest.id);

    if (deleteError) {
      console.error(deleteError);
      showMessage(
        "تعذر حذف المدعو",
        "حدث خطأ أثناء حذف المدعو. حاول مرة أخرى."
      );
      return;
    }

    setGuests((prev) =>
      prev.filter((item) => item.id !== guest.id)
    );

    showMessage(
      "تم حذف المدعو",
      `تم حذف ${guest.name} من قائمة المدعوين، وأصبح بالإمكان إضافة مدعو جديد مكانه.`
    );
  };

  const openReplaceModal = (guest: Guest) => {
    setReplaceTarget(guest);
    setReplaceName("");
    setReplacePhone("");
    setReplaceError("");
    setReplaceModalOpen(true);
  };

  const replaceGuest = async () => {
    if (!replaceTarget || !invitationId) return;

    const cleanNewName = replaceName.trim();
    const cleanNewPhone = replacePhone.trim();

    setReplaceError("");

    if (!cleanNewName) {
      setReplaceError("يرجى كتابة اسم المدعو الجديد");
      return;
    }

    if (!cleanNewPhone) {
      setReplaceError("يرجى كتابة رقم الجوال الجديد");
      return;
    }

    if (!/^05\d{8}$/.test(cleanNewPhone)) {
      setReplaceError(
        "رقم الجوال يجب أن يتكون من 10 أرقام ويبدأ بـ 05"
      );
      return;
    }

    const exists = guests.some(
      (item) =>
        item.phone === cleanNewPhone &&
        item.id !== replaceTarget.id
    );

    if (exists) {
      setReplaceError("رقم الجوال مضاف مسبقًا");
      return;
    }

    const whatsappWindow = prepareWhatsAppWindow();

    const newInviteCode = generateInviteCode();

    const { data, error: updateError } = await supabase
      .from("shim2t")
      .update({
        name: cleanNewName,
        phone: cleanNewPhone,
        invite_code: newInviteCode,
        status: "pending",
        qr_token: null,
        scanned: false,
        device_id: null,
        replaced: null,
      })
      .eq("id", replaceTarget.id)
      .eq("invitation_id", invitationId)
      .select(
        "id, name, phone, status, invite_code, replaced, created_at, qr_token, scanned, device_id"
      )
      .single();

    if (updateError || !data) {
      console.error(updateError);

      if (whatsappWindow) {
        whatsappWindow.close();
      }

      setReplaceError(
        "حدث خطأ أثناء استبدال المدعو، حاول مرة أخرى."
      );
      return;
    }

    setGuests((prev) =>
      prev.map((item) =>
        item.id === replaceTarget.id
          ? (data as Guest)
          : item
      )
    );

    setReplaceModalOpen(false);
    setReplaceTarget(null);
    setReplaceName("");
    setReplacePhone("");
    setReplaceError("");

    openWhatsApp(
      whatsappWindow,
      cleanNewName,
      cleanNewPhone,
      newInviteCode
    );
  };

  if (loading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center font-arabic"
        style={{
          background: "#F5F3EE",
          color: "#273247",
        }}
      >
        <div
          className="text-sm"
          style={{ color: "#7B818B" }}
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
          background: "#F5F3EE",
          color: "#273247",
        }}
      >
        <div className="text-center">
          <div
            className="text-3xl font-light"
            style={{
              color: "#273247",
              letterSpacing: "0",
            }}
          >
            غيمة
          </div>

          <div
            className="mx-auto mt-5 h-px w-12"
            style={{ background: "#B5A07E" }}
          />

          <div
            className="mt-7 text-lg font-medium"
            style={{ color: "#273247" }}
          >
            تعذر فتح صفحة الإدارة
          </div>

          <div
            className="mt-2 text-sm"
            style={{ color: "#7B818B" }}
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
        background: "#F5F3EE",
        color: "#273247",
      }}
    >
      <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-7">

        {/* Header */}
        <header className="mb-12 text-center">
          <div
            className="text-4xl font-light"
            style={{
              color: "#273247",
              letterSpacing: "0",
            }}
          >
            غيمة
          </div>

          <div
            className="mt-3 text-sm font-light"
            style={{ color: "#7B818B" }}
          >
            مساحة دعوتك
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            <div
              className="h-px w-14"
              style={{ background: "#B5A07E" }}
            />

            <svg
              width="42"
              height="24"
              viewBox="0 0 42 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5 20.5H32C36.1421 20.5 39.5 17.1421 39.5 13C39.5 9.05887 36.4579 5.875 32.5 5.875C31.8285 5.875 31.1764 5.96125 30.56 6.12375C29.2719 2.8425 26.0879 0.5 22.35 0.5C17.8307 0.5 14.125 4.06123 13.8925 8.52375C12.8476 7.90055 11.0266 7.5 9.5 7.5C4.80558 7.5 1 10.6337 1 14.5C1 17.8137 4.80558 20.5 9.5 20.5H10.5Z"
                fill="#273247"
              />
            </svg>

            <div
              className="h-px w-14"
              style={{ background: "#B5A07E" }}
            />
          </div>
        </header>

        {/* Invitation Preview */}
        <section className="mb-12">
          <div
            className="mb-4 text-center text-sm"
            style={{ color: "#7B818B" }}
          >
            دعوتك
          </div>

          <div
            className="overflow-hidden rounded-[28px]"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E0DA",
              boxShadow:
                "0 18px 45px rgba(39,50,71,.08)",
            }}
          >
            <div
              className="w-full overflow-hidden"
              style={{
                background: "#FFFFFF",
              }}
            >
              <img
                src="https://mo.shim2t.com/K.png"
                alt="معاينة الدعوة"
                className="w-full h-auto block"
              />
            </div>

            <div className="p-5">
              <button
                onClick={() => {
                  window.open("/", "_blank");
                }}
                className="w-full rounded-2xl py-3 text-sm font-medium transition-all active:scale-[.99]"
                style={{
                  background: "#273247",
                  color: "#FFFFFF",
                  boxShadow:
                    "0 8px 22px rgba(39,50,71,.18)",
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
              style={{ color: "#7B818B" }}
            >
              ملخص الدعوة
            </div>

            <div
              className="mt-3 text-5xl font-light tracking-tight"
              style={{ color: "#273247" }}
            >
              {guests.length}

              <span
                className="mx-1 text-2xl"
                style={{ color: "#B5A07E" }}
              >
                /
              </span>

              <span
                className="text-2xl"
                style={{ color: "#7B818B" }}
              >
                {maxGuests}
              </span>
            </div>

            <div
              className="mt-1 text-xs"
              style={{ color: "#7B818B" }}
            >
              المدعوون
            </div>
          </div>

          <div
            className="h-[2px] w-full overflow-hidden rounded-full"
            style={{ background: "#E2E0DA" }}
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
                background: "#273247",
              }}
            />
          </div>

          <div
            className="mt-7 grid grid-cols-3 text-center"
            style={{ color: "#7B818B" }}
          >
            <div>
              <div
                className="text-2xl font-light"
                style={{ color: "#273247" }}
              >
                {confirmedCount}
              </div>

              <div className="mt-1 text-xs">
                تم التأكيد
              </div>
            </div>

            <div
              className="border-x"
              style={{ borderColor: "#E2E0DA" }}
            >
              <div
                className="text-2xl font-light"
                style={{ color: "#273247" }}
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
                style={{ color: "#273247" }}
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
              style={{ color: "#273247" }}
            >
              إضافة مدعو
            </div>

            <div
              className="mt-1 text-xs"
              style={{ color: "#7B818B" }}
            >
              أضف الاسم ورقم الجوال لإرسال الدعوة
            </div>
          </div>

          <div
            className="rounded-[26px] p-5 sm:p-6"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E0DA",
              boxShadow:
                "0 16px 40px rgba(39,50,71,.06)",
            }}
          >
            <div className="space-y-3">
              <input
                placeholder="اسم المدعو الأساسي"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                className="w-full rounded-2xl px-4 py-3 outline-none text-sm"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E0DA",
                  color: "#273247",
                }}
              />

              {/* حقول المرافقين (إن وُجدت) */}
              {companions.map((comp, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    placeholder={`اسم المرافق (مثال: جود)`}
                    value={comp}
                    onChange={(e) => {
                      const newComps = [...companions];
                      newComps[idx] = e.target.value;
                      setCompanions(newComps);
                      setError("");
                    }}
                    className="w-full rounded-2xl px-4 py-3 outline-none text-sm"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E2E0DA",
                      color: "#273247",
                    }}
                  />
                  <button
                    onClick={() => {
                      setCompanions(
                        companions.filter((_, i) => i !== idx)
                      );
                    }}
                    className="rounded-2xl px-4 text-xs font-medium transition-all active:scale-[.99]"
                    style={{
                      background: "#F1F0EC",
                      color: "#5F6978",
                      border: "1px solid #E2E0DA",
                    }}
                  >
                    حذف
                  </button>
                </div>
              ))}

              {/* زر إضافة مرافق بنفس طابع وألوان الهوية */}
              <button
                type="button"
                onClick={() => setCompanions([...companions, ""])}
                className="text-xs font-medium w-full text-right px-2 py-1 transition-all active:scale-[.99]"
                style={{ color: "#B5A07E" }}
              >
                + إضافة مرافق على نفس الرقم (اختياري)
              </button>

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
                  background: "#FFFFFF",
                  border: "1px solid #E2E0DA",
                  color: "#273247",
                }}
              />

              <button
                onClick={addFromContacts}
                className="w-full rounded-2xl py-3 text-sm font-medium transition-all active:scale-[.99]"
                style={{
                  background: "#F1F0EC",
                  color: "#5F6978",
                  border: "1px solid #E2E0DA",
                }}
              >
                إضافة من جهات الاتصال
              </button>

              <button
                onClick={addGuest}
                className="w-full rounded-2xl py-3 text-sm font-medium transition-all active:scale-[.99]"
                style={{
                  background: "#273247",
                  color: "#FFFFFF",
                  boxShadow:
                    "0 8px 22px rgba(39,50,71,.18)",
                }}
              >
                إضافة المدعو
              </button>

              {error && (
                <p
                  className="pt-1 text-center text-xs"
                  style={{ color: "#7B818B" }}
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
                style={{ color: "#273247" }}
              >
                المدعوون
              </div>

              <div
                className="mt-1 text-xs"
                style={{ color: "#7B818B" }}
              >
                قائمة المدعوين وحالة الرد
              </div>
            </div>

            <div
              className="text-xs"
              style={{ color: "#7B818B" }}
            >
              {guests.length} / {maxGuests}
            </div>
          </div>

          <div
            className="overflow-hidden rounded-[26px]"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E0DA",
              boxShadow:
                "0 16px 40px rgba(39,50,71,.05)",
            }}
          >
            {guests.length === 0 ? (
              <div
                className="py-12 text-center text-sm"
                style={{ color: "#7B818B" }}
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
                    ? "#273247"
                    : guest.status === "declined"
                    ? "#B5A07E"
                    : "#B7BABF";

                const hasUsedBarcode =
                  !!guest.qr_token && !!guest.scanned;

                return (
                  <div
                    key={guest.id}
                    className="px-5 py-4"
                    style={{
                      borderBottom:
                        index !== guests.length - 1
                          ? "1px solid #E2E0DA"
                          : "none",
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div
                          className="truncate text-sm font-medium"
                          style={{
                            color: "#273247",
                            fontFamily: "Arial, sans-serif",
                          }}
                        >
                          {guest.name}
                        </div>

                        <div
                          className="mt-1 text-xs"
                          style={{ color: "#7B818B" }}
                        >
                          {guest.phone}
                        </div>

                        <button
                          onClick={() => {
                            showConfirm(
                              "إعادة تعيين الجهاز",
                              `سيتم فصل دعوة ${guest.name} عن الجهاز الحالي، ويمكن فتحها من جهاز جديد. هل تريد المتابعة؟`,
                              async () => {
                                setModal(null);
                                await resetGuestDevice(guest);
                              }
                            );
                          }}
                          className="mt-3 rounded-xl px-3 py-2 text-xs font-medium transition-all active:scale-[.98]"
                          style={{
                            background: "#F1F0EC",
                            color: "#5F6978",
                            border: "1px solid #E2E0DA",
                          }}
                        >
                          إعادة تعيين الجهاز
                        </button>
                      </div>

                      <div
                        className="flex shrink-0 flex-col items-end gap-2 text-xs"
                        style={{ color: "#7B818B" }}
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{
                              background: dotColor,
                            }}
                          />

                          {status}
                        </div>

                        <button
                          onClick={() => {
                            showConfirm(
                              "حذف المدعو",
                              `هل أنت متأكد من حذف ${guest.name}؟ سيتم حذف دعوته من القائمة ويمكن إضافة مدعو جديد مكانه.`,
                              async () => {
                                setModal(null);
                                await deleteGuest(guest);
                              }
                            );
                          }}
                          aria-label={`حذف ${guest.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg transition-all active:scale-[.95]"
                          style={{
                            background: "#273247",
                            color: "#FFFFFF",
                          }}
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9 3H15L16 5H20V7H4V5H8L9 3Z"
                              fill="currentColor"
                            />
                            <path
                              d="M6 8H18L17.2 20C17.13 21.12 16.2 22 15.08 22H8.92C7.8 22 6.87 21.12 6.8 20L6 8Z"
                              fill="currentColor"
                            />
                            <path
                              d="M10 11V18M14 11V18"
                              stroke="#273247"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {hasUsedBarcode ? (
                        <button
                          onClick={() => {
                            showConfirm(
                              "إعادة تعيين الباركود",
                              `سيتم إعادة تعيين باركود ${guest.name} وجعله صالحًا للاستخدام من جديد. هل تريد المتابعة؟`,
                              async () => {
                                setModal(null);
                                await resetBarcode(guest);
                              }
                            );
                          }}
                          className="rounded-xl py-2.5 text-xs font-medium transition-all active:scale-[.98]"
                          style={{
                            background: "#F1F0EC",
                            color: "#5F6978",
                            border: "1px solid #E2E0DA",
                          }}
                        >
                          إعادة تعيين الباركود
                        </button>
                      ) : (
                        <div />
                      )}

                      {guest.status === "declined" ? (
                        <button
                          onClick={() =>
                            openReplaceModal(guest)
                          }
                          className="rounded-xl py-2.5 text-xs font-medium transition-all active:scale-[.98]"
                          style={{
                            background: "#273247",
                            color: "#FFFFFF",
                          }}
                        >
                          استبدال
                        </button>
                      ) : (
                        <div />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <footer
          className="mt-14 pb-4 text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-2">
            <div
              className="h-px w-12"
              style={{ background: "#B5A07E" }}
            />

            <svg
              width="42"
              height="24"
              viewBox="0 0 42 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5 20.5H32C36.1421 20.5 39.5 17.1421 39.5 13C39.5 9.05887 36.4579 5.875 32.5 5.875C31.8285 5.875 31.1764 5.96125 30.56 6.12375C29.2719 2.8425 26.0879 0.5 22.35 0.5C17.8307 0.5 14.125 4.06123 13.8925 8.52375C12.8476 7.90055 11.0266 7.5 9.5 7.5C4.80558 7.5 1 10.6337 1 14.5C1 17.8137 4.80558 20.5 9.5 20.5H10.5Z"
                fill="#273247"
              />
            </svg>

            <div
              className="h-px w-12"
              style={{ background: "#B5A07E" }}
            />
          </div>

          <div
            className="text-xs"
            style={{ color: "#7B818B" }}
          >
            غيمة · دعوات تليق بتفاصيلك
          </div>
        </footer>
      </div>

      {/* Replace Guest Modal */}
      {replaceModalOpen && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 flex items-center justify-center px-5"
          style={{
            background: "rgba(39,50,71,.35)",
            backdropFilter: "blur(5px)",
          }}
          onClick={() => setReplaceModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-[26px] p-6"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E0DA",
              boxShadow:
                "0 25px 70px rgba(39,50,71,.18)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="mx-auto mb-4 h-1 w-10 rounded-full"
              style={{
                background: "#B5A07E",
              }}
            />

            <div
              className="text-center text-lg font-medium"
              style={{ color: "#273247" }}
            >
              استبدال المدعو
            </div>

            <div
              className="mt-2 text-center text-xs leading-6"
              style={{ color: "#7B818B" }}
            >
              أضف بيانات المدعو الجديد بدلًا من المدعو المعتذر.
            </div>

            <div className="mt-5 space-y-3">
              <input
                autoFocus
                placeholder="اسم المدعو الجديد"
                value={replaceName}
                onChange={(e) => {
                  setReplaceName(e.target.value);
                  setReplaceError("");
                }}
                className="w-full rounded-2xl px-4 py-3 outline-none text-sm"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E0DA",
                  color: "#273247",
                }}
              />

              <input
                placeholder="05xxxxxxxx"
                inputMode="numeric"
                maxLength={10}
                value={replacePhone}
                onChange={(e) => {
                  setReplacePhone(
                    e.target.value.replace(/\D/g, "")
                  );
                  setReplaceError("");
                }}
                className="w-full rounded-2xl px-4 py-3 outline-none text-sm"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E0DA",
                  color: "#273247",
                }}
              />

              {replaceError && (
                <p
                  className="text-center text-xs leading-6"
                  style={{ color: "#7B818B" }}
                >
                  {replaceError}
                </p>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setReplaceModalOpen(false);
                  setReplaceTarget(null);
                  setReplaceName("");
                  setReplacePhone("");
                  setReplaceError("");
                }}
                className="rounded-2xl py-3 text-sm font-medium"
                style={{
                  background: "#F1F0EC",
                  color: "#5F6978",
                }}
              >
                إلغاء
              </button>

              <button
                onClick={replaceGuest}
                className="rounded-2xl py-3 text-sm font-medium"
                style={{
                  background: "#273247",
                  color: "#FFFFFF",
                }}
              >
                تأكيد الاستبدال
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message / Confirmation Modal */}
      {modal && (
        <div
          dir="rtl"
          className="fixed inset-0 z-[60] flex items-center justify-center px-5"
          style={{
            background: "rgba(39,50,71,.35)",
            backdropFilter: "blur(5px)",
          }}
          onClick={() => setModal(null)}
        >
          <div
            className="w-full max-w-sm rounded-[26px] p-6"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E0DA",
              boxShadow:
                "0 25px 70px rgba(39,50,71,.18)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="mx-auto mb-4 h-1 w-10 rounded-full"
              style={{
                background: "#B5A07E",
              }}
            />

            <div
              className="text-center text-lg font-medium"
              style={{ color: "#273247" }}
            >
              {modal.title}
            </div>

            <div
              className="mt-3 text-center text-sm leading-7"
              style={{ color: "#7B818B" }}
            >
              {modal.message}
            </div>

            {modal.type === "confirm" ? (
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setModal(null)}
                  className="rounded-2xl py-3 text-sm font-medium"
                  style={{
                    background: "#F1F0EC",
                    color: "#5F6978",
                  }}
                >
                  إلغاء
                </button>

                <button
                  onClick={async () => {
                    await modal.action?.();
                  }}
                  className="rounded-2xl py-3 text-sm font-medium"
                  style={{
                    background: "#273247",
                    color: "#FFFFFF",
                  }}
                >
                  تأكيد
                </button>
              </div>
            ) : (
              <button
                onClick={() => setModal(null)}
                className="mt-6 w-full rounded-2xl py-3 text-sm font-medium"
                style={{
                  background: "#273247",
                  color: "#FFFFFF",
                }}
              >
                حسنًا
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Manage;
