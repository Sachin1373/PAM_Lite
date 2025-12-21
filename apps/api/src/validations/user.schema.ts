import { email, z } from "zod";

export const createUserSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    role: z.enum(['ADMIN', 'USER', 'APPROVER'])
})

export type createUserDTO = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
    name: z.string().optional(),
    role: z.enum(['ADMIN', 'USER', 'APPROVER']).optional(),
}).refine(data => data.name || data.role, {
    message: "At least one field (name or role) must be provided for update"
});

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;