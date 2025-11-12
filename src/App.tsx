import { HelmetProvider } from "react-helmet-async";
import RoutesIndex from "./routes";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <RoutesIndex />
      <Toaster />
    </HelmetProvider>
  );
};

export default App;
