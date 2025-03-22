import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error when user types
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear API error when user makes any change
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setApiError("");

    try {
      // Mock login - no actual API call
      setIsLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock credentials check
      const mockUsers = [
        { email: "admin@example.com", password: "password123" },
        { email: "user@example.com", password: "password123" },
      ];

      // Also check for users registered through the registration page
      let registeredUsers = [];
      try {
        registeredUsers = JSON.parse(localStorage.getItem("mockUsers") || "[]");
      } catch (e) {
        console.error("Error parsing mockUsers from localStorage:", e);
      }

      const allUsers = [...mockUsers, ...registeredUsers];

      const user = allUsers.find(
        (u) => u.email === formData.email && u.password === formData.password,
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Create a mock token
      const mockToken = btoa(
        JSON.stringify({ email: formData.email, timestamp: Date.now() }),
      );

      // Store JWT token
      localStorage.setItem("idms_token", mockToken);
      console.log("Token stored in localStorage:", mockToken);

      // Redirect to dashboard
      navigate("/");
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-card-foreground">
            IDMS Security
          </h2>
          <h3 className="mt-2 text-xl font-semibold">
            Sign in to your account
          </h3>
        </div>

        {apiError && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{apiError}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-destructive" : ""}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "border-destructive" : ""}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="text-primary hover:text-primary/90"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:text-primary/90 font-medium"
              >
                Register now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
