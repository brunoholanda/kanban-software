import apiClient from './apiClient';

export const cardsService = {
  // Buscar todos os cards
  async getAll() {
    const response = await apiClient.get('/cards');
    return response.data;
  },

  // Buscar cards por status
  async getByStatus(status) {
    const response = await apiClient.get(`/cards?status=${status}`);
    return response.data;
  },

  // Criar novo card
  async create(cardData) {
    const response = await apiClient.post('/cards', cardData);
    return response.data;
  },

  // Atualizar card
  async update(id, cardData) {
    const response = await apiClient.patch(`/cards/${id}`, cardData);
    return response.data;
  },

  // Atualizar apenas o status do card
  async updateStatus(id, status) {
    const response = await apiClient.patch(`/cards/${id}/status`, { status });
    return response.data;
  },

  // Deletar card
  async delete(id) {
    await apiClient.delete(`/cards/${id}`);
  },

  // Buscar card por ID
  async getById(id) {
    const response = await apiClient.get(`/cards/${id}`);
    return response.data;
  }
};

export default cardsService;

