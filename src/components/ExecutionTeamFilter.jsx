import React, { useState } from 'react';
import { Card, Select, Button, Tag } from 'antd';
import { Users, X } from 'lucide-react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  margin-bottom: 12px;
`;

const FilterCard = styled(Card)`
  .ant-card-body {
    padding: 8px 12px;
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterLabel = styled.span`
  font-weight: 500;
  color: #262626;
  white-space: nowrap;
  font-size: 12px;
`;

const ActiveFilters = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 6px;
`;

const FilterTag = styled(Tag)`
  margin: 0;
  font-size: 11px;
`;

const ExecutionTeamFilter = ({ onTeamFilterChange }) => {
  const [selectedTeams, setSelectedTeams] = useState([]);

  const teams = [
    { value: 'Time Dev', label: 'Time Dev' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Data', label: 'Data' },
    { value: 'DevOps', label: 'DevOps' },
    { value: 'Network', label: 'Network' }
  ];

  const handleTeamChange = (value) => {
    setSelectedTeams(value);
    onTeamFilterChange(value);
  };

  const clearFilters = () => {
    setSelectedTeams([]);
    onTeamFilterChange([]);
  };

  const removeTeamFilter = (teamToRemove) => {
    const newTeams = selectedTeams.filter(team => team !== teamToRemove);
    setSelectedTeams(newTeams);
    onTeamFilterChange(newTeams);
  };

  const hasActiveFilters = selectedTeams.length > 0;

  return (
    <FilterContainer>
      <FilterCard 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={12} />
            <span style={{ fontSize: '12px' }}>Filtrar por Time</span>
          </div>
        }
        size="small"
        extra={
          hasActiveFilters && (
            <Button 
              type="text" 
              size="small" 
              icon={<X size={10} />}
              onClick={clearFilters}
              style={{ fontSize: '10px', padding: '2px 4px' }}
            >
              Limpar
            </Button>
          )
        }
      >
        <FilterRow>
          <FilterLabel>Times:</FilterLabel>
          <Select
            mode="multiple"
            placeholder="Filtrar por times"
            value={selectedTeams}
            onChange={handleTeamChange}
            style={{ minWidth: 150, fontSize: '12px' }}
            size="small"
            options={teams}
          />
        </FilterRow>

        {hasActiveFilters && (
          <ActiveFilters>
            {selectedTeams.map(team => (
              <FilterTag
                key={`team-${team}`}
                closable
                onClose={() => removeTeamFilter(team)}
                color="green"
              >
                {team}
              </FilterTag>
            ))}
          </ActiveFilters>
        )}
      </FilterCard>
    </FilterContainer>
  );
};

export default ExecutionTeamFilter;

