import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { BoardView } from "./views/BoardView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/board"} element={<BoardView />} />
          <Route path="*" element={<Navigate to='/board' replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
