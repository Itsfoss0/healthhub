import { Route, Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.page';
import DemoPage from '../pages/DemoPage.component';

export default function AppRouter () {
  return (
    <Routes>
      <Route path='' index element={<LandingPage />} />
      <Route path='/demo' element={<DemoPage />} />
    </Routes>
  );
}
