import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppDataProvider from './components/AppDataProvider';
import Menu from './pages/Menu';
import Search from './pages/Search';
import ConferenceFilters from './pages/ConferenceFilters';
import ConferenceList from './pages/ConferenceList';
import Settings from './pages/Settings';
import StudentDetail from './pages/StudentDetail';

function App() {
  return (
    <AppDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/search" element={<Search />} />
          <Route path="/conference-filters" element={<ConferenceFilters />} />
          <Route path="/conference-list" element={<ConferenceList />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/student/:id" element={<StudentDetail />} />
        </Routes>
      </BrowserRouter>
    </AppDataProvider>
  );
}

export default App;
