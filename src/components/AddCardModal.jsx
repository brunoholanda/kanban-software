import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Button, Select } from 'antd';
import { formatDateForStorage } from '../utils/dateConfig';
import useApprovers from '../hooks/useApprovers';

const AddCardModal = ({ isVisible, onClose, onAddCard }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { approvers } = useApprovers();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Encontrar os IDs dos aprovadores selecionados
      const selectedApproverIds = values.approvers.map(approverName => {
        const approver = approvers.find(ap => ap.fullName === approverName);
        return approver ? approver.id : null;
      }).filter(id => id !== null);

      const newCard = {
        title: values.title,
        gmudLink: values.gmudLink,
        executor: values.executor,
        openDate: formatDateForStorage(values.openDate),
        executionForecast: formatDateForStorage(values.executionForecast),
        status: 'aberta',
        approverIds: selectedApproverIds
      };
      
      await onAddCard(newCard);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar card:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Adicionar Nova GMUD"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Título"
          name="title"
          rules={[{ required: true, message: 'Por favor, insira o título da GMUD!' }]}
        >
          <Input placeholder="Ex: GMUD-001: Atualização do sistema" />
        </Form.Item>

        <Form.Item
          label="Link da GMUD"
          name="gmudLink"
          rules={[
            { required: true, message: 'Por favor, insira o link da GMUD!' },
            { type: 'url', message: 'Por favor, insira uma URL válida!' }
          ]}
        >
          <Input placeholder="https://gmud.example.com/001" />
        </Form.Item>

        <Form.Item
          label="Aprovadores"
          name="approvers"
          rules={[{ required: true, message: 'Por favor, selecione pelo menos um aprovador!' }]}
        >
          <Select
            mode="multiple"
            placeholder="Selecione os aprovadores"
            options={approvers.map(approver => ({
              value: approver.fullName,
              label: approver.fullName
            }))}
            disabled={approvers.length === 0}
            notFoundContent={approvers.length === 0 ? "Nenhum aprovador cadastrado" : "Nenhum resultado"}
          />
        </Form.Item>

        <Form.Item
          label="Executor"
          name="executor"
          rules={[{ required: true, message: 'Por favor, insira o executor!' }]}
        >
          <Select
            placeholder="Selecione o executor"
            options={[
              { value: 'Time Dev', label: 'Time Dev' },
              { value: 'Operations', label: 'Operations' },
              { value: 'Data', label: 'Data' },
              { value: 'DevOps', label: 'DevOps' },
              { value: 'Network', label: 'Network' }
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Data de Abertura"
          name="openDate"
          rules={[{ required: true, message: 'Por favor, selecione a data de abertura!' }]}
        >
          <DatePicker 
            style={{ width: '100%' }} 
            format="DD/MM/YYYY"
            placeholder="Selecione a data"
          />
        </Form.Item>

        <Form.Item
          label="Previsão de Execução"
          name="executionForecast"
          rules={[{ required: true, message: 'Por favor, selecione a previsão de execução!' }]}
        >
          <DatePicker 
            style={{ width: '100%' }} 
            format="DD/MM/YYYY"
            placeholder="Selecione a data"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button onClick={onClose}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Adicionar GMUD
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCardModal;
