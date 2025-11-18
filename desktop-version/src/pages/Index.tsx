import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AppHeader } from "@/components/AppHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Plus, FileText, Briefcase, Calendar, DollarSign, Clock, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
const Index = () => {
  const navigate = useNavigate();
  const currentUser = "Joe"; // Mock user name

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const showWalkthrough = localStorage.getItem("showWalkthrough");
    
    if (!isAuthenticated) {
      navigate("/signin");
    } else if (showWalkthrough === "true") {
      navigate("/walkthrough");
    }
  }, [navigate]);

  // Mock data for stats
  const estimatesData = {
    new: 3,
    approved: {
      count: 2,
      amount: 2100
    },
    changesRequested: 1,
    draft: {
      count: 2,
      amount: 1300
    }
  };
  const jobsData = {
    requiresInvoicing: 0,
    actionRequired: 0,
    active: {
      count: 1,
      amount: 795
    }
  };
  const invoicesData = {
    pastDue: 0,
    awaitingPayment: {
      count: 2,
      amount: 525
    },
    draft: 0
  };
  const appointmentsData = {
    total: {
      count: 1,
      amount: 795.00
    },
    toGo: {
      count: 1,
      amount: 795.00
    },
    active: {
      count: 0,
      amount: 0
    },
    complete: {
      count: 0,
      amount: 0
    }
  };
  const todaysAppointments = [{
    id: 1,
    time: "0:00",
    customer: "Sharon Mcdonald",
    type: "Anytime"
  }];

  // Get today's date for filtering
  const today = new Date();
  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  // Format date for input fields (YYYY-MM-DD)
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleNewEstimatesClick = () => {
    navigate("/estimates", {
      state: {
        dateRange: {
          from: todayStart,
          to: todayEnd,
        },
      },
    });
  };

  const handleActiveJobsClick = () => {
    navigate("/jobs", {
      state: {
        dateFrom: todayStart,
        dateTo: todayEnd,
        timeFilter: "day",
      },
    });
  };

  const handleAwaitingPaymentsClick = () => {
    navigate("/jobs", {
      state: {
        dateFrom: todayStart,
        dateTo: todayEnd,
        timeFilter: "day",
        filterUnpaid: true,
      },
    });
  };

  const handleTodaysAppointmentsClick = () => {
    navigate("/appointments/manage", {
      state: {
        selectedDate: formatDateForInput(today),
        calendarView: "day",
      },
    });
  };

  return <div className="flex-1">
      <AppHeader searchPlaceholder="Search..." />

      <main className="px-4 sm:px-6 py-4 sm:py-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="app-card p-4 sm:p-6 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent relative overflow-hidden">
          <div className="gradient-mesh absolute inset-0 opacity-50"></div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display mb-1">
                <span className="text-gradient">Good morning, </span>
                <span className="text-foreground">{currentUser}</span>
              </h1>
              <p className="text-sm text-muted-foreground">Welcome back to your dashboard</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              
              
            </div>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="app-card p-4 card-shine cursor-pointer group" onClick={handleNewEstimatesClick}>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all shadow-sm">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <TrendingUp className="h-4 w-4 text-success animate-float" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">New Estimates</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground font-display">{estimatesData.new}</p>
              <p className="text-xs text-success font-medium">↑ 12% this week</p>
            </div>
          </div>

          <div className="app-card p-4 card-shine cursor-pointer group" onClick={handleActiveJobsClick}>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 group-hover:from-accent/20 group-hover:to-accent/10 transition-all shadow-sm">
                <Briefcase className="h-5 w-5 text-accent" />
              </div>
              <TrendingUp className="h-4 w-4 text-success animate-float" style={{
              animationDelay: '0.2s'
            }} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Active Jobs</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground font-display">{jobsData.active.count}</p>
              <p className="text-xs text-accent font-medium">${jobsData.active.amount}</p>
            </div>
          </div>

          <div className="app-card p-4 card-shine cursor-pointer group" onClick={handleAwaitingPaymentsClick}>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-warning/10 to-warning/5 group-hover:from-warning/20 group-hover:to-warning/10 transition-all shadow-sm">
                <DollarSign className="h-5 w-5 text-warning" />
              </div>
              <AlertCircle className="h-4 w-4 text-warning animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Awaiting Payment</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground font-display">{invoicesData.awaitingPayment.count}</p>
              <p className="text-xs text-warning font-medium">${invoicesData.awaitingPayment.amount}</p>
            </div>
          </div>

          <div className="app-card p-4 card-shine cursor-pointer group" onClick={handleTodaysAppointmentsClick}>
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-success/10 to-success/5 group-hover:from-success/20 group-hover:to-success/10 transition-all shadow-sm">
                <Calendar className="h-5 w-5 text-success" />
              </div>
              <CheckCircle className="h-4 w-4 text-success animate-float" style={{
              animationDelay: '0.4s'
            }} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Today's Appointments</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground font-display">{appointmentsData.total.count}</p>
              <p className="text-xs text-success font-medium">${appointmentsData.total.amount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Detailed Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Estimates Detail */}
          <div className="app-card overflow-hidden">
            <div className="p-4 sm:p-5 border-b bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 shadow-sm">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Estimates</h3>
                    <p className="text-xs text-muted-foreground">Manage quotes</p>
                  </div>
                </div>
                <Button size="sm" variant="default" onClick={() => navigate("/estimates")} className="touch-target shadow-md">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 sm:p-5 space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-success/10 to-success/5 hover:from-success/15 hover:to-success/10 transition-all cursor-pointer border border-success/20">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span className="text-sm font-semibold">Approved</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{estimatesData.approved.count}</div>
                  <div className="text-xs text-muted-foreground">${estimatesData.approved.amount.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">Changes Requested</span>
                </div>
                <div className="font-bold text-lg">{estimatesData.changesRequested}</div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Draft</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{estimatesData.draft.count}</div>
                  <div className="text-xs text-muted-foreground">${estimatesData.draft.amount.toLocaleString()}</div>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-3 touch-target" onClick={() => navigate("/estimates")}>
                View All Estimates
              </Button>
            </div>
          </div>

          {/* Jobs Detail */}
          <div className="app-card overflow-hidden">
            <div className="p-4 sm:p-5 border-b bg-gradient-to-r from-accent/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-accent/10 shadow-sm">
                    <Briefcase className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Jobs</h3>
                    <p className="text-xs text-muted-foreground">Track progress</p>
                  </div>
                </div>
                <Button size="sm" variant="default" onClick={() => navigate("/jobs")} className="touch-target shadow-md">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 sm:p-5 space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">Requires Invoicing</span>
                </div>
                <div className="font-bold text-lg">{jobsData.requiresInvoicing}</div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-warning/10 to-warning/5 hover:from-warning/15 hover:to-warning/10 transition-all cursor-pointer border border-warning/20">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">Action Required</span>
                </div>
                <div className="font-bold text-lg">{jobsData.actionRequired}</div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-success/10 to-success/5 hover:from-success/15 hover:to-success/10 transition-all cursor-pointer border border-success/20">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span className="text-sm font-semibold">Active</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{jobsData.active.count}</div>
                  <div className="text-xs text-muted-foreground">${jobsData.active.amount.toLocaleString()}</div>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-3 touch-target" onClick={() => navigate("/jobs")}>
                View All Jobs
              </Button>
            </div>
          </div>

          {/* Invoices Detail */}
          <div className="app-card overflow-hidden">
            <div className="p-4 sm:p-5 border-b bg-gradient-to-r from-warning/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-warning/10 shadow-sm">
                    <DollarSign className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Invoices</h3>
                    <p className="text-xs text-muted-foreground">Payments due</p>
                  </div>
                </div>
                <Button size="sm" variant="default" onClick={() => navigate("/invoices")} className="touch-target shadow-md">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 sm:p-5 space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-destructive/10 to-destructive/5 hover:from-destructive/15 hover:to-destructive/10 transition-all cursor-pointer border border-destructive/20">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-semibold">Past Due</span>
                </div>
                <div className="font-bold text-lg text-destructive">{invoicesData.pastDue}</div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-warning/10 to-warning/5 hover:from-warning/15 hover:to-warning/10 transition-all cursor-pointer border border-warning/20">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">Awaiting Payment</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{invoicesData.awaitingPayment.count}</div>
                  <div className="text-xs text-muted-foreground">${invoicesData.awaitingPayment.amount.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Draft</span>
                </div>
                <div className="font-bold text-lg">{invoicesData.draft}</div>
              </div>

              <Button variant="outline" className="w-full mt-3 touch-target" onClick={() => navigate("/invoices")}>
                View All Invoices
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section - Today's Appointments and Payments */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Today's Appointments with Calendar Preview */}
          <div className="app-card overflow-hidden">
            <div className="p-4 sm:p-5 border-b bg-gradient-to-r from-success/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-success/10 shadow-sm">
                    <Calendar className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Today's Schedule</h3>
                    <p className="text-xs text-muted-foreground">{todaysAppointments.length} appointments</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate("/appointments/manage")} className="touch-target">
                  View All
                </Button>
              </div>
            </div>
            <div className="p-4 sm:p-5 space-y-4">
              {/* Mini Calendar */}
              <div className="p-3 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-border shadow-inner">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => <div key={i} className="text-center text-xs font-semibold text-muted-foreground p-1">
                      {day}
                    </div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({
                  length: 35
                }, (_, i) => {
                  const date = new Date(2025, 9, 27);
                  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                  const startDate = new Date(firstDay);
                  startDate.setDate(startDate.getDate() - startDate.getDay());
                  const cellDate = new Date(startDate);
                  cellDate.setDate(cellDate.getDate() + i);
                  const isCurrentMonth = cellDate.getMonth() === date.getMonth();
                  const isToday = cellDate.toDateString() === date.toDateString();
                  return <div key={i} className={`aspect-square flex items-center justify-center text-xs rounded cursor-pointer transition-colors ${isToday ? "bg-primary text-primary-foreground font-bold" : isCurrentMonth ? "hover:bg-muted text-foreground" : "text-muted-foreground/50"}`}>
                        {cellDate.getDate()}
                      </div>;
                })}
                </div>
              </div>

              {/* Appointments List */}
              <div className="space-y-2">
                {todaysAppointments.map(appointment => <div key={appointment.id} className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group">
                    <Avatar className="h-12 w-12 sm:h-14 sm:w-14 bg-gradient-to-br from-primary to-accent shadow-md group-hover:scale-110 transition-transform">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-lg">
                        {appointment.customer.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground truncate">{appointment.customer}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs px-2">
                          {appointment.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>

          {/* Payments */}
          <div className="app-card overflow-hidden">
            <div className="p-4 sm:p-5 border-b bg-gradient-to-r from-success/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-success/10 shadow-sm">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Payments</h3>
                  <p className="text-xs text-muted-foreground">Financial overview</p>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-5 space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-success/15 to-success/5 border border-success/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <p className="text-xs font-bold text-success uppercase tracking-wide">On Its Way</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">Expected on Oct 06, 2023</p>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold bg-gradient-to-r from-success to-success/70 bg-clip-text text-transparent">
                      $320.33
                    </div>
                    <Button size="sm" variant="outline" onClick={() => navigate("/reports")} className="touch-target">
                      View
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/30 relative overflow-hidden pulse-glow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <p className="text-xs font-bold text-primary uppercase tracking-wide">Available Now</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      $1,337.00
                    </div>
                    <Button size="sm" variant="default" className="touch-target shadow-md hover:shadow-lg">
                      Get it now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>;
};
export default Index;