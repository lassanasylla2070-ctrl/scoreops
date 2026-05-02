import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />
      <Header />
      <main className="ml-60 pt-[60px] min-h-screen transition-all duration-300">
        <div className="max-w-[1200px] mx-auto px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
