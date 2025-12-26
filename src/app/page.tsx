import { CallInterface } from '@/components/CallInterface';

function SpykeLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 4L6 14v10c0 11 7.2 21.3 18 24 10.8-2.7 18-13 18-24V14L24 4z"
          fill="url(#shield-gradient)"
          stroke="url(#shield-stroke)"
          strokeWidth="1.5"
        />
        <path
          d="M24 16c-4.4 0-8 1.8-8 4v2c0 1.1.9 2 2 2h1c.6 0 1-.4 1-1v-1c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v1c0 .6.4 1 1 1h1c1.1 0 2-.9 2-2v-2c0-2.2-3.6-4-8-4z"
          fill="#00d9ff"
        />
        <path
          d="M16 26c0 0 2 8 8 8s8-8 8-8"
          stroke="#00d9ff"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="20" cy="28" r="1.5" fill="#00d9ff" />
        <circle cx="28" cy="28" r="1.5" fill="#00d9ff" />
        <circle cx="24" cy="31" r="1.5" fill="#00d9ff" />
        <defs>
          <linearGradient
            id="shield-gradient"
            x1="6"
            y1="4"
            x2="42"
            y2="48"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4f46e5" stopOpacity="0.3" />
            <stop offset="1" stopColor="#7c3aed" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient
            id="shield-stroke"
            x1="6"
            y1="4"
            x2="42"
            y2="48"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00d9ff" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      <span
        style={{
          fontSize: '2rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          background: 'linear-gradient(135deg, #00d9ff 0%, #7c3aed 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        SPYKE
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <SpykeLogo />
      <div style={{ marginTop: '40px', width: '100%', maxWidth: '400px' }}>
        <CallInterface />
      </div>
    </div>
  );
}
