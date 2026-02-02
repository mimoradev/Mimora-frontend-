

// Loading fallback component - HYRUP Design System v3.0 with Geometric Animations
const PageLoader = () => (
    <div className="w-full h-screen flex items-center justify-center bg-(--bg-main) relative overflow-hidden">
        {/* Ambient grid background */}
        <div
            className="absolute inset-0 opacity-5"
            style={{
                backgroundImage: `
          linear-gradient(rgba(0,0,0,1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)
        `,
                backgroundSize: "32px 32px",
            }}
        />

        {/* Floating geometric decorations */}
        <div
            className="absolute top-[20%] left-[15%] w-16 h-16 border border-(--accent)/20 rotate-45"
            style={{ animation: "float-gentle 6s ease-in-out infinite" }}
        />
        <div
            className="absolute bottom-[25%] right-[20%] w-12 h-12 rounded-full border border-(--accent)/15"
            style={{ animation: "float-gentle 8s ease-in-out infinite 1s" }}
        />
        <div
            className="absolute top-[60%] left-[10%] w-8 h-8 border border-(--accent)/10 rotate-12"
            style={{ animation: "float-gentle 7s ease-in-out infinite 0.5s" }}
        />

        <div className="flex flex-col items-center gap-8 relative z-10">
            {/* Main geometric loader */}
            <div className="relative w-32 h-32">
                {/* Outer spinning hexagon */}
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                    style={{ animation: "spin 8s linear infinite" }}
                >
                    <polygon
                        points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="1"
                        opacity="0.3"
                    />
                </svg>

                {/* Middle counter-rotating square */}
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                    style={{ animation: "spin 6s linear infinite reverse" }}
                >
                    <rect
                        x="25"
                        y="25"
                        width="50"
                        height="50"
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="1.5"
                        opacity="0.5"
                        transform="rotate(45 50 50)"
                    />
                </svg>

                {/* Inner spinning triangle */}
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                    style={{ animation: "spin 4s linear infinite" }}
                >
                    <polygon
                        points="50,30 65,60 35,60"
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="2"
                        opacity="0.7"
                    />
                </svg>

                {/* Center pulsing dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-(--accent) rounded-full animate-pulse" />

                {/* Orbiting dots */}
                <div
                    className="absolute inset-0"
                    style={{ animation: "spin 3s linear infinite" }}
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-(--accent) rounded-full opacity-80" />
                </div>
                <div
                    className="absolute inset-0"
                    style={{ animation: "spin 3s linear infinite 1s" }}
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-(--accent) rounded-full opacity-60" />
                </div>
                <div
                    className="absolute inset-0"
                    style={{ animation: "spin 3s linear infinite 2s" }}
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-(--accent) rounded-full opacity-40" />
                </div>
            </div>

            {/* Loading text */}
            <div className="flex flex-col items-center gap-2">
                <div className="text-(--text-secondary) text-[14px] font-light tracking-wider uppercase">
                    Loading
                </div>
                {/* Animated dots */}
                <div className="flex gap-1.5">
                    <div
                        className="w-1.5 h-1.5 bg-(--accent) rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                    />
                    <div
                        className="w-1.5 h-1.5 bg-(--accent) rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                    />
                    <div
                        className="w-1.5 h-1.5 bg-(--accent) rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                    />
                </div>
            </div>
        </div>
    </div>
);

export default PageLoader;
