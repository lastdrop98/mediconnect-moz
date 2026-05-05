import { useState } from "react";
import { EDU_CATEGORIES, EDU_ARTICLES, QUIZ } from "@/data/edu";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export default function EduPage() {
  const { setPage } = useApp();
  const [open, setOpen] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<Record<number, number>>({});
  const [showQuiz, setShowQuiz] = useState(false);
  const article = open ? EDU_ARTICLES[open] : null;
  const quiz = QUIZ[0];
  const correct = Object.entries(quizAnswered).filter(([i, a]) => quiz.questions[+i].correct === a).length;

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <section className="gradient-green text-white rounded-2xl p-6 shadow-elevated">
        <h2 className="font-display text-2xl font-bold">📚 Edu-Saúde</h2>
        <p className="opacity-90 mt-1">Saber é a melhor medicina. Aprenda a proteger a sua saúde e a sua família.</p>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {EDU_CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => setOpen(c.id)}
            className={cn("rounded-2xl p-5 text-white text-left shadow-card hover:shadow-elevated transition-shadow bg-gradient-to-br", c.color)}>
            <div className="text-4xl mb-2">{c.emoji}</div>
            <div className="font-semibold">{c.title}</div>
          </button>
        ))}
      </div>

      <button onClick={() => setShowQuiz((s) => !s)} className="w-full bg-card rounded-2xl p-5 shadow-card text-left hover:shadow-elevated transition-shadow flex items-center gap-3">
        <span className="text-3xl">🎯</span>
        <div className="flex-1">
          <div className="font-display font-bold">Quiz de Saúde — Malária</div>
          <div className="text-sm text-muted-foreground">Teste os seus conhecimentos com 5 perguntas</div>
        </div>
        <span className="text-primary font-semibold">{showQuiz ? "Esconder" : "Começar →"}</span>
      </button>

      {showQuiz && (
        <div className="bg-card rounded-2xl p-5 shadow-card space-y-4">
          <div className="font-semibold">Pontuação: {correct} / {quiz.questions.length}</div>
          {quiz.questions.map((qi, i) => {
            const ans = quizAnswered[i];
            return (
              <div key={i} className="border-t border-border pt-4">
                <div className="font-semibold mb-2">{i + 1}. {qi.q}</div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {qi.opts.map((o, j) => {
                    const answered = ans !== undefined;
                    const isCorrect = j === qi.correct;
                    const isPicked = ans === j;
                    return (
                      <button key={j} disabled={answered} onClick={() => setQuizAnswered((s) => ({ ...s, [i]: j }))}
                        className={cn("text-left p-3 rounded-xl text-sm border-2",
                          !answered ? "border-border hover:border-primary/50" :
                          isCorrect ? "border-success bg-success/10" :
                          isPicked ? "border-destructive bg-destructive/10" : "border-border opacity-50")}>
                        {o}
                      </button>
                    );
                  })}
                </div>
                {ans !== undefined && <p className="text-sm mt-2 text-muted-foreground">💡 {qi.explanation}</p>}
              </div>
            );
          })}
        </div>
      )}

      {article && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setOpen(null)}>
          <div className="bg-card rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto scrollbar-thin" onClick={(e) => e.stopPropagation()}>
            <div className="text-5xl mb-2">{article.emoji}</div>
            <h2 className="font-display font-extrabold text-2xl">{article.title}</h2>
            <div className="text-sm text-primary mb-4">{article.category}</div>

            <h3 className="font-semibold mt-4 mb-1">O que é?</h3>
            <p className="text-sm">{article.what}</p>

            <h3 className="font-semibold mt-4 mb-1">Como prevenir?</h3>
            <ul className="text-sm space-y-1">{article.prevention.map((p, i) => <li key={i}>✅ {p}</li>)}</ul>

            <h3 className="font-semibold mt-4 mb-1">Sintomas</h3>
            <p className="text-sm">{article.symptoms}</p>

            <div className="mt-4 bg-warning/10 border border-warning/30 rounded-xl p-3">
              <div className="font-bold text-warning">⚠️ Mito vs Realidade</div>
              <div className="text-sm mt-1"><strong>Mito:</strong> {article.myth.myth}</div>
              <div className="text-sm mt-1"><strong>Realidade:</strong> {article.myth.truth}</div>
            </div>

            <div className="mt-4 bg-destructive/10 rounded-xl p-3 text-sm">
              <strong>Quando ir ao médico:</strong> {article.whenDoctor}
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => { setOpen(null); setPage("ia"); }} className="flex-1 gradient-purple text-white rounded-xl py-2 font-semibold">🧠 Consultar Assistente IA</button>
              <button onClick={() => setOpen(null)} className="flex-1 border border-border rounded-xl py-2 font-semibold">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
