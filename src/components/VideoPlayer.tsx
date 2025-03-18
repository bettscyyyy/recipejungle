import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { generateRecipeVideo } from "@/services/recipeService";
import { toast } from "sonner";

interface VideoPlayerProps {
  recipeId: string;
  videoUrl: string | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ recipeId, videoUrl: initialVideoUrl }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(initialVideoUrl);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationAttempted, setGenerationAttempted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (recipeId) {
      setVideoError(false);
      setGenerationAttempted(false);
      
      if (initialVideoUrl) {
        setVideoUrl(initialVideoUrl);
      } 
      else if (!isLoading && !generationAttempted) {
        handleGenerateVideo();
      }
    }
  }, [recipeId, initialVideoUrl]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(progress);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
    setIsLoading(false);
    toast.error("Could not play the video. Try regenerating.");
  };

  const handleGenerateVideo = () => {
    setIsLoading(true);
    setVideoError(false);
    
    generateRecipeVideo(recipeId)
      .then((url) => {
        setVideoUrl(url);
        setIsPlaying(false);
        setProgress(0);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
        }
      })
      .catch((error) => {
        toast.error("Failed to generate video. Please try again.");
        console.error("Error generating video:", error);
        setVideoError(true);
      })
      .finally(() => {
        setIsLoading(false);
        setGenerationAttempted(true);
      });
  };

  return (
    <div className="w-full rounded-xl overflow-hidden glass-card">
      <div className="relative aspect-video">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-sm">
            <div className="text-center">
              <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4" />
              <p className="text-lg font-medium animate-pulse">Generating AI Recipe Video...</p>
              <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
            </div>
          </div>
        ) : videoUrl && !videoError ? (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-cover"
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnd}
              onError={handleVideoError}
              poster={videoUrl ? undefined : "https://via.placeholder.com/640x360?text=Recipe+Video"}
              controls={false}
            />
            
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="mb-3 h-1 w-full bg-white/20 rounded overflow-hidden">
                <div 
                  className="h-full bg-primary rounded transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Button 
                  onClick={togglePlay} 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={handleGenerateVideo} 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/20"
                    disabled={isLoading}
                    title="Regenerate video"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    onClick={toggleMute} 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <Button
              onClick={handleGenerateVideo}
              className="animate-pulse bg-primary/90 hover:bg-primary"
              disabled={isLoading}
            >
              {videoError ? "Retry Video Generation" : "Generate AI Recipe Video"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
