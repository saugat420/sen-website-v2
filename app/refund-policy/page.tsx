import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy | Spoken English Nepal",
  description: "The seven-day refund policy for the Spoken English Nepal program.",
};

export default function RefundPolicy() {
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
        <h1>Refund Policy</h1>
        <p className="policy-updated">Last updated: 20 October 2026</p>

        <section>
          <h2>Seven-day refund period</h2>
          <p>We offer a seven-day refund period for the program. If you decide the program is not right for you, you may request a refund within seven calendar days of joining the program.</p>
        </section>

        <section>
          <h2>How to request a refund</h2>
          <p>Contact the Spoken English Nepal team through the same channel you used to enrol. Please share the name and phone number used for your enrolment, along with your payment details, so we can identify your payment and review the request.</p>
        </section>

        <section>
          <h2>After seven days</h2>
          <p>Requests made after the seven-day refund period are not covered by this policy.</p>
        </section>

        <section>
          <h2>Refund processing</h2>
          <p>Approved refunds will be returned through an available payment method. The time needed for the money to appear may depend on the payment provider.</p>
        </section>
      </article>

      <footer className="policy-footer"><p>© 2026 Spoken English Nepal</p></footer>
    </main>
  );
}
