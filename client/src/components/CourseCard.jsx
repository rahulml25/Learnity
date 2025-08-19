import { Clock, User } from "lucide-react";
import { Link } from "react-router";

export default function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course._id}`}>
      <div className="bg-card border-border hover:border-primary/60 hover:bg-card/80 group cursor-pointer rounded-lg border p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
        <div className="space-y-4">
          <div>
            <h3 className="text-foreground group-hover:text-primary text-xl leading-tight font-semibold transition-colors">
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
                <User className="text-secondary h-3 w-3" />
              </div>
              <span className="font-medium">
                {course.instructor?.name || "Instructor"}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button className="from-primary/15 to-primary/10 hover:from-primary/25 hover:to-primary/15 text-primary border-primary/20 hover:border-primary/40 w-full rounded-lg border bg-gradient-to-r px-4 py-3 font-semibold transition-all duration-300 hover:shadow-lg">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
