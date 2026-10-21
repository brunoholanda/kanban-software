import React from 'react';
import styled, { css } from 'styled-components';
import { useDraggable } from '@dnd-kit/core';
import { ExternalLink, Calendar, Users, Clock, Trash2, AlertTriangle, Edit, CheckCircle, Archive, ArchiveRestore, GripVertical } from 'lucide-react';
import { Button, Popconfirm, Tooltip } from 'antd';
import { formatDateForDisplay } from '../utils/dateConfig';
import { useAuth } from '../hooks/useAuth';
import { getTeamByValue } from '../constants/teams';
import { getColumnById } from '../constants/columns';

const CardContainer = styled.div`
  background: ${props => {
    if (props.$isOverdue) return 'linear-gradient(180deg, #fff7f7 0%, #ffffff 48%)';
    if (props.$isCompleted) return 'linear-gradient(180deg, #f3fff6 0%, #ffffff 48%)';
    return '#ffffff';
  }};
  border: 1px solid ${props => {
    if (props.$isOverdue) return '#fecaca';
    if (props.$isCompleted) return '#bbf7d0';
    return '#e2e8f0';
  }};
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 12px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.05);
  cursor: ${props => (props.$disabledDrag ? 'default' : 'grab')};
  transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
  position: relative;
  touch-action: none;
  user-select: none;

  ${props => props.$isDragging && css`
    opacity: 0.35;
    box-shadow: none;
  `}

  ${props => props.$isOverlay && css`
    cursor: grabbing;
    transform: rotate(2deg) scale(1.03);
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);
    border-color: #93c5fd;
  `}

  &:hover {
    box-shadow: ${props => (props.$isOverlay ? '0 18px 40px rgba(15, 23, 42, 0.18)' : '0 10px 24px rgba(15, 23, 42, 0.1)')};
    transform: ${props => (props.$isOverlay ? 'rotate(2deg) scale(1.03)' : 'translateY(-1px)')};
  }
`;

const CardTitle = styled.h4`
  margin: 0;
  color: #0f172a;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
`;

const CardField = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  font-size: 12px;
  color: #64748b;
  gap: 8px;
`;

const FieldIcon = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1px;
  color: #94a3b8;
`;

const FieldLabel = styled.span`
  font-weight: 600;
  margin-right: 4px;
  color: #475569;
`;

const FieldValue = styled.span`
  color: #0f172a;
`;

const GmudLink = styled.a`
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
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
  background-color: #f1f5f9;
  color: #334155;
  padding: 2px 7px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  gap: 8px;
`;

const TitleSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: ${props => props.$bg || '#2563eb'};
  color: white;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
`;

const TeamBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: white;
  background: ${props => props.$color || '#64748b'};
`;

const ActionButton = styled(Button)`
  width: 26px;
  height: 26px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  color: #64748b;

  &:hover {
    background-color: ${props => (props.danger ? '#fee2e2' : '#eff6ff')} !important;
    color: ${props => (props.danger ? '#dc2626' : '#2563eb')} !important;
  }
`;

const DragHandle = styled.div`
  display: flex;
  color: #94a3b8;
  margin-right: 6px;
  margin-top: 2px;
`;

const KanbanCard = ({
  card,
  onDelete,
  onEdit,
  onArchive,
  onRestore,
  isArchivedView = false,
  isOverlay = false,
}) => {
  const { isAdmin } = useAuth();
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useDraggable({
    id: card.id,
    data: { type: 'card', status: card.status },
    disabled: isArchivedView || isOverlay,
  });

  const formatDate = (dateString) => formatDateForDisplay(dateString);

  const isOverdue = () => {
    const today = new Date();
    const executionDate = new Date(card.executionForecast);
    return executionDate < today;
  };

  const overdue = isOverdue();
  const isCompleted = card.status === 'concluido';
  const team = getTeamByValue(card.executor);
  const column = getColumnById(card.status);

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(card.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(card);
  };

  const dragProps = isArchivedView || isOverlay ? {} : { ...listeners, ...attributes };

  return (
    <CardContainer
      ref={isOverlay ? undefined : setNodeRef}
      $isOverdue={overdue && !isCompleted}
      $isCompleted={isCompleted}
      $isDragging={isDragging}
      $isOverlay={isOverlay}
      $disabledDrag={isArchivedView}
    >
      <CardHeader>
        <DragHandle {...dragProps} title={isArchivedView ? '' : 'Arrastar para outra coluna'}>
          {!isArchivedView && <GripVertical size={16} />}
        </DragHandle>
        <TitleSection {...dragProps}>
          <CardTitle>{card.title}</CardTitle>
          <BadgeRow>
            {overdue && !isCompleted && !isArchivedView && (
              <StatusBadge $bg="#dc2626">
                <AlertTriangle size={12} />
                Atrasada
              </StatusBadge>
            )}
            {isCompleted && !isArchivedView && (
              <StatusBadge $bg="#16a34a">
                <CheckCircle size={12} />
                Concluída
              </StatusBadge>
            )}
            {isArchivedView && column && (
              <StatusBadge $bg={column.color}>{column.title}</StatusBadge>
            )}
            {team && (
              <TeamBadge $color={team.color}>{team.label}</TeamBadge>
            )}
            {!team && card.executor && (
              <TeamBadge>{card.executor}</TeamBadge>
            )}
          </BadgeRow>
        </TitleSection>

        <CardActions>
          {!isArchivedView && (
            <Tooltip title="Editar GMUD">
              <ActionButton
                type="text"
                size="small"
                icon={<Edit size={14} />}
                onClick={handleEdit}
              />
            </Tooltip>
          )}

          {isArchivedView ? (
            <Tooltip title="Restaurar para o quadro">
              <ActionButton
                type="text"
                size="small"
                icon={<ArchiveRestore size={14} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore?.(card);
                }}
              />
            </Tooltip>
          ) : (
            <Popconfirm
              title="Arquivar GMUD"
              description="A GMUD sairá do quadro principal e ficará na área de arquivadas."
              onConfirm={(e) => {
                e?.stopPropagation?.();
                onArchive?.(card);
              }}
              okText="Arquivar"
              cancelText="Cancelar"
            >
              <Tooltip title="Arquivar GMUD">
                <ActionButton
                  type="text"
                  size="small"
                  icon={<Archive size={14} />}
                  onClick={(e) => e.stopPropagation()}
                />
              </Tooltip>
            </Popconfirm>
          )}

          {isAdmin && (
            <Popconfirm
              title="Excluir GMUD"
              description="Tem certeza que deseja excluir esta GMUD?"
              onConfirm={handleDelete}
              okText="Sim"
              cancelText="Não"
              okButtonProps={{ danger: true }}
            >
              <Tooltip title="Excluir GMUD">
                <ActionButton
                  type="text"
                  size="small"
                  icon={<Trash2 size={14} />}
                  onClick={(e) => e.stopPropagation()}
                  danger
                />
              </Tooltip>
            </Popconfirm>
          )}
        </CardActions>
      </CardHeader>

      <div {...dragProps}>
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
              if (!card.gmudLink || card.gmudLink.trim() === '') {
                e.preventDefault();
              }
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
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
            {(card.approvers || []).map((approver, idx) => (
              <ApproverTag key={idx}>{approver.fullName || approver}</ApproverTag>
            ))}
          </ApproversList>
        </CardField>

        <CardField>
          <FieldIcon>
            <Users size={12} />
          </FieldIcon>
          <FieldLabel>Time responsável:</FieldLabel>
          <FieldValue>{card.executor}</FieldValue>
        </CardField>

        <CardField>
          <FieldIcon>
            <Calendar size={12} />
          </FieldIcon>
          <FieldLabel>Abertura:</FieldLabel>
          <FieldValue>{formatDate(card.openDate)}</FieldValue>
        </CardField>

        <CardField>
          <FieldIcon>
            <Clock size={12} />
          </FieldIcon>
          <FieldLabel>Previsão:</FieldLabel>
          <FieldValue>{formatDate(card.executionForecast)}</FieldValue>
        </CardField>
      </div>
    </CardContainer>
  );
};

export default KanbanCard;
