export interface CreateSessionPayload {
    access_request_id: string;
    application_id: string;
}

export interface Session {
    id: string;
    tenant_id: string;
    user_id: string;
    application_id: string;
    access_request_id: string;
    token: string;
    status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
    start_time: Date;
    expires_at: Date;
    target_url: string;
    auth_config: any;
    is_active: boolean;
}
