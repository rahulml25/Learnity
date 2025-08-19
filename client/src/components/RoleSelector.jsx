import { User, GraduationCap } from "lucide-react";

export default function RoleSelector({ onRoleSelect, type }) {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img
            src="/icon.png"
            alt="Learnity Logo"
            className="mx-auto h-16 w-16"
          />
          <h2 className="text-foreground mt-6 text-3xl font-bold">
            {type === "signup" ? "Join Learnity" : "Welcome Back"}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {type === "signup"
              ? "Choose how you'd like to get started"
              : "Select your account type to continue"}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onRoleSelect("student")}
            className="group border-primary/30 from-card via-card to-primary/10 hover:border-primary/60 hover:shadow-primary/20 flex w-full items-center justify-center rounded-xl border bg-gradient-to-br p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="flex items-center space-x-4">
              <div className="from-secondary/30 to-highlight-foreground/30 group-hover:from-secondary/40 group-hover:to-highlight-foreground/40 rounded-xl bg-gradient-to-br p-4 transition-all duration-300 group-hover:shadow-lg">
                <User className="text-secondary h-7 w-7" />
              </div>
              <div className="text-left">
                <h3 className="text-foreground group-hover:text-secondary text-xl font-bold transition-colors">
                  Student
                </h3>
                <p className="text-secondary-foreground text-sm leading-relaxed">
                  Learn new skills and discover knowledge
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onRoleSelect("instructor")}
            className="group border-primary/30 from-card via-card to-secondary/10 hover:border-secondary/60 hover:shadow-secondary/20 flex w-full items-center justify-center rounded-xl border bg-gradient-to-br p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="flex items-center space-x-4">
              <div className="from-primary/30 to-highlight/30 group-hover:from-primary/40 group-hover:to-highlight/40 rounded-xl bg-gradient-to-br p-4 transition-all duration-300 group-hover:shadow-lg">
                <GraduationCap className="text-primary h-7 w-7" />
              </div>
              <div className="text-left">
                <h3 className="text-foreground group-hover:text-primary text-xl font-bold transition-colors">
                  Instructor
                </h3>
                <p className="text-secondary-foreground text-sm leading-relaxed">
                  Share your expertise and teach others
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
