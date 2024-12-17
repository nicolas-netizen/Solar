import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Store, 
  CreditCard, 
  Bell, 
  Mail,
  Save,
  User
} from 'lucide-react';

interface SettingsForm {
  storeName: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  timezone: string;
  emailNotifications: boolean;
  orderNotifications: boolean;
  stockNotifications: boolean;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SettingsForm>({
    storeName: 'Solar Store',
    email: 'contacto@solarstore.com',
    phone: '+54 11 1234-5678',
    address: 'Av. Corrientes 1234, CABA',
    currency: 'ARS',
    timezone: 'America/Argentina/Buenos_Aires',
    emailNotifications: true,
    orderNotifications: true,
    stockNotifications: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar los cambios
    console.log('Guardando configuración:', settings);
    // Mostrar notificación de éxito
    alert('Configuración guardada exitosamente');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <SettingsIcon className="h-6 w-6" />
          Configuración
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('general')}
              className={\`px-6 py-3 border-b-2 text-sm font-medium \${
                activeTab === 'general'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }\`}
            >
              <Store className="h-5 w-5 inline-block mr-2" />
              General
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={\`px-6 py-3 border-b-2 text-sm font-medium \${
                activeTab === 'payments'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }\`}
            >
              <CreditCard className="h-5 w-5 inline-block mr-2" />
              Pagos
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={\`px-6 py-3 border-b-2 text-sm font-medium \${
                activeTab === 'notifications'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }\`}
            >
              <Bell className="h-5 w-5 inline-block mr-2" />
              Notificaciones
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre de la Tienda
                  </label>
                  <input
                    type="text"
                    name="storeName"
                    value={settings.storeName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={settings.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Moneda
                  </label>
                  <select
                    name="currency"
                    value={settings.currency}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  >
                    <option value="ARS">Peso Argentino (ARS)</option>
                    <option value="USD">Dólar Estadounidense (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Zona Horaria
                  </label>
                  <select
                    name="timezone"
                    value={settings.timezone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  >
                    <option value="America/Argentina/Buenos_Aires">Argentina (GMT-3)</option>
                    <option value="America/Santiago">Chile (GMT-4)</option>
                    <option value="America/Sao_Paulo">Brasil (GMT-3)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  <Save className="h-4 w-4" />
                  Guardar Cambios
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="ml-3">
                      <span className="text-sm font-medium text-gray-900">Notificaciones por Email</span>
                      <p className="text-sm text-gray-500">Recibir actualizaciones por correo electrónico</p>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={settings.emailNotifications}
                      onChange={handleChange}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 text-gray-400" />
                    <span className="ml-3">
                      <span className="text-sm font-medium text-gray-900">Notificaciones de Pedidos</span>
                      <p className="text-sm text-gray-500">Recibir alertas de nuevos pedidos</p>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="orderNotifications"
                      checked={settings.orderNotifications}
                      onChange={handleChange}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Store className="h-5 w-5 text-gray-400" />
                    <span className="ml-3">
                      <span className="text-sm font-medium text-gray-900">Alertas de Stock</span>
                      <p className="text-sm text-gray-500">Recibir alertas cuando el stock esté bajo</p>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="stockNotifications"
                      checked={settings.stockNotifications}
                      onChange={handleChange}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  <Save className="h-4 w-4" />
                  Guardar Cambios
                </button>
              </div>
            </form>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Configuración de Pagos
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Esta sección estará disponible próximamente. Podrás configurar tus métodos de pago y procesadores aquí.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
