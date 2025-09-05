import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  MapPin,
  Target,
  Award,
  Briefcase,
  ExternalLink,
  Save,
  ArrowLeft,
  Loader2,
  Plus,
  X,
} from "lucide-react";

export default function EditProfilePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    goals: [],
    skills: [],
    location: "",
    expertise: [],
    experience: [],
    socialLinks: {
      linkedin: "",
      github: "",
      twitter: "",
      website: "",
    },
  });

  const [newGoal, setNewGoal] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newExpertise, setNewExpertise] = useState("");
  const [newExperience, setNewExperience] = useState({
    role: "",
    company: "",
    years: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        goals: user.goals || [],
        skills: user.skills || [],
        location: user.location || "",
        expertise: user.expertise || [],
        experience: user.experience || [],
        socialLinks: {
          linkedin: user.socialLinks?.linkedin || "",
          github: user.socialLinks?.github || "",
          twitter: user.socialLinks?.twitter || "",
          website: user.socialLinks?.website || "",
        },
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const addGoal = () => {
    if (newGoal.trim() && !formData.goals.includes(newGoal.trim())) {
      setFormData((prev) => ({
        ...prev,
        goals: [...prev.goals, newGoal.trim()],
      }));
      setNewGoal("");
    }
  };

  const removeGoal = (index) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addExpertise = () => {
    if (
      newExpertise.trim() &&
      !formData.expertise.includes(newExpertise.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()],
      }));
      setNewExpertise("");
    }
  };

  const removeExpertise = (index) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index),
    }));
  };

  const addExperience = () => {
    if (
      newExperience.role.trim() &&
      newExperience.company.trim() &&
      newExperience.years
    ) {
      setFormData((prev) => ({
        ...prev,
        experience: [
          ...prev.experience,
          {
            role: newExperience.role.trim(),
            company: newExperience.company.trim(),
            years: parseInt(newExperience.years),
          },
        ],
      }));
      setNewExperience({ role: "", company: "", years: "" });
    }
  };

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      setError("Name is required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:3000/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(user, data.user);
        setUser(data.user); // Update user context
        setSuccess("Profile updated successfully!");
        setTimeout(() => {
          navigate(`/profile/${user._id}`);
        }, 1500);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (error) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <User className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h2 className="text-foreground mb-2 text-2xl font-bold">
            Please Login
          </h2>
          <p className="text-muted-foreground">
            You need to be logged in to edit your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6 flex items-center space-x-4">
            <button
              onClick={() => navigate(`/profile/${user._id}`)}
              className="hover:bg-card border-border text-muted-foreground hover:text-foreground flex items-center space-x-2 rounded-lg border px-4 py-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Profile</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="from-primary/20 to-highlight/20 rounded-xl bg-gradient-to-r p-3">
              <User className="text-primary h-8 w-8" />
            </div>
            <div>
              <h1 className="text-foreground text-3xl font-bold">
                Edit Profile
              </h1>
              <p className="text-muted-foreground text-lg">
                Update your personal information and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-error/10 border-error/20 text-error mb-6 rounded-lg border px-6 py-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-success/10 border-success/20 text-success mb-6 rounded-lg border px-6 py-4">
            {success}
          </div>
        )}

        {/* Form */}
        <div className="bg-card border-border mx-auto max-w-4xl rounded-xl border p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-foreground flex items-center space-x-2 text-xl font-bold">
                <User className="h-5 w-5" />
                <span>Basic Information</span>
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    className="border-border bg-muted text-muted-foreground w-full cursor-not-allowed rounded-lg border px-4 py-3"
                    disabled
                    title="Email cannot be changed"
                  />
                  <p className="text-muted-foreground mt-1 text-xs">
                    Email address cannot be changed for security reasons
                  </p>
                </div>
              </div>
            </div>

            {/* Location (for students only) */}
            {user.role === "student" && (
              <div>
                <label className="text-foreground mb-2 flex items-center space-x-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  <span>Location</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., San Francisco, CA"
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
                />
              </div>
            )}

            {/* Goals (for students only) */}
            {user.role === "student" && (
              <div className="space-y-4">
                <h2 className="text-foreground flex items-center space-x-2 text-xl font-bold">
                  <Target className="h-5 w-5" />
                  <span>Learning Goals</span>
                </h2>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="Add a new learning goal"
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 flex-1 rounded-lg border px-4 py-2 transition-colors focus:ring-2 focus:outline-none"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addGoal())
                    }
                  />
                  <button
                    type="button"
                    onClick={addGoal}
                    className="bg-primary hover:bg-primary-accent text-primary-foreground flex items-center space-x-1 rounded-lg px-4 py-2 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.goals.map((goal, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary border-primary/20 flex items-center space-x-2 rounded-full border px-3 py-1 text-sm"
                    >
                      <span>{goal}</span>
                      <button
                        type="button"
                        onClick={() => removeGoal(index)}
                        className="hover:text-primary-accent"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skills (for students only) */}
            {user.role === "student" && (
              <div className="space-y-4">
                <h2 className="text-foreground flex items-center space-x-2 text-xl font-bold">
                  <Award className="h-5 w-5" />
                  <span>Skills</span>
                </h2>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a new skill"
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 flex-1 rounded-lg border px-4 py-2 transition-colors focus:ring-2 focus:outline-none"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSkill())
                    }
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="bg-primary hover:bg-primary-accent text-primary-foreground flex items-center space-x-1 rounded-lg px-4 py-2 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-secondary/10 text-secondary border-secondary/20 flex items-center space-x-2 rounded-full border px-3 py-1 text-sm"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="hover:text-secondary-accent"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Expertise (for instructors only) */}
            {user.role === "instructor" && (
              <div className="space-y-4">
                <h2 className="text-foreground flex items-center space-x-2 text-xl font-bold">
                  <Award className="h-5 w-5" />
                  <span>Subject Expertise</span>
                </h2>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    placeholder="Add area of expertise"
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 flex-1 rounded-lg border px-4 py-2 transition-colors focus:ring-2 focus:outline-none"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addExpertise())
                    }
                  />
                  <button
                    type="button"
                    onClick={addExpertise}
                    className="bg-primary hover:bg-primary-accent text-primary-foreground flex items-center space-x-1 rounded-lg px-4 py-2 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.expertise.map((area, index) => (
                    <span
                      key={index}
                      className="bg-highlight/10 text-highlight border-highlight/20 flex items-center space-x-2 rounded-full border px-3 py-1 text-sm"
                    >
                      <span>{area}</span>
                      <button
                        type="button"
                        onClick={() => removeExpertise(index)}
                        className="hover:text-highlight-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience (for instructors only) */}
            {user.role === "instructor" && (
              <div className="space-y-4">
                <h2 className="text-foreground flex items-center space-x-2 text-xl font-bold">
                  <Briefcase className="h-5 w-5" />
                  <span>Experience</span>
                </h2>

                <div className="bg-background border-border space-y-4 rounded-lg border p-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <input
                      type="text"
                      value={newExperience.role}
                      onChange={(e) =>
                        setNewExperience((prev) => ({
                          ...prev,
                          role: e.target.value,
                        }))
                      }
                      placeholder="Job title/role"
                      className="border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 rounded-lg border px-4 py-2 transition-colors focus:ring-2 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={newExperience.company}
                      onChange={(e) =>
                        setNewExperience((prev) => ({
                          ...prev,
                          company: e.target.value,
                        }))
                      }
                      placeholder="Company/Organization"
                      className="border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 rounded-lg border px-4 py-2 transition-colors focus:ring-2 focus:outline-none"
                    />
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={newExperience.years}
                        onChange={(e) =>
                          setNewExperience((prev) => ({
                            ...prev,
                            years: e.target.value,
                          }))
                        }
                        placeholder="Years"
                        min="0"
                        max="50"
                        className="border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 flex-1 rounded-lg border px-4 py-2 transition-colors focus:ring-2 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={addExperience}
                        className="bg-primary hover:bg-primary-accent text-primary-foreground flex items-center space-x-1 rounded-lg px-4 py-2 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {formData.experience.map((exp, index) => (
                    <div
                      key={index}
                      className="bg-card border-border flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <h4 className="text-foreground font-semibold">
                          {exp.role}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {exp.company} • {exp.years} year
                          {exp.years !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="text-error hover:text-error/80"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links (for instructors only) */}
            {user.role === "instructor" && (
              <div className="space-y-4">
                <h2 className="text-foreground flex items-center space-x-2 text-xl font-bold">
                  <ExternalLink className="h-5 w-5" />
                  <span>Social Links</span>
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-foreground mb-2 block text-sm font-medium">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={formData.socialLinks.linkedin}
                      onChange={(e) =>
                        handleSocialLinkChange("linkedin", e.target.value)
                      }
                      placeholder="https://linkedin.com/in/username"
                      className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-foreground mb-2 block text-sm font-medium">
                      GitHub
                    </label>
                    <input
                      type="url"
                      value={formData.socialLinks.github}
                      onChange={(e) =>
                        handleSocialLinkChange("github", e.target.value)
                      }
                      placeholder="https://github.com/username"
                      className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-foreground mb-2 block text-sm font-medium">
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={formData.socialLinks.twitter}
                      onChange={(e) =>
                        handleSocialLinkChange("twitter", e.target.value)
                      }
                      placeholder="https://twitter.com/username"
                      className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-foreground mb-2 block text-sm font-medium">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.socialLinks.website}
                      onChange={(e) =>
                        handleSocialLinkChange("website", e.target.value)
                      }
                      placeholder="https://yourwebsite.com"
                      className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(`/profile/${user._id}`)}
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
                <span>{loading ? "Updating..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
