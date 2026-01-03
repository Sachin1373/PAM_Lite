import crypto from 'crypto';
import { CreateSessionPayload, Session } from "./session.types";
import { createSession, getAccessRequestForSession, getApplicationForSession } from "./session.repo";
// Importing updateAccessRequestStatus from access_req module to reuse
import { updateAccessRequestStatus } from "../access_request/access_req.repo";

export const createSessionService = async (
    userId: string,
    tenantId: string,
    payload: CreateSessionPayload
) => {
    // 1. Load access_request from DB
    const accessRequest = await getAccessRequestForSession(payload.access_request_id, userId);

    if (!accessRequest) {
        throw new Error('Access request not found or does not belong to user');
    }

    if (accessRequest.status !== 'APPROVED') {
        throw new Error('Access request must be APPROVED to start a session');
    }

    // 2. Load application from DB
    const application = await getApplicationForSession(payload.application_id);
    if (!application) {
        throw new Error('Application not found');
    }

    // 3. Generate token
    const token = crypto.randomBytes(32).toString('hex');

    // 4. Calculate expires_at
    const now = new Date();
    const expiresAt = new Date(now.getTime() + accessRequest.duration_minutes * 60000);

    // 5. Insert into sessions
    const session = await createSession({
        tenant_id: tenantId,
        user_id: userId,
        application_id: payload.application_id,
        access_request_id: payload.access_request_id,
        token: token,
        expires_at: expiresAt,
        target_url: application.target_url,
        auth_config: application.auth_config || {} // Handle null auth_config
    });

    // 6. Update access_request status
    // Note: 'active' is not in the request_status enum (PENDING, APPROVED, REJECTED).
    // Skipping status update to 'active' to prevent DB error. 
    // If 'active' status is required, a migration is needed to update the enum.
    // For now we assume the session creation is enough.
    // await updateAccessRequestStatus(payload.access_request_id, 'active');

    return session;
};
