import React, { useEffect, useState } from 'react';
import api from './services/api';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('produtos')
      .then(res => {
        setProducts(res.data);
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
            <th className="py-3 px-4 text-left">Descrição</th>
            <th className="py-3 px-4 text-left">Preço</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.Id}
              className="hover:bg-blue-50 transition-colors"
            >
              <td className="py-2 px-4">{product.Id}</td>
              <td className="py-2 px-4">{product.Nome}</td>
              <td className="py-2 px-4">{product.Descricao}</td>
              <td className="py-2 px-4">
                {Number(product.Preco).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
