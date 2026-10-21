export const RESPONSIBLE_TEAMS = [
  { value: 'Time Dev', label: 'Time Dev', color: '#2563eb' },
  { value: 'Operations', label: 'Operations', color: '#16a34a' },
  { value: 'Data', label: 'Data', color: '#7c3aed' },
  { value: 'DevOps', label: 'DevOps', color: '#ea580c' },
  { value: 'Network', label: 'Network', color: '#0891b2' },
  { value: 'NOC', label: 'NOC', color: '#dc2626' },
  { value: 'GRC', label: 'GRC', color: '#ca8a04' },
  { value: 'SRE', label: 'SRE', color: '#0d9488' },
];

export const getTeamByValue = (value) =>
  RESPONSIBLE_TEAMS.find((team) => team.value === value);
