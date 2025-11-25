import { SearchX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div
      className="full-view"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'top', justifyContent: 'center', textAlign: 'center', gap: '1rem' }}
    >
      <SearchX size={150} color="white" />
      <h1 style={{ fontSize: '3rem', color: 'white' }}>404 - Página no encontrada</h1>
      <p style={{ color: 'white' }}>Lo siento, la página que estás buscando no existe.</p>
      <button onClick={goToDashboard} className="btn btn-white">
        Volver al Dashboard
      </button>
    </div>
  );
};

export default NotFoundPage;