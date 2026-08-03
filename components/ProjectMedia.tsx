"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaItem, Project } from "@/lib/projects";

function FlipCard({
  front,
  back,
  alt,
}: {
  front: string;
  back: string;
  alt?: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      className={`flip-card${flipped ? " is-flipped" : ""}`}
      onClick={() => setFlipped((v) => !v)}
      aria-label={alt ? `${alt} (click to flip)` : "Flip card"}
    >
      <span className="flip-card__inner">
        <span className="flip-card__face">
          <Image src={front} alt={alt ?? ""} fill sizes="50vw" />
        </span>
        <span className="flip-card__face flip-card__back">
          <Image src={back} alt="" fill sizes="50vw" />
        </span>
      </span>
    </button>
  );
}

function ProjectVideo({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    el.defaultMuted = true;
    el.muted = true;
    el.playsInline = true;
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "");
    el.setAttribute("muted", "");

    const tryPlay = () => {
      el.muted = true;
      void el.play().catch(() => {});
    };

    tryPlay();
    el.addEventListener("loadeddata", tryPlay);
    el.addEventListener("canplay", tryPlay);

    const unlock = () => tryPlay();
    window.addEventListener("touchstart", unlock, { passive: true, once: true });
    window.addEventListener("scroll", unlock, { passive: true, once: true });

    return () => {
      el.removeEventListener("loadeddata", tryPlay);
      el.removeEventListener("canplay", tryPlay);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("scroll", unlock);
    };
  }, [src]);

  const toggleMute = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    const next = !el.muted;
    el.muted = next;
    setMuted(next);
    void el.play().catch(() => {});
  }, []);

  return (
    <button
      type="button"
      className={`project-video${muted ? " is-muted" : " is-unmuted"}`}
      onClick={toggleMute}
      aria-label={muted ? "Unmute video" : "Mute video"}
      aria-pressed={!muted}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
      />
      <span className="project-video__hint" aria-hidden>
        {muted ? (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11 5L6 9H3v6h3l5 4V5z"
              fill="currentColor"
            />
            <path
              d="M16.5 8.5l5 5M21.5 8.5l-5 5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11 5L6 9H3v6h3l5 4V5z"
              fill="currentColor"
            />
            <path
              d="M15.5 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
    </button>
  );
}

function Media({ item }: { item: MediaItem }) {
  if (item.type === "video") {
    return (
      <div className="media-block media-block--wide">
        <ProjectVideo src={item.src} poster={item.poster} />
      </div>
    );
  }

  if (item.type === "card-pair") {
    return (
      <FlipCard front={item.front} back={item.back} alt={item.alt} />
    );
  }

  return (
    <div className="media-block">
      <Image
        src={item.src}
        alt={item.alt ?? ""}
        width={1600}
        height={1200}
        sizes="(max-width: 900px) 100vw, 80vw"
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
}

export function ProjectMedia({ project }: { project: Project }) {
  const { media, layout = "wide" } = project;

  if (layout === "harbor") {
    const [logo, ...cards] = media;
    return (
      <div className="project-body">
        {logo && logo.type === "image" && (
          <div className="media-block media-block--wide">
            <Image
              src={logo.src}
              alt={logo.alt ?? ""}
              width={1654}
              height={945}
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </div>
        )}
        {cards
          .filter((m) => m.type === "card-pair")
          .map((m, i) =>
            m.type === "card-pair" ? (
              <div className="card-pair" key={i}>
                <Image
                  src={m.front}
                  alt={m.alt ?? ""}
                  width={756}
                  height={432}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 24,
                  }}
                />
                <Image
                  src={m.back}
                  alt=""
                  width={756}
                  height={432}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: 24,
                  }}
                />
              </div>
            ) : null,
          )}
      </div>
    );
  }

  if (layout === "stills" || layout === "album") {
    const images = media.filter((m) => m.type === "image");
    return (
      <div className="project-body">
        <div className={layout === "album" ? "media-grid-3" : "media-grid-3"}>
          {images.map((m, i) =>
            m.type === "image" ? (
              <div className="media-block" key={i}>
                <Image
                  src={m.src}
                  alt={m.alt ?? ""}
                  width={800}
                  height={800}
                  sizes="(max-width: 900px) 100vw, 33vw"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            ) : null,
          )}
        </div>
      </div>
    );
  }

  if (layout === "centered") {
    return (
      <div className="project-body">
        {media.map((item, i) => (
          <div className="media-block media-block--centered" key={i}>
            <Media item={item} />
          </div>
        ))}
      </div>
    );
  }

  // Full-width stacked images (optional centered frames, e.g. Rebel menu)
  if (layout === "stacked") {
    return (
      <div className="project-body">
        {media.map((item, i) => {
          if (item.type === "image") {
            const frameClass =
              item.frame === "centered"
                ? "media-block media-block--centered"
                : item.frame === "wide"
                  ? "media-block media-block--wide"
                  : "media-block media-block--full";
            return (
              <div className={frameClass} key={i}>
                <Image
                  src={item.src}
                  alt={item.alt ?? ""}
                  width={item.frame === "centered" ? 800 : 1685}
                  height={item.frame === "centered" ? 1200 : 1100}
                  sizes={
                    item.frame === "centered"
                      ? "(max-width: 900px) 100vw, 735px"
                      : "(max-width: 900px) 100vw, 1685px"
                  }
                  style={{ width: "100%", height: "auto" }}
                  priority={i === 0}
                />
              </div>
            );
          }
          return <Media item={item} key={i} />;
        })}
      </div>
    );
  }

  // Default / wide: first media featured, remaining in 2-col if images
  const [first, ...rest] = media;
  const restImages = rest.filter((m) => m.type === "image");
  const restOther = rest.filter((m) => m.type !== "image");

  return (
    <div className="project-body">
      {first && (
        <div
          className={
            layout === "wide" || first.type === "video"
              ? "media-block media-block--wide"
              : "media-block"
          }
        >
          <Media item={first} />
        </div>
      )}
      {restOther.map((item, i) => (
        <Media item={item} key={`other-${i}`} />
      ))}
      {restImages.length > 0 && (
        <div className="media-grid-2">
          {restImages.map((item, i) => (
            <Media item={item} key={`img-${i}`} />
          ))}
        </div>
      )}
    </div>
  );
}
