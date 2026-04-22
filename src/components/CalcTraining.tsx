import { useState } from 'react';
import calcData from '../data/calc-training.json';

interface CalcQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  cheatsheet: string;
  steps: string[];
}

const STATS_KEY = 'se-calc-stats';

const categories = [...new Set((calcData as CalcQuestion[]).map(q => q.category))];

export default function CalcTraining() {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [questions, setQuestions] = useState<CalcQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [mode, setMode] = useState<'menu' | 'quiz' | 'results'>('menu');
  const [score, setScore] = useState(0);
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const [stats, setStats] = useState<Record<string, {correct:number;total:number}>>(() => {
    try { return JSON.parse(localStorage.getItem(STATS_KEY) || '{}'); } catch { return {}; }
  });

  const saveStats = (cat: string, correct: number, total: number) => {
    const s = { ...stats };
    if (!s[cat]) s[cat] = { correct: 0, total: 0 };
    s[cat].correct += correct;
    s[cat].total += total;
    setStats(s);
    localStorage.setItem(STATS_KEY, JSON.stringify(s));
  };

  const startQuiz = (cat: string) => {
    setSelectedCat(cat);
    let pool = (calcData as CalcQuestion[]);
    if (cat !== 'all') pool = pool.filter(q => q.category === cat);
    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
    setCurrent(0);
    setSelected(null);
    setShowAnswer(false);
    setShowCheatsheet(false);
    setScore(0);
    setMode('quiz');
  };

  const handleSelect = (idx: number) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
    if (idx === questions[current].answer) setScore(s => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      saveStats(selectedCat === 'all' ? 'All Calc' : selectedCat, score, questions.length);
      setMode('results');
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowAnswer(false);
      setShowCheatsheet(false);
    }
  };

  if (mode === 'results') {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="p-4 max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2" style={{ color: pct >= 80 ? '#4ade80' : pct >= 60 ? '#fbbf24' : '#f87171' }}>{pct}%</h2>
        <p className="text-[#a0a0c0] mb-6">{score} / {questions.length}</p>
        <button onClick={() => setMode('menu')} className="px-6 py-3 rounded-lg font-semibold" style={{ background: '#e67e22' }}>Back</button>
      </div>
    );
  }

  if (mode === 'quiz' && questions.length > 0) {
    const q = questions[current];
    return (
      <div className="p-4 max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-[#a0a0c0]">{current + 1} / {questions.length}</span>
          <span className="text-sm px-2 py-1 rounded" style={{ background: '#1a1a3e' }}>{q.category}</span>
        </div>
        <button onClick={() => setShowCheatsheet(!showCheatsheet)} className="w-full mb-4 p-2 rounded-lg text-sm text-left" style={{ background: '#1a1a3e' }}>
          {showCheatsheet ? 'Hide' : 'Show'} Cheatsheet
        </button>
        {showCheatsheet && (
          <div className="mb-4 p-3 rounded-lg text-sm whitespace-pre-wrap" style={{ background: '#1a1a3e', color: '#c0c0e0' }}>
            {q.cheatsheet}
          </div>
        )}
        <p className="text-lg font-medium mb-6">{q.question}</p>
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let cls = 'border-2 rounded-lg p-4 text-left transition-all cursor-pointer w-full';
            if (showAnswer) {
              if (i === q.answer) cls += ' border-green-500 bg-green-500/10';
              else if (i === selected && i !== q.answer) cls += ' border-red-500 bg-red-500/10';
              else cls += ' border-[#1a1a3e] opacity-50';
            } else {
              cls += ' border-[#1a1a3e] hover:border-[#f39c12]';
            }
            return (
              <button key={i} onClick={() => handleSelect(i)} className={cls}>
                <span className="text-sm mr-2 text-[#a0a0c0]">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            );
          })}
        </div>
        {showAnswer && (
          <div className="mt-6 space-y-3">
            <div className="p-4 rounded-lg" style={{ background: '#1a1a3e' }}>
              <p className="text-sm mb-2" style={{ color: selected === q.answer ? '#4ade80' : '#f87171' }}>
                {selected === q.answer ? 'Correct!' : `Answer: ${String.fromCharCode(65 + q.answer)}`}
              </p>
              <p className="text-sm text-[#a0a0c0]">{q.explanation}</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: '#1a1a3e' }}>
              <p className="text-sm font-semibold mb-2" style={{ color: '#f39c12' }}>Step-by-step:</p>
              {q.steps.map((step, i) => (
                <p key={i} className="text-sm text-[#a0a0c0] mb-1">{i + 1}. {step}</p>
              ))}
            </div>
          </div>
        )}
        {showAnswer && (
          <button onClick={next} className="mt-4 w-full py-3 rounded-lg font-semibold" style={{ background: '#e67e22' }}>
            {current + 1 >= questions.length ? 'See Results' : 'Next'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Calculation Training</h2>
      <button onClick={() => startQuiz('all')} className="w-full text-left p-4 rounded-lg border border-[#1a1a3e] hover:border-[#f39c12] transition-all mb-4">
        <span className="font-semibold">All Categories</span>
        <span className="text-sm text-[#a0a0c0] block">{(calcData as CalcQuestion[]).length} questions</span>
      </button>
      <div className="space-y-2">
        {categories.map(cat => {
          const count = (calcData as CalcQuestion[]).filter(q => q.category === cat).length;
          const s = stats[cat];
          return (
            <button key={cat} onClick={() => startQuiz(cat)} className="w-full text-left p-3 rounded-lg border border-[#1a1a3e] hover:border-[#f39c12] transition-all">
              <span className="font-medium">{cat}</span>
              <span className="text-sm text-[#a0a0c0] block">{count} questions{s ? ` | ${Math.round((s.correct/s.total)*100)}%` : ''}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
