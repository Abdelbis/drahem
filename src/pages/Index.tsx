import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard immediately
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">Mon Budget</h1>
        <p className="text-xl text-gray-300 mb-8">
          Gestion de vos finances personnelles
        </p>
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4"></div>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;