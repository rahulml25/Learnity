import { Clock, User } from "lucide-react";
import { Link } from "react-router";

export default function CourseCard({ course }) {
  return (
    <div className="group border-primary/20 from-card via-card to-primary/5 hover:border-primary/60 hover:shadow-primary/20 cursor-pointer rounded-xl border bg-gradient-to-br p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="space-y-4">
        <div>
          <Link to={`/courses/${course._id}`}>
            <h3 className="text-foreground group-hover:text-primary hover:text-primary text-xl leading-tight font-semibold transition-colors">
              {course.title}
            </h3>
          </Link>
          <p className="text-secondary-foreground/80 mt-3 line-clamp-3 text-sm leading-relaxed">
            {course.description}
          </p>
        </div>

        <div className="border-primary/10 text-muted-foreground flex items-center justify-between border-t pt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="from-primary/20 to-highlight/20 rounded-lg bg-gradient-to-r p-2">
              <Clock className="text-primary h-4 w-4" />
            </div>
            <span className="text-foreground font-medium">
              {course.duration} hours
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="from-secondary/20 to-highlight-foreground/20 rounded-lg bg-gradient-to-r p-2">
              <User className="text-secondary h-4 w-4" />
            </div>
            {course.instructor?._id ? (
              <Link
                to={`/profile/${course.instructor._id}`}
                className="text-secondary hover:text-primary font-medium transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {course.instructor.name}
              </Link>
            ) : (
              <span className="text-foreground font-medium">Instructor</span>
            )}
          </div>
        </div>

        <div className="pt-2">
          <Link to={`/courses/${course._id}`}>
            <button className="from-primary via-primary to-secondary hover:from-primary-accent hover:via-primary-accent hover:to-secondary-accent hover:shadow-primary/30 focus:ring-primary/50 w-full rounded-xl bg-gradient-to-r px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg focus:ring-2 focus:outline-none">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
