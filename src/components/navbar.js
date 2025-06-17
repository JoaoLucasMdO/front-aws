import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div className="flex items-center py-4">
              <span className="font-semibold text-white text-lg">P2 AWS</span>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className="py-4 px-2 text-white hover:text-gray-200 transition duration-300"
              >
                Home
              </Link>
              <Link
                to="/users"
                className="py-4 px-2 text-white hover:text-gray-200 transition duration-300"
              >
                Usuários
              </Link>
              <Link to="/products" className="py-4 px-2 text-white hover:text-gray-200">
                Produtos
              </Link>
              <Link to="/buckets" className="py-4 px-2 text-white hover:text-gray-200">
                Buckets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;