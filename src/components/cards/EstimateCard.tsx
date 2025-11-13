import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusColors } from "@/data/mobileMockData";

interface EstimateCardProps {
  estimate: {
    id: string;
    customerName: string;
    date: string;
    amount: number;
    status: string;
    probability?: number;
  };
  onClick?: () => void;
  actionButtons?: React.ReactNode;
  payButton?: React.ReactNode;
}

const EstimateCard = ({ estimate, onClick, actionButtons, payButton }: EstimateCardProps) => {
  const showProbability = estimate.status === "Paid" && estimate.probability;

  return (
    <div
      className="p-4 rounded-xl border border-gray-200 bg-white active:scale-[0.98] transition-all duration-200 cursor-pointer hover:shadow-md hover:border-primary/30 overflow-hidden"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold whitespace-nowrap">{estimate.id}</span>
            <Badge className={cn("text-xs flex-shrink-0", statusColors[estimate.status])}>
              {estimate.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground truncate">{estimate.customerName}</p>
        </div>
        <div className="text-right flex-shrink-0 flex items-center gap-2">
          <div className="text-xl font-bold text-primary whitespace-nowrap w-[100px] text-right">
            ${estimate.amount.toLocaleString()}
          </div>
          {payButton && (
            <div onClick={(e) => e.stopPropagation()} className="w-[100px]">
              {payButton}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm gap-2 min-w-0">
        <div className="flex items-center gap-2 text-muted-foreground flex-shrink-0">
          <Calendar className="h-3 w-3 flex-shrink-0" />
          <span className="whitespace-nowrap text-xs">{new Date(estimate.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {showProbability && (
            <div className="flex items-center gap-1 text-success whitespace-nowrap">
              <TrendingUp className="h-3 w-3 flex-shrink-0" />
              <span className="font-medium text-xs">{estimate.probability}% likely</span>
            </div>
          )}
          {actionButtons && (
            <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              {actionButtons}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstimateCard;


