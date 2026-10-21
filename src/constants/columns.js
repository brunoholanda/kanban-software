export const KANBAN_COLUMNS = [
  { id: 'aberta', title: 'Aberta', color: '#16a34a' },
  { id: 'pendente-aprovacao-1', title: 'Pendente Aprovação 1', color: '#2563eb' },
  { id: 'pendente-aprovacao-2', title: 'Pendente Aprovação 2', color: '#d97706' },
  { id: 'pendente-execucao', title: 'Pendente de Execução', color: '#dc2626' },
  { id: 'concluido', title: 'Concluído', color: '#7c3aed' },
];

export const getColumnById = (id) =>
  KANBAN_COLUMNS.find((column) => column.id === id);
