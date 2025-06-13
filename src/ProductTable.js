import React from 'react';
import { Table } from 'react-bootstrap';

const ProductTable = ({ products, loading }) => {
  if (loading) return <p>Carregando...</p>;

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Descrição</th>
          <th>Preço</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.Id}>
            <td>{product.Id}</td>
            <td>{product.Nome}</td>
            <td>{product.Descricao}</td>
            <td>{product.Preco}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ProductTable;
