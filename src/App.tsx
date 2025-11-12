//import routes
import { HelmetProvider } from "react-helmet-async";
import RoutesIndex from "./routes/index";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <HelmetProvider>
      <RoutesIndex />
      <Toaster />
    </HelmetProvider>
  );
}

export default App;
