import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { FavoritesProvider } from './context/FavoritesContext';
import Home        from './pages/Home';
import Scores      from './pages/Scores';
import MatchDetail from './pages/MatchDetail';
import Standings   from './pages/Standings';
import Players     from './pages/Players';
import PlayerDetail from './pages/PlayerDetail';
import Teams       from './pages/Teams';
import TeamDetail  from './pages/TeamDetail';
import News        from './pages/News';
import ComparePlayers from './pages/ComparePlayers';

export default function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <Layout>
          <Routes>
            <Route path="/"            element={<Home />}        />
            <Route path="/scores"      element={<Scores />}      />
            <Route path="/matches/:id" element={<MatchDetail />} />
            <Route path="/standings"   element={<Standings />}   />
            <Route path="/players"     element={<Players />}     />
            <Route path="/players/:id" element={<PlayerDetail />} />
            <Route path="/compare"     element={<ComparePlayers />} />
            <Route path="/teams"       element={<Teams />}       />
            <Route path="/teams/:id"   element={<TeamDetail />}  />
            <Route path="/news"        element={<News />}        />
            <Route path="*"            element={<NotFound />}    />
          </Routes>
        </Layout>
      </FavoritesProvider>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in">
      <p className="text-7xl mb-4">⚽</p>
      <h1 className="text-3xl font-extrabold text-text-primary mb-2">404 — Off Target</h1>
      <p className="text-text-muted mb-6">This page doesn't exist.</p>
      <a href="/" className="btn-primary">Go Home</a>
    </div>
  );
}
