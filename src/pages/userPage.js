import React, { useState, useEffect } from 'react';
import api from '../services/api';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nome: '', email: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await api.get('usuarios');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar usuários');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create/Update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`usuarios/${editingId}`, formData);
      } else {
        await api.post('usuarios', formData);
      }
      setFormData({ nome: '', email: '' });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      setError(editingId ? 'Erro ao atualizar usuário' : 'Erro ao criar usuário');
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        await api.delete(`usuarios/${id}`);
        fetchUsers();
      } catch (err) {
        setError('Erro ao deletar usuário');
      }
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setFormData({ nome: user.nome, email: user.email });
    setEditingId(user._id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-blue-700 font-semibold">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-2xl mb-4">{editingId ? 'Editar Usuário' : 'Criar Usuário'}</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nome">
            Nome
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            id="nome"
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            {editingId ? 'Atualizar' : 'Criar'}
          </button>
          {editingId && (
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({ nome: '', email: '' });
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-3 px-4 text-left">Nome</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-blue-50 transition-colors">
                <td className="py-2 px-4">{user.nome}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserPage;