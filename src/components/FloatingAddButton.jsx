import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { Plus } from 'lucide-react';

const FloatingButton = styled(Button)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 41px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  border: none;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
`;

const FloatingAddButton = ({ onClick }) => {
  return (
    <FloatingButton
      type="primary"
      size="large"
      icon={<Plus size={24} />}
      onClick={onClick}
    />
  );
};

export default FloatingAddButton;

