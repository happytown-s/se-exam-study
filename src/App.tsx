import { useState } from 'react';
import Quiz from './components/Quiz';
import CalcTraining from './components/CalcTraining';
import SubjectBTraining from './components/SubjectBTraining';
import Progress from './components/Progress';

type Tab = 'quiz' | 'calc' | 'subjectb' | 'progress';

export default function App() {
  const [tab, setTab] = useState<Tab>('quiz');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'quiz', label: 'Quiz' },
    { key: 'calc', label: 'Calc Training' },
    { key: 'subjectb', label: 'Subject B' },
    { key: 'progress', label: 'Progress' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0f0f23' }}>
      {/* Header */}
      <header className="sticky top-0 z-10" style={{ background: '#0f0f23', borderBottom: '1px solid #1a1a3e' }}>
        <div className="max-w-lg mx-auto px-4 pt-3 pb-0">
          <h1 className="text-lg font-bold mb-3" style={{ color: '#f39c12' }}>
            SE Exam Study
          </h1>
          <div className="flex">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="flex-1 py-2 text-sm font-medium transition-all border-b-2"
                style={{
                  color: tab === t.key ? '#f39c12' : '#a0a0c0',
                  borderColor: tab === t.key ? '#f39c12' : 'transparent',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pb-8">
        {tab === 'quiz' && <Quiz />}
        {tab === 'calc' && <CalcTraining />}
        {tab === 'subjectb' && <SubjectBTraining />}
        {tab === 'progress' && <Progress />}
      </main>
    </div>
  );
}
