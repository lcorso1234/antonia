"use client";

import { FormEvent, useMemo, useState } from "react";

const CARD_FIRST_NAME = "Antonia";
const CARD_LAST_NAME = "Gianakas";
const CARD_PHONE_DISPLAY = "708.203.7932";
const CARD_PHONE_RAW = "+17082037932";
const CARD_ORG = "Charizard Network";
const CARD_TITLE = "Pokemon Leader";
const CARD_NOTE = "Charizard-powered relationships built to last, the American Way.";

function getSmsLink(phone: string, body: string) {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const encodedBody = encodeURIComponent(body);
  return isIOS ? `sms:${phone}&body=${encodedBody}` : `sms:${phone}?body=${encodedBody}`;
}

function buildContactUrl(origin: string, params: Record<string, string>) {
  const query = new URLSearchParams(params);
  return `${origin}/api/contact?${query.toString()}`;
}

export default function Home() {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSmsPrompt, setShowSmsPrompt] = useState(false);
  const [senderFirstName, setSenderFirstName] = useState("");
  const [senderLastName, setSenderLastName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderEmail, setSenderEmail] = useState("");

  const canSendSms = senderPhone.trim().length > 0 && senderEmail.trim().length > 0;

  const ownerContactUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return buildContactUrl(window.location.origin, {
      firstName: CARD_FIRST_NAME,
      lastName: CARD_LAST_NAME,
      phone: CARD_PHONE_RAW,
      org: CARD_ORG,
      title: CARD_TITLE,
      note: CARD_NOTE,
    });
  }, []);

  const saveOwnerContact = async () => {
    if (!ownerContactUrl) {
      return;
    }

    setIsSaving(true);
    const link = document.createElement("a");
    link.href = ownerContactUrl;
    link.download = `${CARD_FIRST_NAME}_${CARD_LAST_NAME}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSaved(true);
    setShowSmsPrompt(true);
    setTimeout(() => setSaved(false), 3500);
    setIsSaving(false);
  };

  const onSmsSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (typeof window === "undefined" || !canSendSms) {
      return;
    }

    const shareableContactUrl = buildContactUrl(window.location.origin, {
      firstName: senderFirstName.trim() || "Network",
      lastName: senderLastName.trim() || "Contact",
      phone: senderPhone.trim(),
      email: senderEmail.trim(),
      note: "Shared from Antonia's network form.",
    });

    const smsBody = [
      `Hi ${CARD_FIRST_NAME}, I joined your Charizard network.`,
      `Phone: ${senderPhone.trim()}`,
      `Email: ${senderEmail.trim()}`,
      `Shareable contact: ${shareableContactUrl}`,
    ].join("\n");

    window.location.href = getSmsLink(CARD_PHONE_RAW, smsBody);
  };

  return (
    <main className="business-shell">
      <div className="noise-layer" />
      <section className="business-card">
        <header className="card-header">
          <p className="header-kicker">Charizard Command Card</p>
          <h1 className="header-title">
            First Name: {CARD_FIRST_NAME} Last Name: {CARD_LAST_NAME} Phone number: {CARD_PHONE_DISPLAY}
          </h1>
        </header>

        <div className="card-body">
          <button
            type="button"
            onClick={saveOwnerContact}
            disabled={isSaving}
            className={`save-button ${saved ? "is-saved" : ""}`}
          >
            {isSaving ? "Saving Contact..." : saved ? "Contact Saved" : "Save Contact & Continue to Text"}
          </button>

          <p className="support-text">
            Charizard flow on Android and iOS: save contact first, then open the form to send SMS.
          </p>
        </div>

        {showSmsPrompt ? (
          <form className="sms-form" onSubmit={onSmsSubmit}>
            <h2 className="sms-form-title">Send Charizard Network Text</h2>
            <p className="sms-form-copy">Fill your details to generate the SMS and your Charizard shareable contact link.</p>

            <div className="input-grid">
              <input
                value={senderFirstName}
                onChange={(e) => setSenderFirstName(e.target.value)}
                placeholder="Your first name (optional)"
                className="text-input"
              />
              <input
                value={senderLastName}
                onChange={(e) => setSenderLastName(e.target.value)}
                placeholder="Your last name (optional)"
                className="text-input"
              />
              <input
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="Your phone number"
                className="text-input"
              />
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="Your email"
                className="text-input"
              />
            </div>

            <div className="sms-actions">
              <button type="submit" className="send-button" disabled={!canSendSms}>
                Open Text Message
              </button>
              <button type="button" className="ghost-button" onClick={() => setShowSmsPrompt(false)}>
                Close
              </button>
            </div>
          </form>
        ) : null}

        <footer className="card-footer">
          <p>Built in America, on earth.</p>
          <p className="footer-italic">Making relationships built to last, the American Way.</p>
        </footer>
      </section>
    </main>
  );
}
