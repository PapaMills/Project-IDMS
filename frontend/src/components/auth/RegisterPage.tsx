import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};
    let isValid = true;

    if (!formData.username) {
      newErrors.username = "Username is required";
      isValid = false;
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
    if (errors[name as keyof RegisterFormData]) {
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
      // Mock registration - no actual API call
      setIsLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate successful registration
      console.log("Registration data:", {
        username: formData.username,
        email: formData.email,
        password: formData.password, // In a real app, never log passwords
      });

      // For demo purposes, we'll store the registered user in localStorage
      // In a real app, this would be handled by a backend
      let existingUsers = [];
      try {
        existingUsers = JSON.parse(localStorage.getItem("mockUsers") || "[]");
      } catch (e) {
        console.error("Error parsing mockUsers from localStorage:", e);
      }

      existingUsers.push({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("mockUsers", JSON.stringify(existingUsers));
      console.log("User registered and stored in localStorage");

      // Create a mock token for auto-login
      const mockToken = btoa(
        JSON.stringify({
          username: formData.username,
          email: formData.email,
          timestamp: Date.now(),
        }),
      );

      // Option to auto-login after registration
      // localStorage.setItem("idms_token", mockToken);
      // navigate("/");

      // Redirect to login page instead
      navigate("/login");
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
          <h3 className="mt-2 text-xl font-semibold">Create your account</h3>
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
                htmlFor="username"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? "border-destructive" : ""}
                placeholder="johndoe"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.username}
                </p>
              )}
            </div>

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
                autoComplete="new-password"
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "border-destructive" : ""}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Register"}
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary/90 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
