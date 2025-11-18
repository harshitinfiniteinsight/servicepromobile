import { Wrench } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className="flex items-center gap-3 group">
      <div className="relative">
        <div className="gradient-primary rounded-xl p-2.5 shadow-lg group-hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          <Wrench className={`${sizes[size]} text-white relative z-10`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        </div>
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizes[size]} font-bold text-foreground leading-none font-display tracking-tight`}>
            ServicePro
            <span className="text-gradient">911</span>
          </h1>
          <span className="text-xs text-muted-foreground font-medium">Field Service Pro</span>
        </div>
      )}
    </div>
  );
};
