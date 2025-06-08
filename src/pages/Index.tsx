
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, firm } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && firm) {
      navigate(`/${firm.slug}`);
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, firm, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Immigration Consultant SaaS</h1>
        <p className="text-xl text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default Index;
