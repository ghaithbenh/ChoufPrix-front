import apiClient from './apiClient';

export interface User {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role: 'admin' | 'sub-admin' | 'user';
    assignedStore?: string | null;
}

export const userService = {
    async getUsers(token: string): Promise<User[]> {
        const response = await apiClient.get<User[]>('/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async updateUserRole(id: string, data: { role: string; assignedStore?: string | null }, token: string): Promise<void> {
        await apiClient.patch(`/users/${id}/role`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    async createUser(data: any, token: string): Promise<User> {
        const response = await apiClient.post<User>('/users', data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async deleteUser(id: string, token: string): Promise<void> {
        await apiClient.delete(`/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};
