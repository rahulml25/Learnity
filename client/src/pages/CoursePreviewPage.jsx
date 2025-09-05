import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import MarkdownPreview from "@uiw/react-markdown-preview";
import "@uiw/react-markdown-preview/markdown.css";
import { ArrowLeft, Clock, Calendar, Loader2, BookOpen } from "lucide-react";

export default function CoursePreviewPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
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
        <Link
          to="/created"
          className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Courses
        </Link>

        <div className="mx-auto max-w-6xl">
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

                    <Link
                      to={`/courses/${course._id}/edit`}
                      className="bg-primary/10 hover:bg-primary/20 text-primary block w-full rounded-lg px-4 py-2 text-center font-medium transition-colors"
                    >
                      Edit Course Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                  No detailed overview available for this course yet. You can
                  add one by editing the course details.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
