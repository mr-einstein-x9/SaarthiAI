"use client";

interface BackgroundProps {
  dimmed?: boolean;
}

export default function Background({ dimmed = false }: BackgroundProps) {
  return (
    <>
      {/* Layer -4: Krishna sunset parallax */}
      <div
        className={`krishna-bg fixed inset-[-2.5%] z-[-4] pointer-events-none bg-cover transition-[filter] duration-[2s] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          dimmed
            ? "brightness-[0.55] contrast-100 saturate-[0.85]"
            : "brightness-[1.15] contrast-110 saturate-110"
        }`}
        style={{
          backgroundImage: "url('/krishna-sunset.png')",
          backgroundPosition: "34% center",
          animation: "sunset-drift 42s ease-in-out infinite alternate",
        }}
        aria-hidden="true"
      />

      {/* Layer -3: Warm golden radial */}
      <div
        className="fixed inset-0 z-[-3] pointer-events-none"
        style={{
          background: `
            linear-gradient(90deg, rgba(6,4,3,0.12) 0%, transparent 36%, rgba(6,4,3,0.1) 100%),
            radial-gradient(ellipse at 30% 43%, rgba(255,183,82,0.24), rgba(255,183,82,0.05) 28%, transparent 58%)
          `,
          animation: "sunset-breathe 18s ease-in-out infinite",
        }}
        aria-hidden="true"
      />

      {/* Layer -2: Haze overlay */}
      <div
        className="fixed inset-0 z-[-2] pointer-events-none opacity-60"
        style={{
          background: `
            linear-gradient(105deg, transparent 0%, rgba(245,201,126,0.07) 38%, transparent 70%),
            linear-gradient(0deg, rgba(14,9,6,0.42), transparent 38%, rgba(9,6,5,0.18))
          `,
          mixBlendMode: "screen",
          animation: "haze-pass 34s ease-in-out infinite alternate",
        }}
        aria-hidden="true"
      />

      {/* Layer -1: Canopy gradient */}
      <div
        className="fixed inset-0 z-[-1] pointer-events-none opacity-60"
        style={{
          background: `
            linear-gradient(175deg, rgba(7,5,3,0.15) 0%, transparent 20%),
            linear-gradient(90deg, rgba(5,4,3,0.12) 0%, transparent 30%, transparent 76%, rgba(5,4,3,0.1) 100%)
          `,
          animation: "canopy-sway 30s ease-in-out infinite alternate",
        }}
        aria-hidden="true"
      />
    </>
  );
}
