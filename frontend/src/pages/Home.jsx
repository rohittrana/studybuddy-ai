import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import "./Home.css";

const HighlightStroke = ({ children, color = "var(--highlight)" }) => (
  <span className="highlight-stroke">
    {children}
    <svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M2 12 C 40 18, 90 6, 130 11 S 180 16, 198 9"
        stroke={color}
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
    </svg>
  </span>
);

const features = [
  {
    tag: "upload",
    title: "Drop in your notes",
    body: "PDF lecture slides, scanned readings, typed notes — upload once, and it's ready to work with.",
  },
  {
    tag: "ask",
    title: "Ask it anything",
    body: "Chat with your own material. Answers are grounded in what you uploaded, not the open internet.",
  },
  {
    tag: "review",
    title: "Instant summaries",
    body: "Get the whole document distilled into clear, organized bullet points before an exam.",
  },
  {
    tag: "practice",
    title: "Quizzes & flashcards",
    body: "Auto-generated from your notes, so what you practice is exactly what you'll be tested on.",
  },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__inner">
          <p className="eyebrow">// study smarter, not longer</p>
          <h1 className="hero__title">
            Turn your notes into <HighlightStroke>answers</HighlightStroke>,{" "}
            <HighlightStroke color="var(--coral)">quizzes</HighlightStroke>, and{" "}
            <HighlightStroke>flashcards</HighlightStroke>.
          </h1>
          <p className="hero__subtitle">
            Upload a PDF. Ask questions in plain English. StudyBuddy AI reads your notes so you
            don't have to read them twice.
          </p>
          <div className="hero__actions">
            <Link to={user ? "/dashboard" : "/signup"} className="btn btn--primary">
              {user ? "Go to your notes" : "Start studying free"}
            </Link>
            {!user && (
              <Link to="/login" className="btn btn--ghost">
                I already have an account
              </Link>
            )}
          </div>
        </div>

        <div className="hero__card card" aria-hidden="true">
          <div className="hero__card-header">
            <span className="hero__dot" />
            <span className="hero__dot" />
            <span className="hero__dot" />
            <span className="hero__card-title">chapter-7-thermodynamics.pdf</span>
          </div>
          <div className="hero__card-body">
            <p className="hero__q">"What's the difference between enthalpy and entropy?"</p>
            <div className="hero__a">
              <span className="hero__a-label">StudyBuddy</span>
              <p>
                Enthalpy (H) measures total heat content of a system at constant pressure.
                Entropy (S) measures disorder — how energy is spread out...
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="features__title">Everything you need before exam day</h2>
        <div className="features__grid">
          {features.map((f, i) => (
            <div className="feature card" key={f.tag}>
              <span className="feature__index">0{i + 1}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
