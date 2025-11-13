import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, Wrench, Hammer, Zap, Wind, Briefcase } from "lucide-react";
import { ForgotPasswordModal } from "@/components/modals/ForgotPasswordModal";

const demoBusinesses = [
  {
    id: "plumber",
    name: "Pro Plumbing Services",
    icon: Wrench,
    color: "from-blue-500 to-blue-600",
    description: "Residential & Commercial Plumbing",
  },
  {
    id: "carpenter",
    name: "Master Carpentry Co.",
    icon: Hammer,
    color: "from-amber-600 to-amber-700",
    description: "Custom Woodwork & Renovation",
  },
  {
    id: "electrician",
    name: "Elite Electric Solutions",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    description: "Electrical Installation & Repair",
  },
  {
    id: "hvac",
    name: "Cool Comfort HVAC",
    icon: Wind,
    color: "from-cyan-500 to-blue-600",
    description: "Heating, Cooling & Air Quality",
  },
  {
    id: "general",
    name: "General Service",
    icon: Briefcase,
    color: "from-purple-500 to-indigo-600",
    description: "Multi-Service & General Contractor",
  },
];

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@servicepro911.com");
  const [password, setPassword] = useState("demo123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.removeItem("demoBusinessType"); // Clear demo mode for regular login
      toast.success("Welcome back!");
      navigate("/");
      setLoading(false);
    }, 1000);
  };

  const handleDemoSignIn = (businessType: string, businessName: string) => {
    setLoading(true);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("demoBusinessType", businessType);
    localStorage.setItem("demoBusinessName", businessName);
    toast.success(`Welcome to ${businessName}!`);
    setTimeout(() => {
      navigate("/");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-mesh">
      <Card className="w-full max-w-2xl glass-effect">
        <CardHeader className="space-y-1 text-center px-4 sm:px-6 pt-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-sm sm:text-base">Sign in to your ServicePro911 account or try a demo</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 h-auto">
              <TabsTrigger value="signin" className="py-2.5 text-sm sm:text-base">Sign In</TabsTrigger>
              <TabsTrigger value="demo" className="py-2.5 text-sm sm:text-base">Demo Accounts</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="demo@servicepro911.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="demo123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
                <Button type="submit" className="w-full gradient-primary touch-target" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="demo">
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="font-semibold text-lg mb-2">Try a Service Business Demo</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a business type to explore the app with realistic data
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {demoBusinesses.map((business) => (
                    <Card
                      key={business.id}
                      className="cursor-pointer hover:scale-105 transition-all duration-300 overflow-hidden group border-2 hover:border-primary/50"
                      onClick={() => handleDemoSignIn(business.id, business.name)}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div
                            className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${business.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                          >
                            <business.icon className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground">{business.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {business.description}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 group-hover:bg-primary/10 touch-target"
                          >
                            Try Demo →
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center text-xs text-muted-foreground mt-6 p-4 bg-muted/30 rounded-lg">
                  <p className="font-medium mb-1">🎯 Demo Mode Features:</p>
                  <p>
                    Experience the full app with pre-populated customers, appointments, invoices,
                    and estimates tailored to your selected business type.
                  </p>
                </div>

                <div className="text-center text-sm pt-2">
                  <span className="text-muted-foreground">Want to create your own account? </span>
                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <ForgotPasswordModal open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen} />
    </div>
  );
};

export default SignIn;
