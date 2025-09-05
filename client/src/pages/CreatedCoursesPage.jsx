import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router";
import { API_BASE_URL } from "../config";
import {
  BookOpen,
  Loader2,
  GraduationCap,
  Plus,
  Users,
  Clock,
  Eye,
  Edit,
} from "lucide-react";

export default function CreatedCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === "instructor") {
      fetchCreatedCourses();
    }
  }, [user]);

  const fetchCreatedCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/created`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        setError("Failed to fetch created courses");
      }
    } catch (error) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "instructor") {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <GraduationCap className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h2 className="text-foreground mb-2 text-2xl font-bold">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            This page is only available to instructors.
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
        <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-6 text-center sm:mb-0 sm:text-left">
            <h1 className="text-foreground mb-4 text-4xl font-bold">
              My Created Courses
            </h1>
            <p className="text-muted-foreground text-xl">
              Manage and monitor your courses and students.
            </p>
          </div>

          <Link to="/courses/create">
            <button className="bg-primary hover:bg-primary-accent text-primary-foreground inline-flex items-center space-x-2 rounded-lg px-6 py-3 font-medium transition-colors">
              <Plus className="h-4 w-4" />
              <span>Create New Course</span>
            </button>
          </Link>
        </div>

        {error && (
          <div className="bg-error/10 border-error/20 text-error mb-8 rounded-lg border px-6 py-4 text-center">
            {error}
          </div>
        )}

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <InstructorCourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="py-16 text-center">
              <BookOpen className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                No courses created yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start sharing your knowledge by creating your first course.
              </p>
              <Link to="/courses/create">
                <button className="bg-primary hover:bg-primary-accent text-primary-foreground inline-flex items-center rounded-lg px-6 py-3 font-medium transition-colors">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Course
                </button>
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function InstructorCourseCard({ course }) {
  return (
    <div className="bg-card border-border hover:border-primary/60 hover:bg-card/80 rounded-lg border p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
      <div className="space-y-4">
        <div>
          <h3 className="text-foreground text-xl leading-tight font-semibold">
            {course.title}
          </h3>
          <p className="text-secondary-foreground mt-3 line-clamp-3 text-sm leading-relaxed">
            {course.description}
          </p>
        </div>

        <div className="text-muted-foreground border-border flex items-center justify-between border-t pt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 rounded p-1">
              <Clock className="text-primary h-3 w-3" />
            </div>
            <span className="font-medium">{course.duration} hours</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-secondary/10 rounded p-1">
              <Users className="text-secondary h-3 w-3" />
            </div>
            <span className="font-medium">
              {course.enrolledStudents.length} students
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
          <Link
            to={`/courses/${course._id}`}
            className="from-secondary/15 to-secondary/10 hover:from-secondary/25 hover:to-secondary/15 text-secondary border-secondary/20 hover:border-secondary/40 rounded-lg border bg-gradient-to-r px-4 py-3 text-center font-semibold transition-all duration-300"
          >
            View Course
          </Link>

          <Link
            to={`/courses/${course._id}/preview`}
            className="from-primary/15 to-primary/10 hover:from-primary/25 hover:to-primary/15 text-primary border-primary/20 hover:border-primary/40 flex items-center justify-center space-x-1 rounded-lg border bg-gradient-to-r px-4 py-3 text-center font-semibold transition-all duration-300"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </Link>

          <Link
            to={`/courses/${course._id}/edit`}
            className="from-highlight/15 to-highlight/10 hover:from-highlight/25 hover:to-highlight/15 text-highlight border-highlight/20 hover:border-highlight/40 col-span-1 flex items-center justify-center space-x-1 rounded-lg border bg-gradient-to-r px-4 py-3 text-center font-semibold transition-all duration-300 sm:col-span-2"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Course</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
