import { z } from "zod";

export const adminCreateUserSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(100, "Username must be at most 100 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),

    email: z
      .string()
      .email("Invalid email address")
      .max(150, "Email must be at most 150 characters"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be at most 100 characters"),

    mobileNo: z
      .string()
      .min(7, "Mobile number too short")
      .max(20, "Mobile number too long")
      .regex(/^[0-9+]+$/, "Invalid mobile number")
      .optional(),

    roleCode: z.string(),

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

        serviceDeptID : z.number() , // 👈 REQUIRED
        isHODStaff : z.boolean().optional()
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Enforce staff info for technicians only
    if (!(data.roleCode === "ADMIN" || data.roleCode === "USER") && !data.staffInfo) {
      ctx.addIssue({
        path: ["staffInfo"],
        message: "Staff info is required for technician",
        code: z.ZodIssueCode.custom,
      });
    }

   
  });
