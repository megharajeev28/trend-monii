import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ink-50 text-center px-6">
      <span className="h-14 w-14 rounded-full bg-signal-50 text-signal-600 flex items-center justify-center mb-4">
        <Compass size={26} />
      </span>
      <h1 className="font-display text-2xl font-semibold text-ink-950">Page not found</h1>
      <p className="text-ink-500 mt-2 max-w-sm">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/app/overview" className="btn-primary mt-6">
        Go to Dashboard
      </Link>
    </div>
  );
}
