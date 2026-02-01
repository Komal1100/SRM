import {z} from "zod";
export const adminUpdateUserSchema = z.object({
  email: z.string().email(),
  mobileNo: z.string().optional().nullable(),
  roleCode: z.string(),
  staffInfo: z
    .object({
      staffCode: z.string(),
      designation: z.string(),
      department: z.string(),
      serviceDeptID: z.number(),
    })
    .optional(),
});
