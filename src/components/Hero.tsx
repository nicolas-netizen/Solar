import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative h-screen">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
            Energía Solar para un Futuro Brillante
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl mb-8">
            Transformamos el poder del sol en energía limpia para tu hogar
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-yellow-400 transition duration-300">
              <span>Solicitar Cotización</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition duration-300">
              Ver Productos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;