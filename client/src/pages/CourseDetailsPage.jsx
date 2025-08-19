import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import {
  Clock,
  User,
  Calendar,
  ArrowLeft,
  Loader2,
  BookOpen,
  UserPlus,
} from "lucide-react";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");
  const [enrollmentStatus, setEnrollmentStatus] = useState("");

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`http://localhost:3000/courses/${id}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCourse(data);
      } else {
        setError("Course not found");
      }
    } catch (error) {
      setError("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (user?.role !== "student") return;

    setEnrolling(true);
    try {
      const response = await fetch(
        `http://localhost:3000/courses/${id}/enroll`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = await response.json();
      if (response.ok) {
        setEnrollmentStatus("success");
      } else {
        setEnrollmentStatus(`error: ${data.message}`);
      }
    } catch (error) {
      setEnrollmentStatus("error: Network error occurred");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading course details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <BookOpen className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h2 className="text-foreground mb-2 text-2xl font-bold">
            Course Not Found
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link
            to="/courses"
            className="text-primary hover:text-primary-accent"
          >
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/courses"
          className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Link>

        <div className="mx-auto max-w-4xl">
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
                    <User className="h-5 w-5" />
                    <span>By {course.instructor?.name || "Instructor"}</span>
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

              {/* Enrollment Section */}
              {user?.role === "student" && (
                <div className="lg:w-80">
                  <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <h3 className="text-foreground mb-4 text-xl font-semibold">
                      Enroll in this course
                    </h3>

                    {enrollmentStatus && (
                      <div
                        className={`mb-4 rounded-lg p-4 text-sm font-medium ${
                          enrollmentStatus === "success"
                            ? "bg-gradient-to-r from-success/15 to-success/10 border border-success/30 text-success"
                            : "bg-gradient-to-r from-error/15 to-error/10 border border-error/30 text-error"
                        }`}
                      >
                        {enrollmentStatus === "success"
                          ? "Successfully enrolled in course!"
                          : enrollmentStatus.replace("error: ", "")}
                      </div>
                    )}

                    <button
                      onClick={handleEnroll}
                      disabled={enrolling || enrollmentStatus === "success"}
                      className="bg-primary hover:bg-primary-accent text-primary-foreground flex w-full items-center justify-center space-x-2 rounded-lg px-4 py-3 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {enrolling ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Enrolling...</span>
                        </>
                      ) : enrollmentStatus === "success" ? (
                        <>
                          <BookOpen className="h-4 w-4" />
                          <span>Enrolled</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" />
                          <span>Enroll Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Course Content/Details */}
          <div className="bg-card border-border rounded-lg border p-8 shadow-sm">
            <h2 className="text-foreground mb-6 text-2xl font-bold">
              Course Overview
            </h2>

            <div className="prose prose-invert max-w-none">
              <p className="text-secondary-foreground leading-relaxed">
                This comprehensive course covers all the essential topics you
                need to master. Through practical exercises and real-world
                examples, you'll gain the skills and knowledge to excel in this
                subject area.
              </p>

              <h3 className="text-foreground mt-8 mb-4 text-xl font-semibold">
                What You'll Learn
              </h3>

              <ul className="text-secondary-foreground space-y-2">
                <li>• Fundamental concepts and principles</li>
                <li>• Hands-on practical applications</li>
                <li>• Industry best practices and standards</li>
                <li>• Real-world project development</li>
                <li>• Advanced techniques and strategies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
