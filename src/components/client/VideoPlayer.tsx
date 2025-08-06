
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Video, HistoryItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Play, Pause, Volume2, Volume1, VolumeX, Maximize, Minimize, Loader2, AlertCircle, Settings, PictureInPicture } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const VideoPlayer = ({ video }: { video: Video }) => {
    const { currentUser } = useAuth();
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [buffered, setBuffered] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showControls, setShowControls] = useState(true);
    const [playbackRate, setPlaybackRate] = useState(1);

    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds) || timeInSeconds < 0) return '00:00';
        const date = new Date(0);
        date.setSeconds(timeInSeconds);
        const timeString = date.toISOString().substr(11, 8);
        return timeString.startsWith('00:') ? timeString.substr(3) : timeString;
    };
    
    const handlePlayPause = useCallback(() => {
        if (!videoRef.current || error) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play().catch(() => {
                setError("Could not play video. Please try again.");
                setIsLoading(false);
            });
        }
    }, [isPlaying, error]);

    const handleVolumeChange = (newVolume: number[]) => {
        if (!videoRef.current) return;
        const vol = newVolume[0] / 100;
        videoRef.current.volume = vol;
        setVolume(vol);
        videoRef.current.muted = vol === 0;
        setIsMuted(vol === 0);
    };

    const handleMuteToggle = useCallback(() => {
        if (!videoRef.current) return;
        const newMutedState = !isMuted;
        videoRef.current.muted = newMutedState;
        setIsMuted(newMutedState);
        if(!newMutedState && videoRef.current.volume === 0) {
            videoRef.current.volume = 0.5;
            setVolume(0.5);
        }
    }, [isMuted]);
    
    const handleProgressChange = (newProgress: number[]) => {
        if (!videoRef.current || isNaN(duration)) return;
        const newTime = (newProgress[0] / 100) * duration;
        videoRef.current.currentTime = newTime;
        setProgress(newProgress[0]);
    };

    const handleFullScreenToggle = useCallback(() => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }, []);
    
     const handleMouseMove = useCallback(() => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        if(isPlaying){
             controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
        }
    }, [isPlaying]);

    const handlePlaybackRateChange = (rate: string) => {
        const newRate = parseFloat(rate);
        if (videoRef.current) {
            videoRef.current.playbackRate = newRate;
            setPlaybackRate(newRate);
        }
    };

    const handlePictureInPicture = async () => {
        if (!videoRef.current) return;
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else {
            if (document.pictureInPictureEnabled) {
                await videoRef.current.requestPictureInPicture();
            }
        }
    };
    
    const VolumeIcon = () => {
        if (isMuted || volume === 0) return <VolumeX size={24} />;
        if (volume < 0.5) return <Volume1 size={24} />;
        return <Volume2 size={24} />;
    }

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const updatePlayingState = () => setIsPlaying(!videoElement.paused);
        const updateProgress = () => {
            if (isNaN(videoElement.duration)) return;
            setProgress((videoElement.currentTime / videoElement.duration) * 100);
            
            if (videoElement.buffered.length > 0) {
                const bufferedEnd = videoElement.buffered.end(videoElement.buffered.length - 1);
                setBuffered((bufferedEnd / videoElement.duration) * 100);
            }
        };
        const updateDuration = () => {
            if (!isNaN(videoElement.duration)) {
                setDuration(videoElement.duration);
                setIsLoading(false);
            }
        };
        const handleLoading = () => setIsLoading(true);
        const handleCanPlay = () => {
            setIsLoading(false);
            setError(null);
        };
        const handleError = () => {
            switch (videoElement.error?.code) {
                case videoElement.error.MEDIA_ERR_ABORTED:
                    setError('Video playback was aborted.');
                    break;
                case videoElement.error.MEDIA_ERR_NETWORK:
                    setError('A network error caused the video download to fail.');
                    break;
                case videoElement.error.MEDIA_ERR_DECODE:
                    setError('The video playback was aborted due to a corruption problem.');
                    break;
                case videoElement.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    setError('The video could not be loaded, either because the server or network failed or because the format is not supported.');
                    break;
                default:
                    setError('An unknown error occurred.');
                    break;
            }
            setIsLoading(false);
        };

        videoElement.addEventListener('play', updatePlayingState);
        videoElement.addEventListener('pause', updatePlayingState);
        videoElement.addEventListener('timeupdate', updateProgress);
        videoElement.addEventListener('progress', updateProgress);
        videoElement.addEventListener('loadedmetadata', updateDuration);
        videoElement.addEventListener('durationchange', updateDuration);
        videoElement.addEventListener('waiting', handleLoading);
        videoElement.addEventListener('playing', handleCanPlay);
        videoElement.addEventListener('canplay', handleCanPlay);
        videoElement.addEventListener('error', handleError);
        
        return () => {
            videoElement.removeEventListener('play', updatePlayingState);
            videoElement.removeEventListener('pause', updatePlayingState);
            videoElement.removeEventListener('timeupdate', updateProgress);
            videoElement.removeEventListener('progress', updateProgress);
            videoElement.removeEventListener('loadedmetadata', updateDuration);
            videoElement.removeEventListener('durationchange', updateDuration);
            videoElement.removeEventListener('waiting', handleLoading);
            videoElement.removeEventListener('playing', handleCanPlay);
            videoElement.removeEventListener('canplay', handleCanPlay);
            videoElement.removeEventListener('error', handleError);
        };
    }, []);

    useEffect(() => {
      const handleFullScreenChange = () => {
        setIsFullScreen(!!document.fullscreenElement);
      };
      document.addEventListener('fullscreenchange', handleFullScreenChange);
      return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
    }, []);

    const handleKeyboardShortcuts = useCallback((e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        if(target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

        switch(e.key.toLowerCase()){
            case ' ': e.preventDefault(); handlePlayPause(); break;
            case 'f': handleFullScreenToggle(); break;
            case 'm': handleMuteToggle(); break;
            case 'arrowright': if(videoRef.current) videoRef.current.currentTime += 5; break;
            case 'arrowleft': if(videoRef.current) videoRef.current.currentTime -= 5; break;
        }
    }, [handlePlayPause, handleFullScreenToggle, handleMuteToggle]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyboardShortcuts);
        return () => {
            window.removeEventListener('keydown', handleKeyboardShortcuts);
        }
    }, [handleKeyboardShortcuts]);
    
    useEffect(() => {
        const addWatchHistory = async () => {
            if (currentUser && video) {
                const userRef = doc(db, 'users', currentUser.id);
                const userSnap = await getDoc(userRef);
                if (!userSnap.exists()) return;

                const history = (userSnap.data()?.watchHistory || []) as HistoryItem[];
                
                // Only add to history if it's not already the most recent item
                if (history.length > 0 && history[0].id === video.id) {
                    return;
                }

                const newHistoryItem = { id: video.id, type: 'video' as const, viewedAt: new Date().toISOString() };
                
                const updatedHistory = [newHistoryItem, ...history.filter((h: any) => h.id !== video.id)].slice(0, 50);
                await updateDoc(userRef, { watchHistory: updatedHistory });
            }
        };

        if (isPlaying) {
             addWatchHistory();
        }
      }, [isPlaying, video, currentUser]);

    return (
        <div 
            ref={containerRef} 
            className="w-full bg-black relative aspect-video group" 
            onMouseMove={handleMouseMove} 
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={video.videoUrl}
                className="w-full h-full"
                poster={video.image}
                onClick={handlePlayPause}
                preload="metadata"
            />
            
            <div 
                className={cn(
                    "absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none transition-opacity", 
                    isLoading || error ? 'opacity-100' : 'opacity-0'
                )}
            >
                {isLoading && !error && <Loader2 className="w-12 h-12 text-white animate-spin" />}
                {error && (
                    <div className="flex flex-col items-center justify-center text-white p-4 text-center">
                        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                        <p className="text-lg font-semibold">Video Playback Error</p>
                        <p className="text-sm text-muted-foreground max-w-xs">{error}</p>
                    </div>
                )}
            </div>

            <div 
                className={cn(
                    "absolute bottom-0 left-0 right-0 pt-2 px-2 md:px-4 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300", 
                    showControls || !isPlaying || error ? "opacity-100" : "opacity-0 group-hover:opacity-100", 
                    isFullScreen ? "pb-4" : ""
                )}
            >
                {/* Progress Bar */}
                <div className="relative w-full h-1.5 cursor-pointer group/progress py-2">
                    <div className="absolute top-1/2 -translate-y-1/2 h-1 group-hover/progress:h-1.5 bg-white/30 rounded-full transition-all w-full">
                         <div className="h-full bg-accent/50 rounded-full" style={{ width: `${buffered}%`}}/>
                    </div>
                    <Slider 
                        value={[progress]} 
                        onValueChange={handleProgressChange}
                        max={100}
                        step={0.1}
                        className="w-full absolute top-1/2 -translate-y-1/2"
                        disabled={!!error}
                    />
                </div>
                
                <div className="flex items-center justify-between text-white mt-1">
                    <div className="flex items-center gap-2 md:gap-4">
                        <TooltipProvider delayDuration={200}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button onClick={handlePlayPause} className="text-white hover:text-accent transition-colors disabled:text-gray-500" disabled={!!error}>
                                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent><p>{isPlaying ? 'Pause (space)' : 'Play (space)'}</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <div className="relative group/volume flex items-center">
                            <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button onClick={handleMuteToggle}>
                                            <VolumeIcon />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>{isMuted ? 'Unmute (m)' : 'Mute (m)'}</p></TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                             <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 h-24 p-2 bg-black/60 rounded-md opacity-0 group-hover/volume:opacity-100 transition-opacity duration-300 pointer-events-none group-hover/volume:pointer-events-auto">
                                <Slider
                                    defaultValue={[100]}
                                    value={[isMuted ? 0 : volume * 100]}
                                    onValueChange={handleVolumeChange}
                                    max={100}
                                    step={1}
                                    className="h-full"
                                    orientation="vertical"
                                />
                            </div>
                        </div>

                        <div className="text-xs font-mono">
                            <span>{formatTime(videoRef.current?.currentTime || 0)}</span> / <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <Popover>
                             <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <PopoverTrigger asChild>
                                            <button><Settings size={22} /></button>
                                        </PopoverTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Settings</p></TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <PopoverContent align="end" className="w-48 bg-black/80 border-gray-700 text-white p-2">
                                <div className="space-y-4">
                                     <div>
                                        <h4 className="font-semibold text-sm px-2 mb-1">Speed</h4>
                                        <RadioGroup value={String(playbackRate)} onValueChange={handlePlaybackRateChange} className="text-sm">
                                            {[0.5, 0.75, 1, 1.5, 2].map(rate => (
                                                <Label key={rate} className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-md cursor-pointer">
                                                    <RadioGroupItem value={String(rate)} id={`rate-${rate}`} className="border-gray-500 text-accent"/>
                                                    <span>{rate === 1 ? 'Normal' : `${rate}x`}</span>
                                                </Label>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm px-2 mb-1">Quality</h4>
                                        <RadioGroup value="auto" className="text-sm">
                                            <Label className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-md cursor-pointer">
                                                <RadioGroupItem value="auto" id="q-auto" className="border-gray-500 text-accent" />
                                                <span>Auto</span>
                                            </Label>
                                        </RadioGroup>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {document.pictureInPictureEnabled && (
                            <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button onClick={handlePictureInPicture}>
                                            <PictureInPicture size={22} />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Picture in Picture</p></TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        
                         <TooltipProvider delayDuration={200}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                     <button onClick={handleFullScreenToggle}>
                                        {isFullScreen ? <Minimize size={24} /> : <Maximize size={24} />}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent><p>{isFullScreen ? 'Exit Fullscreen (f)' : 'Fullscreen (f)'}</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </div>
    );
};
