import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, RefreshCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { formatInTimeZone } from 'date-fns-tz';
import { useAuth } from "@/contexts/AuthContext";
import { attendanceService } from "@/services/storageService";

const CheckIn = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const takePhoto = () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to check in.",
        variant: "destructive",
      });
      return;
    }

    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const photoData = canvas.toDataURL("image/jpeg");
        setPhoto(photoData);
        stopCamera();
        
        // Get current date and time in Malaysia timezone
        const now = new Date();
        const malaysiaDate = formatInTimeZone(now, 'Asia/Kuala_Lumpur', 'yyyy-MM-dd');
        const malaysiaTime = formatInTimeZone(now, 'Asia/Kuala_Lumpur', 'HH:mm');
        
        // Create and save new attendance record with correct status type
        const newRecord = {
          id: Date.now(),
          name: user.name,
          date: malaysiaDate,
          checkInTime: malaysiaTime,
          status: malaysiaTime <= "09:00" ? "on-time" : "late",
          photo: photoData
        } as const;  // Using const assertion to ensure type safety

        attendanceService.saveRecord(newRecord);
        
        toast({
          title: "Check-in Successful",
          description: `Time recorded: ${malaysiaTime} (MYT)`,
        });

        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const resetCamera = () => {
    setPhoto(null);
    startCamera();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Staff Check In
        </h1>
        <p className="text-muted-foreground">
          Take a photo to record your attendance
        </p>
      </div>
      
      <Card className="p-8 bg-gradient-to-br from-white to-muted/20 rounded-[2rem] border-none shadow-lg">
        <div className="space-y-6">
          {!stream && !photo && (
            <Button 
              onClick={startCamera} 
              className="w-full h-16 text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity rounded-xl"
            >
              <Camera className="mr-2 h-6 w-6" />
              Start Camera
            </Button>
          )}

          {stream && (
            <>
              <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-accent">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full"
                />
              </div>
              <Button 
                onClick={takePhoto} 
                className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity rounded-xl"
              >
                Take Photo
              </Button>
            </>
          )}

          {photo && (
            <>
              <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-accent">
                <img src={photo} alt="Check-in" className="w-full" />
              </div>
              <Button 
                onClick={resetCamera} 
                variant="outline" 
                className="w-full h-12 border-2 rounded-xl hover:bg-accent/20 transition-colors"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Take Another Photo
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

export default CheckIn;