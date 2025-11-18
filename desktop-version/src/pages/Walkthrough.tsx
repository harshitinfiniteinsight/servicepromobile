import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  Calendar, 
  FileText, 
  DollarSign, 
  Package, 
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Play,
  TrendingUp,
  Clock,
  Shield
} from "lucide-react";

const Walkthrough = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Welcome to Service Pro911",
      description: "Your all-in-one service management platform",
      features: [
        { icon: Users, text: "Manage customers effortlessly", color: "text-blue-500" },
        { icon: Calendar, text: "Schedule appointments seamlessly", color: "text-green-500" },
        { icon: FileText, text: "Create estimates & invoices", color: "text-purple-500" },
        { icon: Package, text: "Track inventory in real-time", color: "text-orange-500" }
      ],
      value: "Save 15+ hours per week on administrative tasks"
    },
    {
      title: "Streamline Your Operations",
      description: "Everything you need to run your service business",
      features: [
        { icon: DollarSign, text: "Accept payments instantly", color: "text-green-500" },
        { icon: BarChart3, text: "Get actionable insights", color: "text-blue-500" },
        { icon: Shield, text: "Secure & reliable platform", color: "text-red-500" },
        { icon: Clock, text: "24/7 access from anywhere", color: "text-purple-500" }
      ],
      value: "Increase revenue by up to 30% with better workflow management"
    },
    {
      title: "See It In Action",
      description: "Watch how Service Pro911 transforms your business",
      isVideo: true,
      businessValues: [
        { icon: TrendingUp, text: "30% revenue increase", description: "Better workflow & faster payments" },
        { icon: Clock, text: "15 hours saved weekly", description: "Automated administrative tasks" },
        { icon: CheckCircle2, text: "98% customer satisfaction", description: "Professional estimates & invoices" },
        { icon: Users, text: "Unlimited team members", description: "Collaborate efficiently" }
      ]
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      localStorage.removeItem("showWalkthrough");
      navigate("/");
    }
  };

  const handleSkip = () => {
    localStorage.removeItem("showWalkthrough");
    navigate("/");
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-mesh">
      <Card className="w-full max-w-4xl glass-effect p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gradient">{currentSlideData.title}</h1>
            <p className="text-xl text-muted-foreground">{currentSlideData.description}</p>
          </div>

          {/* Content */}
          {!currentSlideData.isVideo ? (
            <div className="space-y-8">
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentSlideData.features?.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-6 rounded-xl bg-card/50 border border-border/50 hover:bg-card transition-all duration-300 hover:scale-105"
                  >
                    <div className={`p-3 rounded-lg bg-background ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{feature.text}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Business Value */}
              <div className="text-center p-6 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                <p className="text-lg font-semibold text-primary">{currentSlideData.value}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Video Placeholder */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group cursor-pointer border-2 border-primary/20 hover:border-primary/40 transition-all">
                <div className="absolute inset-0 gradient-shine opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-10 w-10 text-primary ml-1" />
                  </div>
                  <p className="text-lg font-semibold">Watch Demo Video</p>
                  <p className="text-sm text-muted-foreground">See Service Pro911 in action (2:30)</p>
                </div>
              </div>

              {/* Business Values */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentSlideData.businessValues?.map((value, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-6 rounded-xl bg-card/50 border border-border/50"
                  >
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      <value.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{value.text}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button variant="ghost" onClick={handleSkip}>
              Skip
            </Button>

            <div className="flex gap-2">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? "w-8 bg-primary" 
                      : "w-2 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            <Button onClick={handleNext} className="gradient-primary gap-2">
              {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Walkthrough;
