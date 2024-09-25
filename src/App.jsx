import "./App.css";
import Sidebar from "./components/sidebar_section/Sidebar";
import "./App.css";
import Routing from "./components/routes/routing";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  if (location.pathname.includes("/Template") || location.pathname.includes("/TotemAdvertising")  ) {
    return (
      <div className="w-screen h-screen">
        <Routing/>
      </div>
    ); // Retorna null para ocultar el sidebar
  }
  return (
    <div className="containerV">
      <Sidebar />
      <div className="mainContent">
        <Routing/>
      </div>
    </div>
  );
}

export default App;