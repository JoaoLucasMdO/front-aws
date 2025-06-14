import UserTable from './UserTable';
import ProductTable from './ProductTable';
import S3Uploader from './S3Uploader';


function App() {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Usuários</h2>
        <UserTable />
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-green-700">Produtos</h2>
        <ProductTable />
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4 text-purple-700">Upload de Arquivo S3</h2>
        <S3Uploader />
      </section>
    </div>
  );
}

export default App;
