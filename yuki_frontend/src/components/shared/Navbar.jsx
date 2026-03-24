import { Link, useLocation } from 'react-router-dom';
import { Coffee, User } from 'lucide-react';

function Navbar({ showBaristaLink = false }) {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/kiosk" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-yuki-purple rounded-xl flex items-center justify-center">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold text-yuki-purple">Yuki</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {showBaristaLink && location.pathname !== '/barista' && (
              <Link 
                to="/barista"
                className="flex items-center gap-2 px-4 py-2 text-yuki-muted hover:text-yuki-purple transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Panel Barista</span>
              </Link>
            )}
            {location.pathname === '/barista' && (
              <Link 
                to="/kiosk"
                className="flex items-center gap-2 px-4 py-2 text-yuki-muted hover:text-yuki-purple transition-colors"
              >
                <Coffee className="w-5 h-5" />
                <span className="hidden sm:inline">Kiosk</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
