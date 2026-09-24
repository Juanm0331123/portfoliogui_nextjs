/**
 * Data Bridge has no screen to show, so its slide shows the thing itself: two
 * systems and the bridge between them. Node names and protocol terms are
 * proper nouns and stay as they are in both languages.
 */
export function DataBridgeDiagram({ label }: { label: string }) {
    return (
        <svg viewBox="0 0 800 420" role="img" aria-label={label} className="h-full w-full">
            <defs>
                <pattern id="bridge-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="currentColor" opacity="0.12" />
                </pattern>
                <linearGradient id="bridge-flow" x1="0" x2="1">
                    <stop offset="0" stopColor="var(--accent)" stopOpacity="0" />
                    <stop offset="0.5" stopColor="var(--accent)" stopOpacity="1" />
                    <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
            </defs>
            <rect width="800" height="420" fill="url(#bridge-grid)" className="text-ink" />

            <g fill="none" stroke="currentColor" strokeWidth="1" className="text-ink-muted">
                <rect x="60" y="170" width="170" height="80" rx="4" />
                <rect x="315" y="150" width="170" height="120" rx="4" stroke="var(--accent)" />
                <rect x="570" y="170" width="170" height="80" rx="4" />
                <path d="M230 200 H315" />
                <path d="M315 220 H230" strokeDasharray="3 5" />
                <path d="M485 200 H570" />
                <path d="M570 220 H485" strokeDasharray="3 5" />
            </g>
            <path d="M230 200 H570" stroke="url(#bridge-flow)" strokeWidth="2" fill="none" />

            <g className="fill-ink font-mono" fontSize="15" textAnchor="middle">
                <text x="145" y="215">PostgreSQL</text>
                <text x="400" y="205">Data Bridge</text>
                <text x="655" y="215">Zoho Analytics</text>
            </g>
            <g className="fill-ink-muted font-mono" fontSize="11" letterSpacing="2" textAnchor="middle">
                <text x="400" y="232">FASTAPI · ASYNC</text>
                <text x="272" y="188">UPSERT</text>
                <text x="528" y="188">OAUTH</text>
                <text x="400" y="330">/api/v1/sync</text>
            </g>
        </svg>
    )
}
