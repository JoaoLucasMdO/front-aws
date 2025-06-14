import React, { useEffect, useState } from 'react';
import api from './services/api';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('usuarios')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-blue-700 font-semibold">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">Nome</th>
            <th className="py-3 px-4 text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="hover:bg-blue-50 transition-colors"
            >
              <td className="py-2 px-4">{user._id}</td>
              <td className="py-2 px-4">{user.nome}</td>
              <td className="py-2 px-4">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
