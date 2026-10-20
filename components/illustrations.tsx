type ChallengeKind = "blank" | "translate" | "mistakes";
type ProgramKind = "class" | "assignment";

const face = { fill: "#fff", stroke: "currentColor", strokeWidth: 5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function ConversationIllustration() {
  return (
    <svg className="illustration hero-illustration" viewBox="0 0 560 430" role="img" aria-labelledby="conversation-title conversation-desc">
      <title id="conversation-title">Two people enjoying an English conversation</title>
      <desc id="conversation-desc">One learner says they want to speak English fluently, and a friend says that is why we have SEN.</desc>
      <path className="accent-shape" d="M69 338C15 242 49 114 154 55c116-65 268-41 336 59 68 99 22 226-85 277-98 47-275 37-336-53Z" />
      <path className="scribble" d="M82 386c128 20 292 19 401-9" />
      <g><circle cx="189" cy="172" r="55" {...face} /><circle cx="172" cy="164" r="4" /><circle cx="207" cy="164" r="4" /><path d="M170 190c14 12 29 12 42-1M187 228v82m0-56-46 35m48-30 44 24m-46 26-30 70m31-69 40 65" {...face} fill="none" /><path d="M137 286c-5-18-3-34 5-48m-15 9 15-9 2 17" {...face} fill="none" /></g>
      <g><circle cx="369" cy="174" r="55" {...face} /><circle cx="352" cy="165" r="4" /><circle cx="386" cy="165" r="4" /><path d="M351 190c13 12 29 12 41-1M367 230v81m0-54-48 23m49-26 51 31m-52 25-39 66m40-65 28 68M418 284c14-14 20-29 18-46m-8 4 9-6 7 14" {...face} fill="none" /></g>
      <g className="speech-bubble speech-left"><path d="M57 76h113c17 0 30 13 30 30v22c0 17-13 30-30 30h-48l-23 22 2-22H57c-17 0-30-13-30-30v-22c0-17 13-30 30-30Z" /><text className="speech-long" x="113" textAnchor="middle"><tspan x="113" y="108">I want to speak</tspan><tspan x="113" y="130">English fluently.</tspan></text></g>
      <g className="speech-bubble speech-right"><path d="M384 47h120c17 0 30 13 30 30v24c0 17-13 30-30 30h-41l-2 23-22-23h-55c-17 0-30-13-30-30V77c0-17 13-30 30-30Z" /><text className="speech-long" x="444" textAnchor="middle"><tspan x="444" y="80">That’s why we</tspan><tspan x="444" y="102">have SEN.</tspan></text></g>
      <circle className="red-dot" cx="479" cy="238" r="13" /><path className="blue-mark" d="m75 208 19 9m-14-34 12 4" />
    </svg>
  );
}

export function ChallengeIllustration({ kind }: { kind: ChallengeKind }) {
  if (kind === "translate") return (
    <svg className="illustration challenge-illustration" viewBox="0 0 300 230" role="img" aria-label="A person thinking between Nepali and English">
      <circle cx="150" cy="84" r="45" {...face} /><circle cx="136" cy="78" r="3.5" /><circle cx="164" cy="78" r="3.5" /><path d="M138 101h24M149 129v46m0-25-45 18m46-17 43 18m-44 5-27 43m28-43 28 43" {...face} fill="none" />
      <path className="thought" d="M65 73c-19-5-24-30-6-40 7-15 30-15 38-1 18-3 27 20 14 31-6 8-17 10-27 9Z" /><text className="thought-text" x="83" y="57" textAnchor="middle">क</text>
      <path className="thought" d="M207 48c-9-18 11-36 28-29 13-11 34 1 29 18 15 10 5 34-13 33-13 8-29 0-31-13Z" /><text className="thought-text latin" x="237" y="52" textAnchor="middle">A</text><path className="blue-mark" d="m112 16 7 11m70-14-7 12" />
    </svg>
  );
  if (kind === "mistakes") return (
    <svg className="illustration challenge-illustration" viewBox="0 0 300 230" role="img" aria-label="A nervous person hesitating to speak">
      <circle cx="143" cy="77" r="45" {...face} /><circle cx="129" cy="72" r="3.5" /><circle cx="157" cy="72" r="3.5" /><path d="M130 98c9-8 18-8 27 0m-14 24 2 49m-2-27-39 28m40-29 35 31m-34-4-24 46m25-46 32 43m-71-48 23-16m49 20-23-18" {...face} fill="none" />
      <path className="speech-cloud" d="M210 47c-8-18 11-35 28-28 13-11 34 2 29 19 14 10 5 33-13 32-12 8-29 1-31-13Z" /><text className="dots" x="238" y="55" textAnchor="middle">…</text><path className="red-mark" d="m79 55-12-8m18-8-6-12m104 59 12-6" />
    </svg>
  );
  return (
    <svg className="illustration challenge-illustration" viewBox="0 0 300 230" role="img" aria-label="A confused person trying to find the words">
      <circle cx="145" cy="83" r="46" {...face} /><circle cx="131" cy="78" r="3.5" /><circle cx="158" cy="78" r="3.5" /><path d="M132 103c9-7 18-7 26 0m-13 26v45m0-26-44 9m45-8 44-4m-44 28-31 43m32-43 32 42M99 157c-2-16 2-29 13-40m78 28c1-15-5-28-17-38" {...face} fill="none" />
      <text className="question" x="225" y="75">?</text><path className="blue-mark" d="m77 75-18-1m23-17-14-10m99-24 9-13" />
    </svg>
  );
}

export function ProgramIllustration({ kind }: { kind: ProgramKind }) {
  if (kind === "assignment") return (
    <svg className="illustration program-illustration" viewBox="0 0 410 290" role="img" aria-label="A learner completing a practice checklist">
      <rect className="scene-fill" x="213" y="33" width="143" height="187" rx="14" /><path d="M245 78h80m-80 50h80m-80 51h80" {...face} fill="none" strokeWidth="4" /><path className="check" d="m224 70 9 9 15-20m-24 62 9 9 15-20m-24 62 9 9 15-20" />
      <circle cx="114" cy="91" r="48" {...face} /><circle cx="99" cy="85" r="3.5" /><circle cx="129" cy="85" r="3.5" /><path d="M99 111c10 8 21 8 31 0m-16 29v62m0-40-56 26m56-25 61 9m-61 29-31 66m32-65 40 61m19-91 41-34" {...face} fill="none" /><circle className="red-dot" cx="182" cy="166" r="8" />
    </svg>
  );
  return (
    <svg className="illustration program-illustration" viewBox="0 0 410 290" role="img" aria-label="A learner attending a live class on a laptop">
      <path className="desk" d="M41 226h330" /><rect className="scene-fill" x="190" y="49" width="169" height="121" rx="12" />
      <circle cx="274" cy="98" r="28" {...face} strokeWidth="4" /><circle cx="265" cy="94" r="2.5" /><circle cx="282" cy="94" r="2.5" /><path d="M265 110c6 5 13 5 19 0m-10 16v26m-1-14-25 13m26-13 24 13" {...face} fill="none" strokeWidth="4" /><path className="camera-light" d="m333 67 13-7v18l-13-6Z" />
      <circle cx="110" cy="103" r="47" {...face} /><circle cx="96" cy="97" r="3.5" /><circle cx="124" cy="97" r="3.5" /><path d="M96 121c9 8 20 8 29 0m-15 29v55m0-36-49 24m50-24 47 26m-48 9-30 52m31-51 35 50" {...face} fill="none" /><path className="blue-mark" d="m65 65-16-9m20-9-8-16" /><path className="laptop" d="M163 169h164l21 57H145Z" />
    </svg>
  );
}

export function PracticeIllustration() {
  return (
    <svg className="illustration program-illustration" viewBox="0 0 410 290" role="img" aria-label="Two people practicing a friendly conversation">
      <path className="scribble" d="M44 250c89 13 223 10 322-5" />
      <g><circle cx="116" cy="95" r="45" {...face} /><circle cx="103" cy="89" r="3.5" /><circle cx="130" cy="89" r="3.5" /><path d="M103 112c9 8 18 8 27 0m-14 27v65m0-42-50 26m51-26 48 22m-49 19-28 54m29-53 37 53" {...face} fill="none" /></g>
      <g><circle cx="289" cy="100" r="45" {...face} /><circle cx="276" cy="94" r="3.5" /><circle cx="303" cy="94" r="3.5" /><path d="M276 117c9 8 18 8 27 0m-14 28v60m0-38-48 18m49-19 45 27m-46 11-36 52m37-51 28 53" {...face} fill="none" /></g>
      <path className="mini-bubble blue" d="M152 34h70c10 0 18 8 18 18v17c0 10-8 18-18 18h-30l-14 13 2-13h-28c-10 0-18-8-18-18V52c0-10 8-18 18-18Z" /><path className="mini-bubble red" d="M274 27h57c10 0 18 8 18 18v13c0 10-8 18-18 18h-17l-2 13-13-13h-25c-10 0-18-8-18-18V45c0-10 8-18 18-18Z" />
    </svg>
  );
}
