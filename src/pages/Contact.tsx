import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
      setIsSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    { icon: '📍', text: 'Av. Principal 123, Ciudad', delay: 0.1 },
    { icon: '📞', text: '+1234567890', delay: 0.2 },
    { icon: '✉️', text: 'contacto@solar.com', delay: 0.3 },
    { icon: '⏰', text: 'Lun-Vie: 9:00 - 18:00', delay: 0.4 },
  ];

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Contáctanos
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center text-gray-600 mb-12 text-lg"
        >
          Estamos aquí para ayudarte en tu transición a energía solar
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-8 text-gray-800">Información de Contacto</h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: info.delay, duration: 0.5 }}
                  className="flex items-center group"
                >
                  <motion.span
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl mr-4 bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full text-white shadow-md"
                  >
                    {info.icon}
                  </motion.span>
                  <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                    {info.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 rounded-xl shadow-lg relative overflow-hidden"
          >
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-5xl mb-4"
                  >
                    ✅
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-800">¡Mensaje enviado!</h3>
                  <p className="text-gray-600">Nos pondremos en contacto contigo pronto.</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { id: 'name', label: 'Nombre', type: 'text' },
                { id: 'email', label: 'Email', type: 'email' },
                { id: 'phone', label: 'Teléfono', type: 'tel' },
              ].map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <motion.input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    value={formData[field.id as keyof typeof formData]}
                    onChange={handleChange}
                    required
                    whileFocus="focus"
                    variants={inputVariants}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <motion.textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  whileFocus="focus"
                  variants={inputVariants}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
              </motion.div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg hover:shadow-lg transition-shadow duration-300 font-semibold"
              >
                Enviar Mensaje
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
