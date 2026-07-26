import { useState } from "react";
import api from "../services/api.js";
import Loader from "./Loader.jsx";
import "./QuizView.css";

const QuizView = ({ documentId, documentReady }) => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateQuiz = async () => {
    setLoading(true);
    setError("");
    setSubmitted(false);
    setAnswers({});
    try {
      const { data } = await api.post(`/quizzes/${documentId}/generate`, { numQuestions: 5 });
      setQuiz(data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't generate a quiz. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (qIndex, option) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const score = quiz?.questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correctAnswer ? 1 : 0),
    0
  );

  if (loading) {
    return (
      <div className="quiz card">
        <Loader label="Writing quiz questions..." />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="quiz quiz--empty card">
        <p className="quiz__hand">Test yourself before the real thing.</p>
        <button className="btn btn--primary" onClick={generateQuiz} disabled={!documentReady}>
          {documentReady ? "Generate quiz" : "Processing document..."}
        </button>
        {error && <p className="quiz__error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="quiz card">
      <div className="quiz__header">
        <h3>{quiz.title}</h3>
        <button className="btn btn--ghost" onClick={generateQuiz}>
          New quiz
        </button>
      </div>

      <div className="quiz__questions">
        {quiz.questions.map((q, qi) => (
          <div className="quiz__question" key={qi}>
            <p className="quiz__question-text">
              <span className="quiz__question-num">{qi + 1}.</span> {q.question}
            </p>
            <div className="quiz__options">
              {q.options.map((opt) => {
                const isSelected = answers[qi] === opt;
                const isCorrect = opt === q.correctAnswer;
                let className = "quiz__option";
                if (isSelected) className += " quiz__option--selected";
                if (submitted && isCorrect) className += " quiz__option--correct";
                if (submitted && isSelected && !isCorrect) className += " quiz__option--incorrect";

                return (
                  <button
                    key={opt}
                    type="button"
                    className={className}
                    onClick={() => selectAnswer(qi, opt)}
                    disabled={submitted}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {submitted && q.explanation && (
              <p className="quiz__explanation">{q.explanation}</p>
            )}
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          className="btn btn--primary btn--block"
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length !== quiz.questions.length}
        >
          Check answers
        </button>
      ) : (
        <div className="quiz__score">
          You scored <strong>{score}</strong> out of <strong>{quiz.questions.length}</strong>
        </div>
      )}
    </div>
  );
};

export default QuizView;
