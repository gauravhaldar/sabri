"use client";

export default function VideoBanner({
  src = "/hero.mp4",
  poster = "",
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  overlay = true,
  heightClass = "h-[60vh] sm:h-[80vh] md:h-screen",
  children,
}) {
  return (
    <section className={`relative ${heightClass} w-full overflow-hidden`}>
      <video
        className="absolute inset-0 h-full w-full object-cover object-center"
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        preload="metadata"
      />

      {overlay && (
        <div className="pointer-events-none absolute inset-0 bg-black/20" />
      )}

      <div className="relative z-10 flex h-full w-full items-center justify-center px-4">
        {children}
      </div>
    </section>
  );
}


