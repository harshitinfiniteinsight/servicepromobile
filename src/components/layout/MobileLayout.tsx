import BottomNav from "./BottomNav";

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <main className="flex-1 overflow-hidden pb-16">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default MobileLayout;


