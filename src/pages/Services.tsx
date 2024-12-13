import React from 'react';
import { motion } from 'framer-motion';

const Services = () => {
  const services = [
    {
      title: 'Instalación de Paneles Solares',
      description: 'Instalación profesional de sistemas fotovoltaicos para hogares y empresas.',
      icon: '🌞',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      title: 'Mantenimiento',
      description: 'Servicio de mantenimiento preventivo y correctivo para sistemas solares.',
      icon: '🔧',
      color: 'from-blue-400 to-blue-600',
    },
    {
      title: 'Consultoría Energética',
      description: 'Asesoramiento experto para optimizar tu consumo energético.',
      icon: '📊',
      color: 'from-green-400 to-green-600',
    },
    {
      title: 'Diseño de Sistemas',
      description: 'Diseño personalizado de sistemas solares según tus necesidades.',
      icon: '✏️',
      color: 'from-purple-400 to-purple-600',
    },
    {
      title: 'Monitoreo Remoto',
      description: 'Seguimiento en tiempo real del rendimiento de tu sistema solar.',
      icon: '📱',
      color: 'from-red-400 to-red-600',
    },
    {
      title: 'Certificaciones',
      description: 'Gestión de certificaciones y permisos necesarios.',
      icon: '📜',
      color: 'from-indigo-400 to-indigo-600',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-12 overflow-hidden">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-bold text-center mb-4 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        Nuestros Servicios
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-center text-gray-600 mb-12 text-lg"
      >
        Soluciones energéticas para un futuro sostenible
      </motion.p>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            className="relative bg-white rounded-xl shadow-lg overflow-hidden group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            <div className="p-8">
              <motion.div
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="text-5xl mb-6 transform transition-transform duration-300"
              >
                {service.icon}
              </motion.div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:shadow-lg transition-shadow duration-300"
              >
                Más información
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Services;
