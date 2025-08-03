import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  FileText,
  Search,
  Settings,
  Bell,
  User,
  Menu,
  X,
  Heart,
  Stethoscope,
  Brain,
  Bone,
  Eye,
  Baby,
  Activity,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import { clsx } from 'clsx';

const medicalSpecialtyIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  cardiologia: Heart,
  oncologia: Activity,
  neurologia: Brain,
  ortopedia: Bone,
  psiquiatria: Brain,
  oftalmologia: Eye,
  pediatria: Baby,
  ginecologia: Heart,
  urologia: Activity,
  gastroenterologia: Activity,
  outros: Stethoscope,
};

const navigation = [
  { name: 'Dashboard Executivo', href: '/', icon: BarChart3 },
  { name: 'Processos Jurídicos', href: '/processos', icon: FileText },
  { name: 'Alertas Críticos', href: '/alertas', icon: AlertTriangle },
  { name: 'Análise Preditiva', href: '/analytics', icon: Activity },
  { name: 'Relatórios', href: '/relatorios', icon: Search },
];

const medicalSpecialties = [
  { id: 'cardiologia', name: 'Cardiologia', count: 45, priority: 'alta' },
  { id: 'oncologia', name: 'Oncologia', count: 38, priority: 'critica' },
  { id: 'neurologia', name: 'Neurologia', count: 29, priority: 'alta' },
  { id: 'ortopedia', name: 'Ortopedia', count: 52, priority: 'media' },
  { id: 'psiquiatria', name: 'Psiquiatria', count: 31, priority: 'media' },
  { id: 'gastroenterologia', name: 'Gastroenterologia', count: 24, priority: 'media' },
  { id: 'ginecologia', name: 'Ginecologia', count: 33, priority: 'media' },
  { id: 'pediatria', name: 'Pediatria', count: 28, priority: 'alta' },
  { id: 'urologia', name: 'Urologia', count: 19, priority: 'baixa' },
  { id: 'oftalmologia', name: 'Oftalmologia', count: 22, priority: 'baixa' },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSpecialtyClick = (specialtyId: string) => {
    navigate(`/processos?especialidade=${specialtyId}`);
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 flex z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={clsx(
        'fixed inset-y-0 left-0 flex flex-col w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-50',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0 md:static md:inset-0'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600" />
            <div className="ml-2">
              <span className="text-lg font-semibold text-gray-900">Health Legal</span>
              <div className="text-xs text-gray-500">Intelligence System</div>
            </div>
          </div>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
                className={clsx(
                  'sidebar-item w-full text-left',
                  isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
                )}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </button>
            );
          })}

          {/* Medical Specialties Section */}
          <div className="pt-6">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Especialidades Médicas
            </h3>
            <div className="mt-2 space-y-1">
              {medicalSpecialties.map((specialty) => {
                const Icon = medicalSpecialtyIcons[specialty.id];
                const priorityColor = specialty.priority === 'critica' ? 'text-red-600' : 
                                    specialty.priority === 'alta' ? 'text-orange-600' : 
                                    specialty.priority === 'media' ? 'text-yellow-600' : 'text-green-600';
                return (
                  <button
                    key={specialty.id}
                    onClick={() => handleSpecialtyClick(specialty.id)}
                    className="sidebar-item sidebar-item-inactive w-full text-left group"
                  >
                    <Icon className={`h-4 w-4 mr-3 ${priorityColor}`} />
                    <span className="flex-1">{specialty.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full group-hover:opacity-80 ${
                      specialty.priority === 'critica' ? 'bg-red-100 text-red-700' :
                      specialty.priority === 'alta' ? 'bg-orange-100 text-orange-700' :
                      specialty.priority === 'media' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {specialty.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Jurídico Executivo</p>
              <p className="text-xs text-gray-500">Saúde Suplementar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="ml-2 md:ml-0 text-lg font-semibold text-gray-900">
                Health Legal Intelligence - Saúde Suplementar
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}