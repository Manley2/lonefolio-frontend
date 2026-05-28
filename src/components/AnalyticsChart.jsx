import { useState, useRef, useEffect } from "react";

export default function AnalyticsChart() {
    // Mock data for SaaS system growth metrics
    const data = [
        { day: "Mon", signups: 10, sessions: 25 },
        { day: "Tue", signups: 18, sessions: 42 },
        { day: "Wed", signups: 14, sessions: 35 },
        { day: "Thu", signups: 28, sessions: 58 },
        { day: "Fri", signups: 20, sessions: 46 },
        { day: "Sat", signups: 35, sessions: 74 },
        { day: "Sun", signups: 50, sessions: 98 }
    ];

    const [activeIndex, setActiveIndex] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const svgRef = useRef(null);

    const width = 600;
    const height = 240;
    const paddingX = 40;
    const paddingY = 30;

    // Calculate Y axis scale
    const maxVal = 100; // Standardize scale up to 100%
    const chartWidth = width - 2 * paddingX;
    const chartHeight = height - 2 * paddingY;

    // Calculate coordinates for columns and line points
    const points = data.map((d, i) => {
        const x = paddingX + (i * chartWidth) / (data.length - 1);
        const ySignups = height - paddingY - (d.signups * chartHeight) / maxVal;
        const ySessions = height - paddingY - (d.sessions * chartHeight) / maxVal;
        return { x, ySignups, ySessions, ...d };
    });

    // Cubic Bezier curve path helper for Signups line
    const getBezierPath = (coords, key) => {
        if (coords.length === 0) return "";
        let d = `M ${coords[0].x} ${coords[0][key]}`;
        
        for (let i = 0; i < coords.length - 1; i++) {
            const p0 = coords[i];
            const p1 = coords[i + 1];
            
            const cp1x = p0.x + (p1.x - p0.x) / 3;
            const cp1y = p0[key];
            const cp2x = p0.x + (2 * (p1.x - p0.x)) / 3;
            const cp2y = p1[key];
            
            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1[key]}`;
        }
        return d;
    };

    const signupLinePath = getBezierPath(points, "ySignups");

    // Dynamic mouse movements for hovering calculations
    const handleMouseMove = (e) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        
        const mouseX = ((e.clientX - rect.left) / rect.width) * width;
        
        let closestIndex = 0;
        let minDiff = Infinity;
        
        points.forEach((p, idx) => {
            const diff = Math.abs(p.x - mouseX);
            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = idx;
            }
        });

        setActiveIndex(closestIndex);

        const tooltipX = e.clientX - rect.left;
        const tooltipY = e.clientY - rect.top;
        setTooltipPos({ x: tooltipX, y: tooltipY });
    };

    const handleMouseLeave = () => {
        setActiveIndex(null);
    };

    return (
        <div className="bg-white dark:bg-[#141824] border border-slate-200/60 dark:border-phoenix-border-dark p-6 rounded-2xl shadow-sm flex flex-col h-full transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="font-black text-xs tracking-wider uppercase text-slate-800 dark:text-white font-sans">
                        SaaS Traffic & Conversions
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                        Interactive columns & line combo chart (ECharts Inspired)
                    </p>
                </div>
                
                {/* Horizontal Chart Legend */}
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider select-none">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-blue-150 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-900 inline-block shadow-sm"></span>
                        <span className="text-slate-500 dark:text-slate-450">Sessions</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-1.5 rounded-full bg-[#3874ff] inline-block shadow-sm"></span>
                        <span className="text-slate-550 dark:text-slate-400">Signups</span>
                    </div>
                </div>
            </div>

            {/* SVG Content Panel */}
            <div className="relative flex-1" onMouseLeave={handleMouseLeave}>
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-full cursor-crosshair overflow-visible"
                    onMouseMove={handleMouseMove}
                >
                    <defs>
                        {/* Interactive Gradients */}
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3874ff" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#3874ff" stopOpacity="0.02" />
                        </linearGradient>
                        <linearGradient id="barGradientActive" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3874ff" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#3874ff" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>

                    {/* Horizontal Gridlines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                        const y = paddingY + ratio * chartHeight;
                        const labelValue = Math.round(maxVal - ratio * maxVal);
                        return (
                            <g key={i} className="opacity-45">
                                <line
                                    x1={paddingX}
                                    y1={y}
                                    x2={width - paddingX}
                                    y2={y}
                                    stroke="currentColor"
                                    className="text-slate-200 dark:text-slate-800/40"
                                    strokeWidth="0.8"
                                    strokeDasharray="4 6"
                                />
                                <text
                                    x={paddingX - 12}
                                    y={y + 4}
                                    textAnchor="end"
                                    className="text-[9px] font-bold fill-slate-400 dark:fill-slate-600 font-mono"
                                >
                                    {labelValue}
                                </text>
                            </g>
                        );
                    })}

                    {/* Y-Axis tick coordinates */}
                    {points.map((p, i) => (
                        <g key={i}>
                            <text
                                x={p.x}
                                y={height - paddingY + 18}
                                textAnchor="middle"
                                className="text-[10px] font-extrabold fill-slate-400 dark:fill-slate-500 font-sans uppercase tracking-wider"
                            >
                                {p.day}
                            </text>
                            {/* Hover Vertical Guide Line */}
                            {activeIndex === i && (
                                <line
                                    x1={p.x}
                                    y1={paddingY}
                                    x2={p.x}
                                    y2={height - paddingY}
                                    stroke="currentColor"
                                    className="text-slate-350 dark:text-slate-800"
                                    strokeWidth="1"
                                    strokeDasharray="2 3"
                                />
                            )}
                        </g>
                    ))}

                    {/* COLUMN BARS (Sessions Traffic) */}
                    {points.map((p, i) => {
                        const barWidth = 22;
                        const barHeight = (p.sessions * chartHeight) / maxVal;
                        const barX = p.x - barWidth / 2;
                        const barY = height - paddingY - barHeight;
                        const isActive = activeIndex === i;

                        return (
                            <rect
                                key={i}
                                x={barX}
                                y={barY}
                                width={barWidth}
                                height={Math.max(barHeight, 4)}
                                rx="4"
                                fill={isActive ? "url(#barGradientActive)" : "url(#barGradient)"}
                                stroke={isActive ? "#3874ff" : "currentColor"}
                                strokeWidth={isActive ? "1" : "0.5"}
                                className="text-slate-200/50 dark:text-phoenix-border-dark transition-all duration-300 cursor-pointer"
                            />
                        );
                    })}

                    {/* LINE GRAPH (New Signups Conversion) */}
                    <path
                        d={signupLinePath}
                        fill="none"
                        stroke="#3874ff"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        className="transition-all duration-300 ease-out"
                    />

                    {/* Interactive glowing dots on line chart */}
                    {points.map((p, i) => {
                        const isActive = activeIndex === i;
                        return (
                            <g key={i}>
                                <circle
                                    cx={p.x}
                                    cy={p.ySignups}
                                    r={isActive ? 6 : 3.5}
                                    fill="#3874ff"
                                    stroke="#ffffff"
                                    strokeWidth={isActive ? 2.5 : 1.5}
                                    className="transition-all duration-150 cursor-pointer shadow-sm"
                                />
                                {isActive && (
                                    <circle
                                        cx={p.x}
                                        cy={p.ySignups}
                                        r="10"
                                        fill="#3874ff"
                                        fillOpacity="0.25"
                                        className="animate-ping pointer-events-none"
                                    />
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* ECharts Styled HTML Tooltip Popup */}
                {activeIndex !== null && (
                    <div
                        className="absolute pointer-events-none bg-[#101424] dark:bg-[#101424] text-white p-3.5 rounded-xl shadow-xl text-[10px] border border-slate-200/80 dark:border-phoenix-border-dark backdrop-blur-md transition-all duration-75 min-w-[140px]"
                        style={{
                            left: `${tooltipPos.x + 18}px`,
                            top: `${tooltipPos.y - 35}px`,
                            transform: `translate(${tooltipPos.x + 180 > width ? "-125%" : "0%"}, -50%)`,
                        }}
                    >
                        <p className="font-black text-slate-400 dark:text-slate-500 mb-2 border-b border-slate-800/80 pb-1.5 uppercase tracking-wider font-sans">
                            {data[activeIndex].day} Overview
                        </p>
                        <div className="space-y-1.5 font-mono">
                            <div className="flex justify-between items-center gap-4">
                                <span className="text-slate-400 font-sans font-bold">Sessions:</span>
                                <span className="font-extrabold text-blue-300">{data[activeIndex].sessions} hits</span>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                                <span className="text-[#3874ff] font-sans font-bold">Signups:</span>
                                <span className="font-extrabold text-[#3874ff]">{data[activeIndex].signups} user</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
