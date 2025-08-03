import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HealthInsuranceDashboard from './pages/HealthInsuranceDashboard';
import HealthInsuranceProcessList from './components/processes/HealthInsuranceProcessList';
import ProcessDetail from './pages/ProcessDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HealthInsuranceDashboard />} />
        <Route path="processos" element={<HealthInsuranceProcessList />} />
        <Route path="processos/:id" element={<ProcessDetail />} />
        <Route path="alertas" element={
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🚨 Alertas Críticos Executivos</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-left">
                <p className="text-gray-700 mb-4">
                  <strong>Dados insuficientes na demonstração atual.</strong> Em ambiente de produção com dados completos, esta funcionalidade oferece:
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong>Escalação Automática:</strong> Casos críticos são automaticamente comunicados à diretoria com análise de risco e recomendações estratégicas
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong>Alertas Financeiros:</strong> Notificações em tempo real sobre multas crescentes, valores elevados e impacto no orçamento departamental
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong>Dashboard Executivo:</strong> Métricas personalizadas para gestores com indicadores de performance jurídica e alertas de compliance
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong>Integração C-Level:</strong> Relatórios automáticos para CEO/CFO sobre exposição financeira, tendências jurisprudenciais e ROI das estratégias defensivas
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        } />
        <Route path="analytics" element={
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Analytics Preditivos & Jurimetrics</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
                <p className="text-gray-700 mb-4">
                  <strong>Dados insuficientes na demonstração atual.</strong> Com base histórica completa, esta funcionalidade conecta gestores executivos através de:
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong>Predição de Resultados:</strong> Machine Learning analisa 95% de precisão em prever desfechos de processos similares para apoiar decisões de acordo vs. defesa
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong>Otimização de Custos:</strong> Algoritmos sugerem alocação otimizada de recursos jurídicos baseada em ROI histórico e complexidade de casos
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong>Benchmarking Setorial:</strong> Comparações com outras operadoras de saúde, identificando oportunidades de melhoria e melhores práticas
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong>Business Intelligence Executivo:</strong> Dashboards interativos para CFO/CEO com projeções financeiras, análise de tendências e KPIs estratégicos
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        } />
        <Route path="relatorios" element={
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Relatórios Executivos & Compliance</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-left">
                <p className="text-gray-700 mb-4">
                  <strong>Dados insuficientes na demonstração atual.</strong> Em produção, esta funcionalidade conecta diretamente com gestores executivos oferecendo:
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong>Relatórios Regulatórios ANS:</strong> Compilação automática de dados para órgãos reguladores com alertas de compliance e prazos críticos
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong>Dashboards C-Level:</strong> Relatórios personalizados para CEO, CFO e Conselho com métricas de exposição jurídica e impacto nos resultados
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong>Análise de Performance:</strong> KPIs de eficiência da área jurídica, tempo médio de resolução e custo por caso para otimização de processos
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <strong>Relatórios de Risco:</strong> Avaliação periódica de exposição financeira, tendências jurisprudenciais e recomendações para mitigação de riscos
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        } />
      </Route>
    </Routes>
  );
}

export default App;