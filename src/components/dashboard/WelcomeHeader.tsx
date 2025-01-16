import { useAuth } from "@/contexts/AuthContext";

export const WelcomeHeader = () => {
  const { user } = useAuth();
  
  return (
    <div className="text-center space-y-2">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Welcome Back, {user?.name}
      </h1>
      <p className="text-muted-foreground">
        {new Date().toLocaleDateString('en-MY', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          timeZone: 'Asia/Kuala_Lumpur'
        })}
      </p>
    </div>
  );
};