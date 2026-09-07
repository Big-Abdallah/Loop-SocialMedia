import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, Checkbox, Spinner } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import loginSchema from "../../Schema/Auth/loginSchema";
import loginImg from "../../asset/login.png";
import loginApi from "../../Api/Auth/login";

export default function Login() {
  const { isLoggedin, setIsLoggedin } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success" | "error", message: string }
  const [serverError, setServerError] = useState(null); // persistent message shown under the button
  function showToast(type, message) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleLogin(formData) {
    setIsLoggedin(false);
    setIsLoading(true);
    setServerError(null);
    try {
      const req = await loginApi(formData);
      if (req.success === true) {
        showToast("success", "Logged in successfully");
        localStorage.setItem("token", req.data.token);
        setIsLoggedin(true);
        setTimeout(() => navigate("/"), 1200);
      } else {
        // covers different rejection reasons: username taken, email taken, weak password, etc.
        const message =
          req.message || "Something went wrong. Please Check Your Internet Connection.";
        setServerError(message);
        showToast("error", message);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please Check Your Internet Connection.";
      setServerError(message);
      showToast("error", message);
    } finally {
      setTimeout(() => setIsLoading(false), 100);
    }
  }

  const inputClassName =
    "w-full rounded-lg border my-1 border-[var(--color-border)] bg-[var(--color-bg-page)] p-2 text-sm text-[var(--color-text-primary)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-card)]";

  return (
    <main className="grid min-h-screen grid-cols-1 sm:grid-cols-2 bg-[var(--color-bg-page)]">
      {/* Left: illustration side */}
      <div className="flex flex-col gap-5 lg:gap-10 border-b lg:border-b-0 lg:border-r border-[var(--color-border)] bg-[var(--color-bg-page)] p-6 sm:p-8 lg:p-12">
        <p
          className="flex items-center gap-2 text-xl font-medium tracking-tight text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          loop
        </p>

        <div className="relative h-[38vh] sm:h-[45vh] lg:h-auto lg:flex-1 lg:max-h-[70vh] overflow-hidden rounded-lg border border-[var(--color-border)]">
          <img
            src={loginImg}
            alt="Illustration"
            className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
          />
        </div>

        <p className="hidden lg:block text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-sm">
          Welcome back — pick up right where you left off.
        </p>
      </div>

      {/* Right: form side */}
      <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:py-13">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-8">
            <h1
              className="text-2xl font-medium tracking-tight text-[var(--color-text-primary)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Log in to continue to your account.
            </p>
          </div>

          {/* Login Card */}
          <Card className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 transition-colors duration-300 hover:border-[var(--color-accent)]">
            <Form
              onSubmit={handleSubmit(handleLogin)}
              className="flex flex-col gap-4"
            >
              {/* Email */}
              <div>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Email address"
                  className={`${inputClassName} ${
                    errors.email ? "border-red-400" : ""
                  }`}
                />

                <p className="mt-1 min-h-4 text-xs text-red-500">
                  {errors.email?.message || ""}
                </p>
              </div>

              {/* Password */}
              <div>
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className={`${inputClassName} ${
                    errors.password ? "border-red-400" : ""
                  }`}
                />

                <p className="mt-1 min-h-4 text-xs text-red-500">
                  {errors.password?.message || ""}
                </p>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between px-1">
                <Checkbox
                  {...register("remember")}
                  className="text-sm text-[var(--color-text-secondary)]"
                >
                  Remember me
                </Checkbox>

                <NavLink
                  to="/forgot-password"
                  className="text-sm font-semibold text-[var(--color-text-primary)] transition-opacity duration-200 hover:opacity-60"
                >
                  Forgot password?
                </NavLink>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                isLoading={isLoading}
                spinner={<Spinner size="sm" color="current" />}
                spinnerPlacement="start"
                className="mt-2 w-full rounded-lg bg-[var(--color-button-bg)] py-3 text-sm font-semibold text-[var(--color-button-text)] transition-opacity duration-200 hover:opacity-85 disabled:opacity-50"
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
              {serverError && (
                <p
                  role="alert"
                  className="mt-3 flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-600"
                >
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v5m0 3h.01"
                    />
                  </svg>
                  <span>{serverError}</span>
                </p>
              )}
            </Form>
          </Card>

          {/* Register */}
          <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
            Don't have an account?{" "}
            <NavLink
              to="/register"
              className="font-semibold text-[var(--color-accent)] transition-opacity duration-200 hover:opacity-70"
            >
              Sign up
            </NavLink>
          </p>
        </div>
      </div>
    </main>
  );
}
