import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Table, Form, InputGroup } from 'react-bootstrap';
import UserTable from './UserTable';
import ProductTable from './ProductTable';
import S3Uploader from './S3Uploader';

function App() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users and products from backend
    async function fetchData() {
      try {
        const userResponse = await axios.get('http://44.201.171.2:3000/usuarios');
        const productResponse = await axios.get('http://44.201.171.2:3000/produtos');
        setUsers(userResponse.data);
        setProducts(productResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <Container>
      <Row className="mt-3">
        <Col>
          <h2>Usuários</h2>
          <UserTable users={users} loading={loading} />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <h2>Produtos</h2>
          <ProductTable products={products} loading={loading} />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <h2>Upload de Arquivo S3</h2>
          <S3Uploader />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
