import React from 'react';
import styled from 'styled-components';
import { Button, Tooltip } from 'antd';
import { Plus } from 'lucide-react';

const FloatingButton = styled(Button)`
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.35);
  z-index: 1000;
  border: none;

  &:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 16px 32px rgba(37, 99, 235, 0.4);
  }
`;

const FloatingAddButton = ({ onClick }) => {
  return (
    <Tooltip title="Nova GMUD" placement="left">
      <FloatingButton
        type="primary"
        size="large"
        icon={<Plus size={24} />}
        onClick={onClick}
        aria-label="Nova GMUD"
      />
    </Tooltip>
  );
};

export default FloatingAddButton;
