import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { SeafinProvider } from './contexts/SeafinContext';
import Overview from './pages/Overview';
import ServiceModule from './pages/ServiceModule';
import Operations from './pages/Operations';
import Schools from './pages/Schools';
import Alerts from './pages/Alerts';
import Sources from './pages/Sources';
import { TransportProvider } from './transport/TransportContext';
import TransportLayout, { ManagerOnly } from './transport/TransportLayout';
import TransportDashboard from './transport/TransportDashboard';
import SchoolTransport from './transport/SchoolTransport';
import OccurrenceDetail from './transport/OccurrenceDetail';
import Evaluations from './transport/Evaluations';
import TransportReports from './transport/TransportReports';
import TransportSettings from './transport/TransportSettings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/painel" element={<SeafinProvider><TransportProvider><Dashboard /></TransportProvider></SeafinProvider>}>
              <Route index element={<Overview />} />
              <Route path="merenda" element={<ServiceModule module="merenda" />} />
              <Route path="limpeza" element={<ServiceModule module="limpeza" />} />
              <Route path="transporte" element={<TransportLayout />}>
                <Route index element={<ManagerOnly><TransportDashboard /></ManagerOnly>} />
                <Route path="escola" element={<SchoolTransport />} />
                <Route path="escola/:schoolId" element={<SchoolTransport />} />
                <Route path="escola/:schoolId/ocorrencias/:id" element={<OccurrenceDetail />} />
                <Route path="escola/:schoolId/avaliacoes" element={<Evaluations />} />
                <Route path="ocorrencias/:id" element={<ManagerOnly><OccurrenceDetail /></ManagerOnly>} />
                <Route path="avaliacoes" element={<ManagerOnly><Evaluations /></ManagerOnly>} />
                <Route path="relatorios" element={<ManagerOnly><TransportReports /></ManagerOnly>} />
                <Route path="configuracoes" element={<ManagerOnly><TransportSettings /></ManagerOnly>} />
                <Route path="contratos/:contractId" element={<ManagerOnly><TransportDashboard /></ManagerOnly>} />
              </Route>
              <Route path="cuidador" element={<ServiceModule module="cuidador" />} />
              <Route path="escolas" element={<Schools />} />
              <Route path="escolas/:schoolId" element={<Schools />} />
              <Route path="pendencias" element={<Operations key="pendencias" kind="pendencia" />} />
              <Route path="ocorrencias" element={<Operations key="ocorrencias" kind="ocorrencia" />} />
              <Route path="alertas" element={<Alerts />} />
              <Route path="fontes" element={<Sources />} />
            </Route>
            <Route path="/" element={<Navigate to="/painel" replace />} />
            <Route path="*" element={<Navigate to="/painel" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
