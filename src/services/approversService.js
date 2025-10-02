import apiClient from './apiClient';

export const approversService = {
  // Buscar todos os aprovadores
  async getAll() {
    const response = await apiClient.get('/approvers');
    return response.data;
  },

  // Criar novo aprovador
  async create(approverData) {
    const response = await apiClient.post('/approvers', approverData);
    return response.data;
  },

  // Atualizar aprovador
  async update(id, approverData) {
    const response = await apiClient.patch(`/approvers/${id}`, approverData);
    return response.data;
  },

  // Deletar aprovador
  async delete(id) {
    await apiClient.delete(`/approvers/${id}`);
  },

  // Buscar aprovador por ID
  async getById(id) {
    const response = await apiClient.get(`/approvers/${id}`);
    return response.data;
  }
};

export default approversService;

