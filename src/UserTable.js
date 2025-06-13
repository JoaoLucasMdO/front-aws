import React from 'react';
import { Table } from 'react-bootstrap';

const UserTable = ({ users, loading }) => {
  if (loading) return <p>Carregando...</p>;

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td>{user._id}</td>
            <td>{user.nome}</td>
            <td>{user.email}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UserTable;
