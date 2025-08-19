import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  MapPin,
  Target,
  Award,
  Briefcase,
  ExternalLink,
  Edit,
  BookOpen,
  Loader2,
} from "lucide-react";
import CourseCard from "../components/CourseCard";

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isOwnProfile = currentUser?._id === id;

  useEffect(() => {
    fetchProfile();
  }, [id]);

  useEffect(() => {
    if (profileUser?.role === "instructor") {
      fetchInstructorCourses();
    }
  }, [profileUser]);

  const fetchProfile = async () => {
    try {
      if (isOwnProfile) {
        setProfileUser(currentUser);
      } else {
        // Fetch another user's profile from server
        const response = await fetch(
          `http://localhost:3000/auth/profile/${id}`,
          {
            credentials: "include",
          },
        );

        if (response.ok) {
          const userData = await response.json();
          setProfileUser(userData);
        } else {
          setError("Failed to load profile or user not found");
        }
      }
    } catch (error) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructorCourses = async () => {
    if (profileUser?.role !== "instructor") return;

    try {
      console.log("Fetching instructor courses for:", profileUser);
      const response = await fetch(
        `http://localhost:3000/courses/instructor/${profileUser._id}`,
        {
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched courses:", data);
        setCourses(data);
      } else {
        console.error("Failed to fetch courses, status:", response.status);
      }
    } catch (error) {
      console.error("Failed to fetch instructor courses:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <User className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h2 className="text-foreground mb-2 text-2xl font-bold">
            Profile Not Found
          </h2>
          <p className="text-muted-foreground">
            The requested profile could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Profile Header */}
          <div className="border-primary/20 from-card via-card to-primary/5 shadow-primary/10 mb-8 rounded-xl border bg-gradient-to-br p-8 shadow-xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center space-x-4">
                <div className="from-primary/30 to-secondary/30 rounded-full bg-gradient-to-br p-4">
                  <User className="text-primary h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-foreground text-3xl font-bold">
                    {profileUser.name}
                  </h1>
                  <p className="text-muted-foreground text-lg capitalize">
                    {profileUser.role}
                  </p>
                  {profileUser.location && (
                    <div className="text-muted-foreground mt-1 flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profileUser.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {isOwnProfile && (
                <Link
                  to={`/profile/${id}/edit`}
                  className="bg-secondary hover:bg-secondary-accent text-secondary-foreground flex items-center space-x-2 rounded-lg px-4 py-2 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Link>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Profile Details */}
            <div className="space-y-8 lg:col-span-2">
              {profileUser.role === "student" ? (
                <StudentProfileContent user={profileUser} />
              ) : (
                <InstructorProfileContent user={profileUser} />
              )}
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-6">
              {profileUser.role === "instructor" && (
                <div className="border-primary/20 from-card via-card to-secondary/10 shadow-secondary/10 rounded-xl border bg-gradient-to-br p-6 shadow-lg">
                  <h3 className="text-foreground mb-4 text-xl font-semibold">
                    Created Courses
                  </h3>
                  {courses.length > 0 ? (
                    <div className="space-y-4">
                      {courses.slice(0, 3).map((course) => (
                        <Link
                          key={course._id}
                          to={`/courses/${course._id}`}
                          className="border-primary/30 from-primary/10 to-secondary/10 hover:border-primary/50 block rounded-lg border bg-gradient-to-r p-4 transition-all duration-300 hover:shadow-lg"
                        >
                          <h4 className="text-foreground font-semibold">
                            {course.title}
                          </h4>
                          <p className="text-secondary-foreground mt-1 text-sm">
                            {course.duration} hours
                          </p>
                        </Link>
                      ))}
                      {courses.length > 3 && (
                        <Link
                          to="/created"
                          className="text-primary hover:text-primary-accent text-sm"
                        >
                          View all {courses.length} courses →
                        </Link>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No courses created yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentProfileContent({ user }) {
  return (
    <>
      {/* Learning Goals */}
      {user.goals && user.goals.length > 0 && (
        <div className="bg-card border-border rounded-lg border p-6 shadow-sm">
          <div className="mb-4 flex items-center space-x-2">
            <Target className="text-primary h-5 w-5" />
            <h2 className="text-foreground text-xl font-semibold">
              Learning Goals
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.goals.map((goal, index) => (
              <span
                key={index}
                className="from-primary/15 to-primary/10 text-primary border-primary/20 rounded-full border bg-gradient-to-r px-4 py-2 text-sm font-medium"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {user.skills && user.skills.length > 0 && (
        <div className="bg-card border-border rounded-lg border p-6 shadow-sm">
          <div className="mb-4 flex items-center space-x-2">
            <Award className="text-secondary h-5 w-5" />
            <h2 className="text-foreground text-xl font-semibold">Skills</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="from-secondary/15 to-secondary/10 text-secondary border-secondary/20 rounded-full border bg-gradient-to-r px-4 py-2 text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function InstructorProfileContent({ user }) {
  return (
    <>
      {/* Expertise */}
      {user.expertise && user.expertise.length > 0 && (
        <div className="bg-card border-border rounded-lg border p-6">
          <div className="mb-4 flex items-center space-x-2">
            <Award className="text-primary h-5 w-5" />
            <h2 className="text-foreground text-xl font-semibold">
              Areas of Expertise
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.expertise.map((subject, index) => (
              <span
                key={index}
                className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {user.experience && user.experience.length > 0 && (
        <div className="bg-card border-border rounded-lg border p-6">
          <div className="mb-4 flex items-center space-x-2">
            <Briefcase className="text-secondary h-5 w-5" />
            <h2 className="text-foreground text-xl font-semibold">
              Experience
            </h2>
          </div>
          <div className="space-y-4">
            {user.experience.map((exp, index) => (
              <div key={index} className="border-primary/30 border-l-2 pl-4">
                <h3 className="text-foreground font-medium">{exp.role}</h3>
                <p className="text-muted-foreground">{exp.company}</p>
                <p className="text-muted-foreground text-sm">
                  {exp.years} years
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Links */}
      {user.socialLinks &&
        Object.values(user.socialLinks).some((link) => link) && (
          <div className="bg-card border-border rounded-lg border p-6">
            <h2 className="text-foreground mb-4 text-xl font-semibold">
              Connect
            </h2>
            <div className="space-y-3">
              {Object.entries(user.socialLinks).map(([platform, url]) =>
                url ? (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary flex items-center space-x-2 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="capitalize">{platform}</span>
                  </a>
                ) : null,
              )}
            </div>
          </div>
        )}
    </>
  );
}
