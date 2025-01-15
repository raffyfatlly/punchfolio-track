import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, RefreshCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CheckIn = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const { toast } = useToast();

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
        
        toast({
          title: "Check-in Successful",
          description: `Time recorded: ${new Date().toLocaleTimeString()}`,
        });
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Staff Check In</h1>
      
      <Card className="p-6 max-w-2xl mx-auto">
        <div className="space-y-6">
          {!stream && !photo && (
            <Button onClick={startCamera} className="w-full">
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </Button>
          )}

          {stream && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
              />
              <Button onClick={takePhoto} className="w-full">
                Take Photo
              </Button>
            </>
          )}

          {photo && (
            <>
              <img src={photo} alt="Check-in" className="w-full rounded-lg" />
              <Button onClick={resetCamera} variant="outline" className="w-full">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Take Another Photo
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CheckIn;