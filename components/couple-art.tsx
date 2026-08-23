"use client";

import { useInView } from "@/lib/useInView";

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 240 150"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function Heart({ x, y, s = 1, className = "acc-rose" }: { x: number; y: number; s?: number; className?: string }) {
  return (
    <path
      className={className}
      transform={`translate(${x - 12 * s} ${y - 8 * s}) scale(${s})`}
      d="M12 21 C5 15 0 10 0 5 C0 -1 5 -4 8 -1 C9.5 0.5 14.5 0.5 16 -1 C19 -4 24 -1 24 5 C24 10 19 15 12 21 Z"
    />
  );
}

function Sparkle({ x, y, s = 1, className = "acc-gold" }: { x: number; y: number; s?: number; className?: string }) {
  return (
    <path
      className={className}
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 -6 L1.6 -1.6 L6 0 L1.6 1.6 L0 6 L-1.6 1.6 L-6 0 L-1.6 -1.6 Z"
    />
  );
}

function Note({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g className="acc-gold" stroke="none" transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="0" r="3.4" />
      <path d="M3.4 0 L3.4 -13 C6.2 -13 6.8 -10 3.4 -9.4 L3.4 0 Z" />
    </g>
  );
}

function Girl({ cx, tilt = 0 }: { cx: number; tilt?: number }) {
  return (
    <g transform={tilt ? `rotate(${tilt} ${cx} 60)` : undefined}>
      <path d={`M ${cx - 16} 57 C ${cx - 23} 73 ${cx - 21} 90 ${cx - 13} 97`} />
      <path d={`M ${cx + 16} 57 C ${cx + 23} 73 ${cx + 21} 90 ${cx + 13} 97`} />
      <path
        d={`M ${cx - 18} 115 C ${cx - 24} 92 ${cx - 15} 80 ${cx} 80 C ${cx + 15} 80 ${cx + 24} 92 ${cx + 18} 115`}
      />
      <path d={`M ${cx - 3} 76 L ${cx - 3} 80 M ${cx + 3} 76 L ${cx + 3} 80`} />
      <circle cx={cx} cy={60} r={16} />
    </g>
  );
}

function Boy({ cx, tilt = 0 }: { cx: number; tilt?: number }) {
  return (
    <g transform={tilt ? `rotate(${tilt} ${cx} 60)` : undefined}>
      <path
        d={`M ${cx - 18} 115 C ${cx - 24} 92 ${cx - 15} 80 ${cx} 80 C ${cx + 15} 80 ${cx + 24} 92 ${cx + 18} 115`}
      />
      <path d={`M ${cx - 3} 76 L ${cx - 3} 80 M ${cx + 3} 76 L ${cx + 3} 80`} />
      <circle cx={cx} cy={60} r={16} />
      <path d={`M ${cx - 15} 56 C ${cx - 14} 41 ${cx + 14} 41 ${cx + 15} 56`} />
    </g>
  );
}

function HappyEyes({ cx, cy = 60 }: { cx: number; cy?: number }) {
  return (
    <>
      <path d={`M ${cx - 9} ${cy - 5} Q ${cx - 6} ${cy - 8} ${cx - 3} ${cy - 5}`} />
      <path d={`M ${cx + 3} ${cy - 5} Q ${cx + 6} ${cy - 8} ${cx + 9} ${cy - 5}`} />
    </>
  );
}

function ClosedEyes({ cx, cy = 60 }: { cx: number; cy?: number }) {
  return (
    <>
      <path d={`M ${cx - 10} ${cy - 4} Q ${cx - 6} ${cy - 1} ${cx - 2} ${cy - 4}`} />
      <path d={`M ${cx + 2} ${cy - 4} Q ${cx + 6} ${cy - 1} ${cx + 10} ${cy - 4}`} />
    </>
  );
}

function Smile({ cx, cy = 60 }: { cx: number; cy?: number }) {
  return <path d={`M ${cx - 5} ${cy + 2} Q ${cx} ${cy + 6} ${cx + 5} ${cy + 2}`} />;
}

function LaughMouth({ cx, cy = 60 }: { cx: number; cy?: number }) {
  return <path className="acc-rose" d={`M ${cx - 5} ${cy + 1} Q ${cx} ${cy + 9} ${cx + 5} ${cy + 1} Z`} />;
}

function Blush({ cx, cy = 60 }: { cx: number; cy?: number }) {
  return (
    <>
      <circle className="acc-rose" cx={cx - 11} cy={cy + 1} r={2} opacity={0.55} />
      <circle className="acc-rose" cx={cx + 11} cy={cy + 1} r={2} opacity={0.55} />
    </>
  );
}

function HoldHands() {
  return (
    <Svg>
      <Girl cx={72} />
      <Boy cx={168} />
      <HappyEyes cx={72} />
      <Smile cx={72} />
      <HappyEyes cx={168} />
      <Smile cx={168} />
      <path d="M 84 88 C 96 86 108 89 118 93" />
      <path d="M 156 88 C 144 86 132 89 122 93" />
      <Heart x={120} y={93} s={0.5} />
      <Heart x={120} y={36} s={1.1} className="heart-pulse" />
      <Sparkle x={50} y={30} s={0.8} />
      <Sparkle x={190} y={30} s={0.8} />
    </Svg>
  );
}

function Hug() {
  return (
    <Svg>
      <Girl cx={80} />
      <Boy cx={150} />
      <ClosedEyes cx={80} />
      <Smile cx={80} />
      <ClosedEyes cx={150} />
      <Smile cx={150} />
      <Blush cx={80} />
      <Blush cx={150} />
      <path d="M 92 90 C 106 97 120 101 130 98" />
      <path d="M 138 90 C 124 97 110 101 100 98" />
      <Heart x={115} y={32} s={1.1} className="heart-pulse" />
      <Sparkle x={56} y={28} s={0.7} />
      <Sparkle x={174} y={28} s={0.7} />
    </Svg>
  );
}

function Laughing() {
  return (
    <Svg>
      <Girl cx={72} tilt={-7} />
      <Boy cx={168} tilt={7} />
      <HappyEyes cx={72} />
      <LaughMouth cx={72} />
      <HappyEyes cx={168} />
      <LaughMouth cx={168} />
      <Heart x={120} y={40} s={0.9} />
      <Sparkle x={50} y={28} s={0.9} />
      <Sparkle x={94} y={20} s={0.7} />
      <Sparkle x={190} y={28} s={0.9} />
      <Sparkle x={146} y={20} s={0.7} />
    </Svg>
  );
}

function Kissing() {
  return (
    <Svg>
      <Girl cx={86} tilt={8} />
      <Boy cx={154} tilt={-8} />
      <ClosedEyes cx={86} />
      <ClosedEyes cx={154} />
      <Blush cx={86} />
      <Blush cx={154} />
      <circle className="acc-rose" cx={101} cy={67} r={2.2} />
      <circle className="acc-rose" cx={139} cy={67} r={2.2} />
      <Heart x={120} y={66} s={0.6} />
      <Heart x={120} y={32} s={1.15} className="heart-pulse" />
    </Svg>
  );
}

function SparkHearts() {
  return (
    <Svg>
      <Heart x={76} y={74} s={1.5} className="acc-line" />
      <Heart x={150} y={74} s={1.5} className="acc-line" />
      <path className="acc-faint" d="M 98 76 L 142 76" strokeDasharray="3 6" />
      <Heart x={120} y={74} s={0.85} className="heart-pulse" />
      <Sparkle x={54} y={36} s={0.9} />
      <Sparkle x={186} y={36} s={0.9} />
      <Sparkle x={120} y={28} s={0.7} />
    </Svg>
  );
}

function Dancing() {
  return (
    <Svg>
      <Girl cx={72} />
      <Boy cx={168} />
      <HappyEyes cx={72} />
      <Smile cx={72} />
      <HappyEyes cx={168} />
      <Smile cx={168} />
      <path d="M 56 88 C 46 72 46 58 55 48" />
      <path d="M 88 88 C 94 72 96 58 104 48" />
      <path d="M 184 88 C 194 72 194 58 185 48" />
      <path d="M 152 88 C 146 72 144 58 136 48" />
      <circle className="acc-rose" cx={55} cy={48} r={2.6} />
      <circle className="acc-rose" cx={104} cy={48} r={2.6} />
      <circle className="acc-rose" cx={185} cy={48} r={2.6} />
      <circle className="acc-rose" cx={136} cy={48} r={2.6} />
      <Note x={42} y={34} />
      <Note x={120} y={24} s={1.1} />
      <Note x={198} y={34} />
      <Sparkle x={80} y={24} s={0.7} />
      <Sparkle x={160} y={24} s={0.7} />
    </Svg>
  );
}

function Celebrating() {
  return (
    <Svg>
      <Girl cx={72} />
      <Boy cx={168} />
      <HappyEyes cx={72} />
      <Smile cx={72} />
      <HappyEyes cx={168} />
      <Smile cx={168} />
      <path d="M 88 88 C 96 72 98 58 106 48" />
      <path d="M 152 88 C 144 72 142 58 134 48" />
      <circle className="acc-rose" cx={106} cy={48} r={2.6} />
      <circle className="acc-rose" cx={134} cy={48} r={2.6} />
      <circle className="acc-gold" cx={44} cy={42} r={2.4} />
      <circle className="acc-rose" cx={62} cy={26} r={2} />
      <circle className="acc-gold" cx={92} cy={20} r={2.4} />
      <circle className="acc-rose" cx={122} cy={24} r={2} />
      <circle className="acc-gold" cx={150} cy={20} r={2.4} />
      <circle className="acc-rose" cx={180} cy={26} r={2} />
      <circle className="acc-gold" cx={198} cy={42} r={2.4} />
      <rect className="acc-gold" x={100} y={34} width={7} height={3} rx={1.5} transform="rotate(25 103 35)" />
      <rect className="acc-rose" x={138} y={34} width={7} height={3} rx={1.5} transform="rotate(-25 141 35)" />
      <rect className="acc-gold" x={56} y={50} width={7} height={3} rx={1.5} transform="rotate(40 59 51)" />
      <rect className="acc-rose" x={182} y={50} width={7} height={3} rx={1.5} transform="rotate(-40 185 51)" />
      <Heart x={120} y={90} s={0.8} className="heart-pulse" />
    </Svg>
  );
}

function CoffeeDate() {
  return (
    <Svg>
      <rect x={58} y={64} width={36} height={36} rx={7} />
      <path d="M 58 72 C 48 72 48 92 58 92" />
      <path d="M 68 56 C 66 50 72 48 70 42" />
      <path d="M 78 56 C 76 50 82 48 80 42" />
      <rect x={146} y={64} width={36} height={36} rx={7} />
      <path d="M 182 72 C 192 72 192 92 182 92" />
      <path d="M 162 56 C 160 50 166 48 164 42" />
      <path d="M 172 56 C 170 50 176 48 174 42" />
      <Heart x={120} y={82} s={0.85} className="heart-pulse" />
      <Sparkle x={120} y={56} s={0.8} />
    </Svg>
  );
}

function SunsetBench() {
  return (
    <Svg>
      <path className="acc-faint" d="M 24 112 H 216" />
      <circle className="acc-gold-soft" cx={120} cy={64} r={17} />
      <path className="acc-faint" d="M 120 38 L 120 32" />
      <path className="acc-faint" d="M 120 90 L 120 96" />
      <path className="acc-faint" d="M 96 64 L 90 64" />
      <path className="acc-faint" d="M 144 64 L 150 64" />
      <path className="acc-faint" d="M 103 47 L 99 43" />
      <path className="acc-faint" d="M 137 47 L 141 43" />
      <path className="acc-faint" d="M 103 81 L 99 85" />
      <path className="acc-faint" d="M 137 81 L 141 85" />
      <path d="M 64 104 H 176" />
      <path d="M 76 104 V 120" />
      <path d="M 164 104 V 120" />
      <path d="M 80 70 C 77 82 79 90 84 95" />
      <path d="M 104 70 C 107 82 105 90 100 95" />
      <circle cx={92} cy={72} r={12} />
      <path d="M 79 84 C 77 96 81 101 87 103 H 101 C 107 101 111 96 109 84" />
      <circle cx={148} cy={72} r={12} />
      <path d="M 137 70 C 137 58 159 58 159 70" />
      <path d="M 137 84 C 135 96 139 101 145 103 H 157 C 163 101 167 96 165 84" />
      <Heart x={120} y={48} s={0.9} className="heart-pulse" />
    </Svg>
  );
}

const SCENES = {
  "hold-hands": HoldHands,
  hug: Hug,
  laughing: Laughing,
  kissing: Kissing,
  "spark-hearts": SparkHearts,
  dancing: Dancing,
  celebrating: Celebrating,
  "coffee-date": CoffeeDate,
  "sunset-bench": SunsetBench,
} as const;

export type CoupleScene = keyof typeof SCENES;

export default function CoupleDivider({ scene }: { scene: CoupleScene }) {
  const { setRef, inView } = useInView<HTMLDivElement>();
  const Scene = SCENES[scene];

  return (
    <div ref={setRef} className={`couple-divider ${inView ? "in-view" : ""}`} aria-hidden="true">
      <div className="float">
        <Scene />
      </div>
    </div>
  );
}
