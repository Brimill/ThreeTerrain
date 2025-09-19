import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import { Button } from "./components/ui/button";
import TextureViewer from "./TextureViewer";
import ThreeViewer from "./ThreeViewer";
import { Sun, Moon } from "lucide-react";

function App() {
  return (
    <div className="w-screen h-screen flex">
      <div className="w-1/2 flex-auto">
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <TextureViewer />
        </ThemeProvider>
      </div>
      <div className="w-1/2 flex-auto">
        <ThreeViewer />
      </div>
    </div>
  );
}

export default App;
