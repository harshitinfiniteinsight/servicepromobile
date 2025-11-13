import MobileHeader from "@/components/layout/MobileHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, Mail, MessageCircle, BookOpen } from "lucide-react";

const Help = () => {
  const faqs = [
    {
      question: "How do I create an invoice?",
      answer: "Navigate to Invoices, tap the + button, select a customer, add items, set payment terms, and create the invoice. You can save drafts and complete them later.",
    },
    {
      question: "How do I add a new customer?",
      answer: "Go to Customers, tap the + button, fill in the customer details including name, email, phone, and address. You can also add notes for future reference.",
    },
    {
      question: "How do I schedule an appointment?",
      answer: "Go to Appointments, tap the + button, select a customer, choose service type, pick date and time, assign a technician, and book the appointment.",
    },
    {
      question: "How do I track inventory?",
      answer: "Navigate to Inventory to view all items. Use Stock In/Out to record transactions. Set up low stock alerts in Settings to get notified when items run low.",
    },
    {
      question: "How do I generate reports?",
      answer: "Go to Reports, select the report type you need (Invoice, Estimate, Revenue, etc.), set the date range, and view or export the report.",
    },
    {
      question: "How do I manage employee schedules?",
      answer: "Navigate to Employees > Schedule, select an employee, view their calendar, and see all assigned jobs. You can filter by date and status.",
    },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader title="Help & Support" showBack={true} />
      
      <div className="flex-1 overflow-y-auto scrollable pt-14">
        {/* Contact Support */}
        <div className="px-4 py-4 space-y-3">
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
            <div className="flex items-start gap-3 mb-3">
              <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Need Help?</h3>
                <p className="text-sm text-muted-foreground">
                  Our support team is here to assist you with any questions or issues.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                Live Chat
              </Button>
            </div>
          </div>

          {/* FAQs */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Frequently Asked Questions</h3>
            </div>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border rounded-xl px-4">
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Video Tutorials */}
          <div className="p-4 rounded-xl border bg-card">
            <h3 className="font-semibold mb-2">Video Tutorials</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Watch step-by-step tutorials to learn how to use all features.
            </p>
            <Button variant="outline" className="w-full">
              View Tutorials
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
