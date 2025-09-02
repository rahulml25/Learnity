import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import MarkdownPreview from "@uiw/react-markdown-preview";
import "@uiw/react-markdown-preview/markdown.css";
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
        // Refresh course data to update enrollment status
        fetchCourse();
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
                    <span>By </span>
                    {course.instructor?._id ? (
                      <Link
                        to={`/profile/${course.instructor._id}`}
                        className="text-primary hover:text-primary-accent underline transition-colors"
                      >
                        {course.instructor.name}
                      </Link>
                    ) : (
                      <span>Instructor</span>
                    )}
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
                <div className="lg:w-80 lg:border-l lg:border-dashed lg:pl-6">
                  {/* <div className="border-border from-card/50 to-muted/20 rounded-lg border bg-gradient-to-br p-6 backdrop-blur-sm"> */}
                  <h3 className="text-foreground mb-4 text-xl font-semibold">
                    Enrollment Status
                  </h3>

                  {course.isEnrolled ? (
                    <div className="from-primary/10 to-secondary/10 mb-4 flex items-center space-x-3 rounded-lg bg-gradient-to-r p-4">
                      <div className="from-primary/20 to-secondary/20 rounded-full bg-gradient-to-r p-2">
                        <svg
                          className="text-primary h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-foreground font-semibold">
                          Already Enrolled
                        </p>
                        <p className="text-secondary-foreground text-sm">
                          You have access to this course
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {enrollmentStatus && (
                        <div
                          className={`mb-4 flex items-center space-x-3 rounded-lg p-4 ${
                            enrollmentStatus === "success"
                              ? "from-primary/10 to-secondary/10 bg-gradient-to-r"
                              : "from-error/10 to-error/15 bg-gradient-to-r"
                          }`}
                        >
                          <div
                            className={`rounded-full p-2 ${
                              enrollmentStatus === "success"
                                ? "from-primary/20 to-secondary/20 bg-gradient-to-r"
                                : "from-error/20 to-error/30 bg-gradient-to-r"
                            }`}
                          >
                            {enrollmentStatus === "success" ? (
                              <svg
                                className="text-primary h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="text-error h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p
                              className={`font-semibold ${
                                enrollmentStatus === "success"
                                  ? "text-foreground"
                                  : "text-error"
                              }`}
                            >
                              {enrollmentStatus === "success"
                                ? "Successfully Enrolled!"
                                : "Enrollment Failed"}
                            </p>
                            <p className="text-secondary-foreground text-sm">
                              {enrollmentStatus === "success"
                                ? "You now have access to this course"
                                : enrollmentStatus.replace("error: ", "")}
                            </p>
                          </div>
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
                    </>
                  )}
                  {/* </div> */}
                </div>
              )}
            </div>
          </div>

          {/* Course Content/Details */}
          <div className="bg-card border-border rounded-lg border p-8 shadow-sm">
            <h2 className="text-foreground mb-6 text-2xl font-bold">
              Course Overview
            </h2>

            <div
              className="prose prose-invert max-w-none"
              data-color-mode="dark"
            >
              {course.overview ? (
                <MarkdownPreview
                  source={course.overview}
                  style={{
                    backgroundColor: "transparent",
                    color: "var(--secondary-foreground)",
                  }}
                />
              ) : (
                <p className="text-secondary-foreground leading-relaxed">
                  No detailed overview available for this course yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
