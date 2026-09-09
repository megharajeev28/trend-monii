import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import TopNavbar from "./TopNavbar.jsx";
import AppProvider from "./AppProvider.jsx";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AppProvider>
      <div className="flex min-h-screen bg-ink-50">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <TopNavbar onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 sm:px-6 py-6 max-w-[1400px] w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
