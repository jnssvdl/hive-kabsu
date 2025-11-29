import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="from-primary-foreground/60 to-background flex h-screen items-center justify-center bg-gradient-to-b">
      <div className="px-4 text-center">
        <h1 className="text-6xl font-semibold">404</h1>
        <p className="mt-4 text-lg">Page Not Found</p>
        <p className="mt-2 text-sm">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Button
          onClick={() => {
            navigate("/");
          }}
          className="mt-6"
        >
          <ArrowLeft />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
