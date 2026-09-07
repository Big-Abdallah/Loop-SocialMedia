import { z } from "zod";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, { message: "Name must be at least 3 characters long" }),
    username: z
      .string()
      .trim()
      .min(3, { message: "Username must be at least 3 characters long" }),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: "Invalid email address" }),
    gender: z.enum(["male", "female"], { message: "Gender is required" }),
    dateOfBirth: z
      .string()
      .min(1, { message: "Date of birth is required" })
      .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" })
      .refine(
        (val) => {
          const age =
            (Date.now() - new Date(val).getTime()) /
            (1000 * 60 * 60 * 24 * 365.25);
          return age >= 13;
        },
        { message: "You must be at least 13 years old" },
      ),
    password: z
      .string()
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message:
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
      }),
    rePassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export default registerSchema;
