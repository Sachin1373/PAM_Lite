import { addApplication, checkApplication, updateApplication, getApplications, deleteApplication } from "./application.repo";
import { actor, createApplication } from "./application.types";


export const addApplicationService = async (data: { creator: actor, payload: createApplication }) => {
    const applicationExisits = await checkApplication(data.creator.userId, data.creator.tenantId, data.payload.name)
    if (applicationExisits) throw Error("Application Already Exists")
    const application = await addApplication({
        tenant_id: data.creator.tenantId,
        name: data.payload.name,
        type: data.payload.app_type,
        target_url: data.payload.target_url,
        description: data.payload.description,
        created_by: data.creator.userId
    })

    return { application }
}

export const updateApplicationService = async (
    actor: { tenantId: string },
    applicationId: string,
    payload: any
) => {
    const updatedApp = await updateApplication(applicationId, actor.tenantId, payload);
    if (!updatedApp) throw new Error("Application not found or update failed");
    return { application: updatedApp };
};

export const getApplicationsService = async (actor: { tenantId: string }) => {
    const applications = await getApplications(actor.tenantId);
    return { applications };
};

export const deleteApplicationService = async (actor: { tenantId: string }, applicationId: string) => {
    const deleted = await deleteApplication(applicationId, actor.tenantId);
    if (!deleted) throw new Error("Application not found");
    return { success: true };
};