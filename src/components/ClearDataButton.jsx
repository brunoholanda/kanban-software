import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Modal } from 'antd';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const ClearButton = styled(Button)`
  position: fixed;
  bottom: 30px;
  left: 30px;
  z-index: 1000;
`;

const ClearDataButton = ({ onClearData }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isAdmin } = useAuth();

  const handleClear = () => {
    onClearData();
    setIsModalVisible(false);
  };

  // Só renderiza se for admin
  if (!isAdmin) {
    return null;
  }

  return (
    <>{/*
      <ClearButton
        type="default"
        danger
        icon={<Trash2 size={16} />}
        onClick={() => setIsModalVisible(true)}
      >
        Limpar Dados
      </ClearButton>nv
*/}
      <Modal
        title="Limpar Todos os Dados"
        open={isModalVisible}
        onOk={handleClear}
        onCancel={() => setIsModalVisible(false)}
        okText="Sim, Limpar"
        cancelText="Cancelar"
        okButtonProps={{ danger: true }}
      >
        <p>Tem certeza que deseja limpar todos os dados do quadro Kanban?</p>
        <p><strong>Esta ação não pode ser desfeita.</strong></p>
      </Modal>
    </>
  );
};

export default ClearDataButton;

