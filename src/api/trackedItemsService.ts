import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

export const trackedItemsService = {
    async getTrackedItems(token: string) {
        const response = await axios.get(`${API_BASE}/tracked-items`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    async getTrackedProductIds(token: string): Promise<string[]> {
        const response = await axios.get<string[]>(`${API_BASE}/tracked-items/ids`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    async trackItem(token: string, productId: string) {
        const response = await axios.post(
            `${API_BASE}/tracked-items`,
            { productId },
            { headers: { Authorization: `Bearer ${token}` } },
        );
        return response.data;
    },

    async untrackItem(token: string, productId: string) {
        const response = await axios.delete(`${API_BASE}/tracked-items/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
};
