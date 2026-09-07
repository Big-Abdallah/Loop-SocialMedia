import { z } from "zod";

const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email address" }),

  password: z
  .string()
  .regex(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    {
      message:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
    }
  ),
});

export default registerSchema;

//abdallah20066@gmail.com