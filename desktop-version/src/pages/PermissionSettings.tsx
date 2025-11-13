import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft } from "lucide-react";

const PermissionSettings = () => {
  const navigate = useNavigate();
  
  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [crashReporting, setCrashReporting] = useState(true);
  const [cameraPermission, setCameraPermission] = useState(true);

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
        <h1 className="text-xl font-semibold">Service Pro911 - SETTING</h1>
      </div>

      <main className="p-4 sm:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-background p-6 rounded-lg shadow-md mb-8 flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <div className="text-2xl font-bold text-primary">SP</div>
            </div>
            <h2 className="text-3xl font-bold">Service Pro911</h2>
          </div>

          <h3 className="text-4xl font-bold text-center mb-12">Permission Settings</h3>

          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox
                id="privacy"
                checked={privacyAgreed}
                onCheckedChange={(checked) => setPrivacyAgreed(checked as boolean)}
                className="mt-1 h-6 w-6 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label htmlFor="privacy" className="text-base text-muted-foreground cursor-pointer flex-1">
                I agree to{" "}
                <a href="#" className="text-primary underline hover:text-primary/80">
                  Privacy Policy
                </a>{" "}
                &{" "}
                <a href="#" className="text-primary underline hover:text-primary/80">
                  EULA
                </a>
                .
              </label>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox
                id="crash"
                checked={crashReporting}
                onCheckedChange={(checked) => setCrashReporting(checked as boolean)}
                className="mt-1 h-6 w-6 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label htmlFor="crash" className="text-base text-muted-foreground cursor-pointer flex-1">
                I allow the app to collect crash reporting data.
              </label>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox
                id="camera"
                checked={cameraPermission}
                onCheckedChange={(checked) => setCameraPermission(checked as boolean)}
                className="mt-1 h-6 w-6 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label htmlFor="camera" className="text-base text-muted-foreground cursor-pointer flex-1">
                I allow the application to use the camera to capture agreement images. I understand that limiting this permission will limit my ability to add images to my agreement through this application.
              </label>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PermissionSettings;
