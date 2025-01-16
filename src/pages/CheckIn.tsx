import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, RefreshCcw, CameraOff, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { formatInTimeZone } from 'date-fns-tz';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const CheckIn = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCameraInitializing, setIsCameraInitializing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    if (isCameraInitializing) return;
    
    try {
      setIsCameraInitializing(true);
      setShowConfirm(false);
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error("Camera access error:", error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please ensure camera permissions are granted.",
        variant: "destructive",
      });
    } finally {
      setIsCameraInitializing(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) {
      toast({
        title: "Error",
        description: "Camera not initialized",
        variant: "destructive",
      });
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    ctx.drawImage(videoRef.current, 0, 0);
    const photoData = canvas.toDataURL("image/jpeg");
    setPhoto(photoData);
    stopCamera();
    setShowConfirm(true);
  };

  const submitAttendance = async () => {
    if (!user?.id || !photo) {
      toast({
        title: "Error",
        description: "Missing photo or user data",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Get the profile ID for the current user
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('name', user.name)
        .single();

      if (profileError || !profileData) {
        throw new Error('Could not find user profile');
      }

      // Convert base64 to blob
      const base64Data = photo.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      // Create a unique filename
      const fileName = `${profileData.id}_${Date.now()}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      // Get current date and time in Malaysia timezone
      const now = new Date();
      const malaysiaDate = formatInTimeZone(now, 'Asia/Kuala_Lumpur', 'yyyy-MM-dd');
      const malaysiaTime = formatInTimeZone(now, 'Asia/Kuala_Lumpur', 'HH:mm:ss');

      // Upload photo to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('attendance_photos')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL of the uploaded photo
      const { data: { publicUrl } } = supabase.storage
        .from('attendance_photos')
        .getPublicUrl(fileName);

      // Create attendance record
      const { error: insertError } = await supabase
        .from('attendance')
        .insert({
          profile_id: profileData.id,
          date: malaysiaDate,
          check_in_time: malaysiaTime,
          status: malaysiaTime <= "09:00:00" ? "on-time" : "late",
          photo: publicUrl
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Check-in Successful",
        description: `Time recorded: ${malaysiaTime} (MYT)`,
      });

      // Add a delay before navigation
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error during check-in:', error);
      toast({
        title: "Check-in Failed",
        description: "There was an error recording your attendance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const resetCamera = () => {
    setPhoto(null);
    setShowConfirm(false);
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
              disabled={isCameraInitializing || isSubmitting}
              className="w-full h-16 text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity rounded-xl"
            >
              <Camera className="mr-2 h-6 w-6" />
              {isCameraInitializing ? "Initializing Camera..." : "Start Camera"}
            </Button>
          )}

          {stream && (
            <>
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border-4 border-accent bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
              </div>
              <div className="flex gap-4">
                <Button 
                  onClick={capturePhoto}
                  disabled={isSubmitting}
                  className="flex-1 h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity rounded-xl"
                >
                  Take Photo
                </Button>
                <Button
                  onClick={stopCamera}
                  variant="outline"
                  className="h-12 border-2 rounded-xl hover:bg-accent/20 transition-colors"
                >
                  <CameraOff className="h-5 w-5" />
                </Button>
              </div>
            </>
          )}

          {photo && (
            <>
              <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-accent">
                <img 
                  src={photo} 
                  alt="Check-in" 
                  className="w-full"
                  style={{ transform: 'scaleX(-1)' }}
                />
              </div>
              <div className="flex gap-4">
                {showConfirm ? (
                  <>
                    <Button 
                      onClick={submitAttendance}
                      disabled={isSubmitting}
                      className="flex-1 h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity rounded-xl"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Submitting..." : "Submit Attendance"}
                    </Button>
                    <Button
                      onClick={resetCamera}
                      variant="outline"
                      disabled={isSubmitting}
                      className="h-12 border-2 rounded-xl hover:bg-accent/20 transition-colors"
                    >
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={resetCamera}
                    disabled={isSubmitting}
                    variant="outline"
                    className="w-full h-12 border-2 rounded-xl hover:bg-accent/20 transition-colors"
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Take Another Photo
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CheckIn;
