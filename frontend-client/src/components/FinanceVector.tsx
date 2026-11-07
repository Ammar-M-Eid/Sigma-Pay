import React from 'react';

export type IllustrationKind = 'overview' | 'budgets' | 'goals' | 'groups' | 'bills' | 'payments' | 'reports' | 'notifications' | 'profile';

interface FinanceVectorProps {
  kind: IllustrationKind;
  title: string;
  className?: string;
}

const FinanceVector: React.FC<FinanceVectorProps> = ({ kind, title, className = '' }) => {
  const label = kind === 'overview' ? 'Money flow' : kind === 'groups' ? 'Group savings' : kind.charAt(0).toUpperCase() + kind.slice(1);
  return (
    <svg className={`finance-vector vector-${kind} ${className}`} viewBox="0 0 600 360" role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      <desc>{label} shown as connected account, planning, and activity symbols.</desc>
      <defs>
        <pattern id={`grid-${kind}`} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="#dbe8f3" strokeWidth=".7" />
        </pattern>
      </defs>
      <rect x="30" y="24" width="540" height="312" rx="24" fill="#f7fbff" />
      <rect x="30" y="24" width="540" height="312" rx="24" fill={`url(#grid-${kind})`} opacity=".55" />

      {kind === 'overview' ? (
        <>
          <path className="vector-flow vector-flow-main" d="M78 186H218M380 186C430 186 430 91 489 91M380 186C438 186 438 186 489 186M380 186C431 186 431 281 489 281" fill="none" stroke="#7ea9d7" strokeWidth="3" />
          <path className="vector-flow vector-flow-accent" d="M83 186H218M380 186C430 186 430 91 489 91M380 186C438 186 438 186 489 186M380 186C431 186 431 281 489 281" fill="none" stroke="#3c7fe1" strokeWidth="2" />
          <g className="vector-node vector-income"><circle cx="82" cy="186" r="31" fill="#e5f2ff" stroke="#b6d2ee" /><path d="M82 202v-31m0 0-12 12m12-12 12 12" fill="none" stroke="#2868bf" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><text x="82" y="238" textAnchor="middle">Income</text></g>
          <g className="vector-account">
            <rect x="216" y="105" width="166" height="162" rx="18" fill="#12355c" />
            <rect x="233" y="122" width="34" height="34" rx="10" fill="#dcecff" />
            <path d="M243 139h14m-7-7v14" stroke="#2868bf" strokeWidth="2.4" strokeLinecap="round" />
            <text className="vector-account-title" x="278" y="137">Your money</text>
            <text className="vector-account-subtitle" x="237" y="178">Plan · track · grow</text>
            <path d="M237 228h126" stroke="#31577b" strokeWidth="1" />
            <rect x="237" y="210" width="10" height="12" rx="2" fill="#91b8e8" /><rect x="254" y="202" width="10" height="20" rx="2" fill="#6b9fe0" /><rect x="271" y="193" width="10" height="29" rx="2" fill="#4c8bd9" /><rect x="288" y="184" width="10" height="38" rx="2" fill="#54c7a0" />
            <path d="M310 215l17-12 13 5 17-21" fill="none" stroke="#d9f27d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g className="vector-node vector-budget"><circle cx="492" cy="91" r="27" fill="#eaf2ff" stroke="#c4d8f2" /><path d="M480 98h24M483 93v-8m9 8V78m9 15v-11" stroke="#3675c4" strokeWidth="2.5" strokeLinecap="round" /><text x="492" y="132" textAnchor="middle">Budget</text></g>
          <g className="vector-node vector-goal"><circle cx="492" cy="186" r="27" fill="#e7f6ef" stroke="#bde4d2" /><circle cx="492" cy="186" r="12" fill="none" stroke="#188565" strokeWidth="2.5" /><circle cx="492" cy="186" r="3.5" fill="#188565" /><text x="492" y="227" textAnchor="middle">Savings goal</text></g>
          <g className="vector-node vector-bills"><circle cx="492" cy="281" r="27" fill="#fff3e4" stroke="#f1d9b9" /><path d="M482 266h20v28l-4-3-4 3-4-3-4 3-4-3z" fill="none" stroke="#bd7a29" strokeWidth="2" strokeLinejoin="round" /><path d="M486 274h11m-11 6h8" stroke="#bd7a29" strokeWidth="1.6" strokeLinecap="round" /><text x="492" y="322" textAnchor="middle">Bills</text></g>
        </>
      ) : (
        <>
          <path className="vector-flow vector-flow-main" d="M97 187H233M370 187H505" fill="none" stroke="#8db5e0" strokeWidth="3" />
          <path className="vector-flow vector-flow-accent" d="M97 187H233M370 187H505" fill="none" stroke="#3c7fe1" strokeWidth="2" />
          <circle cx="96" cy="187" r="18" fill="#fff" stroke="#b8d2ed" strokeWidth="2" />
          <circle cx="505" cy="187" r="18" fill="#e5f2ff" stroke="#99bce3" strokeWidth="2" />
          <path d="M90 187h12m-5-5 5 5-5 5" fill="none" stroke="#3e77bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="224" y="84" width="153" height="207" rx="20" fill="#fff" stroke="#d7e5f0" strokeWidth="1.5" />
          <rect x="240" y="100" width="121" height="170" rx="14" fill="#edf5fc" />
          <text x="300" y="74" className="vector-top-label" textAnchor="middle">{label}</text>
          {kind === 'budgets' && <g><rect x="264" y="197" width="19" height="56" rx="5" fill="#8db4e5" /><rect x="291" y="165" width="19" height="88" rx="5" fill="#5189d0" /><rect x="318" y="136" width="19" height="117" rx="5" fill="#2c6dc5" /><path d="M257 253h90" stroke="#c9d9e7" strokeWidth="2" /><circle cx="351" cy="118" r="18" fill="#e3f6ee" /><path d="m343 118 5 5 10-11" fill="none" stroke="#168565" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></g>}
          {kind === 'goals' && <g><circle cx="300" cy="181" r="59" fill="#fff" stroke="#a7c6e7" strokeWidth="9" /><circle cx="300" cy="181" r="39" fill="#e7f2ff" stroke="#5890d1" strokeWidth="8" /><circle cx="300" cy="181" r="17" fill="#3c7fe1" /><path d="m297 176 44-44m-21 0h21v21" fill="none" stroke="#188565" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></g>}
          {kind === 'groups' && <g><path d="M265 184c19-31 52-31 71 0M256 204c26 20 62 20 88 0" fill="none" stroke="#73a4db" strokeWidth="4" strokeLinecap="round" /><circle cx="300" cy="144" r="20" fill="#bcd5f2" /><circle cx="263" cy="174" r="16" fill="#3d7fd0" /><circle cx="337" cy="174" r="16" fill="#55b997" /><rect x="262" y="219" width="76" height="11" rx="5.5" fill="#d6e5f1" /><rect x="262" y="219" width="52" height="11" rx="5.5" fill="#54b793" /></g>}
          {kind === 'payments' && <g><rect x="252" y="139" width="96" height="65" rx="10" fill="#12355c" /><rect x="252" y="155" width="96" height="12" fill="#4c87cb" /><rect x="263" y="178" width="20" height="13" rx="3" fill="#e2efff" /><path d="M263 214h65" stroke="#91b8df" strokeWidth="5" strokeLinecap="round" /><circle cx="338" cy="215" r="13" fill="#e7f6ef" /><path d="m332 215 4 4 8-9" fill="none" stroke="#168565" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></g>}
          {kind === 'reports' && <g><path d="M260 231V128m0 103h87" stroke="#bdd0e2" strokeWidth="2" /><path d="m269 213 19-25 18 11 20-31 14 9" fill="none" stroke="#3477ce" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /><circle cx="340" cy="177" r="6" fill="#55b997" /><rect x="271" y="220" width="10" height="11" rx="2" fill="#bed6f0" /><rect x="291" y="213" width="10" height="18" rx="2" fill="#8eb3df" /><rect x="311" y="205" width="10" height="26" rx="2" fill="#5d93d3" /></g>}
          {kind === 'bills' && <g><path d="M270 126h60v116l-12-7-12 7-12-7-12 7-12-7z" fill="#fff" stroke="#5d91cb" strokeWidth="3" strokeLinejoin="round" /><path d="M282 151h35m-35 18h35m-35 18h25" stroke="#9db9d6" strokeWidth="3" strokeLinecap="round" /><circle cx="321" cy="219" r="13" fill="#e5f5ec" /><path d="m315 219 4 4 8-9" fill="none" stroke="#168565" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></g>}
          {kind === 'notifications' && <g><path d="M300 132c-21 0-33 17-33 39v23l-10 14h86l-10-14v-23c0-22-12-39-33-39z" fill="#dfeeff" stroke="#477fc2" strokeWidth="3" strokeLinejoin="round" /><path d="M289 218c2 12 20 12 22 0" fill="none" stroke="#477fc2" strokeWidth="3" strokeLinecap="round" /><circle cx="333" cy="139" r="11" fill="#55b997" stroke="#fff" strokeWidth="4" /></g>}
          {kind === 'profile' && <g><circle cx="300" cy="153" r="29" fill="#9fc3e9" /><path d="M247 242c5-34 25-51 53-51s48 17 53 51" fill="#d8e9f7" stroke="#4e88cb" strokeWidth="3" strokeLinecap="round" /><path d="m328 192 18 7v20c0 14-9 24-18 29-9-5-18-15-18-29v-20z" fill="#e1f5ed" stroke="#208366" strokeWidth="2.5" /><path d="m320 219 6 6 11-13" fill="none" stroke="#208366" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></g>}
        </>
      )}
    </svg>
  );
};

export default FinanceVector;
