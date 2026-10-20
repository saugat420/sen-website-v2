"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Mail, Phone, UserRound } from "lucide-react";

type FormState = {
  enquiryId: string;
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  level: string;
  challenges: string[];
  website: string;
};

const levels = [
  "I know a few words.",
  "I can make simple sentences.",
  "I understand English, but struggle to speak.",
  "I can speak, but want to improve.",
];

const challenges = [
  "Finding the right words.",
  "Speaking without translating.",
  "Feeling confident.",
  "Pronunciation.",
  "Everyday conversations.",
  "Speaking at work.",
];

const countryCodes = [
  { value: "+977", label: "Nepal (+977)" },
  { value: "+91", label: "India (+91)" },
  { value: "+880", label: "Bangladesh (+880)" },
  { value: "+971", label: "UAE (+971)" },
  { value: "+974", label: "Qatar (+974)" },
  { value: "+966", label: "Saudi Arabia (+966)" },
  { value: "+44", label: "United Kingdom (+44)" },
  { value: "+1", label: "US / Canada (+1)" },
  { value: "+61", label: "Australia (+61)" },
  { value: "other", label: "Other country" },
];

const newEnquiryId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `sen-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const emptyForm = (): FormState => ({
  enquiryId: newEnquiryId(), name: "", email: "", countryCode: "+977", phone: "", level: "", challenges: [], website: "",
});

function normalizedPhone(form: FormState) {
  const raw = form.phone.trim().replace(/[\s()-]/g, "");
  if (raw.startsWith("+")) return raw;
  if (form.countryCode === "other") return "";
  const localDigits = raw.replace(/\D/g, "").replace(/^0/, "");
  return `${form.countryCode}${localDigits}`;
}

export function EnquiryForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ whatsappUrl: string } | null>(null);
  const [startedAt] = useState(() => Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasChangedStep = useRef(false);

  useEffect(() => {
    if (hasChangedStep.current) headingRef.current?.focus();
    hasChangedStep.current = true;
  }, [step]);

  const update = (key: keyof FormState, value: string | string[]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const toggleChallenge = (value: string) => {
    update("challenges", form.challenges.includes(value)
      ? form.challenges.filter((item) => item !== value)
      : [...form.challenges, value]);
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      if (form.name.trim().length < 2) return "Please enter your full name.";
      if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone(form))) return form.countryCode === "other"
        ? "Enter your full WhatsApp number with country code, for example +44 7700 900000."
        : "Enter a valid WhatsApp number. You can also type a full international number beginning with +.";
      if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Please enter a valid email address or leave it blank.";
    }
    if (currentStep === 2) {
      if (!form.level) return "Please choose the option that best describes your English.";
      if (form.challenges.length === 0) return "Choose at least one area you would like help with.";
    }
    return "";
  };

  const continueToStepTwo = () => {
    const message = validateStep(1);
    if (message) { setError(message); return; }
    setStep(2); setError("");
  };

  const submit = async () => {
    const message = validateStep(2);
    if (message) { setError(message); return; }
    setSubmitting(true); setError("");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enquiryId: form.enquiryId,
          name: form.name,
          email: form.email,
          phone: normalizedPhone(form),
          level: form.level,
          challenges: form.challenges,
          website: form.website,
          formStartedAt: startedAt,
        }),
      });
      const result = (await response.json()) as { ok?: boolean; whatsappUrl?: string; error?: string };
      if (!response.ok || !result.ok || !result.whatsappUrl) throw new Error(result.error || "We couldn’t save your enquiry. Please try again.");
      setSuccess({ whatsappUrl: result.whatsappUrl });
      window.location.assign(result.whatsappUrl);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We couldn’t save your enquiry. Your answers are still here—please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) return (
    <div className="form-shell success-panel" aria-live="polite">
      <span className="success-icon"><Check aria-hidden="true" /></span>
      <p className="eyebrow">Your enquiry has been saved</p>
      <h3>Open WhatsApp and tap Send.</h3>
      <p>Your answers are ready to share with our team.</p>
      <a className="button button-primary" href={success.whatsappUrl}>Open WhatsApp <span aria-hidden="true">→</span></a>
    </div>
  );

  return (
    <form className="form-shell" onSubmit={(event) => event.preventDefault()} noValidate>
      <div className="form-progress">
        <div><span>Step {step} of 2</span><span>{step * 50}%</span></div>
        <div className="progress-track" aria-hidden="true"><span style={{ width: `${step * 50}%` }} /></div>
      </div>

      {step === 1 && (
        <fieldset>
          <legend><span ref={headingRef} tabIndex={-1}>Let’s start with you.</span></legend>
          <p className="form-hint">We’ll use these details only to respond to your enquiry.</p>
          <label className="field-label"><span><UserRound aria-hidden="true" /> Your name <b aria-hidden="true">*</b></span><input autoComplete="name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full name" required /></label>
          <div className="field-label">
            <span><Phone aria-hidden="true" /> WhatsApp number <b aria-hidden="true">*</b></span>
            <div className="phone-fields">
              <label className="sr-only" htmlFor="country-code">Country code</label>
              <select id="country-code" value={form.countryCode} onChange={(e) => update("countryCode", e.target.value)} aria-label="Country code">
                {countryCodes.map((country) => <option value={country.value} key={country.value}>{country.label}</option>)}
              </select>
              <input type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder={form.countryCode === "other" ? "+44 7700 900000" : "98XXXXXXXX"} aria-label="WhatsApp number" required />
            </div>
            <small>Enter your local number, or type a full international number beginning with +.</small>
          </div>
          <label className="field-label"><span><Mail aria-hidden="true" /> Email address <em>Optional</em></span><input type="email" autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" /></label>
          <label className="honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} /></label>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset>
          <legend><span ref={headingRef} tabIndex={-1}>Where do you get stuck?</span></legend>
          <div className="question-group"><h4>Which best describes your English?</h4><div className="choice-list">
            {levels.map((option) => <Choice key={option} type="radio" name="level" value={option} checked={form.level === option} onChange={() => update("level", option)} />)}
          </div></div>
          <div className="question-group"><h4>What would you like help with?</h4><p className="select-hint">Select all that apply.</p><div className="choice-list compact">
            {challenges.map((option) => <Choice key={option} type="checkbox" name="challenges" value={option} checked={form.challenges.includes(option)} onChange={() => toggleChallenge(option)} />)}
          </div></div>
          <p className="submission-note">We’ll save your enquiry first. WhatsApp will then open with your answers ready—tap Send to share them with our team.</p>
          <p className="privacy-note">We’ll use your details to respond to your enquiry about the program.</p>
        </fieldset>
      )}

      <div className="form-error" role="alert" aria-live="assertive">{error}</div>
      <div className="form-actions">
        {step === 2 && <button className="button button-back" type="button" onClick={() => { setStep(1); setError(""); }}><ArrowLeft aria-hidden="true" /> Back</button>}
        {step === 1 ? <button className="button button-primary" type="button" onClick={continueToStepTwo}>Continue <span aria-hidden="true">→</span></button>
          : <button className="button button-primary submit-button" type="button" onClick={submit} disabled={submitting}>{submitting ? "Saving your enquiry…" : "Submit & Chat on WhatsApp →"}</button>}
      </div>
    </form>
  );
}

function Choice({ type, name, value, checked, onChange }: { type: "radio" | "checkbox"; name: string; value: string; checked: boolean; onChange: () => void }) {
  return <label className={`choice-row ${checked ? "selected" : ""}`}><input type={type} name={name} value={value} checked={checked} onChange={onChange} /><span>{value}</span><span className="choice-check" aria-hidden="true"><Check /></span></label>;
}
