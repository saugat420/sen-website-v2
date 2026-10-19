import Image from "next/image";
import {
  CalendarDays,
  ClipboardCheck,
  Globe2,
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
  { kind: "blank" as const, title: "Your mind goes blank." },
  { kind: "translate" as const, title: "You translate every word." },
  { kind: "mistakes" as const, title: "You worry about mistakes." },
];

const benefits = [
  { kind: "class" as const, icon: Video, title: "Daily live classes", copy: "Learn English you can use." },
  { kind: "practice" as const, icon: MessageCircleMore, title: "Daily speaking practice", copy: "Speak more. Build confidence." },
  { kind: "assignment" as const, icon: ClipboardCheck, title: "Daily assignments", copy: "Turn practice into a habit." },
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
          <a href="#challenges">The struggle</a>
          <a href="#program">The program</a>
        </nav>
        <a className="button button-small" href="#enquire">Enquire now</a>
      </header>

      <section className="hero section" id="top">
        <div className="hero-copy">
          <p className="eyebrow">English Fluency Launchpad</p>
          <h1>Stop getting stuck.<br /><span>Start speaking.</span></h1>
          <p className="hero-lede">Build your English confidence with daily live classes and speaking practice.</p>
          <a className="button button-primary" href="#enquire">Explore the program <span aria-hidden="true">↓</span></a>
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
          <h2>Want to speak.<br />But get stuck?</h2>
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
          <p>You don’t need perfect English.<br /><strong>You need more chances to speak.</strong></p>
        </div>
      </section>

      <section className="program-section" id="program">
        <div className="section program-inner">
          <div className="program-heading">
            <div><p className="eyebrow">A daily rhythm that helps</p><h2>English Fluency<br />Launchpad</h2></div>
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
          <div className="program-cta"><p>Curious how it fits your goals?</p><a className="button button-primary" href="#enquire">Is this right for me? <span aria-hidden="true">→</span></a></div>
        </div>
      </section>

      <section className="section enquiry-section" id="enquire">
        <div className="enquiry-intro">
          <p className="eyebrow">Start with a conversation</p>
          <h2>Your voice is<br /><span>worth finding.</span></h2>
          <p>Ask us about the program, fees, and class timings.</p>
          <div className="enquiry-doodle" aria-hidden="true"><PracticeIllustration /></div>
        </div>
        <EnquiryForm />
      </section>

      <footer>
        <a className="brand" href="#top"><Image src="/sen-logo.png" alt="" width={44} height={44} /><span>Spoken English Nepal</span></a>
        <p>© {new Date().getFullYear()} Spoken English Nepal</p>
      </footer>
    </main>
  );
}
