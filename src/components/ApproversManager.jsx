import React, { useState } from 'react';
import { Modal, Form, Input, Button, List, Card, Popconfirm, message } from 'antd';
import { Plus, Edit, Delete, User } from 'lucide-react';
import styled from 'styled-components';
import useApprovers from '../hooks/useApprovers';
import { useAuth } from '../hooks/useAuth';

const ManagerContainer = styled.div`
  margin-bottom: 16px;
`;

const ApproverCard = styled(Card)`
  margin-bottom: 8px;
  .ant-card-body {
    padding: 12px 16px;
  }
`;

const ApproverInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ApproverName = styled.span`
  font-weight: 500;
  color: #262626;
`;

const ApproverActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ApproversManager = () => {
  const { approvers, loading, addApprover, updateApprover, deleteApprover } = useApprovers();
  const { isAdmin, user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingApprover, setEditingApprover] = useState(null);
  const [form] = Form.useForm();

  // Debug log
  console.log('🔍 ApproversManager Debug:', {
    user: user ? { username: user.username, userType: user.userType } : null,
    isAdmin,
    approversCount: approvers.length
  });

  const handleAddApprover = () => {
    setEditingApprover(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditApprover = (approver) => {
    setEditingApprover(approver);
    form.setFieldsValue({
      firstName: approver.firstName,
      lastName: approver.lastName
    });
    setIsModalVisible(true);
  };

  const handleDeleteApprover = async (approverId) => {
    try {
      await deleteApprover(approverId);
      message.success('Aprovador removido com sucesso!');
    } catch (error) {
      message.error('Erro ao remover aprovador');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const approverData = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim()
      };

      if (editingApprover) {
        await updateApprover(editingApprover.id, approverData);
        message.success('Aprovador atualizado com sucesso!');
      } else {
        await addApprover(approverData);
        message.success('Aprovador adicionado com sucesso!');
      }

      form.resetFields();
      setIsModalVisible(false);
      setEditingApprover(null);
    } catch (error) {
      message.error('Erro ao salvar aprovador');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setEditingApprover(null);
  };

  return (
    <ManagerContainer>
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={16} />
            <span>{isAdmin ? 'Gerenciar Aprovadores' : 'Aprovadores'}</span>
          </div>
        }
        extra={
          isAdmin && (
            <Button 
              type="primary" 
              icon={<Plus size={14} />} 
              size="small"
              onClick={handleAddApprover}
            >
              Adicionar
            </Button>
          )
        }
        size="small"
      >
        {approvers.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#8c8c8c', padding: '20px' }}>
            Nenhum aprovador cadastrado
          </div>
        ) : (
          <List
            dataSource={approvers}
            renderItem={(approver) => (
              <ApproverCard size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <ApproverInfo>
                    <User size={14} color="#1890ff" />
                    <ApproverName>{approver.fullName}</ApproverName>
                  </ApproverInfo>
                  {isAdmin && (
                    <ApproverActions>
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<Edit size={12} />}
                        onClick={() => handleEditApprover(approver)}
                      />
                      <Popconfirm
                        title="Remover aprovador"
                        description="Tem certeza que deseja remover este aprovador?"
                        onConfirm={() => handleDeleteApprover(approver.id)}
                        okText="Sim"
                        cancelText="Não"
                      >
                        <Button 
                          type="text" 
                          size="small" 
                          danger
                          icon={<Delete size={12} />}
                        />
                      </Popconfirm>
                    </ApproverActions>
                  )}
                </div>
              </ApproverCard>
            )}
          />
        )}
      </Card>

      <Modal
        title={editingApprover ? 'Editar Aprovador' : 'Adicionar Aprovador'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={400}
        destroyOnClose={true}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Nome"
            name="firstName"
            rules={[
              { required: true, message: 'Por favor, insira o nome!' },
              { min: 2, message: 'Nome deve ter pelo menos 2 caracteres!' }
            ]}
          >
            <Input placeholder="Ex: João" />
          </Form.Item>

          <Form.Item
            label="Sobrenome"
            name="lastName"
            rules={[
              { required: true, message: 'Por favor, insira o sobrenome!' },
              { min: 2, message: 'Sobrenome deve ter pelo menos 2 caracteres!' }
            ]}
          >
            <Input placeholder="Ex: Silva" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                {editingApprover ? 'Salvar' : 'Adicionar'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </ManagerContainer>
  );
};

export default ApproversManager;
