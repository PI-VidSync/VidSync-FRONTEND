import { SearchX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "./NotFoundPage.scss";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div
      className="full-view not-found-content"
    >
      <SearchX size={150} color="white" />
      <h1 className='title'>404 - Página no encontrada</h1>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <button onClick={goToHome} className="btn btn-white">
        Volver al Inicio
      </button>
    </div>
  );
};

export default NotFoundPage;