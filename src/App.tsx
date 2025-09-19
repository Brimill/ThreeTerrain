import TextureViewer from "./TextureViewer";
import ThreeViewer from "./ThreeViewer";

function App() {
  return (
    <div className="w-screen h-screen flex">
      <div className="w-1/2 flex-auto">
        <TextureViewer />
      </div>
      <div className="w-1/2 flex-auto">
        <ThreeViewer />
      </div>
    </div>
  );
}

export default App;
