import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { API_BASE_URL } from "../config";
import CourseCard from "../components/CourseCard";
import { BookOpen, Loader2, GraduationCap } from "lucide-react";

export default function EnrolledCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === "student") {
      fetchEnrolledCourses();
    }
  }, [user]);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/enrolled`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        setError("Failed to fetch enrolled courses");
      }
    } catch (error) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "student") {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <GraduationCap className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h2 className="text-foreground mb-2 text-2xl font-bold">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            This page is only available to students.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading your courses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center">
            <GraduationCap className="text-primary h-12 w-12" />
          </div>
          <h1 className="text-foreground mb-4 text-4xl font-bold">
            My Enrolled Courses
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Continue your learning journey with the courses you've enrolled in.
          </p>
        </div>

        {error && (
          <div className="bg-error/10 border-error/20 text-error mb-8 rounded-lg border px-6 py-4 text-center">
            {error}
          </div>
        )}

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
                No enrolled courses yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start your learning journey by enrolling in courses that
                interest you.
              </p>
              <a
                href="/courses"
                className="bg-primary hover:bg-primary-accent text-primary-foreground inline-flex items-center rounded-lg px-6 py-3 font-medium transition-colors"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Courses
              </a>
            </div>
          )
        )}
      </div>
    </div>
  );
}
