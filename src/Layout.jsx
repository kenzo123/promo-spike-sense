import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import {
  Zap,
  LayoutDashboard,
  Upload,
  Bell,
  Settings,
  ChevronDown,
  LogOut,
  User,
  Crown,
  Menu,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PUBLIC_PAGES = ["Auth"];

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, page: "Dashboard" },
  { label: "Upload", icon: Upload, page: "Upload" },
  { label: "Alerts", icon: Bell, page: "Alerts" },
  { label: "Settings", icon: Settings, page: "Settings" },
];

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [userSettings, setUserSettings] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isPublicPage = PUBLIC_PAGES.includes(currentPageName);

  useEffect(() => {
    if (!isPublicPage) {
      loadUser();
    }
  }, [isPublicPage]);

  const loadUser = async () => {
    try {
      const u = await base44.auth.me();
      setUser(u);
      const settings = await base44.entities.UserSettings.filter({ user_id: u.id });
      if (settings.length > 0) setUserSettings(settings[0]);
    } catch {
      // not authenticated
    }
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  const plan = userSettings?.plan || "free";

  if (isPublicPage) {
    return (
      <div className="min-h-screen" style={{ background: "#0F0F0F", color: "#F5F5F5" }}>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0F0F0F", color: "#F5F5F5" }}>
      {/* Top Nav */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 h-14 border-b"
        style={{
          background: "rgba(15,15,15,0.85)",
          backdropFilter: "blur(12px)",
          borderColor: "#2A2A2A",
        }}
      >
        {/* Left: Logo */}
        <Link
          to={createPageUrl("Dashboard")}
          className="flex items-center gap-2 no-underline"
          style={{ color: "#F5F5F5" }}
        >
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}
          >
            <Zap size={14} color="#fff" fill="#fff" />
          </div>
          <span className="font-semibold text-sm tracking-tight hidden sm:block">
            Promo<span style={{ color: "#6366F1" }}>Spike</span>Sense
          </span>
        </Link>

        {/* Center: Nav Links (desktop) */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all no-underline"
                style={{
                  color: isActive ? "#F5F5F5" : "#888888",
                  background: isActive ? "#222222" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = "#F5F5F5";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = "#888888";
                }}
              >
                <item.icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right: Plan badge + User dropdown */}
        <div className="flex items-center gap-3">
          {/* Plan Badge */}
          <div
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={
              plan === "pro"
                ? { background: "rgba(99,102,241,0.15)", color: "#818CF8", border: "1px solid rgba(99,102,241,0.3)" }
                : { background: "#222222", color: "#888888", border: "1px solid #2A2A2A" }
            }
          >
            {plan === "pro" && <Crown size={10} />}
            {plan === "pro" ? "Pro" : "Free"}
          </div>

          {/* User Dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all"
                  style={{ border: "none", background: "transparent", cursor: "pointer", color: "#F5F5F5" }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}
                  >
                    {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <ChevronDown size={12} style={{ color: "#888888" }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52"
                style={{ background: "#1A1A1A", border: "1px solid #2A2A2A", color: "#F5F5F5" }}
              >
                <div className="px-3 py-2">
                  <p className="text-sm font-medium truncate">{user.full_name || "User"}</p>
                  <p className="text-xs truncate" style={{ color: "#888888" }}>{user.email}</p>
                </div>
                <DropdownMenuSeparator style={{ background: "#2A2A2A" }} />
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer"
                  style={{ color: "#F5F5F5" }}
                >
                  <Link to={createPageUrl("Settings")} className="flex items-center gap-2 no-underline" style={{ color: "#F5F5F5" }}>
                    <User size={13} />
                    Profile & Settings
                  </Link>
                </DropdownMenuItem>
                {plan === "free" && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    style={{ color: "#818CF8" }}
                    onClick={() => {}}
                  >
                    <Crown size={13} className="mr-2" />
                    Upgrade to Pro
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator style={{ background: "#2A2A2A" }} />
                <DropdownMenuItem
                  className="cursor-pointer"
                  style={{ color: "#EF4444" }}
                  onClick={handleLogout}
                >
                  <LogOut size={13} className="mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded-md"
            style={{ background: "transparent", border: "none", color: "#888888", cursor: "pointer" }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-b"
          style={{ background: "#1A1A1A", borderColor: "#2A2A2A" }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium no-underline"
                style={{ color: isActive ? "#F5F5F5" : "#888888" }}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Page Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}