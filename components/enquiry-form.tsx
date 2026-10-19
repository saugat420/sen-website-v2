"use client";

import { useState } from "react";
import { ArrowLeft, Check, Mail, Phone, UserRound } from "lucide-react";

type FormState = {
  enquiryId: string;
  name: string;
  email: string;
  phone: string;
  level: string;
  challenges: string[];
  eagerness: string;
  website: string;
};

const levels = [
  "Beginner — I know a few words.",
  "Basic — I can make simple sentences.",
  "Intermediate — I understand, but struggle to speak.",
  "Confident — I want to become more fluent.",
];

const challenges = [
  "My mind goes blank.",
  "I translate in my head.",
  "I worry about mistakes.",
  "I struggle to find words.",
  "I lack confidence.",
  "I need more speaking practice.",
  "I struggle with pronunciation.",
];

const eagernessOptions = [
  "Just exploring my options.",
  "Ready to make time for daily practice.",
  "Very eager — I want to start soon.",
];

const newEnquiryId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `sen-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const emptyForm = (): FormState => ({
  enquiryId: newEnquiryId(), name: "", email: "", phone: "", level: "", challenges: [], eagerness: "", website: "",
});

export function EnquiryForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ whatsappUrl: string } | null>(null);
  const [startedAt] = useState(() => Date.now());

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
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Please enter a valid email address.";
      if (!/^\+[1-9]\d{7,14}$/.test(form.phone.replace(/[\s()-]/g, ""))) return "Enter your WhatsApp number with country code, for example +977 98XXXXXXXX.";
    }
    if (currentStep === 2) {
      if (!form.level) return "Please choose your English level.";
      if (form.challenges.length === 0) return "Choose at least one speaking challenge.";
    }
    if (currentStep === 3 && !form.eagerness) return "Please tell us how eager you are to improve.";
    return "";
  };

  const continueTo = (nextStep: number) => {
    const message = validateStep(step);
    if (message) { setError(message); return; }
    setStep(nextStep); setError("");
  };

  const submit = async () => {
    const message = validateStep(3);
    if (message) { setError(message); return; }
    setSubmitting(true); setError("");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, formStartedAt: startedAt }),
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
      <p className="eyebrow">Enquiry saved</p>
      <h3>Your answers are ready.</h3>
      <p>On WhatsApp, tap <strong>Send</strong> to share them with Spoken English Nepal.</p>
      <a className="button button-primary" href={success.whatsappUrl}>Open WhatsApp</a>
    </div>
  );

  return (
    <form className="form-shell" onSubmit={(event) => event.preventDefault()} noValidate>
      <div className="form-progress">
        <div><span>Step {step} of 3</span><span>{Math.round((step / 3) * 100)}%</span></div>
        <div className="progress-track" aria-hidden="true"><span style={{ width: `${(step / 3) * 100}%` }} /></div>
      </div>

      {step === 1 && (
        <fieldset>
          <legend>First, let’s meet you.</legend>
          <p className="form-hint">Tell us where to send program details.</p>
          <label className="field-label"><span><UserRound aria-hidden="true" /> Your name</span><input autoComplete="name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full name" required /></label>
          <label className="field-label"><span><Mail aria-hidden="true" /> Email address</span><input type="email" autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" required /></label>
          <label className="field-label"><span><Phone aria-hidden="true" /> WhatsApp number</span><input type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+977 98XXXXXXXX" required /></label>
          <label className="honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} /></label>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset>
          <legend>Where do you get stuck?</legend>
          <div className="question-group"><h4>Your English level</h4><div className="choice-list">
            {levels.map((option) => <Choice key={option} type="radio" name="level" value={option} checked={form.level === option} onChange={() => update("level", option)} />)}
          </div></div>
          <div className="question-group"><h4>Your challenges</h4><p className="select-hint">Select all that apply.</p><div className="choice-list compact">
            {challenges.map((option) => <Choice key={option} type="checkbox" name="challenges" value={option} checked={form.challenges.includes(option)} onChange={() => toggleChallenge(option)} />)}
          </div></div>
        </fieldset>
      )}

      {step === 3 && (
        <fieldset>
          <legend>Ready to give it a go?</legend>
          <div className="question-group"><h4>How eager are you to improve?</h4><div className="choice-list">
            {eagernessOptions.map((option) => <Choice key={option} type="radio" name="eagerness" value={option} checked={form.eagerness === option} onChange={() => update("eagerness", option)} />)}
          </div></div>
          <div className="summary-card">
            <div className="summary-title"><strong>Your enquiry</strong><button type="button" onClick={() => setStep(1)}>Edit answers</button></div>
            <dl><div><dt>Name</dt><dd>{form.name}</dd></div><div><dt>Level</dt><dd>{form.level}</dd></div><div><dt>Challenges</dt><dd>{form.challenges.join(", ")}</dd></div></dl>
          </div>
          <p className="consent">We’ll save your details and contact you about the program. On WhatsApp, tap Send to share your answers. This is an enquiry, not a payment or confirmed enrolment.</p>
        </fieldset>
      )}

      <div className="form-error" role="alert" aria-live="assertive">{error}</div>
      <div className="form-actions">
        {step > 1 && <button className="button button-back" type="button" onClick={() => { setStep(step - 1); setError(""); }}><ArrowLeft aria-hidden="true" /> Back</button>}
        {step < 3 ? <button className="button button-primary" type="button" onClick={() => continueTo(step + 1)}>Continue <span aria-hidden="true">→</span></button>
          : <button className="button button-primary submit-button" type="button" onClick={submit} disabled={submitting}>{submitting ? "Saving your enquiry…" : "Submit & chat on WhatsApp"}</button>}
      </div>
    </form>
  );
}

function Choice({ type, name, value, checked, onChange }: { type: "radio" | "checkbox"; name: string; value: string; checked: boolean; onChange: () => void }) {
  return <label className={`choice-row ${checked ? "selected" : ""}`}><input type={type} name={name} value={value} checked={checked} onChange={onChange} /><span>{value}</span><span className="choice-check" aria-hidden="true"><Check /></span></label>;
}
