import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Spoken English Nepal",
  description: "How Spoken English Nepal handles information submitted through its enquiry form.",
};

export default function PrivacyPolicy() {
  return (
    <main className="policy-page">
      <header className="policy-header">
        <Link className="brand" href="/" aria-label="Spoken English Nepal home">
          <Image src="/sen-logo.png" alt="" width={48} height={48} priority />
          <span>Spoken English Nepal</span>
        </Link>
        <Link className="policy-back" href="/">← Back to home</Link>
      </header>

      <article className="policy-content">
        <p className="eyebrow">Spoken English Nepal</p>
        <h1>Privacy Policy</h1>
        <p className="policy-updated">Last updated: 20 October 2026</p>

        <section>
          <h2>Information we collect</h2>
          <p>When you send an enquiry, we may collect your name, WhatsApp number, optional email address, English level, selected speaking challenges and basic submission details such as the date and enquiry reference.</p>
        </section>

        <section>
          <h2>How we use your information</h2>
          <p>We use this information to respond to your enquiry, understand what support you need and share relevant details about the program, fees, timings and next steps. Submitting the form does not automatically enrol you or subscribe you to promotional messages.</p>
        </section>

        <section>
          <h2>Services used to handle enquiries</h2>
          <p>Your form answers may be saved to a private enquiry record and prepared as a WhatsApp message. WhatsApp opens on your device, and you choose whether to send that message. These services process information under their own privacy policies.</p>
        </section>

        <section>
          <h2>Your choices</h2>
          <p>You may choose not to provide the optional email address. You can also contact the Spoken English Nepal team through the same channel you used for your enquiry to ask about the personal information you submitted or request its correction or deletion.</p>
        </section>

        <section>
          <h2>Policy changes</h2>
          <p>We may update this policy when the enquiry process or the services we use change. The latest version will be published on this page with its updated date.</p>
        </section>
      </article>

      <footer className="policy-footer"><p>© 2026 Spoken English Nepal</p></footer>
    </main>
  );
}
