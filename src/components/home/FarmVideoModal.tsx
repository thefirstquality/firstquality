'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { FarmVideoItem, HeroPopupVideoItem } from '@/types';
import { DEFAULT_HERO_POPUP_VIDEOS, DEFAULT_FARM_VIDEOS } from '@/services/defaults';
import {
  extractYoutubeId,
  isDirectVideoFile,
  getOptimizedVideoUrl,
  getOptimizedThumbnailUrl,
  detectVideoPlatform,
  getVideoEmbedUrl,
} from '@/lib/mediaOptimization';

export type ModalVideoItem = FarmVideoItem | HeroPopupVideoItem;

interface FarmVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos?: ModalVideoItem[];
  initialVideoId?: string;
  badgeTitle?: string;
}

export function FarmVideoModal({
  isOpen,
  onClose,
  videos = [],
  initialVideoId,
  badgeTitle = 'Farm Footage',
}: FarmVideoModalProps) {
  // Stable memoized videos list
  const publishedVideos = useMemo<ModalVideoItem[]>(() => {
    return (videos && videos.length > 0 ? videos : DEFAULT_HERO_POPUP_VIDEOS)
      .filter((v: any) => v.is_published !== false)
      .map((v, i) => ({
        ...v,
        id: v.id || `v-${i}`,
      }));
  }, [videos]);

  const [activeVideoId, setActiveVideoId] = useState<string>(() => {
    if (initialVideoId && publishedVideos.some((v) => v.id === initialVideoId)) {
      return initialVideoId;
    }
    const featured = publishedVideos.find((v: any) => v.is_featured);
    return featured?.id || publishedVideos[0]?.id || 'default';
  });

  // Explicit play state: DO NOT PLAY AUTOMATICALLY. Only load & play on explicit user click!
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const backdropRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const prevIsOpenRef = useRef<boolean>(false);

  // Only reset isPlaying when modal opens from closed state, NOT on every render!
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setIsPlaying(false);
      if (initialVideoId && publishedVideos.some((v) => v.id === initialVideoId)) {
        setActiveVideoId(initialVideoId);
      } else {
        const featured = publishedVideos.find((v: any) => v.is_featured);
        setActiveVideoId(featured?.id || publishedVideos[0]?.id || 'default');
      }
    } else if (!isOpen && prevIsOpenRef.current) {
      setIsPlaying(false);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, initialVideoId, publishedVideos]);

  // Handle closing cleanly: stop video, stop audio, dispatch global event
  const handleClose = useCallback(() => {
    setIsPlaying(false);

    if (videoElementRef.current) {
      try {
        videoElementRef.current.pause();
        videoElementRef.current.currentTime = 0;
      } catch {
        // ignore
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fq:stop-all-videos'));
    }

    onClose();
  }, [onClose]);

  // Escape key and backdrop scroll lock
  useEffect(() => {
    if (!isOpen) return;

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fq:stop-all-videos'));
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const currentVideo =
    publishedVideos.find((v) => v.id === activeVideoId) || publishedVideos[0];
  const isDirect = currentVideo ? isDirectVideoFile(currentVideo.video_url) : false;
  const ytId = currentVideo ? extractYoutubeId(currentVideo.video_url) : '';
  const optimizedVideoUrl = currentVideo ? getOptimizedVideoUrl(currentVideo.video_url) : '';
  const posterUrl = currentVideo
    ? getOptimizedThumbnailUrl(currentVideo.thumbnail_url || '', currentVideo.video_url)
    : '/images/farm-harvesting.jpg';

  // Switching videos resets playback so no background video downloads happen
  const handleSelectVideo = (videoId: string) => {
    if (videoId !== activeVideoId) {
      setIsPlaying(false);
      setActiveVideoId(videoId);
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={(e) => {
        if (e.target === backdropRef.current) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      aria-modal="true"
      role="dialog"
      aria-labelledby="farm-video-modal-title"
    >
      <div className="relative w-full max-w-xl sm:max-w-2xl bg-[#09120e] border border-emerald-500/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-emerald-950/70 via-[#09120e] to-[#09120e] border-b border-emerald-500/20">
          <div className="flex items-center gap-2.5 min-w-0 pr-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-base flex-shrink-0 shadow-inner">
              🎬
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold tracking-wider text-emerald-400 uppercase">
                  Farm Footage
                </span>
                {isPlaying && (
                  <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-300 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Playing
                  </span>
                )}
              </div>
              <h3
                id="farm-video-modal-title"
                className="text-xs sm:text-sm font-bold text-white truncate max-w-[220px] sm:max-w-md"
              >
                {currentVideo?.title || 'Farm Video'}
              </h3>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
            aria-label="Close video popup"
          >
            <svg
              className="w-4 h-4 sm:w-4.5 sm:h-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video Player Box */}
        <div className="p-3 sm:p-5 flex-1 overflow-y-auto">
          <div className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-emerald-500/20 shadow-2xl">
            {currentVideo ? (
              isPlaying ? (
                /* Active Video Player: ONLY rendered when user clicks Play */
                <div className="relative w-full h-full bg-black">
                  {isDirect ? (
                    <video
                      ref={videoElementRef}
                      key={currentVideo.id}
                      src={currentVideo.video_url}
                      controls
                      autoPlay
                      playsInline
                      onEnded={() => setIsPlaying(false)}
                      className="w-full h-full object-contain bg-black"
                    />
                  ) : (
                    <iframe
                      key={currentVideo.id}
                      src={getVideoEmbedUrl(currentVideo.video_url, true)}
                      title={currentVideo.title}
                      className="w-full h-full border-0 pointer-events-auto"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  )}

                  {/* Top-Right Stop/Reset Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (videoElementRef.current) {
                        try {
                          videoElementRef.current.pause();
                        } catch {
                          // ignore
                        }
                      }
                      setIsPlaying(false);
                    }}
                    className="absolute top-2.5 right-2.5 z-20 px-2 py-1 rounded-md bg-black/75 hover:bg-black text-white text-[10px] font-semibold flex items-center gap-1 border border-white/20 backdrop-blur-xs transition-all shadow-md cursor-pointer"
                    title="Stop video and return to preview"
                  >
                    <span>⏹</span>
                    <span>Stop</span>
                  </button>
                </div>
              ) : (
                /* Poster Preview Layer (0 Video Bandwidth used until Clicked) */
                <div
                  onClick={() => setIsPlaying(true)}
                  className="relative w-full h-full group/poster cursor-pointer"
                  title="Click to play video"
                >
                  <Image
                    src={posterUrl}
                    alt={currentVideo.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 680px"
                    className="object-cover group-hover/poster:scale-102 transition-transform duration-500 opacity-90"
                    unoptimized={
                      posterUrl.startsWith('/images/') ||
                      posterUrl.includes('img.youtube.com')
                    }
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30 pointer-events-none" />

                  {/* Duration Badge */}
                  {currentVideo.duration && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/80 border border-white/20 text-[11px] font-semibold text-white/95 backdrop-blur-xs pointer-events-none">
                      ⏱ {currentVideo.duration}
                    </span>
                  )}

                  {/* Center Play Button: ONLY action that starts playback */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 p-4 z-10 pointer-events-none">
                    <div
                      className="group-hover/poster:scale-110 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:shadow-emerald-500/40 active:scale-95 transition-all duration-300 border-2 border-white/90"
                      aria-label={`Play ${currentVideo.title}`}
                    >
                      <svg
                        className="w-6 h-6 sm:w-7 sm:h-7 translate-x-0.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>

                    <div className="text-center pointer-events-none">
                      <p className="text-xs sm:text-sm font-bold text-white drop-shadow-md">
                        Click to Watch Video
                      </p>
                      <p className="text-[10px] text-emerald-300 font-medium">
                        Plays on demand • No automatic data usage
                      </p>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-gray-400">
                No video available
              </div>
            )}
          </div>

          {/* Video Switcher / Playlist */}
          {publishedVideos.length > 1 && (
            <div className="mt-3.5 sm:mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Available Videos ({publishedVideos.length})
                </span>
                <span className="text-[10px] sm:text-[11px] text-emerald-400 font-medium">
                  Select a video to preview
                </span>
              </div>

              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-0.5 scrollbar-thin scrollbar-thumb-emerald-700/50 scrollbar-track-transparent">
                {publishedVideos.map((video) => {
                  const isCurrent = video.id === activeVideoId;
                  const thumb = getOptimizedThumbnailUrl(video.thumbnail_url || '', video.video_url);

                  return (
                    <button
                      key={video.id || video.title}
                      type="button"
                      onClick={() => handleSelectVideo(video.id || '')}
                      className={`relative flex-shrink-0 w-28 sm:w-36 rounded-xl overflow-hidden border text-left transition-all duration-200 group/thumb cursor-pointer ${
                        isCurrent
                          ? 'border-emerald-500 ring-2 ring-emerald-500/50 bg-emerald-950/60 scale-[1.02]'
                          : 'border-white/10 bg-white/5 hover:border-emerald-500/40 hover:bg-white/10 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="relative aspect-[16/10] w-full bg-black/60 overflow-hidden">
                        <Image
                          src={thumb}
                          alt={video.title}
                          fill
                          sizes="144px"
                          className="object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                          unoptimized={
                            thumb.startsWith('/images/') ||
                            thumb.includes('img.youtube.com')
                          }
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                        {/* Playing badge or Duration */}
                        {isCurrent && isPlaying ? (
                          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-emerald-600 text-[9px] font-bold text-white flex items-center gap-1 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Playing
                          </div>
                        ) : null}

                        {video.duration ? (
                          <span className="absolute bottom-1 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-semibold text-white/90">
                            {video.duration}
                          </span>
                        ) : null}
                      </div>

                      <div className="p-1.5 sm:p-2 bg-[#0b1611]">
                        <p
                          className={`text-[11px] sm:text-xs font-semibold truncate ${
                            isCurrent ? 'text-emerald-300' : 'text-gray-200'
                          }`}
                        >
                          {video.title}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-3 pt-2.5 border-t border-emerald-500/15 flex items-center justify-between text-[11px] text-gray-400">
            <span className="inline-flex items-center gap-1.5 text-gray-300 truncate">
              <span className="text-emerald-400">🌱</span>
              Filmed directly on our partnered farms in Kerala.
            </span>
            <Link
              href="/farms"
              onClick={handleClose}
              className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 ml-2 flex-shrink-0 transition-colors"
            >
              Full Farm Section &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmVideoModal;
