import { createAccessRequest, addApprovers, checkAlreadyRequestRaised, getAccessRequests, approveAccessRequest, updateAccessRequestStatus, getUserAccessRequests } from "./access_req.repo";
import { CreateAccessRequestPayload, actor } from "./access_req.types";
import pool from "../../db";

export const createAccessRequestService = async (data: { creator: actor, payload: CreateAccessRequestPayload }) => {

    const exists = await checkAlreadyRequestRaised(
        data.creator.tenantId,
        data.creator.userId,
        data.payload.application_id
    );

    if (exists) {
        throw new Error(
            'Pending access request already exists for the selected application'
        );
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const reqPayload = {
            tenant_id: data.creator.tenantId,
            user_id: data.creator.userId,
            application_id: data.payload.application_id,
            duration_minutes: data.payload.duration_minutes,
            reason: data.payload.reason,
        }
        const accessRequestRes = await createAccessRequest(client, reqPayload)
        const accessRequestId = accessRequestRes.rows[0].id;
        const approvers = data.payload.approvers;
        const response = await addApprovers(client, accessRequestId, approvers)
        await client.query('COMMIT');

        return {
            id: accessRequestId,
            status: 'PENDING'
        };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }

}

export const getAccessRequestsService = async (data: { actor: actor }) => {
    try {
        const accessRequests = await getAccessRequests(
            data.actor.tenantId,
            data.actor.userId
        );

        return accessRequests;
    } catch (error) {
        throw error;
    }
}

export const approveAccessRequestService = async (data: {
    actor: actor,
    access_request_id: string
}) => {
    try {
        // Update the approver's status
        const approvalResult = await approveAccessRequest(
            data.access_request_id,
            data.actor.userId,
            data.actor.tenantId
        );

        if (!approvalResult) {
            throw new Error('Access request not found or you are not authorized to approve it');
        }

        // Update the main access request status to APPROVED
        await updateAccessRequestStatus(data.access_request_id, 'APPROVED');

        return {
            message: 'Access request approved successfully',
            data: approvalResult
        };
    } catch (error) {
        throw error;
    }
}

export const getUserAccessRequestsService = async (data: { actor: actor }) => {
    try {
        const accessRequests = await getUserAccessRequests(
            data.actor.tenantId,
            data.actor.userId
        );

        return accessRequests;
    } catch (error) {
        throw error;
    }
}
