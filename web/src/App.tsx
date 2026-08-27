import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout.tsx';
import { ProcessoPage } from './modules/processo/index.ts';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/processos" element={<ProcessoPage />} />
          <Route path="/" element={<Navigate to="/processos" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
