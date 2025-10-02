import React from 'react';
import styled from 'styled-components';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ExternalLink, Calendar, User, Users, Clock, Trash2, AlertTriangle, Edit, CheckCircle } from 'lucide-react';
import { Button, Popconfirm } from 'antd';
import { formatDateForDisplay } from '../utils/dateConfig';
import { useAuth } from '../hooks/useAuth';

const CardContainer = styled.div`
  background-color: ${props => {
    if (props.$isOverdue) return '#fff2f0';
    if (props.$isCompleted) return '#f6ffed';
    return 'white';
  }};
  border: 1px solid ${props => {
    if (props.$isOverdue) return '#ff4d4f';
    if (props.$isCompleted) return '#52c41a';
    return '#e8e8e8';
  }};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: grab;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    cursor: grabbing;
  }
`;

const CardTitle = styled.h4`
  margin: 0 0 12px 0;
  color: #262626;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
`;

const CardField = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
  color: #595959;
`;

const FieldIcon = styled.div`
  margin-right: 8px;
  display: flex;
  align-items: center;
`;

const FieldLabel = styled.span`
  font-weight: 500;
  margin-right: 4px;
`;

const FieldValue = styled.span`
  color: #262626;
`;

const GmudLink = styled.a`
  color: #1890ff;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ApproversList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const ApproverTag = styled.span`
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const TitleSection = styled.div`
  flex: 1;
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OverdueAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: #ff4d4f;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
`;

const CompletedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: #52c41a;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
`;

const ActionButton = styled(Button)`
  width: 24px;
  height: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  cursor: pointer;
  position: relative;
  z-index: 10;
  
  &:hover {
    background-color: ${props => props.danger ? '#ff4d4f' : '#1890ff'};
    color: white;
  }
  
  &:focus {
    background-color: ${props => props.danger ? '#ff4d4f' : '#1890ff'};
    color: white;
  }
`;

const KanbanCard = ({ card, onDelete, onEdit }) => {
  const { isAdmin, user } = useAuth();
  
  // Debug log
  console.log('🔍 KanbanCard Debug:', {
    cardTitle: card.title,
    user: user ? { username: user.username, userType: user.userType } : null,
    isAdmin
  });
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (dateString) => {
    return formatDateForDisplay(dateString);
  };

  // Verificar se a previsão de execução está estourada
  const isOverdue = () => {
    const today = new Date();
    const executionDate = new Date(card.executionForecast);
    return executionDate < today;
  };

  const overdue = isOverdue();
  const isCompleted = card.status === 'concluido';

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(card.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit && typeof onEdit === 'function') {
      onEdit(card);
    }
  };

  return (
    <CardContainer
      ref={setNodeRef}
      style={style}
      {...attributes}
      $isOverdue={overdue}
      $isCompleted={isCompleted}
    >
      <CardHeader>
        <TitleSection>
          <CardTitle>{card.title}</CardTitle>
          {overdue && !isCompleted && (
            <OverdueAlert>
              <AlertTriangle size={12} />
              Atrasada
            </OverdueAlert>
          )}
          {isCompleted && (
            <CompletedBadge>
              <CheckCircle size={12} />
              Concluída
            </CompletedBadge>
          )}
        </TitleSection>
        
        <CardActions>
          <ActionButton
            type="text"
            size="small"
            icon={<Edit size={14} />}
            onClick={handleEdit}
            title="Editar GMUD"
          />
          
          {isAdmin && (
            <Popconfirm
              title="Excluir GMUD"
              description="Tem certeza que deseja excluir esta GMUD?"
              onConfirm={handleDelete}
              okText="Sim"
              cancelText="Não"
              okButtonProps={{ danger: true }}
            >
              <ActionButton
                type="text"
                size="small"
                icon={<Trash2 size={14} />}
                onClick={(e) => e.stopPropagation()}
                danger
                title="Excluir GMUD"
              />
            </Popconfirm>
          )}
        </CardActions>
      </CardHeader>
      
      <div {...listeners}>
        <CardField>
            <FieldIcon>
              <ExternalLink size={12} />
            </FieldIcon>
            <GmudLink 
              href={card.gmudLink} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Clicou em Ver GMUD:', card.gmudLink);
                if (!card.gmudLink || card.gmudLink.trim() === '') {
                  e.preventDefault();
                  alert('Link da GMUD não foi preenchido!');
                }
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              Ver GMUD
            </GmudLink>
          </CardField>

          <CardField>
            <FieldIcon>
              <Users size={12} />
            </FieldIcon>
            <FieldLabel>Aprovadores:</FieldLabel>
            <ApproversList>
              {card.approvers.map((approver, idx) => (
                <ApproverTag key={idx}>{approver.fullName || approver}</ApproverTag>
              ))}
            </ApproversList>
          </CardField>

          <CardField>
            <FieldIcon>
              <User size={12} />
            </FieldIcon>
            <FieldLabel>Executor:</FieldLabel>
            <FieldValue>{card.executor}</FieldValue>
          </CardField>

          <CardField>
            <FieldIcon>
              <Calendar size={12} />
            </FieldIcon>
            <FieldLabel>Data de Abertura:</FieldLabel>
            <FieldValue>{formatDate(card.openDate)}</FieldValue>
          </CardField>

          <CardField>
            <FieldIcon>
              <Clock size={12} />
            </FieldIcon>
            <FieldLabel>Previsão de Execução:</FieldLabel>
            <FieldValue>{formatDate(card.executionForecast)}</FieldValue>
          </CardField>
      </div>
    </CardContainer>
  );
};

export default KanbanCard;
