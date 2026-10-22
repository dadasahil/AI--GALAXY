import { useState } from "react";
import { tools } from "../data/tools";
import ToolCard from "../components/ToolCard";

const goalToCategory = {
  Coding: "Coding & Dev Tools",
  "Data Analysis": "Data & Analytics",
  Design: "Image & Design",
  Marketing: "Writing",
  Study: "Research",
  "Video Editing": "Video",
};

const questions = [
  { key: "goal", question: "What do you want to do?", options: Object.keys(goalToCategory) },
  { key: "experience", question: "What's your experience level?", options: ["Beginner", "Intermediate", "Advanced"] },
  { key: "budget", question: "What's your budget?", options: ["Free only", "Willing to pay"] },
  { key: "platform", question: "Preferred platform?", options: ["Web", "Desktop app", "No preference"] },
  { key: "teamSize", question: "Who's this for?", options: ["Just me", "A small team", "A whole company"] },
];

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  function answer(key, value) {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setDone(false);
  }

  const category = goalToCategory[answers.goal];
  const budgetFree = answers.budget === "Free only";

  const recommendations = tools
    .filter((t) => t.category === category)
    .filter((t) => !budgetFree || t.pricing !== "Paid")
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-cyan-glow">AI recommendation engine</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-star-100 sm:text-4xl">Find the Best AI for Me</h1>
      <p className="mt-3 text-sm text-star-500">Answer five quick questions and we'll map you to the right tools.</p>

      {!done ? (
        <div className="mt-10 glass rounded-2xl p-8">
          <div className="mb-6 flex gap-1.5">
            {questions.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-gradient-to-r from-violet-glow to-cyan-glow" : "bg-white/10"}`} />
            ))}
          </div>
          <p className="font-mono text-xs text-star-500">Question {step + 1} of {questions.length}</p>
          <h2 className="mt-2 font-display text-xl font-semibold text-star-100">{questions[step].question}</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {questions[step].options.map((opt) => (
              <button
                key={opt}
                onClick={() => answer(questions[step].key, opt)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-left text-sm font-medium text-star-100 transition-colors hover:border-violet-glow hover:bg-violet-glow/10"
              >
                {opt}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="mt-6 font-mono text-xs text-star-500 hover:text-star-100">
              ← Back
            </button>
          )}
        </div>
      ) : (
        <div className="mt-10">
          <div className="glass rounded-2xl p-6">
            <p className="text-sm text-star-500">
              Based on wanting to do <span className="text-star-100">{answers.goal}</span> as
              a{answers.experience === "Advanced" ? "n" : ""} <span className="text-star-100">{answers.experience.toLowerCase()}</span>,
              {" "}here's your personalized shortlist:
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {recommendations.length > 0 ? recommendations.map((t) => <ToolCard key={t.id} tool={t} />) : (
              <p className="text-star-500">No exact match — try adjusting your budget answer.</p>
            )}
          </div>
          <button onClick={restart} className="mt-8 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium hover:bg-white/5">
            ↺ Retake the quiz
          </button>
        </div>
      )}
    </div>
  );
}
