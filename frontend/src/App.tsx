import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { BoardView } from "./views/BoardView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/board"} element={<BoardView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
