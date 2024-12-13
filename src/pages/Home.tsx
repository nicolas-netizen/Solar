import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import { Sun, Battery, Zap, PhoneCall, ArrowRight, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <Sun className="h-10 w-10 text-yellow-500" />,
    title: 'Energía Limpia',
    description: 'Aprovecha la energía solar para reducir tu huella de carbono y contribuir a un futuro sostenible'
  },
  {
    icon: <Battery className="h-10 w-10 text-yellow-500" />,
    title: 'Ahorro Garantizado',
    description: 'Reduce tus facturas de electricidad hasta un 70% con nuestras soluciones solares eficientes'
  },
  {
    icon: <Zap className="h-10 w-10 text-yellow-500" />,
    title: 'Instalación Profesional',
    description: 'Equipo certificado y garantía de 25 años en todos nuestros productos e instalaciones'
  },
  {
    icon: <Shield className="h-10 w-10 text-yellow-500" />,
    title: 'Garantía de Calidad',
    description: 'Trabajamos solo con las mejores marcas y ofrecemos garantía extendida en todos nuestros productos'
  },
  {
    icon: <Users className="h-10 w-10 text-yellow-500" />,
    title: 'Servicio Personalizado',
    description: 'Asesoramiento experto para encontrar la solución perfecta para tu hogar o negocio'
  },
  {
    icon: <ArrowRight className="h-10 w-10 text-yellow-500" />,
    title: 'Proceso Simple',
    description: 'Desde la cotización hasta la instalación, nos encargamos de todo el proceso'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      
      {/* Features Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              ¿Por qué elegir Nuevo Mundo?
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Descubre cómo podemos ayudarte a transformar la manera en que consumes energía
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="bg-yellow-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-gray-600">
              Miles de hogares ya disfrutan de energía limpia
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "La instalación fue rápida y profesional. Ahora ahorramos significativamente en nuestra factura de luz."
                </p>
                <div className="font-semibold text-gray-900">Cliente Satisfecho</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gray-900 bg-opacity-90"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            ¿Listo para cambiar a energía solar?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Nuestros expertos están listos para ayudarte a encontrar la mejor solución para tu hogar o negocio. 
            Da el primer paso hacia un futuro más sostenible.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-xl font-semibold flex items-center space-x-2 hover:bg-yellow-400 transition duration-300"
            >
              <PhoneCall className="h-5 w-5" />
              <span>Solicitar Asesoría Gratuita</span>
            </Link>
            <Link
              to="/products"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition duration-300"
            >
              Ver Nuestros Productos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;