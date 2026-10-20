import Image from "next/image";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Globe2,
  Laptop2,
  MessageCircleMore,
  UsersRound,
  Video,
} from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";
import {
  ChallengeIllustration,
  ConversationIllustration,
  PracticeIllustration,
  ProgramIllustration,
} from "@/components/illustrations";

const trustItems = [
  { icon: CalendarDays, label: "Since 2020" },
  { icon: UsersRound, label: "5,000+ learners" },
  { icon: Globe2, label: "Nepal & beyond" },
];

const challenges = [
  { kind: "blank" as const, title: "Your mind goes blank when someone speaks to you." },
  { kind: "translate" as const, title: "You translate every sentence before answering." },
  { kind: "mistakes" as const, title: "You stay quiet because you’re afraid of making mistakes." },
];

const benefits = [
  { kind: "class" as const, icon: Video, title: "Daily live classes", copy: "Join your trainer on Zoom for step-by-step lessons five days a week. Live classes run every day except Wednesday and Saturday." },
  { kind: "practice" as const, icon: MessageCircleMore, title: "Daily speaking practice", copy: "Use what you learn by speaking with other members in a supportive, judgement-free session. Speak freely, make mistakes and keep building fluency." },
  { kind: "assignment" as const, icon: ClipboardCheck, title: "Daily assignments", copy: "Complete a short five-to-ten-minute task each day. Small, consistent practice helps turn what you learn into a lasting habit." },
];

const details = [
  { icon: CalendarDays, label: "Program duration", value: "Two months" },
  { icon: Laptop2, label: "Format", value: "Live online classes" },
  { icon: CheckCircle2, label: "Frequency", value: "Daily live classes and speaking practice" },
  { icon: Clock3, label: "Available timings", value: "Ask us about available class timings" },
  { icon: MessageCircleMore, label: "Program fee", value: "Contact us for the current program fee" },
];

const faqs = [
  { question: "What is English Fluency Launchpad?", answer: "A two-month English speaking program with daily live classes, speaking practice and assignments." },
  { question: "Is this right for my English level?", answer: "Tell us about your current level and where you get stuck. Our team will help you understand whether the program is a suitable fit." },
  { question: "Will I become fluent in two months?", answer: "The program gives you structured opportunities to practise. Progress depends on your starting level, attendance and practice. We do not promise instant or guaranteed fluency." },
  { question: "What are the fees and class timings?", answer: "Check the program details above, or send an enquiry for the current fee and available timings." },
  { question: "What happens after I submit an enquiry?", answer: "Your enquiry is saved, then WhatsApp opens with your answers ready. Tap Send to share them with our team and discuss the program." },
  { question: "Does submitting the form enrol me?", answer: "No. It is an enquiry. You can ask questions and understand the program before deciding whether to join." },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Spoken English Nepal home">
          <Image src="/sen-logo.png" alt="" width={48} height={48} priority />
          <span>Spoken English Nepal</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#how-it-works">How It Works</a>
          <a href="#faq">FAQs</a>
        </nav>
        <a className="button button-small" href="#enquire">Get Program Details</a>
      </header>

      <section className="hero section" id="top">
        <div className="hero-copy">
          <h1>Understand English,<br /><span>but struggle to speak?</span></h1>
          <p className="hero-lede">Build your English confidence through a two-month program with daily live classes and guided speaking practice.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#how-it-works">See How the Program Works <span aria-hidden="true">↓</span></a>
            <a className="text-link" href="#enquire">Ask About the Program <span aria-hidden="true">→</span></a>
          </div>
        </div>
        <div className="hero-art"><ConversationIllustration /></div>
      </section>

      <div className="trust-strip" aria-label="Our experience and reach">
        {trustItems.map(({ icon: Icon, label }) => (
          <div className="trust-item" key={label}><Icon aria-hidden="true" /><strong>{label}</strong></div>
        ))}
      </div>

      <section className="section challenges" id="challenges">
        <div className="section-heading">
          <p className="eyebrow">Sound familiar?</p>
          <h2>You know what you want to say.<br /><span>But the words don’t come out.</span></h2>
        </div>
        <div className="challenge-grid">
          {challenges.map((challenge, index) => (
            <article className="challenge-card" key={challenge.title}>
              <span className="card-number" aria-hidden="true">0{index + 1}</span>
              <ChallengeIllustration kind={challenge.kind} />
              <h3>{challenge.title}</h3>
            </article>
          ))}
        </div>
        <div className="reframe">
          <MessageCircleMore aria-hidden="true" />
          <p>You don’t need to wait for perfect English to start practising.</p>
        </div>
      </section>

      <section className="program-section" id="how-it-works">
        <div className="section program-inner">
          <div className="program-heading">
            <div>
              <p className="eyebrow">2 month program</p>
              <h2>What’s inside the launchpad?</h2>
              <p className="section-intro">English Fluency Launchpad gives you a regular place to learn and practise speaking over two months.</p>
            </div>
            <div className="duration"><CalendarDays aria-hidden="true" /><span>A two-month<br /><strong>speaking program</strong></span></div>
          </div>
          <div className="benefit-list">
            {benefits.map(({ kind, icon: Icon, title, copy }, index) => (
              <article className="benefit-row" key={title}>
                <div className="benefit-art">{kind === "practice" ? <PracticeIllustration /> : <ProgramIllustration kind={kind} />}</div>
                <div className="benefit-copy">
                  <span className="benefit-icon"><Icon aria-hidden="true" /></span><span className="benefit-index">0{index + 1}</span>
                  <h3>{title}</h3><p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section details-section" id="program-details">
        <div className="details-heading">
          <p className="eyebrow">The practical details</p>
          <h2>Know what<br />you’re joining.</h2>
          <p>Start with the facts. Ask us about anything that depends on the current batch.</p>
        </div>
        <div className="details-list">
          {details.map(({ icon: Icon, label, value }) => (
            <div className="detail-row" key={label}>
              <Icon aria-hidden="true" />
              <div><span>{label}</span><strong>{value}</strong></div>
            </div>
          ))}
          <a className="button button-primary" href="#enquire">Check If the Program Fits Me <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="section faq-inner">
          <div className="faq-heading"><p className="eyebrow">Before you enquire</p><h2>Questions are<br />welcome.</h2></div>
          <div className="faq-list">
            {faqs.map(({ question, answer }) => (
              <details key={question}>
                <summary><span>{question}</span><ChevronDown aria-hidden="true" /></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section enquiry-section" id="enquire">
        <div className="enquiry-intro">
          <p className="eyebrow">Let’s find your next step</p>
          <h2>Want to feel more confident<br /><span>speaking English?</span></h2>
          <p>Tell us where you get stuck. We’ll help you understand the program, fees and available class timings.</p>
          <p className="reassurance"><CheckCircle2 aria-hidden="true" /> This is an enquiry—not a payment or confirmed enrolment.</p>
          <div className="enquiry-doodle" aria-hidden="true"><PracticeIllustration /></div>
        </div>
        <EnquiryForm />
      </section>

      <footer>
        <a className="brand" href="#top"><Image src="/sen-logo.png" alt="" width={44} height={44} /><span>Spoken English Nepal</span></a>
        <div className="footer-meta">
          <nav className="footer-links" aria-label="Policies">
            <a href="/refund-policy">Refund Policy</a>
            <a href="/privacy-policy">Privacy Policy</a>
          </nav>
          <p>© {new Date().getFullYear()} Spoken English Nepal</p>
        </div>
      </footer>
    </main>
  );
}
