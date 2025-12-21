export type appType = 'WEB' | 'DATABASE'

export interface actor {
    tenantId: string,
    userId: string,
    role: string
}

export interface createApplication {
    tenantId: string,
    name: string,
    description: string,
    target_url: string,
    app_type: appType,
    createdBy: string
}