import { z } from "zod";

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(100, "Username must be at most 100 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, underscores"),

  email: z
    .string()
    .email("Invalid email address")
    .max(150, "Email too long"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),

  mobileNo: z
    .string()
    .min(7)
    .max(20)
    .regex(/^[0-9+]+$/, "Invalid mobile number")
    .optional(),

  roleCode: z.enum(["EMPLOYEE", "CUSTOMER"]),

  staffInfo: z
      .object({
        staffCode: z
          .string()
          .min(1, "Staff code is required"),

        department: z
          .string()
          .min(1, "Department is required"),

        designation: z
          .string()
          .min(1, "Designation is required"),

        serviceDeptID: z
          .number()
      })
      .optional(),

});
