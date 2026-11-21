import "./App.css";
import Home from "./views/Home";
import Login from "./views/Login";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Register from "./views/Register";
import Profile from "./views/Profile";
import History from "./views/History";
import Layout from "./components/Layout";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/history"
            element={
              <Layout>
                <History />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
