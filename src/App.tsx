import { Routes, Route } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import DetailedPage from './pages/DetailedPage';
import SuccessPage from './pages/SuccessPage';
import ErrorPage from './pages/ErrorPage';
import NewAlcoholPage from './pages/NewAlcoholPage';
import NewVolumePage from './pages/NewVolumePage';
import NewBeerBrandPage from './pages/NewBeerBrandPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/detailed" element={<DetailedPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/new-alcohol" element={<NewAlcoholPage />} />
      <Route path="/new-volume" element={<NewVolumePage />} />
      <Route path="/new-brand" element={<NewBeerBrandPage />} />
    </Routes>
  );
}

export default App;
