import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
    
    navigate("/settings");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3 shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/settings")}
          className="hover:bg-primary-foreground/20 text-primary-foreground"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">Service Pro911 - Settings</h1>
      </div>

      <main className="p-4 sm:p-6 max-w-3xl mx-auto flex items-center min-h-[calc(100vh-64px)]">
        <Card className="w-full border-2 shadow-xl bg-primary/5">
          <CardContent className="p-8 sm:p-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-muted-foreground">
              Change Password
            </h2>
            
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="h-14 text-base bg-transparent border-b-2 border-t-0 border-x-0 border-primary rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary placeholder:text-primary/60"
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="h-14 text-base bg-transparent border-b-2 border-t-0 border-x-0 border-primary rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-14 text-base bg-transparent border-b-2 border-t-0 border-x-0 border-primary rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground"
                />
              </div>

              <p className="text-sm text-muted-foreground pt-2">
                * Min 8 characters, must include uppercase, lowercase letters and a number or special character (@,#,$,%,*,!)
              </p>

              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  className="px-16 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  CHANGE PASSWORD
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ChangePassword;
