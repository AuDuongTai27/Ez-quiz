import React, { useState, useMemo } from 'react';
import questionBank from './data/questionBank.json';

export default function App() {
  // All unique weeks from question bank
  const allWeeks = useMemo(() => {
    const weeks = [...new Set(questionBank.map(q => q.week))].sort();
    return weeks;
  }, []);

  const [selectedWeeks, setSelectedWeeks] = useState(new Set(allWeeks)); // all selected by default
  const [showFilter, setShowFilter] = useState(false);
  const [questions, setQuestions] = useState(questionBank);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypedMode, setIsTypedMode] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userTypedAnswer, setUserTypedAnswer] = useState('');
  const [answerResult, setAnswerResult] = useState(null); // 'correct' | 'wrong'

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const toggleWeek = (week) => {
    setSelectedWeeks(prev => {
      const next = new Set(prev);
      if (next.has(week)) {
        if (next.size === 1) return prev; // keep at least 1
        next.delete(week);
      } else {
        next.add(week);
      }
      return next;
    });
  };

  const applyFilter = () => {
    const filtered = questionBank.filter(q => selectedWeeks.has(q.week));
    setQuestions(filtered);
    setCurrentIndex(0);
    resetState();
    setShowFilter(false);
  };

  const handleShuffle = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    resetState();
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
    resetState();
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      resetState();
    }
  };

  const resetState = () => {
    setShowAnswer(false);
    setSelectedOption(null);
    setUserTypedAnswer('');
    setAnswerResult(null);
  };

  const handleOptionClick = (opt) => {
    if (showAnswer) return;
    setSelectedOption(opt);
    setShowAnswer(true);
    const isCorrect = opt.startsWith(currentQ.correctAnswer);
    setAnswerResult(isCorrect ? 'correct' : 'wrong');
  };

  // Kahoot 4 colors: red, blue, yellow, green — fixed positions
  const kahootColors = [
    {
      bg: '#E21B3C',
      shadow: '#9B0000',
      hoverBg: '#FF2748',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <polygon points="16,2 30,28 2,28" fill="white" opacity="0.9"/>
        </svg>
      ),
    },
    {
      bg: '#1368CE',
      shadow: '#0A3F82',
      hoverBg: '#1A7BE8',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="4" width="24" height="24" rx="3" fill="white" opacity="0.9"/>
        </svg>
      ),
    },
    {
      bg: '#D89E00',
      shadow: '#8A6200',
      hoverBg: '#F0AE00',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="13" fill="white" opacity="0.9"/>
        </svg>
      ),
    },
    {
      bg: '#26890C',
      shadow: '#145005',
      hoverBg: '#2FA30E',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <polygon points="16,2 29,10 24,26 8,26 3,10" fill="white" opacity="0.9"/>
        </svg>
      ),
    },
  ];

  if (!currentQ) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#46178F', color: 'white',
      fontFamily: 'system-ui', fontSize: 28, fontWeight: 700
    }}>
      Đang tải câu hỏi...
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #46178F 0%, #2D0A6B 100%)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Nunito', 'Segoe UI', sans-serif",
      overflow: 'hidden',
    }}>

      {/* ── TOP NAV ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: 'rgba(0,0,0,0.25)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        flexShrink: 0,
        gap: 12,
        flexWrap: 'wrap',
      }}>
        {/* Logo */}
        <div style={{ color: 'white', fontWeight: 900, fontSize: 22, letterSpacing: '-0.5px' }}>
          CSW 303 <span style={{ color: '#FF9900' }}>QUIZ</span>
        </div>

        {/* Progress pill */}
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 99,
          padding: '6px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
          flexGrow: 1, maxWidth: 340,
        }}>
          <div style={{ flexGrow: 1, background: 'rgba(255,255,255,0.2)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #FF9900, #FFCC00)',
              borderRadius: 99,
              transition: 'width 0.4s ease',
            }} />
          </div>
          <span style={{ color: 'white', fontWeight: 800, fontSize: 13, whiteSpace: 'nowrap' }}>
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleShuffle} style={navBtnStyle('#FF9900', '#CC7700')}>
            🔀 Xào Bài
          </button>
          <button
            onClick={() => setShowFilter(true)}
            style={{
              ...navBtnStyle('rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)'),
              position: 'relative',
            }}
          >
            🗂️ Lọc Week
            {selectedWeeks.size < allWeeks.length && (
              <span style={{
                position: 'absolute', top: -6, right: -6,
                background: '#FF9900', color: '#1a1a2e',
                fontWeight: 900, fontSize: 11,
                borderRadius: 99, minWidth: 18, height: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 4px',
              }}>
                {selectedWeeks.size}
              </span>
            )}
          </button>
          <button
            onClick={() => { setIsTypedMode(!isTypedMode); resetState(); }}
            style={navBtnStyle('rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)')}
          >
            {isTypedMode ? '🔄 Trắc nghiệm' : '✍️ Tự luận'}
          </button>
        </div>
      </div>

      {/* ── QUESTION AREA ── */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 20px 12px',
        position: 'relative',
      }}>
        {/* Week/Quiz badge */}
        <div style={{
          background: 'rgba(0,0,0,0.4)',
          color: 'rgba(255,255,255,0.7)',
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 1,
          textTransform: 'uppercase',
          padding: '4px 14px',
          borderRadius: 99,
          marginBottom: 12,
        }}>
          {currentQ.week} · {currentQ.quiz}
        </div>

        {/* Question box */}
        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: '24px 32px',
          maxWidth: 760,
          width: '100%',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          textAlign: 'center',
          minHeight: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <p style={{
            margin: 0,
            fontSize: 'clamp(18px, 2.5vw, 28px)',
            fontWeight: 800,
            color: '#1a1a2e',
            lineHeight: 1.4,
          }}>
            {currentQ.question}
          </p>
        </div>

        {/* Result banner */}
        {showAnswer && answerResult && (
          <div style={{
            marginTop: 12,
            padding: '8px 24px',
            borderRadius: 99,
            fontWeight: 900,
            fontSize: 16,
            letterSpacing: 0.5,
            background: answerResult === 'correct' ? '#26890C' : '#E21B3C',
            color: 'white',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            animation: 'popIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            {answerResult === 'correct' ? '✅ Đúng rồi! Xuất sắc!' : '❌ Sai rồi! Xem đáp án bên dưới nhé'}
          </div>
        )}
      </div>

      {/* ── ANSWER GRID ── */}
      <div style={{
        flex: 1,
        padding: '8px 12px 12px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: 10,
        maxWidth: 900,
        margin: '0 auto',
        width: '100%',
      }}>
        {currentQ.options.map((opt, idx) => {
          const c = kahootColors[idx % 4];
          const isCorrect = opt.startsWith(currentQ.correctAnswer);
          const isSelected = opt === selectedOption;

          let opacity = 1;
          let transform = 'none';
          let ring = 'none';

          if (showAnswer) {
            if (isCorrect) {
              transform = 'scale(1.02)';
              ring = '0 0 0 4px white';
            } else if (!isSelected) {
              opacity = 0.45;
            } else {
              opacity = 0.5;
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(opt)}
              disabled={showAnswer}
              style={{
                background: c.bg,
                boxShadow: showAnswer ? `0 4px 0 ${c.shadow}, ${ring}` : `0 6px 0 ${c.shadow}`,
                border: 'none',
                borderRadius: 14,
                cursor: showAnswer ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '0 20px',
                opacity,
                transform,
                transition: 'opacity 0.2s, transform 0.2s',
                position: 'relative',
                overflow: 'hidden',
                minHeight: 0,
              }}
              onMouseEnter={e => {
                if (!showAnswer) e.currentTarget.style.background = c.hoverBg;
              }}
              onMouseLeave={e => {
                if (!showAnswer) e.currentTarget.style.background = c.bg;
              }}
              onMouseDown={e => {
                if (!showAnswer) e.currentTarget.style.transform = 'translateY(4px)';
                if (!showAnswer) e.currentTarget.style.boxShadow = `0 2px 0 ${c.shadow}`;
              }}
              onMouseUp={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = showAnswer
                  ? `0 4px 0 ${c.shadow}, ${ring}`
                  : `0 6px 0 ${c.shadow}`;
              }}
            >
              {/* Shape icon */}
              <div style={{ flexShrink: 0, opacity: 0.9 }}>{c.icon}</div>

              {/* Answer text */}
              <span style={{
                color: 'white',
                fontWeight: 800,
                fontSize: 'clamp(13px, 1.6vw, 19px)',
                textAlign: 'left',
                lineHeight: 1.35,
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                flex: 1,
              }}>
                {opt}
              </span>

              {/* Correct/wrong badge */}
              {showAnswer && isCorrect && (
                <span style={{ fontSize: 26, flexShrink: 0 }}>✅</span>
              )}
              {showAnswer && isSelected && !isCorrect && (
                <span style={{ fontSize: 26, flexShrink: 0 }}>❌</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── TYPED MODE ── */}
      {isTypedMode && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(20,0,50,0.92)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50,
          padding: 20,
        }}>
          <div style={{
            background: 'white', borderRadius: 20,
            padding: '32px 36px', maxWidth: 600, width: '100%',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          }}>
            <p style={{ margin: '0 0 12px', fontWeight: 900, fontSize: 20, color: '#1a1a2e' }}>
              {currentQ.question}
            </p>
            <textarea
              rows={4}
              placeholder="Gõ đáp án của bạn..."
              value={userTypedAnswer}
              onChange={e => setUserTypedAnswer(e.target.value)}
              disabled={showAnswer}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '14px 16px', fontSize: 18, fontWeight: 700,
                border: '3px solid #e2e8f0', borderRadius: 12,
                outline: 'none', resize: 'none', fontFamily: 'inherit',
                background: showAnswer ? '#f8f8f8' : 'white',
                color: '#1a1a2e',
              }}
            />
            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                style={{
                  width: '100%', marginTop: 14, padding: '14px',
                  background: '#46178F', color: 'white', fontWeight: 900,
                  fontSize: 18, border: 'none', borderRadius: 12,
                  boxShadow: '0 5px 0 #2D0A6B', cursor: 'pointer',
                }}
              >
                KIỂM TRA ĐÁP ÁN
              </button>
            ) : (
              <div style={{
                marginTop: 14, padding: '16px 20px',
                background: '#f0fdf4', border: '3px solid #22c55e', borderRadius: 12,
              }}>
                <p style={{ margin: '0 0 6px', color: '#15803d', fontWeight: 900, fontSize: 13, textTransform: 'uppercase' }}>
                  Đáp án chuẩn:
                </p>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 18, color: '#1a1a2e' }}>
                  {currentQ.correctAnswer}. {currentQ.options.find(o => o.startsWith(currentQ.correctAnswer))?.replace(/^[A-D]\.\s*/, '')}
                </p>
              </div>
            )}
            <button
              onClick={() => { setIsTypedMode(false); resetState(); }}
              style={{
                width: '100%', marginTop: 10, padding: '10px',
                background: '#f1f5f9', color: '#475569', fontWeight: 700,
                fontSize: 15, border: 'none', borderRadius: 10, cursor: 'pointer',
              }}
            >
              ← Quay về trắc nghiệm
            </button>
          </div>
        </div>
      )}

      {/* ── BOTTOM NAV ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 16px',
        background: 'rgba(0,0,0,0.3)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        flexShrink: 0,
        gap: 10,
      }}>
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={navBtnStyle('rgba(255,255,255,0.12)', 'rgba(255,255,255,0.05)', currentIndex === 0)}
        >
          ⬅ Trước
        </button>

        {/* Dot indicators (show up to 7) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {questions.slice(Math.max(0, currentIndex - 3), Math.min(questions.length, currentIndex + 4)).map((_, i) => {
            const realIdx = Math.max(0, currentIndex - 3) + i;
            return (
              <div key={realIdx} style={{
                width: realIdx === currentIndex ? 20 : 8,
                height: 8,
                borderRadius: 99,
                background: realIdx === currentIndex ? '#FF9900' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.2s',
              }} />
            );
          })}
        </div>

        <button
          onClick={handleNext}
          style={navBtnStyle('#FF9900', '#CC7700')}
        >
          Tiếp ➡
        </button>
      </div>

      {/* ── WEEK FILTER MODAL ── */}
      {showFilter && (
        <div
          onClick={() => setShowFilter(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(10,0,30,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100, padding: 20,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#1e0a45',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 20,
              padding: '28px 28px 24px',
              maxWidth: 480, width: '100%',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ margin: 0, color: 'white', fontWeight: 900, fontSize: 20 }}>🗂️ Lọc theo Week</h2>
                <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                  Đang chọn {selectedWeeks.size} / {allWeeks.length} tuần
                </p>
              </div>
              <button
                onClick={() => setShowFilter(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)', border: 'none',
                  color: 'white', width: 32, height: 32, borderRadius: 99,
                  cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✕</button>
            </div>

            {/* Select All / None */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <button
                onClick={() => setSelectedWeeks(new Set(allWeeks))}
                style={{
                  flex: 1, padding: '8px', borderRadius: 10, border: 'none',
                  background: 'rgba(255,255,255,0.1)', color: 'white',
                  fontWeight: 800, fontSize: 13, cursor: 'pointer',
                }}
              >
                ✅ Chọn tất cả
              </button>
              <button
                onClick={() => setSelectedWeeks(new Set([allWeeks[0]]))}
                style={{
                  flex: 1, padding: '8px', borderRadius: 10, border: 'none',
                  background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)',
                  fontWeight: 800, fontSize: 13, cursor: 'pointer',
                }}
              >
                ☐ Bỏ chọn
              </button>
            </div>

            {/* Week chips */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 10,
              maxHeight: 280, overflowY: 'auto',
              paddingRight: 4,
            }}>
              {allWeeks.map(week => {
                const count = questionBank.filter(q => q.week === week).length;
                const active = selectedWeeks.has(week);
                return (
                  <button
                    key={week}
                    onClick={() => toggleWeek(week)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: 12,
                      border: active ? '2px solid #FF9900' : '2px solid rgba(255,255,255,0.15)',
                      background: active ? 'rgba(255,153,0,0.2)' : 'rgba(255,255,255,0.06)',
                      color: active ? '#FFCC55' : 'rgba(255,255,255,0.55)',
                      fontWeight: 800, fontSize: 14,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                      minWidth: 90,
                    }}
                  >
                    <span>{week}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.7 }}>{count} câu</span>
                    {active && <span style={{ fontSize: 12 }}>✔</span>}
                  </button>
                );
              })}
            </div>

            {/* Apply button */}
            <button
              onClick={applyFilter}
              style={{
                width: '100%', marginTop: 20, padding: '14px',
                background: 'linear-gradient(90deg, #FF9900, #FFCC00)',
                color: '#1a1a2e', fontWeight: 900, fontSize: 17,
                border: 'none', borderRadius: 12,
                boxShadow: '0 5px 0 #996000',
                cursor: 'pointer',
              }}
            >
              ÁP DỤNG — {questionBank.filter(q => selectedWeeks.has(q.week)).length} câu hỏi
            </button>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
        @keyframes popIn {
          from { transform: scale(0.7); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>
    </div>
  );
}

function navBtnStyle(bg, activeBg, disabled = false) {
  return {
    background: bg,
    color: 'white',
    fontWeight: 800,
    fontSize: 14,
    padding: '9px 20px',
    border: 'none',
    borderRadius: 10,
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.3 : 1,
    transition: 'background 0.15s',
    whiteSpace: 'nowrap',
  };
}