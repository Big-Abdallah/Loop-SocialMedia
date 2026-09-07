import { useState } from "react";
import { NavLink , useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Spinner,
  ListBox,
} from "@heroui/react";
import {AuthContext} from "../../Contexts/AuthContext";
import { useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import registerSchema from "../../Schema/Auth/registerSchema";
import registerApi from "../../Api/Auth/register";
import img from "../../asset/register.png";

export default function Register() {
  const { isLoggedin, setIsLoggedin } = useContext(AuthContext);

   const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      gender: "",
      dateOfBirth: "",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success" | "error", message: string }
  const [serverError, setServerError] = useState(null); // persistent message shown under the button

  function showToast(type, message) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleRegister(formData) {
    setIsLoggedin(false);
    setIsLoading(true);
    setServerError(null);
    try {
      const req = await registerApi(formData);
      if (req.success === true) {
        showToast("success", "Account created successfully");
        localStorage.setItem("token", req.data.token);
        setIsLoggedin(true);
        setTimeout(() => navigate("/"), 1200);
      } else {
        const message = req.message || "Something went wrong. Please try again.";
        setServerError(message);
        showToast("error", message);
      }
    } catch (error) {
      console.error(error);
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setServerError(message);
      showToast("error", message);
    } finally {
      setTimeout(() => setIsLoading(false), 100);
    }
  }

  const inputClassName =
    "w-full rounded-lg border my-[4px] border-[var(--color-border)] bg-[var(--color-bg-page)] p-2 text-sm text-[var(--color-text-primary)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-card)]";

  return (
    <main className="relative xl:my-32 grid grid-cols-1 sm:grid-cols-2 bg-[var(--color-bg-page)]">
      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium shadow-sm animate-[toastIn_0.25s_ease-out] bg-[var(--color-bg-card)] ${
            toast.type === "success"
              ? "border-[var(--color-accent)] text-[var(--color-text-primary)]"
              : "border-red-400 text-red-500"
          }`}
        >
          {toast.type === "success" ? (
            <svg className="h-4 w-4 shrink-0 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Left: illustration side */}
      <div className="flex flex-col gap-4 lg:gap-6 border-b lg:border-b-0 lg:border-r border-[var(--color-border)] bg-[var(--color-bg-page)] p-6 sm:p-8 lg:p-10">
        <p
          className="flex items-center gap-2 text-xl font-medium tracking-tight text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          loop
        </p>

        <div className="relative h-[38vh] sm:h-[45vh] lg:h-auto lg:flex-1 lg:max-h-[70vh] xl:max-h-auto xl:max-w-auto overflow-hidden rounded-lg border border-[var(--color-border)]">
          <img
            src={img}
            alt="Illustration"
            className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
          />
        </div>

        <p className="hidden lg:block text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-sm">
          Join a space built for sharing what you're working on — clean,
          focused, no noise.
        </p>
      </div>

      {/* Right: form side */}
      <div className="flex items-center justify-center px-6 py-6 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-5">
            <h1
              className="text-2xl font-medium tracking-tight text-[var(--color-text-primary)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Create your account
            </h1>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              It only takes a minute to get started.
            </p>
          </div>

          <Card className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 transition-colors duration-300 hover:border-[var(--color-accent)]">
            <Form
              onSubmit={handleSubmit(handleRegister)}
              className="flex flex-col"
            >
              {/* Name */}
              <div>
                <Input
                  {...register("name")}
                  type="text"
                  placeholder="Full name"
                  className={`${inputClassName} ${errors.name ? "border-red-400" : ""}`}
                />
                <p className="mt-0.5 min-h-3.5 text-xs text-red-500">
                  {errors.name?.message || ""}
                </p>
              </div>

              {/* Username */}
              <div>
                <Input
                  {...register("username")}
                  type="text"
                  placeholder="Username"
                  className={`${inputClassName} ${errors.username ? "border-red-400" : ""}`}
                />
                <p className="mt-0.5 min-h-3.5 text-xs text-red-500">
                  {errors.username?.message || ""}
                </p>
              </div>

              {/* Email */}
              <div>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Email address"
                  className={`${inputClassName} ${errors.email ? "border-red-400" : ""}`}
                />
                <p className="mt-0.5 min-h-3.5 text-xs text-red-500">
                  {errors.email?.message || ""}
                </p>
              </div>

              {/* Gender */}
              <div>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      selectedKey={field.value}
                      onSelectionChange={field.onChange}
                      className={`${inputClassName} ${errors.gender ? "border-red-400" : ""}`}
                      placeholder="Gender"
                      aria-label="Gender"
                    >
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>

                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="male" textValue="Male">
                            Male
                            <ListBox.ItemIndicator />
                          </ListBox.Item>

                          <ListBox.Item id="female" textValue="Female">
                            Female
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  )}
                />
                <p className="mt-0.5 min-h-3.5 text-xs text-red-500">
                  {errors.gender?.message || ""}
                </p>
              </div>

              {/* Date of Birth */}
              <div>
                <Input
                  {...register("dateOfBirth")}
                  type="date"
                  placeholder="Date of birth"
                  className={`${inputClassName} ${errors.dateOfBirth ? "border-red-400" : ""}`}
                />
                <p className="mt-0.5 min-h-3.5 text-xs text-red-500">
                  {errors.dateOfBirth?.message || ""}
                </p>
              </div>

              {/* Password */}
              <div>
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className={`${inputClassName} ${errors.password ? "border-red-400" : ""}`}
                />
                <p className="mt-0.5 min-h-3.5 text-xs text-red-500">
                  {errors.password?.message || ""}
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <Input
                  {...register("rePassword")}
                  type="password"
                  placeholder="Confirm password"
                  className={`${inputClassName} ${errors.rePassword ? "border-red-400" : ""}`}
                />
                <p className="mt-0.5 min-h-3.5 text-xs text-red-500">
                  {errors.rePassword?.message || ""}
                </p>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                isLoading={isLoading}
                spinner={<Spinner size="sm" color="current" />}
                spinnerPlacement="start"
                className="mt-1 w-full rounded-lg bg-[var(--color-button-bg)] py-2.5 text-sm font-semibold text-[var(--color-button-text)] transition-opacity duration-200 hover:opacity-85 disabled:opacity-50"
              >
                {isLoading ? "Registering..." : "Register"}
              </Button>

              {/* Server / rejection error */}
              {serverError && (
                <p
                  role="alert"
                  className="mt-2 flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-600"
                >
                  <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v5m0 3h.01" />
                  </svg>
                  <span>{serverError}</span>
                </p>
              )}
            </Form>
          </Card>

          <p className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="font-semibold text-[var(--color-accent)] transition-opacity duration-200 hover:opacity-70"
            >
              Log in
            </NavLink>
          </p>
        </div>
      </div>
    </main>
  );
}