import React, { useState, useEffect } from 'react';
import api from './services/api';

const S3Uploader = () => {
  const [buckets, setBuckets] = useState([]);
  const [file, setFile] = useState(null);
  const [objects, setObjects] = useState([]);
  const [loadingBuckets, setLoadingBuckets] = useState(true);
  const [loadingObjects, setLoadingObjects] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchBuckets() {
      setLoadingBuckets(true);
      try {
        const response = await api.get('buckets');
        setBuckets(response.data);
      } catch (error) {
        console.error('Erro ao carregar buckets:', error);
      }
      setLoadingBuckets(false);
    }
    fetchBuckets();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !selectedBucket) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post(`buckets/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Arquivo enviado com sucesso!');
      setFile(null);
      fetchObjects(selectedBucket);
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar o arquivo');
    }
    setUploading(false);
  };

  const fetchObjects = async (bucketName) => {
    setLoadingObjects(true);
    try {
      const response = await api.get(`buckets/${bucketName}`);
      setObjects(response.data);
    } catch (error) {
      console.error('Erro ao carregar objetos:', error);
      setObjects([]);
    }
    setLoadingObjects(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Upload para S3</h2>
        
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-700">Selecione um arquivo:</label>
        <input
          type="file"
          className="w-full"
          onChange={handleFileChange}
        />
      </div>

      <button
        className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
        onClick={handleUpload}
        disabled={uploading || !file || !selectedBucket}
      >
        {uploading ? 'Enviando...' : 'Upload'}
      </button>

      {selectedBucket && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2 text-blue-600">Objetos no Bucket <span className="font-mono">{selectedBucket}</span></h3>
          {loadingObjects ? (
            <div className="flex justify-center items-center h-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-blue-700">Carregando objetos...</span>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {objects.length === 0 ? (
                <li className="py-2 text-gray-500">Nenhum objeto encontrado.</li>
              ) : (
                objects.map((obj) => (
                  <li key={obj.Key} className="py-2 px-2 hover:bg-blue-50 rounded transition-colors">
                    {obj.Key}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default S3Uploader;
