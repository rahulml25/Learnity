import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import MDEditor, { commands } from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Loader2, Save, ArrowLeft, BookOpen } from "lucide-react";

export default function CreateCoursePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    overview: "",
    duration: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not an instructor
  if (user?.role !== "instructor") {
    navigate("/courses");
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOverviewChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      overview: value || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.duration) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          overview: formData.overview,
          duration: parseInt(formData.duration),
        }),
      });

      if (response.ok) {
        navigate("/created");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create course");
      }
    } catch (error) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="mb-6 flex items-center space-x-4">
            <button
              onClick={() => navigate("/created")}
              className="hover:bg-card border-border text-muted-foreground hover:text-foreground flex items-center space-x-2 rounded-lg border px-4 py-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to My Courses</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="from-primary/20 to-highlight/20 rounded-xl bg-gradient-to-r p-3">
              <BookOpen className="text-primary h-8 w-8" />
            </div>
            <div>
              <h1 className="text-foreground text-3xl font-bold">
                Create New Course
              </h1>
              <p className="text-muted-foreground text-lg">
                Share your knowledge with students around the world
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-error/10 border-error/20 text-error mb-6 rounded-lg border px-6 py-4">
            {error}
          </div>
        )}

        <div className="bg-card border-border mx-auto max-w-4xl rounded-xl border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-foreground mb-2 block text-sm font-medium">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter course title"
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-foreground mb-2 block text-sm font-medium">
                Course Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the course"
                rows={4}
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-foreground mb-2 block text-sm font-medium">
                Course Overview
              </label>
              <p className="text-muted-foreground mb-3 text-sm">
                Detailed overview with markdown formatting (optional)
              </p>
              <div>
                <MDEditor
                  value={formData.overview}
                  onChange={handleOverviewChange}
                  preview="edit"
                  hideToolbar={false}
                  commands={[
                    // Basic formatting commands excluding h1 and h2
                    commands.bold,
                    commands.italic,
                    commands.strikethrough,
                    commands.hr,
                    commands.group(
                      [
                        commands.heading3,
                        commands.heading4,
                        commands.heading5,
                        commands.heading6,
                      ],
                      {
                        name: "title",
                        groupName: "title",
                        buttonProps: { "aria-label": "Insert title" },
                      },
                    ),
                    commands.divider,
                    commands.link,
                    commands.quote,
                    commands.code,
                    commands.codeBlock,
                    commands.divider,
                    commands.unorderedListCommand,
                    commands.orderedListCommand,
                    commands.checkedListCommand,
                  ]}
                  textareaProps={{
                    placeholder:
                      "Write a detailed course overview using markdown...",
                    style: {
                      fontSize: 14,
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                    },
                  }}
                  height="fit-content"
                />
              </div>
            </div>

            <div>
              <label className="text-foreground mb-2 block text-sm font-medium">
                Duration (hours) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="Enter course duration in hours"
                min="1"
                max="1000"
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/created")}
                className="border-border text-muted-foreground hover:text-foreground hover:bg-card rounded-lg border px-6 py-3 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary-accent text-primary-foreground flex items-center space-x-2 rounded-lg px-6 py-3 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{loading ? "Creating..." : "Create Course"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
