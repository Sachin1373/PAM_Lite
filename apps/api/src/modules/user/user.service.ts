import * as userRepo from "../user/user.repo";
import bcrypt from "bcrypt";

export const addUserService = async (input: {
    actor: {
        tenantId: string;
        userId: string;
        role: string;
    };
    payload: {
        name: string;
        email: string;
        password: string;
        role: 'ADMIN' | 'APPROVER' | 'USER';
    }
}) => {
    const { actor, payload } = input;
    const exists = await userRepo.checkUserAlreadyExists(
        payload.email,
        actor.tenantId
    );

    if (exists) throw new Error('User already exists');

    const passwordHash = await bcrypt.hash(payload.password, 10);

    const newUser = await userRepo.createUser({
        tenantId: actor.tenantId,
        name: payload.name,
        email: payload.email,
        password: passwordHash,
        role: payload.role,
        createdBy: actor.userId,
    })

    return { user: newUser }
}

export const getUserService = async (tenantId: string) => {
    const tenantExists = await userRepo.checkTenant(tenantId);
    if (!tenantExists) throw Error("Tenant not Found")

    const users = await userRepo.getUsers(tenantId)

    return { users }

}


export const updateUserService = async (
    actor: { tenantId: string },
    userId: string,
    payload: { name?: string; role?: string }
) => {
    const updatedUser = await userRepo.updateUser(userId, actor.tenantId, payload);
    if (!updatedUser) throw new Error("User not found or update failed");
    return { user: updatedUser };
};

export const deleteUserService = async (
    actor: { tenantId: string },
    userId: string
) => {
    const deleted = await userRepo.deleteUser(userId, actor.tenantId);
    if (!deleted) throw new Error("User not found");
    return { success: true };
};