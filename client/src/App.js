import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/Private";
import Signup from "./pages/Signup";

function App() {
  return (
    <div>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chatroom" element={<PrivateRoute />}>
            <Route path="user" element={<Dashboard/>} />
          </Route>
      </Routes>
    </div>
  );
}

export default App;
