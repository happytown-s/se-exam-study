import { useState } from 'react';
import examData from '../data/se-exam.json';

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const WRONG_KEY = 'se-quiz-wrong';
const STATS_KEY = 'se-quiz-stats';

const categoryNames: Record<string, string> = {
  'Requirements Definition': '要求定義',
  'System Architecture': 'システムアーキテクチャ',
  'Software Design': 'ソフトウェア設計',
  'Database Design': 'データベース設計',
  'UI/UX Design': 'UI/UX設計',
  'API Design': 'API設計',
  'Performance Design': '性能設計',
  'Security Design': 'セキュリティ設計',
  'Cloud Architecture': 'クラウドアーキテクチャ',
  'Testing Strategy': 'テスト戦略',
};

const categories = [...new Set((examData as Question[]).map(q => q.category))];

export default function Quiz() {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [mode, setMode] = useState<'menu' | 'quiz' | 'wrong' | 'results'>('menu');
  const [score, setScore] = useState(0);
  const [wrongIds, setWrongIds] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(WRONG_KEY) || '[]'); } catch { return []; }
  });
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
    let pool = (examData as Question[]);
    if (cat === 'wrong') {
      pool = pool.filter(q => wrongIds.includes(q.id));
      if (pool.length === 0) { alert('No wrong questions yet!'); return; }
    } else if (cat !== 'all') {
      pool = pool.filter(q => q.category === cat);
    }
    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, 25);
    setQuestions(shuffled);
    setCurrent(0);
    setSelected(null);
    setShowAnswer(false);
    setScore(0);
    setMode('quiz');
  };

  const handleSelect = (idx: number) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
    const q = questions[current];
    const isCorrect = idx === q.answer;
    if (isCorrect) setScore(s => s + 1);
    else {
      const newWrong = [...new Set([...wrongIds, q.id])];
      setWrongIds(newWrong);
      localStorage.setItem(WRONG_KEY, JSON.stringify(newWrong));
    }
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      saveStats(selectedCat === 'wrong' ? 'Wrong Review' : (selectedCat === 'all' ? 'All' : selectedCat), score, questions.length);
      setMode('results');
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowAnswer(false);
    }
  };

  const catLabel = (cat: string) => categoryNames[cat] || cat;

  if (mode === 'results') {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="p-4 max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2" style={{ color: pct >= 80 ? '#4ade80' : pct >= 60 ? '#fbbf24' : '#f87171' }}>
            {pct}%
          </h2>
          <p className="text-[#a0a0c0]">{score} / {questions.length} 正解</p>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => setMode('menu')} className="px-6 py-3 rounded-lg font-semibold" style={{ background: '#e67e22' }}>メニューに戻る</button>
          <button onClick={() => startQuiz(selectedCat)} className="px-6 py-3 rounded-lg font-semibold border border-[#e67e22]">再挑戦</button>
        </div>
      </div>
    );
  }

  if (mode === 'quiz' && questions.length > 0) {
    const q = questions[current];
    return (
      <div className="p-4 max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-[#a0a0c0]">{current + 1} / {questions.length}</span>
          <span className="text-sm px-2 py-1 rounded" style={{ background: '#1a1a3e' }}>{catLabel(q.category)}</span>
        </div>
        <div className="w-full h-2 rounded-full mb-6" style={{ background: '#1a1a3e' }}>
          <div className="h-2 rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%`, background: '#e67e22' }}></div>
        </div>
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
          <div className="mt-6 p-4 rounded-lg" style={{ background: '#1a1a3e' }}>
            <p className="text-sm mb-2" style={{ color: selected === q.answer ? '#4ade80' : '#f87171' }}>
              {selected === q.answer ? '正解!' : `不正解。正解: ${String.fromCharCode(65 + q.answer)}`}
            </p>
            <p className="text-sm text-[#a0a0c0]">{q.explanation}</p>
          </div>
        )}
        {showAnswer && (
          <button onClick={next} className="mt-4 w-full py-3 rounded-lg font-semibold" style={{ background: '#e67e22' }}>
            {current + 1 >= questions.length ? '結果を見る' : '次へ'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">システム設計専門試験</h2>
      <div className="space-y-2 mb-6">
        <button onClick={() => startQuiz('all')} className="w-full text-left p-4 rounded-lg border border-[#1a1a3e] hover:border-[#f39c12] transition-all">
          <span className="font-semibold">全カテゴリ</span>
          <span className="text-sm text-[#a0a0c0] block">{(examData as Question[]).length} 問</span>
        </button>
        <button onClick={() => startQuiz('wrong')} className="w-full text-left p-4 rounded-lg border border-[#1a1a3e] hover:border-[#f39c12] transition-all">
          <span className="font-semibold">不正解復習</span>
          <span className="text-sm text-[#a0a0c0] block">{wrongIds.length} 問を復習</span>
        </button>
      </div>
      <h3 className="text-sm font-semibold text-[#a0a0c0] uppercase mb-3">カテゴリ</h3>
      <div className="space-y-2">
        {categories.map(cat => {
          const count = (examData as Question[]).filter(q => q.category === cat).length;
          const s = stats[cat];
          return (
            <button key={cat} onClick={() => startQuiz(cat)} className="w-full text-left p-3 rounded-lg border border-[#1a1a3e] hover:border-[#f39c12] transition-all">
              <span className="font-medium">{catLabel(cat)}</span>
              <span className="text-sm text-[#a0a0c0] block">{count} 問{s ? ` | ${Math.round((s.correct/s.total)*100)}%` : ''}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
