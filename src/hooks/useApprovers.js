import { useState, useEffect } from 'react';
import approversService from '../services/approversService';

const useApprovers = () => {
  const [approvers, setApprovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApprovers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await approversService.getAll();
      setApprovers(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching approvers:', err);
    } finally {
      setLoading(false);
    }
  };

  const addApprover = async (approverData) => {
    try {
      const newApprover = await approversService.create(approverData);
      setApprovers(prev => [...prev, newApprover]);
      return newApprover;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateApprover = async (id, approverData) => {
    try {
      const updatedApprover = await approversService.update(id, approverData);
      setApprovers(prev => 
        prev.map(approver => 
          approver.id === id ? updatedApprover : approver
        )
      );
      return updatedApprover;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteApprover = async (id) => {
    try {
      await approversService.delete(id);
      setApprovers(prev => prev.filter(approver => approver.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchApprovers();
  }, []);

  return {
    approvers,
    loading,
    error,
    addApprover,
    updateApprover,
    deleteApprover,
    refetch: fetchApprovers
  };
};

export default useApprovers;

