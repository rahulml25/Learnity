import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import RoleSelector from "../components/RoleSelector";

export default function SignUpPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signup(
      formData.name,
      formData.email,
      formData.password,
      selectedRole,
    );

    if (result.success) {
      navigate("/courses");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  if (!selectedRole) {
    return <RoleSelector onRoleSelect={handleRoleSelect} type="signup" />;
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <button
            onClick={() => setSelectedRole(null)}
            className="text-muted-foreground hover:text-foreground mb-4 flex items-center transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </button>

          <div className="text-center">
            <img
              src="/icon.png"
              alt="Learnity Logo"
              className="mx-auto h-16 w-16"
            />
            <h2 className="text-foreground mt-6 text-3xl font-bold">
              Sign up as {selectedRole === "student" ? "Student" : "Instructor"}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Create your account to get started
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-error/10 border-error/20 text-error rounded-lg border px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="text-foreground mb-1 block text-sm font-medium"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="border-primary/30 from-card to-card/90 text-foreground placeholder:text-secondary-foreground hover:border-primary/50 focus:border-primary focus:ring-primary/30 w-full rounded-xl border bg-gradient-to-br px-4 py-3 shadow-lg backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-foreground mb-1 block text-sm font-medium"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="border-border bg-card text-foreground placeholder-secondary-foreground focus:ring-primary focus:border-primary/50 hover:border-border/80 w-full rounded-lg border px-4 py-3 shadow-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-foreground mb-1 block text-sm font-medium"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="border-border bg-card text-foreground placeholder-secondary-foreground focus:ring-primary focus:border-primary/50 hover:border-border/80 w-full rounded-lg border px-4 py-3 pr-12 shadow-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="from-primary via-primary to-secondary hover:from-primary-accent hover:via-primary-accent hover:to-secondary-accent hover:shadow-primary/30 focus:ring-primary/50 w-full rounded-xl bg-gradient-to-br px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary-accent font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
