import React from 'react'

interface PncBrandLogoProps {
  collapsed?: boolean
  className?: string
}

export default function PncBrandLogo({
  collapsed = false,
  className = '',
}: PncBrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* 3D Liquid Pebbles Mark */}
      <div className="relative h-10 w-10 shrink-0">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full drop-shadow-[0_4px_8px_rgba(37,99,235,0.25)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="pncBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="pncOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="pncDarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>

          {/* Top Left Pebble - Blue */}
          <ellipse
            cx="35"
            cy="36"
            rx="19"
            ry="19"
            fill="url(#pncBlueGrad)"
          />
          {/* Specular highlight */}
          <ellipse
            cx="32"
            cy="29"
            rx="9"
            ry="4.5"
            fill="#ffffff"
            opacity="0.45"
            transform="rotate(-20 32 29)"
          />

          {/* Bottom Left Pebble - Orange */}
          <ellipse
            cx="38"
            cy="70"
            rx="18"
            ry="18"
            fill="url(#pncOrangeGrad)"
          />
          <ellipse
            cx="34"
            cy="63"
            rx="8"
            ry="4"
            fill="#ffffff"
            opacity="0.45"
            transform="rotate(-20 34 63)"
          />

          {/* Center Right Pebble - Deep Blue */}
          <ellipse
            cx="66"
            cy="52"
            rx="21"
            ry="21"
            fill="url(#pncDarkGrad)"
          />
          <ellipse
            cx="63"
            cy="43"
            rx="10"
            ry="5"
            fill="#ffffff"
            opacity="0.45"
            transform="rotate(-20 63 43)"
          />
        </svg>
      </div>

      {/* Brand Text */}
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black tracking-tight text-slate-800 dark:text-white leading-none">
              PNC
            </span>
          </div>
          <p className="mt-1 text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 leading-tight truncate tracking-tight">
            Better Skills, Brighter Future
          </p>
        </div>
      )}
    </div>
  )
}
