import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, LogOut, MessageSquare, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import logoImage from "@/assets/logo.png";
import NotificationBell from "@/components/NotificationBell";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, userRole, signOut } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("avatar_url, full_name").eq("id", user.id).maybeSingle()
        .then(({ data }) => {
          if (data) {
            setAvatarUrl(data.avatar_url);
            setFullName(data.full_name);
          }
        });
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoImage} alt="NeuraBridge" className="h-7 w-auto md:h-9" />
          <span className="font-display text-lg font-bold text-foreground md:text-xl">NeuraBridge</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-4 lg:gap-6 xl:gap-8 lg:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Home</Link>
          <Link to="/experts" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Experts</Link>
          <Link to="/insights" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Insights</Link>
          <Link to="/marketplace" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Marketplace</Link>
          {user && userRole === 'expert' && (
            <Link to="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
          )}
          {user && userRole === 'investor' && (
            <Link to="/my-feed" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">My Feed</Link>
          )}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-1.5 lg:flex">
          {user ? (
            <>
              <NotificationBell />
              <Button variant="ghost" size="icon" asChild>
                <Link to="/messages"><MessageSquare className="h-5 w-5" /></Link>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link to="/profile">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {(fullName || user.email || "?").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild><Link to="/auth">Sign In</Link></Button>
              <Button asChild><Link to="/auth?mode=signup">Get Started</Link></Button>
            </>
          )}
        </div>

        {/* Mobile: icons + hamburger */}
        <div className="flex items-center gap-0.5 lg:hidden">
          {user && (
            <>
              <NotificationBell />
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link to="/messages"><MessageSquare className="h-4 w-4" /></Link>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" asChild>
                <Link to="/profile">
                  <Avatar className="h-6 w-6 border border-border">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-[9px]">
                      {(fullName || user.email || "?").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </Button>
            </>
          )}
          <button
            className="flex items-center justify-center rounded-md p-1.5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container flex flex-col gap-4 py-4">
            <Link to="/" className="text-sm font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/experts" className="text-sm font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>Experts</Link>
            <Link to="/insights" className="text-sm font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>Insights</Link>
            <Link to="/marketplace" className="text-sm font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>Marketplace</Link>
            {user && userRole === 'expert' && (
              <Link to="/dashboard" className="text-sm font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
            )}
            {user && userRole === 'investor' && (
              <Link to="/my-feed" className="text-sm font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>My Feed</Link>
            )}
            {user && (
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <Link to="/messages" className="flex items-center gap-2 text-sm font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
                  <MessageSquare className="h-4 w-4" /> Messages
                </Link>
                <span className="text-border">|</span>
                <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
                  <Avatar className="h-6 w-6 border border-border">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                      {(fullName || user.email || "?").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  Profile
                </Link>
              </div>
            )}
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground px-1">{user.email}</span>
                  <Button variant="outline" onClick={handleSignOut} className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
