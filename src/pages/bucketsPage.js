import React, { useState, useEffect } from 'react';
import api from '../services/api';

const BucketsPage = () => {
  const [buckets, setBuckets] = useState([]);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [bucketObjects, setBucketObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  // Fetch buckets
  const fetchBuckets = async () => {
    try {
      const response = await api.get('/buckets');
      setBuckets(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar buckets');
      setLoading(false);
    }
  };

  // Fetch bucket objects
  const fetchBucketObjects = async (bucketName) => {
    try {
      const response = await api.get(`/buckets/${bucketName}`);
      setBucketObjects(response.data);
      setSelectedBucket(bucketName);
    } catch (err) {
      setError('Erro ao carregar objetos do bucket');
    }
  };

  useEffect(() => {
    fetchBuckets();
  }, []);

  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Selecione um arquivo para upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/buckets/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFile(null);
      if (selectedBucket) {
        fetchBucketObjects(selectedBucket);
      }
    } catch (err) {
      setError('Erro ao fazer upload do arquivo');
    }
  };

  // Handle file delete
  const handleDelete = async (fileName) => {
    if (window.confirm('Tem certeza que deseja deletar este arquivo?')) {
      try {
        await api.delete(`/buckets/file/${fileName}`);
        if (selectedBucket) {
          fetchBucketObjects(selectedBucket);
        }
      } catch (err) {
        setError('Erro ao deletar arquivo');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
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

      {/* File Upload Form */}
      <form onSubmit={handleFileUpload} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-2xl mb-4">Upload de Arquivo</h2>
        <div className="mb-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload
        </button>
      </form>

      {/* Buckets List */}
      <div className="mb-8">
        <h2 className="text-2xl mb-4">Buckets</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {buckets.map((bucket) => (
            <div
              key={bucket.Name}
              onClick={() => fetchBucketObjects(bucket.Name)}
              className={`p-4 rounded-lg shadow cursor-pointer transition-colors ${
                selectedBucket === bucket.Name ? 'bg-blue-100' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <h3 className="font-semibold">{bucket.Name}</h3>
              <p className="text-sm text-gray-600">
                Criado em: {new Date(bucket.CreationDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bucket Objects */}
      {selectedBucket && (
        <div className="overflow-x-auto">
          <h2 className="text-2xl mb-4">Arquivos em {selectedBucket}</h2>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-3 px-4 text-left">Nome</th>
                <th className="py-3 px-4 text-left">Tamanho</th>
                <th className="py-3 px-4 text-left">Última Modificação</th>
                <th className="py-3 px-4 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {bucketObjects.map((object) => (
                <tr key={object.Key} className="hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-4">{object.Key}</td>
                  <td className="py-2 px-4">{(object.Size / 1024).toFixed(2)} KB</td>
                  <td className="py-2 px-4">
                    {new Date(object.LastModified).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDelete(object.Key)}
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
      )}
    </div>
  );
};

export default BucketsPage;