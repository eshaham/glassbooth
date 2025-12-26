'use client';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

interface DialerProps {
  onDigit: (digit: string) => void;
}

export function Dialer({ onDigit }: DialerProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 64px)',
        gap: '16px',
        justifyContent: 'center',
      }}
    >
      {KEYS.map((key) => (
        <button
          key={key}
          className="glass-button"
          onClick={() => onDigit(key)}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            fontSize: '1.5rem',
            fontWeight: 400,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {key}
        </button>
      ))}
    </div>
  );
}
