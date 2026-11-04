"use client";

import { useMemo } from "react";
import { mapBackground, type ViewBox } from "@/lib/map";

export interface MapPin { slug: string; x: number; y: number; label: string }

export function MapSvg({
  vb, pins, labels, aria, dim, active, onPin,
}: {
  vb: ViewBox;
  pins: MapPin[];
  labels: { volcano: string; lake: string };
  aria: string;
  dim?: Set<string>;
  active?: string | null;
  onPin?: (slug: string) => void;
}) {
  const bg = useMemo(() => mapBackground(labels), [labels]);
  return (
    <svg role="img" aria-label={aria} viewBox={`${vb.x.toFixed(1)} ${vb.y.toFixed(1)} ${vb.w.toFixed(1)} ${vb.h.toFixed(1)}`}>
      <g dangerouslySetInnerHTML={{ __html: bg }} />
      <g>
        {pins.map((p) => (
          <g
            key={p.slug}
            className={`pin ${dim?.has(p.slug) ? "dim" : ""} ${active === p.slug ? "active" : ""}`}
            transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}
            tabIndex={onPin ? 0 : -1}
            role={onPin ? "button" : undefined}
            aria-label={p.label}
            onClick={onPin ? (e) => { e.stopPropagation(); onPin(p.slug); } : undefined}
            onKeyDown={onPin ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPin(p.slug); } } : undefined}
          >
            <g transform={`scale(${vb.pinScale.toFixed(2)})`}>
              <g className="body">
                <path d="M0 0C-3-8-14-15-14-26A14 14 0 1 1 14-26C14-15 3-8 0 0Z" fill="#A6FF00" stroke="#0B0B0B" strokeWidth="2" />
                <circle cy="-26" r="5.5" fill="#0B0B0B" />
                <circle cy="-24" r="22" fill="transparent" />
              </g>
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}
