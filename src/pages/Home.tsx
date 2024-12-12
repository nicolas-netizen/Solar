import React from 'react';
import Hero from '../components/Hero';
import { Sun, Battery, Zap, PhoneCall } from 'lucide-react';

const features = [
  {
    icon: <Sun className="h-8 w-8 text-yellow-500" />,
    title: 'Energía Limpia',
    description: 'Aprovecha la energía solar para reducir tu huella de carbono'
  },
  {
    icon: <Battery className="h-8 w-8 text-yellow-500" />,
    title: 'Ahorro Garantizado',
    description: 'Reduce tus facturas de electricidad hasta un 70%'
  },
  {
    icon: <Zap className="h-8 w-8 text-yellow-500" />,
    title: 'Instalación Profesional',
    description: 'Equipo certificado y garantía de 25 años'
  }
];

const Home = () => {
  return (
    <div>
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Por qué elegir Nuevo Mundo?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">
            ¿Listo para cambiar a energía solar?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Nuestros expertos están listos para ayudarte a encontrar la mejor solución para tu hogar o negocio.
          </p>
          <button className="bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-yellow-400 transition duration-300 mx-auto">
            <PhoneCall className="h-5 w-5" />
            <span>Contactar Ahora</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;