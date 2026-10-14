'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { FarmVideoItem } from '@/types';
import {
  getOptimizedVideoUrl,
  getOptimizedThumbnailUrl,
  getVideoEmbedUrl,
} from '@/lib/mediaOptimization';

interface FarmsSectionProps {
  videos: FarmVideoItem[];
  showHeader?: boolean;
}

export function extractYoutubeId(url: string): string {
  if (!url) return 'dQw4w9WgXcQ';
  if (url.includes('/shorts/')) {
    const match = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (match?.[1]) return match[1];
  }
  if (url.includes('v=')) {
    const match = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (match?.[1]) return match[1];
  }
  if (url.includes('youtu.be/')) {
    const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (match?.[1]) return match[1];
  }
  if (url.includes('/embed/')) {
    const match = url.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (match?.[1]) return match[1];
  }
  return 'dQw4w9WgXcQ';
}

export function isDirectVideoFile(url: string): boolean {
  if (!url) return false;
  return (
    url.startsWith('/uploads/') ||
    /\.(mp4|webm|mov|ogg|mkv)(\?.*)?$/i.test(url) ||
    url.includes('/video/upload/') ||
    url.includes('cloudinary.com')
  );
}

export function FarmsSection({ videos, showHeader = true }: FarmsSectionProps) {
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  // Published videos list
  const baseVideos = (videos && videos.length > 0 ? videos : []).filter(
    (v) => v.is_published !== false
  );

  // Audio mute state (default muted for browser compliance, toggleable)
  const [isMuted, setIsMuted] = useState(true);

  // Playing video tracking: only plays on explicit play button click!
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const currentPlayingIdRef = useRef<string | null>(null);

  // Mobile carousel active center index
  const initialIndex = baseVideos.findIndex((v) => v.is_featured);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );

  // DOM element refs
  const sectionRef = useRef<HTMLElement | null>(null);
  const mobileVideoRef = useRef<HTMLVideoElement | null>(null);
  const desktopVideoRef = useRef<HTMLVideoElement | null>(null);

  // Touch gesture tracking for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  // If list is small, replicate so loop is always seamless
  let displayVideos = [...baseVideos];
  if (displayVideos.length > 0 && displayVideos.length < 5) {
    displayVideos = [...displayVideos, ...displayVideos];
  }

  const total = displayVideos.length;

  // STOP ALL PLAYBACK: completely halts all video & iframe audio immediately
  const stopAllPlayback = useCallback(() => {
    // 1. Pause and reset HTML5 videos
    if (desktopVideoRef.current) {
      try {
        desktopVideoRef.current.pause();
        desktopVideoRef.current.currentTime = 0;
      } catch {
        // ignore
      }
    }
    if (mobileVideoRef.current) {
      try {
        mobileVideoRef.current.pause();
        mobileVideoRef.current.currentTime = 0;
      } catch {
        // ignore
      }
    }

    // 2. Query any playing video or iframe inside the section container to guarantee silence
    if (sectionRef.current) {
      const iframes = sectionRef.current.querySelectorAll('iframe');
      iframes.forEach((iframe) => {
        try {
          iframe.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'stopVideo', args: '' }),
            '*'
          );
          iframe.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'pauseVideo', args: '' }),
            '*'
          );
          iframe.src = 'about:blank';
        } catch {
          // ignore
        }
      });

      const allVideos = sectionRef.current.querySelectorAll('video');
      allVideos.forEach((vid) => {
        try {
          vid.pause();
          vid.currentTime = 0;
        } catch {
          // ignore
        }
      });
    }

    // 3. Clear playing video tracking
    currentPlayingIdRef.current = null;
    setPlayingVideoId(null);
  }, []);

  // START PLAYBACK: ensures only 1 video can ever play in the entire application
  const handlePlayVideo = useCallback(
    (id: string) => {
      // First, stop any local video
      stopAllPlayback();

      // Broadcast globally to kill any video instance across the whole site
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('fq:stop-all-videos', {
            detail: { sourceId: id },
          })
        );
      }

      currentPlayingIdRef.current = id;
      setPlayingVideoId(id);
    },
    [stopAllPlayback]
  );

  // 1. AUTO-STOP ON SCROLL: Stops video immediately when section scrolls out of view
  useEffect(() => {
    if (!playingVideoId || !sectionRef.current) return;

    // Use IntersectionObserver with conservative threshold
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.25) {
            stopAllPlayback();
          }
        }
      },
      {
        threshold: [0, 0.15, 0.25, 0.5],
      }
    );

    observer.observe(sectionRef.current);

    // Continuous scroll listener for immediate pixel-level detection
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (sectionRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight || document.documentElement.clientHeight;
          // If the section scrolled above or below the viewing window
          if (rect.bottom < 80 || rect.top > windowHeight - 80) {
            stopAllPlayback();
          }
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [playingVideoId, stopAllPlayback]);

  // 2. AUTO-STOP ON ROUTE CHANGE: Stop video if user navigates to another page
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      stopAllPlayback();
      prevPathnameRef.current = pathname;
    }
  }, [pathname, stopAllPlayback]);

  // 3. AUTO-STOP ON NAVIGATION CLICK, TAB SWITCH, UNMOUNT, AND GLOBAL SYNC
  useEffect(() => {
    // Capture-phase link click interceptor: stops video BEFORE page unloads
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest('a');
      if (link && link.href) {
        stopAllPlayback();
      }
    };

    // Tab switch / app minimize: stop background playback
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAllPlayback();
      }
    };

    // Global event listener: if another video starts anywhere, stop this one
    const handleGlobalStop = (e: Event) => {
      const customEvent = e as CustomEvent<{ sourceId?: string }>;
      if (customEvent.detail?.sourceId !== currentPlayingIdRef.current) {
        stopAllPlayback();
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', stopAllPlayback);
    window.addEventListener('beforeunload', stopAllPlayback);
    window.addEventListener('fq:stop-all-videos', handleGlobalStop);

    // Broadcast on mount so any lingering video from the previous route terminates
    window.dispatchEvent(new CustomEvent('fq:stop-all-videos'));

    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', stopAllPlayback);
      window.removeEventListener('beforeunload', stopAllPlayback);
      window.removeEventListener('fq:stop-all-videos', handleGlobalStop);
      stopAllPlayback();
    };
  }, [stopAllPlayback]);

  // Sync mute state to HTML5 video element if active
  useEffect(() => {
    if (mobileVideoRef.current) {
      mobileVideoRef.current.muted = isMuted;
    }
    if (desktopVideoRef.current) {
      desktopVideoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  if (!displayVideos || displayVideos.length === 0) return null;

  // Looped slide navigation handlers
  const handlePrev = () => {
    stopAllPlayback();
    setMobileActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    stopAllPlayback();
    setMobileActiveIndex((prev) => (prev + 1) % total);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null) {
      if (touchDeltaX.current < -35) {
        handleNext();
      } else if (touchDeltaX.current > 35) {
        handlePrev();
      }
      touchStartX.current = null;
      touchDeltaX.current = 0;
    }
  };

  // Helper to compute loop offset relative to active center card
  const getOffset = (index: number) => {
    let diff = (index - mobileActiveIndex) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff -= total;
    return diff;
  };

  return (
    <section
      ref={sectionRef}
      id="farms"
      className="relative py-10 sm:py-14 lg:py-16 bg-[#fbfdfb] overflow-hidden scroll-mt-20"
    >
      <span id="videos" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <span id="farm-videos" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Shown on Home page, omitted on /farms page) */}
        {showHeader && (
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-[11px] sm:text-xs font-bold tracking-wider text-[#15803d] uppercase">
              OUR FARMS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mt-1 mb-2">
              <span className="block sm:inline whitespace-normal sm:whitespace-nowrap">
                Real Farms. Real People.
              </span>{' '}
              <span className="inline-block whitespace-nowrap">Real Work.</span>
            </h2>
            <div className="w-12 h-1 bg-[#f97316] rounded-full mx-auto mb-3" />
            <p className="text-xs sm:text-sm lg:text-[15px] text-gray-600">
              Take a look at our farms, harvesting process and behind-the-scenes moments.
            </p>
          </div>
        )}

        {/* ======================================================== */}
        {/* DESKTOP LAYOUT: 5 Cards Arranged on One Row              */}
        {/* ======================================================== */}
        <div className="hidden md:grid md:grid-cols-5 gap-3.5 lg:gap-4 xl:gap-5 items-stretch">
          {displayVideos.slice(0, 5).map((video) => {
            const isPlaying = playingVideoId === `desktop-${video.id}`;
            const isUploaded = isDirectVideoFile(video.video_url);
            const ytId = extractYoutubeId(video.video_url);

            return (
              <div
                key={`desktop-${video.id}`}
                className="relative w-full aspect-[9/16] rounded-2xl lg:rounded-3xl overflow-hidden bg-gray-950 border border-gray-200/90 shadow-md hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1.5 flex flex-col justify-end"
              >
                {/* Playing Video Layer */}
                {isPlaying ? (
                  <div className="absolute inset-0 z-20 bg-black">
                    {isUploaded ? (
                      <video
                        ref={desktopVideoRef}
                        src={video.video_url}
                        autoPlay
                        playsInline
                        muted={isMuted}
                        onEnded={stopAllPlayback}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <iframe
                        src={getVideoEmbedUrl(video.video_url, true)}
                        title={video.title}
                        className="w-full h-full border-0 pointer-events-auto"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    )}

                    {/* Desktop Close/Stop Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        stopAllPlayback();
                      }}
                      className="absolute top-3 left-3 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center text-xs font-bold transition-all shadow-md backdrop-blur-xs"
                      title="Close Video"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  /* Thumbnail Layer with Centered Play Button */
                  <div className="absolute inset-0">
                    <Image
                      src={getOptimizedThumbnailUrl(video.thumbnail_url, video.video_url)}
                      alt={video.title}
                      fill
                      sizes="(max-width: 1200px) 20vw, 240px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                      unoptimized={
                        video.thumbnail_url?.startsWith('/images/') ||
                        video.thumbnail_url?.includes('img.youtube.com')
                      }
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 pointer-events-none" />

                    {/* Center Play Button: Video ONLY plays on this button click */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayVideo(`desktop-${video.id}`);
                        }}
                        className="w-13 h-13 lg:w-15 lg:h-15 rounded-full bg-black/45 backdrop-blur-sm border border-white/80 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#15803d]/90 active:scale-95 transition-all duration-300 shadow-xl"
                        aria-label={`Play ${video.title}`}
                      >
                        <svg className="w-6 h-6 lg:w-7 lg:h-7 fill-current ml-1" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Top Badge (Featured or Duration) */}
                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                  {video.is_featured ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#f97316] text-white shadow-md">
                      Featured
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-white/90 bg-black/50 backdrop-blur-xs border border-white/10">
                      {video.duration || '0:45'}
                    </span>
                  )}
                </div>

                {/* Top Right Sound Toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="absolute top-3 right-3 z-30 w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-all shadow-md active:scale-95"
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                </button>

                {/* Bottom Details Overlay */}
                <div className="relative z-10 p-3.5 lg:p-4 text-white pointer-events-none">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      firstQuality Farm
                    </span>
                  </div>
                  <h3 className="text-xs lg:text-sm font-bold text-white group-hover:text-emerald-200 transition-colors line-clamp-2 leading-snug">
                    {video.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* MOBILE RESPONSIVE LAYOUT (Referral Image Structure)      */}
        {/* Center card is bigger; two side cards; infinite loop;    */}
        {/* Play ONLY on play button click; stops on slide or end    */}
        {/* ======================================================== */}
        <div className="block md:hidden">
          <div
            className="relative w-full py-2 flex flex-col items-center select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Stage Container: Holds the center card and the two side cards */}
            <div className="relative w-full h-[470px] sm:h-[510px] flex items-center justify-center overflow-hidden">
              {displayVideos.map((video, index) => {
                const offset = getOffset(index);
                const isCenter = offset === 0;
                const isLeft = offset === -1;
                const isRight = offset === 1;
                const isVisible = isCenter || isLeft || isRight;

                if (!isVisible) return null;

                const isPlaying = isCenter && playingVideoId === `mobile-${video.id}`;
                const isUploaded = isDirectVideoFile(video.video_url);
                const ytId = extractYoutubeId(video.video_url);

                // Compute positioning & scale: Center card is distinctly BIGGER than side cards
                let transformStyle = '';
                let opacityStyle = 0;
                let zIndexStyle = 10;

                if (isCenter) {
                  transformStyle = 'translateX(0%) scale(1)';
                  opacityStyle = 1;
                  zIndexStyle = 20;
                } else if (isLeft) {
                  transformStyle = 'translateX(-74%) scale(0.82)';
                  opacityStyle = 0.45;
                  zIndexStyle = 10;
                } else if (isRight) {
                  transformStyle = 'translateX(74%) scale(0.82)';
                  opacityStyle = 0.45;
                  zIndexStyle = 10;
                }

                return (
                  <div
                    key={`mobile-${video.id}-${index}`}
                    onClick={() => {
                      if (isLeft) handlePrev();
                      if (isRight) handleNext();
                    }}
                    style={{
                      transform: transformStyle,
                      opacity: opacityStyle,
                      zIndex: zIndexStyle,
                    }}
                    className={`absolute w-[248px] sm:w-[275px] aspect-[9/16] rounded-3xl overflow-hidden bg-gray-950 border border-gray-200/90 shadow-xl transition-all duration-400 ease-out ${
                      isCenter
                        ? 'shadow-2xl ring-2 ring-emerald-500/20'
                        : 'cursor-pointer hover:opacity-60'
                    }`}
                  >
                    {/* Video Player when user clicks PLAY */}
                    {isPlaying ? (
                      <div className="absolute inset-0 z-20 bg-black rounded-3xl">
                        {isUploaded ? (
                          <video
                            ref={mobileVideoRef}
                            src={video.video_url}
                            autoPlay
                            playsInline
                            muted={isMuted}
                            onEnded={stopAllPlayback}
                            className="w-full h-full object-cover rounded-3xl"
                          />
                        ) : (
                          <iframe
                            src={getVideoEmbedUrl(video.video_url, true)}
                            title={video.title}
                            className="w-full h-full border-0 pointer-events-auto rounded-3xl"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          />
                        )}

                        {/* Mobile Close/Stop Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            stopAllPlayback();
                          }}
                          className="absolute top-3 left-3 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center text-xs font-bold transition-all shadow-md backdrop-blur-xs"
                          title="Close Video"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      /* Thumbnail / Cover with Play Button Overlay */
                      <div className="absolute inset-0 rounded-3xl">
                        <Image
                          src={getOptimizedThumbnailUrl(video.thumbnail_url, video.video_url)}
                          alt={video.title}
                          fill
                          sizes="280px"
                          className="object-cover rounded-3xl"
                          unoptimized={
                            video.thumbnail_url?.startsWith('/images/') ||
                            video.thumbnail_url?.includes('img.youtube.com')
                          }
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10 rounded-3xl" />

                        {/* Centered Play Button: Only plays on this button click */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isCenter) {
                                handlePlayVideo(`mobile-${video.id}`);
                              } else if (isLeft) {
                                handlePrev();
                              } else if (isRight) {
                                handleNext();
                              }
                            }}
                            className={`rounded-full bg-white/30 backdrop-blur-md border border-white/80 flex items-center justify-center text-white shadow-xl transition-all ${
                              isCenter
                                ? 'w-14 h-14 active:scale-95 hover:scale-105'
                                : 'w-11 h-11 pointer-events-none'
                            }`}
                            aria-label={`Play ${video.title}`}
                          >
                            <svg
                              className={`fill-current ml-0.5 ${
                                isCenter ? 'w-6 h-6' : 'w-4 h-4'
                              }`}
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Speaker / Audio Mute Button in Top-Right (Matches Referral Image) */}
                    {isCenter && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted(!isMuted);
                        }}
                        className="absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-all shadow-lg active:scale-90"
                        title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                        aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                      >
                        {isMuted ? (
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                          </svg>
                        )}
                      </button>
                    )}

                    {/* Top Left Badge */}
                    <div className="absolute top-3.5 left-3.5 z-10 pointer-events-none">
                      {video.is_featured ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#f97316] text-white shadow-md">
                          Featured
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-white/90 bg-black/50 backdrop-blur-xs border border-white/10">
                          {video.duration || '0:45'}
                        </span>
                      )}
                    </div>

                    {/* Bottom Caption Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none text-white z-10 rounded-b-3xl">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                          firstQuality Farm
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-tight">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                );
              })}

              {/* Navigation Left Circular Button (Referral Image Style) */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/95 text-gray-800 shadow-xl flex items-center justify-center hover:bg-white active:scale-90 transition-transform"
                aria-label="Previous Video"
              >
                <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Navigation Right Circular Button (Referral Image Style) */}
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/95 text-gray-800 shadow-xl flex items-center justify-center hover:bg-white active:scale-90 transition-transform"
                aria-label="Next Video"
              >
                <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Pagination Indicators (Elongated Active Pill + Small Circular Dots) */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {displayVideos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setPlayingVideoId(null);
                    setMobileActiveIndex(i);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    i === mobileActiveIndex
                      ? 'w-7 h-1.5 bg-gray-900 shadow-sm'
                      : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FarmsSection;
