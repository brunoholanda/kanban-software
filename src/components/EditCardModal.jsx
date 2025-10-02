import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button, Select } from 'antd';
import { createDayjsFromStorage, formatDateForStorage } from '../utils/dateConfig';
import useApprovers from '../hooks/useApprovers';

const EditCardModal = ({ isVisible, onClose, onEditCard, card }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { approvers, loading: approversLoading } = useApprovers();


  // Preencher o formulário quando o card for alterado
  useEffect(() => {
    if (card && isVisible && approvers.length > 0) {
      console.log('🔍 EditCardModal - Card:', card);
      console.log('🔍 EditCardModal - Card approvers:', card.approvers);
      console.log('🔍 EditCardModal - Available approvers:', approvers);
      
      // Converter os aprovadores para nomes para o Select
      const approverNames = card.approvers ? card.approvers.map(approver => 
        approver.fullName || approver
      ) : [];
      
      console.log('🔍 EditCardModal - Approver names:', approverNames);
      
      form.setFieldsValue({
        title: card.title,
        gmudLink: card.gmudLink,
        approvers: approverNames,
        executor: card.executor,
        openDate: createDayjsFromStorage(card.openDate),
        executionForecast: createDayjsFromStorage(card.executionForecast),
      });
    }
  }, [card, isVisible, form, approvers]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      console.log('🔍 EditCardModal - Submit values:', values);
      console.log('🔍 EditCardModal - Available approvers:', approvers);
      
      // Encontrar os IDs dos aprovadores selecionados
      const selectedApproverIds = values.approvers.map(approverName => {
        const approver = approvers.find(ap => ap.fullName === approverName);
        console.log(`🔍 Looking for approver "${approverName}":`, approver);
        return approver ? approver.id : null;
      }).filter(id => id !== null);

      console.log('🔍 EditCardModal - Selected approver IDs:', selectedApproverIds);

      const updatedCard = {
        ...card,
        title: values.title,
        gmudLink: values.gmudLink,
        executor: values.executor,
        openDate: formatDateForStorage(values.openDate),
        executionForecast: formatDateForStorage(values.executionForecast),
        approverIds: selectedApproverIds
      };
      
      console.log('🔍 EditCardModal - Updated card:', updatedCard);
      
      await onEditCard(updatedCard);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('Erro ao editar card:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Editar GMUD"
      open={isVisible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      zIndex={2000}
      destroyOnClose={true}
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
            loading={approversLoading}
            options={approvers.map(approver => ({
              value: approver.fullName,
              label: approver.fullName
            }))}
            disabled={approvers.length === 0}
            notFoundContent={approversLoading ? "Carregando aprovadores..." : (approvers.length === 0 ? "Nenhum aprovador cadastrado" : "Nenhum resultado")}
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
              { value: 'João Silva', label: 'João Silva' },
              { value: 'Maria Santos', label: 'Maria Santos' },
              { value: 'Ana Costa', label: 'Ana Costa' },
              { value: 'Pedro Lima', label: 'Pedro Lima' },
              { value: 'Roberto Alves', label: 'Roberto Alves' },
              { value: 'Carlos Oliveira', label: 'Carlos Oliveira' },
              { value: 'Fernanda Rocha', label: 'Fernanda Rocha' },
              { value: 'Juliana Mendes', label: 'Juliana Mendes' }
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
            <Button onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Salvar Alterações
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCardModal;
