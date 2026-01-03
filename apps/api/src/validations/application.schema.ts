import { z } from "zod";

export const createApplicationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    target_url: z.string().url("Invalid URL provided"),
    app_type: z.enum(["WEB", "DATABASE"]),
    auth_config: z
    .object({
      auth_type: z.enum(['basic', 'oidc', 'saml', 'api_key']),
      username: z.string().optional(),
      password: z.string().optional()
    })
});

export const updateApplicationSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    target_url: z.string().url("Invalid URL provided").optional(),
    app_type: z.enum(["WEB", "DATABASE"]).optional(),
});

export type CreateApplicationDTO = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationDTO = z.infer<typeof updateApplicationSchema>;
