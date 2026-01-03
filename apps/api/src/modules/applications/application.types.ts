export type appType = 'WEB' | 'DATABASE'

export interface actor {
    tenantId: string,
    userId: string,
    role: string
}

export interface auth_config {
    auth_type: string,
    username: string,
    password: string,
}

export interface createApplication {
    tenantId: string,
    name: string,
    description: string,
    target_url: string,
    auth_config: auth_config,
    app_type: appType,
    createdBy: string
}