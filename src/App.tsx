import { ThemeProvider } from "@/components/ThemeProvider.tsx";
import TextureViewer from "@/components/TextureViewer";
import ThreeViewer from "@/components/ThreeViewer";

function App() {
  return (
    <div className="w-screen h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 md:h-full flex-auto">
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <TextureViewer />
        </ThemeProvider>
      </div>
      <div className="w-full md:w-1/2 md:h-full flex-auto">
        <ThreeViewer />
      </div>
    </div>
  );
}

export default App;
