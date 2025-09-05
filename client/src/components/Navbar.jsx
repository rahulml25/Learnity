import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { BookOpen, User, GraduationCap, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user || location.pathname === "/") return null;

  const navLinks = [
    {
      label: "All Courses",
      href: "/courses",
      icon: BookOpen,
    },
    {
      label: "Profile",
      href: `/profile/${user._id}`,
      icon: User,
    },
    {
      label: user.role === "student" ? "Enrolled Courses" : "Created Courses",
      href: user.role === "student" ? "/enrolled" : "/created",
      icon: GraduationCap,
    },
  ];

  return (
    <nav className="bg-card border-border sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/courses" className="flex items-center space-x-2">
            <img src="/icon.png" alt="Learnity Logo" className="h-8 w-8" />
            <span className="text-foreground text-xl font-bold">Learnity</span>
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-muted-foreground hover:text-foreground flex items-center space-x-1 transition-colors"
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="text-muted-foreground hover:text-error flex items-center space-x-1 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-foreground md:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="border-border border-t py-4 md:hidden">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-muted-foreground hover:text-foreground flex items-center space-x-2 px-2 py-1 transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              ))}

              <button
                onClick={handleLogout}
                className="text-muted-foreground hover:text-error flex items-center space-x-2 px-2 py-1 text-left transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
