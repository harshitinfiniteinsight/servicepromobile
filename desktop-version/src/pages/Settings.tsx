import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  KeyRound, 
  Shield, 
  FileText, 
  Languages, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const settingsOptions = [
    {
      icon: User,
      label: "Profile",
      description: "Manage your personal information",
      onClick: () => navigate("/settings/profile"),
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      icon: KeyRound,
      label: "Change Password",
      description: "Update your account password",
      onClick: () => navigate("/settings/change-password"),
      color: "text-accent",
      bg: "bg-accent/10"
    },
    {
      icon: Shield,
      label: "Permission Settings",
      description: "Configure app permissions and access",
      onClick: () => navigate("/settings/permissions"),
      color: "text-info",
      bg: "bg-info/10"
    },
    {
      icon: FileText,
      label: "Business Policies",
      description: "Manage payment terms, terms & conditions, and return policy",
      onClick: () => navigate("/settings/business-policies"),
      color: "text-secondary",
      bg: "bg-secondary/10"
    },
    {
      icon: CreditCard,
      label: "Payment Settings",
      description: "Configure payment methods and options",
      onClick: () => navigate("/settings/payment-methods"),
      color: "text-warning",
      bg: "bg-warning/10"
    },
    {
      icon: Languages,
      label: "Change App Language",
      description: "Select your preferred language",
      onClick: () => navigate("/settings/language"),
      color: "text-success",
      bg: "bg-success/10"
    },
    {
      icon: HelpCircle,
      label: "Help",
      description: "Get help and support",
      onClick: () => navigate("/settings/help"),
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      icon: LogOut,
      label: "Logout",
      description: "Sign out of your account",
      onClick: () => {
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        });
        // Add actual logout logic here
        setTimeout(() => navigate("/"), 1000);
      },
      color: "text-destructive",
      bg: "bg-destructive/10"
    }
  ];

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search settings..." />
      
      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account and app preferences
          </p>
        </div>

        <div className="max-w-4xl grid gap-4">
          {settingsOptions.map((option, index) => (
            <Card
              key={index}
              className="border-2 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              onClick={option.onClick}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${option.bg} group-hover:scale-110 transition-transform duration-300`}>
                    <option.icon className={`h-6 w-6 ${option.color}`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground mb-1">
                      {option.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Settings;
