export default function Rocket() {
  return (
    <div className="rocket-fly" aria-hidden="true">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        {/* trail */}
        <g className="rocket-trail">
          <rect x="2" y="30" width="20" height="4" rx="2" fill="hsl(45 100% 60%)" opacity=".9"/>
          <rect x="6" y="26" width="14" height="3" rx="1.5" fill="hsl(18 92% 54%)" opacity=".85"/>
          <rect x="6" y="35" width="14" height="3" rx="1.5" fill="hsl(0 80% 55%)" opacity=".85"/>
        </g>
        {/* body */}
        <path d="M22 26 L46 18 C54 18 58 24 58 32 C58 40 54 46 46 46 L22 38 Z" fill="hsl(18 92% 54%)"/>
        <circle cx="48" cy="32" r="4" fill="hsl(40 100% 95%)"/>
        <circle cx="48" cy="32" r="2" fill="hsl(200 80% 45%)"/>
        {/* fins */}
        <path d="M22 26 L14 20 L22 30 Z" fill="hsl(0 80% 50%)"/>
        <path d="M22 38 L14 44 L22 34 Z" fill="hsl(0 80% 50%)"/>
      </svg>
    </div>
  );
}