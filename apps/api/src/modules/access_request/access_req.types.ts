export interface CreateAccessRequestPayload {
  tenant_id: string;
  user_id: string;
  application_id: string;
  duration_minutes: number;
  reason?: string;
  approvers: string[];
}

export interface addApproversPayload {
    accessRequestId: string;
    approvers: string[];
}

export interface actor {
    tenantId: string,
    userId: string,
    role: string
}