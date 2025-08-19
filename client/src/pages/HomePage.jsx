import { LogIn, UserRoundPlus } from "lucide-react";
import { Link } from "react-router";

export default function HomePage() {
  return (
    <div className="home-radial-bg min-h-dvh">
      {/* Navbar */}
      <header className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2">
          <img src="/icon.png" alt="Learnity Logo" className="size-10" />
          <span className="text-2xl font-medium sm:text-3xl">Learnity</span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link to="/signup">
            <button className="bg-secondary hover:bg-secondary-accent flex items-center space-x-3 rounded-full p-2 font-medium shadow transition-colors sm:space-x-0 sm:px-8 sm:py-1.5">
              <span className="hidden sm:inline-block">Sign Up</span>
              <UserRoundPlus className="size-4 sm:hidden" />
            </button>
          </Link>
          <Link to="/login">
            <button className="bg-primary hover:bg-primary-accent flex items-center space-x-3 rounded-full p-2 font-medium shadow transition-colors sm:space-x-0 sm:px-8 sm:py-1.5">
              <span className="hidden sm:inline-block">Log In</span>
              <LogIn className="size-4 sm:hidden" />
            </button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto">
        {/* Hero Section */}
        <section className="hero flex flex-col items-center gap-y-10 px-10 py-14 md:flex-row md:px-14 lg:px-20">
          <div className="md:min-w-3/5 xl:w-4/6">
            <div className="mb-8 space-y-4 lg:space-y-8">
              <h1 className="text-highlight text-4xl font-bold lg:text-5xl xl:text-6xl">
                Where Learning Becomes a Community.
              </h1>
              <p className="text-secondary-foreground text-lg font-bold lg:text-xl">
                Discover skills, share knowledge, and grow together — anytime,
                anywhere.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/signup">
                <button className="cta-sign-up rounded-full px-8 py-1.5 font-medium transition-colors hover:bg-gradient-to-tr lg:px-10 lg:py-2 lg:text-lg">
                  Start Learning
                </button>
              </Link>
              <Link to="/courses">
                <button className="border-primary hover:border-primary-accent hover:bg-primary/5 rounded-full border-2 px-8 py-1.5 font-medium shadow transition-all duration-300 hover:scale-102 lg:px-10 lg:py-2 lg:text-lg">
                  Browse Courses
                </button>
              </Link>
            </div>
          </div>

          <img
            src="./icon.png"
            alt="Learnity Hero Image"
            className="w-80 md:w-2/6 xl:w-[calc(calc(2/5_*_100%)_-_24px)]"
          />
        </section>
      </main>
    </div>
  );
}
