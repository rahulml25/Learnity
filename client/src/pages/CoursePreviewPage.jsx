import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowLeft,
  Users,
  Clock,
  Calendar,
  Loader2,
  BookOpen,
  User,
  MapPin,
  Mail,
} from "lucide-react";

export default function CoursePreviewPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      // Fetch course details
      const courseResponse = await fetch(
        `http://localhost:3000/courses/${id}`,
        {
          credentials: "include",
        },
      );

      if (courseResponse.ok) {
        const courseData = await courseResponse.json();
        setCourse(courseData);

        // For demo purposes, simulate enrolled students data
        // In a real app, you'd have an endpoint to get enrolled students
        const mockStudents = [
          {
            _id: "1",
            name: "Alice Johnson",
            email: "alice@example.com",
            location: "New York, NY",
            enrolledAt: new Date().toISOString(),
          },
          {
            _id: "2",
            name: "Bob Smith",
            email: "bob@example.com",
            location: "Los Angeles, CA",
            enrolledAt: new Date().toISOString(),
          },
          {
            _id: "3",
            name: "Carol Davis",
            email: "carol@example.com",
            location: "Chicago, IL",
            enrolledAt: new Date().toISOString(),
          },
        ];
        setEnrolledStudents(mockStudents);
      } else {
        setError("Course not found or access denied");
      }
    } catch (error) {
      setError("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  // Check if user is an instructor
  if (user?.role !== "instructor") {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <BookOpen className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
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
          <span>Loading course preview...</span>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <BookOpen className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h2 className="text-foreground mb-2 text-2xl font-bold">
            Course Not Found
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link
            to="/created"
            className="text-primary hover:text-primary-accent"
          >
            ← Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/created"
          className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Courses
        </Link>

        <div className="mx-auto max-w-6xl">
          {/* Course Header */}
          <div className="bg-card border-border mb-8 rounded-lg border p-8 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <h1 className="text-foreground mb-4 text-3xl font-bold lg:text-4xl">
                  {course.title}
                </h1>

                <div className="text-muted-foreground mb-6 flex flex-wrap items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>{course.duration} hours</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>{enrolledStudents.length} enrolled students</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>
                      Created {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="text-secondary-foreground text-lg leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="lg:w-80">
                <div className="bg-card border-border rounded-lg border p-6">
                  <h3 className="text-foreground mb-4 text-xl font-semibold">
                    Quick Actions
                  </h3>

                  <div className="space-y-3">
                    <Link
                      to={`/courses/${course._id}`}
                      className="bg-secondary hover:bg-secondary-accent text-secondary-foreground block w-full rounded-lg px-4 py-2 text-center font-medium transition-colors"
                    >
                      View Public Course Page
                    </Link>

                    <button className="bg-primary/10 hover:bg-primary/20 text-primary w-full rounded-lg px-4 py-2 font-medium transition-colors">
                      Edit Course Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enrolled Students */}
          <div className="bg-card border-border rounded-lg border p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-foreground flex items-center space-x-2 text-2xl font-bold">
                <Users className="h-6 w-6" />
                <span>Enrolled Students ({enrolledStudents.length})</span>
              </h2>
            </div>

            {enrolledStudents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enrolledStudents.map((student) => (
                  <StudentCard key={student._id} student={student} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Users className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <h3 className="text-foreground mb-2 text-xl font-semibold">
                  No students enrolled yet
                </h3>
                <p className="text-muted-foreground">
                  Share your course to start getting enrollments!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentCard({ student }) {
  return (
    <div className="bg-card border-border hover:border-primary/40 hover:bg-card/80 rounded-lg border p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start space-x-4">
        <div className="from-secondary/20 to-secondary/10 ring-secondary/20 rounded-xl bg-gradient-to-br p-3 ring-1">
          <User className="text-secondary h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-foreground truncate text-lg font-semibold">
            {student.name}
          </h3>

          <div className="mt-3 space-y-2">
            <div className="text-secondary-foreground flex items-center space-x-2 text-sm">
              <Mail className="text-primary h-3 w-3" />
              <span className="truncate">{student.email}</span>
            </div>

            {student.location && (
              <div className="text-secondary-foreground flex items-center space-x-2 text-sm">
                <MapPin className="text-secondary h-3 w-3" />
                <span>{student.location}</span>
              </div>
            )}

            <div className="text-muted-foreground flex items-center space-x-2 text-sm">
              <Calendar className="h-3 w-3" />
              <span>
                Enrolled {new Date(student.enrolledAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
