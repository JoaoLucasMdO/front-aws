import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, ListGroup } from 'react-bootstrap';

const S3Uploader = () => {
  const [buckets, setBuckets] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState('');
  const [file, setFile] = useState(null);
  const [objects, setObjects] = useState([]);

  useEffect(() => {
    async function fetchBuckets() {
      try {
        const response = await axios.get('http://44.201.171.2:3000/buckets');
        setBuckets(response.data);
      } catch (error) {
        console.error('Erro ao carregar buckets:', error);
      }
    }
    fetchBuckets();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !selectedBucket) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`http://44.201.171.2:3000/buckets/${selectedBucket}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Arquivo enviado com sucesso!');
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar o arquivo');
    }
  };

  const handleBucketChange = async (bucketName) => {
    setSelectedBucket(bucketName);
    try {
      const response = await axios.get(`http://44.201.171.2:3000/buckets/${bucketName}`);
      setObjects(response.data);
    } catch (error) {
      console.error('Erro ao carregar objetos:', error);
    }
  };

  return (
    <div>
      <Form.Group controlId="bucketSelect">
        <Form.Label>Escolha um bucket:</Form.Label>
        <Form.Control as="select" onChange={(e) => handleBucketChange(e.target.value)}>
          <option>Selecione um bucket</option>
          {buckets.map((bucket) => (
            <option key={bucket.Name} value={bucket.Name}>
              {bucket.Name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="fileUpload">
        <Form.Label>Selecione um arquivo:</Form.Label>
        <Form.Control type="file" onChange={handleFileChange} />
      </Form.Group>

      <Button onClick={handleUpload}>Upload</Button>

      {selectedBucket && (
        <div>
          <h3>Objetos no Bucket {selectedBucket}</h3>
          <ListGroup>
            {objects.map((obj) => (
              <ListGroup.Item key={obj.Key}>{obj.Key}</ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
    </div>
  );
};

export default S3Uploader;
