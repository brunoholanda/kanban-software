import React, { useState } from 'react';
import { Card, Button, Tag } from 'antd';
import { Filter, X } from 'lucide-react';
import styled from 'styled-components';
import useApprovers from '../hooks/useApprovers';

const FilterContainer = styled.div`
  flex: 1;
  min-width: 300px;
`;

const FilterCard = styled(Card)`
  .ant-card-body {
    padding: 12px 16px;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const FilterTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #262626;
`;

const ApproversContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
`;

const ApproverAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.$isSelected ? '#1890ff' : '#f0f0f0'};
  color: ${props => props.$isSelected ? 'white' : '#595959'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid ${props => props.$isSelected ? '#1890ff' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

const ActiveFilters = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const FilterTag = styled(Tag)`
  margin: 0;
`;

const ApproversFilter = ({ onFiltersChange }) => {
  const { approvers, loading } = useApprovers();
  const [selectedApprovers, setSelectedApprovers] = useState([]);

  const getInitials = (fullName) => {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const handleApproverClick = (approver) => {
    const isSelected = selectedApprovers.includes(approver.fullName);
    let newSelectedApprovers;
    
    if (isSelected) {
      newSelectedApprovers = selectedApprovers.filter(name => name !== approver.fullName);
    } else {
      newSelectedApprovers = [...selectedApprovers, approver.fullName];
    }
    
    setSelectedApprovers(newSelectedApprovers);
    onFiltersChange({
      approvers: newSelectedApprovers
    });
  };

  const clearFilters = () => {
    setSelectedApprovers([]);
    onFiltersChange({
      approvers: []
    });
  };

  const removeApproverFilter = (approverToRemove) => {
    const newApprovers = selectedApprovers.filter(approver => approver !== approverToRemove);
    setSelectedApprovers(newApprovers);
    onFiltersChange({
      approvers: newApprovers
    });
  };

  const hasActiveFilters = selectedApprovers.length > 0;

  if (approvers.length === 0) {
    return (
      <FilterContainer>
        <FilterCard 
          title={
            <FilterTitle>
              <Filter size={16} />
              <span>Filtros por Aprovadores</span>
            </FilterTitle>
          }
          size="small"
        >
          <div style={{ textAlign: 'center', color: '#8c8c8c', padding: '20px' }}>
            Nenhum aprovador cadastrado
          </div>
        </FilterCard>
      </FilterContainer>
    );
  }

  return (
    <FilterContainer>
      <FilterCard 
        title={
          <FilterTitle>
            <Filter size={16} />
            <span>Filtros por Aprovadores</span>
          </FilterTitle>
        }
        size="small"
        extra={
          hasActiveFilters && (
            <Button 
              type="text" 
              size="small" 
              icon={<X size={12} />}
              onClick={clearFilters}
            >
              Limpar
            </Button>
          )
        }
      >
        <ApproversContainer>
          {approvers.map(approver => (
            <ApproverAvatar
              key={approver.id}
              $isSelected={selectedApprovers.includes(approver.fullName)}
              onClick={() => handleApproverClick(approver)}
              title={approver.fullName}
            >
              {getInitials(approver.fullName)}
            </ApproverAvatar>
          ))}
        </ApproversContainer>

        {hasActiveFilters && (
          <ActiveFilters>
            {selectedApprovers.map(approver => (
              <FilterTag
                key={`approver-${approver}`}
                closable
                onClose={() => removeApproverFilter(approver)}
                color="blue"
              >
                {approver}
              </FilterTag>
            ))}
          </ActiveFilters>
        )}
      </FilterCard>
    </FilterContainer>
  );
};

export default ApproversFilter;
