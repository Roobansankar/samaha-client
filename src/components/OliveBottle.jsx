/* Hand-built SVG — a dark-glass bottle of Samaha with an olive branch.
   No raster assets: crisp at any size, weightless to load. */

export default function OliveBottle({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 360 470"
      role="img"
      aria-label="A dark glass bottle of Samaha olive oil beside an olive branch"
    >
      <defs>
        <linearGradient id="sm-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#20260f" />
          <stop offset="0.42" stopColor="#3c4428" />
          <stop offset="0.62" stopColor="#4a5433" />
          <stop offset="1" stopColor="#20260f" />
        </linearGradient>
        <linearGradient id="sm-oil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efd4a0" />
          <stop offset="1" stopColor="#c8952f" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="176" cy="442" rx="104" ry="15" fill="#2f3519" opacity="0.16" />

      {/* olive branch, tucked behind the shoulder */}
      <g fill="none" stroke="#5c663f" strokeWidth="2.6" strokeLinecap="round">
        <path d="M330 54c-46 20-74 55-84 104-4 20-4 42 2 66" />
        <path d="M300 74c-16-4-31-2-44 6" />
        <path d="M268 128c-16-6-32-6-46 0" />
        <path d="M250 196c-15-9-29-12-45-10" />
      </g>
      <g fill="#6f7a4d">
        <ellipse cx="286" cy="64" rx="19" ry="7.5" transform="rotate(-34 286 64)" />
        <ellipse cx="252" cy="70" rx="18" ry="7" transform="rotate(16 252 70)" />
        <ellipse cx="238" cy="120" rx="19" ry="7.5" transform="rotate(-24 238 120)" />
        <ellipse cx="212" cy="128" rx="17" ry="6.5" transform="rotate(22 212 128)" />
        <ellipse cx="224" cy="188" rx="18" ry="7" transform="rotate(-16 224 188)" />
        <ellipse cx="200" cy="196" rx="16" ry="6.5" transform="rotate(28 200 196)" />
      </g>
      <g fill="#4a5433">
        <circle cx="300" cy="92" r="8.5" />
        <circle cx="270" cy="150" r="8" />
        <circle cx="243" cy="216" r="8" />
      </g>
      <circle cx="297.5" cy="89" r="2.4" fill="#a7b083" />
      <circle cx="267.5" cy="147" r="2.2" fill="#a7b083" />

      {/* bottle */}
      <g>
        {/* cap + foil band */}
        <rect x="158" y="40" width="40" height="30" rx="3" fill="#20260f" />
        <rect x="156" y="64" width="44" height="9" rx="2" fill="#b07d24" />

        {/* glass body */}
        <path
          d="M160 73 L196 73 L196 120
             C196 139 234 150 234 178
             L234 396 Q234 414 216 414
             L140 414 Q122 414 122 396
             L122 178
             C122 150 160 139 160 120 Z"
          fill="url(#sm-glass)"
          stroke="#20260f"
          strokeOpacity="0.5"
        />

        {/* sheen */}
        <path
          d="M150 150 C146 210 146 320 152 384"
          fill="none"
          stroke="#e6bd71"
          strokeOpacity="0.22"
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* label */}
        <rect x="132" y="250" width="92" height="118" rx="4" fill="#fbf7ec" />
        <rect
          x="132"
          y="250"
          width="92"
          height="118"
          rx="4"
          fill="none"
          stroke="#2f3519"
          strokeOpacity="0.14"
        />
        <text
          x="178"
          y="285"
          textAnchor="middle"
          fontFamily="Fraunces, Georgia, serif"
          fontSize="20"
          letterSpacing="3"
          fill="#2f3519"
        >
          SAMAHA
        </text>
        <line x1="150" y1="298" x2="206" y2="298" stroke="#b07d24" strokeWidth="1.2" />
        <text
          x="178"
          y="316"
          textAnchor="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="7.5"
          letterSpacing="2.4"
          fill="#565b41"
        >
          EXTRA VIRGIN
        </text>
        <text
          x="178"
          y="329"
          textAnchor="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="7.5"
          letterSpacing="2.4"
          fill="#565b41"
        >
          OLIVE OIL
        </text>
        <circle cx="178" cy="345" r="4.6" fill="none" stroke="#6f7a4d" strokeWidth="1.4" />
        <path d="M178 341c3 2 4 5 0 8-4-3-3-6 0-8Z" fill="#6f7a4d" />
        <text
          x="178"
          y="361"
          textAnchor="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="6.5"
          letterSpacing="1.6"
          fill="#797d64"
        >
          COLD PRESSED · 500 ML
        </text>
      </g>
    </svg>
  )
}
