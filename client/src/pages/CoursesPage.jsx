import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import CourseCard from "../components/CourseCard";
import { BookOpen, Loader2 } from "lucide-react";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:3000/courses", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        setError("Failed to fetch courses");
      }
    } catch (error) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading courses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center">
            <BookOpen className="text-primary h-12 w-12" />
          </div>
          <h1 className="text-foreground mb-4 text-4xl font-bold">
            Discover Amazing Courses
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Explore our wide range of courses designed to help you learn new
            skills and advance your career. Find the perfect course for your
            learning journey.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-error/10 border-error/20 text-error mb-8 rounded-lg border px-6 py-4 text-center">
            {error}
          </div>
        )}

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="py-16 text-center">
              <BookOpen className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                No courses available
              </h3>
              <p className="text-muted-foreground">
                {user?.role === "instructor"
                  ? "Be the first to create a course!"
                  : "Check back later for new courses."}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
