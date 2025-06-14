import UserTable from '../components/users/UserTable';
import ProductTable from '../components/products/ProductTable';
import S3Uploader from '../components/buckets/S3Uploader';


function Home() {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-purple-700">Upload de Arquivo S3</h2>
        <S3Uploader />
      </section>
    </div>
  );
}

export default Home;
