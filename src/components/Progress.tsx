import { useState, useEffect } from 'react';
import examData from '../data/se-exam.json';
import calcData from '../data/calc-training.json';
import subjectBData from '../data/subject-b-training.json';

interface Stats {
  correct: number;
  total: number;
}

interface Question {
  id: number;
  category: string;
}

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

export default function Progress() {
  const [quizStats, setQuizStats] = useState<Record<string, Stats>>({});
  const [calcStats, setCalcStats] = useState<Record<string, Stats>>({});
  const [bStats, setBStats] = useState<Record<string, Stats>>({});
  const [wrongIds, setWrongIds] = useState<number[]>([]);

  useEffect(() => {
    try { setQuizStats(JSON.parse(localStorage.getItem('se-quiz-stats') || '{}')); } catch {}
    try { setCalcStats(JSON.parse(localStorage.getItem('se-calc-stats') || '{}')); } catch {}
    try { setBStats(JSON.parse(localStorage.getItem('se-b-stats') || '{}')); } catch {}
    try { setWrongIds(JSON.parse(localStorage.getItem('se-quiz-wrong') || '[]')); } catch {}
  }, []);

  const getStatRow = (label: string, s: Stats | undefined, totalQ: number) => {
    if (!s || s.total === 0) return (
      <tr className="border-t border-[#1a1a3e]">
        <td className="py-2 text-sm">{label}</td>
        <td className="py-2 text-sm text-[#a0a0c0] text-center">-</td>
        <td className="py-2 text-sm text-[#a0a0c0] text-center">0/{totalQ}</td>
        <td className="py-2 text-sm text-[#a0a0c0] text-center">0%</td>
      </tr>
    );
    const pct = Math.round((s.correct / s.total) * 100);
    const color = pct >= 80 ? '#4ade80' : pct >= 60 ? '#fbbf24' : '#f87171';
    return (
      <tr className="border-t border-[#1a1a3e]">
        <td className="py-2 text-sm">{label}</td>
        <td className="py-2 text-sm text-center" style={{ color }}>{pct}%</td>
        <td className="py-2 text-sm text-[#a0a0c0] text-center">{s.correct}/{s.total}</td>
        <td className="py-2 text-sm text-[#a0a0c0] text-center">{Math.round((s.total / totalQ) * 100)}%</td>
      </tr>
    );
  };

  const categories = [...new Set((examData as Question[]).map(q => q.category))];

  const totalQuizCorrect = Object.values(quizStats).reduce((a, s) => a + s.correct, 0);
  const totalQuizAttempts = Object.values(quizStats).reduce((a, s) => a + s.total, 0);
  const totalCalcCorrect = Object.values(calcStats).reduce((a, s) => a + s.correct, 0);
  const totalCalcAttempts = Object.values(calcStats).reduce((a, s) => a + s.total, 0);
  const totalBCorrect = Object.values(bStats).reduce((a, s) => a + s.correct, 0);
  const totalBAttempts = Object.values(bStats).reduce((a, s) => a + s.total, 0);

  const catLabel = (cat: string) => categoryNames[cat] || cat;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-6">進捗</h2>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 rounded-lg text-center" style={{ background: '#1a1a3e' }}>
          <p className="text-2xl font-bold" style={{ color: '#f39c12' }}>{(examData as Question[]).length}</p>
          <p className="text-xs text-[#a0a0c0]">試験問題</p>
        </div>
        <div className="p-3 rounded-lg text-center" style={{ background: '#1a1a3e' }}>
          <p className="text-2xl font-bold" style={{ color: '#f39c12' }}>{(calcData as Question[]).length + (subjectBData as Question[]).length}</p>
          <p className="text-xs text-[#a0a0c0]">トレーニング問題</p>
        </div>
        <div className="p-3 rounded-lg text-center" style={{ background: '#1a1a3e' }}>
          <p className="text-2xl font-bold" style={{ color: '#f39c12' }}>{wrongIds.length}</p>
          <p className="text-xs text-[#a0a0c0]">不正解</p>
        </div>
      </div>

      {/* Overall */}
      <div className="mb-6 p-4 rounded-lg" style={{ background: '#1a1a3e' }}>
        <h3 className="text-sm font-semibold mb-2">全体正答率</h3>
        <div className="space-y-1">
          {totalQuizAttempts > 0 && (
            <div className="flex justify-between text-sm">
              <span>問題集: {Math.round((totalQuizCorrect/totalQuizAttempts)*100)}%</span>
              <span className="text-[#a0a0c0]">{totalQuizCorrect}/{totalQuizAttempts}</span>
            </div>
          )}
          {totalCalcAttempts > 0 && (
            <div className="flex justify-between text-sm">
              <span>計算: {Math.round((totalCalcCorrect/totalCalcAttempts)*100)}%</span>
              <span className="text-[#a0a0c0]">{totalCalcCorrect}/{totalCalcAttempts}</span>
            </div>
          )}
          {totalBAttempts > 0 && (
            <div className="flex justify-between text-sm">
              <span>科目B: {Math.round((totalBCorrect/totalBAttempts)*100)}%</span>
              <span className="text-[#a0a0c0]">{totalBCorrect}/{totalBAttempts}</span>
            </div>
          )}
          {totalQuizAttempts + totalCalcAttempts + totalBAttempts === 0 && (
            <p className="text-sm text-[#a0a0c0]">まだ解答していません</p>
          )}
        </div>
      </div>

      {/* Category breakdown */}
      <h3 className="text-sm font-semibold text-[#a0a0c0] uppercase mb-3">カテゴリ別</h3>
      <table className="w-full text-left mb-6">
        <thead>
          <tr className="text-xs text-[#a0a0c0]">
            <th className="pb-2">カテゴリ</th>
            <th className="pb-2 text-center">スコア</th>
            <th className="pb-2 text-center">正解</th>
            <th className="pb-2 text-center">カバー率</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => {
            const total = (examData as Question[]).filter(q => q.category === cat).length;
            return getStatRow(catLabel(cat), quizStats[cat], total);
          })}
        </tbody>
      </table>

      {/* Clear button */}
      <button
        onClick={() => {
          if (confirm('進捗データを全て消去しますか？')) {
            localStorage.removeItem('se-quiz-stats');
            localStorage.removeItem('se-calc-stats');
            localStorage.removeItem('se-b-stats');
            localStorage.removeItem('se-quiz-wrong');
            setQuizStats({});
            setCalcStats({});
            setBStats({});
            setWrongIds([]);
          }
        }}
        className="w-full py-2 rounded-lg text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10"
      >
        全てリセット
      </button>
    </div>
  );
}
