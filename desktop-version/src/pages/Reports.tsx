import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Receipt } from "lucide-react";

const Reports = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1">
      <AppHeader searchPlaceholder="Search reports..." />

      <main className="px-6 py-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground">View and analyze your business reports</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <Card 
            className="cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1"
            onClick={() => navigate("/reports/invoice")}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Receipt className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Invoice Report</CardTitle>
                  <CardDescription>View all invoice records</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access detailed invoice reports with filtering options for status, payment type, dates, and employees.
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1"
            onClick={() => navigate("/reports/estimate")}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-info" />
                </div>
                <div>
                  <CardTitle className="text-xl">Estimate Report</CardTitle>
                  <CardDescription>View all estimate records</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access detailed estimate reports with filtering options for status, dates, and employees.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Reports;
