import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./Auth/AuthContext.jsx";
import ProtectedRoute from "./Auth/PrivateRoute.jsx";
import Layout from "./components/Layout/index.jsx";
import Dashboard from "./pages/Dashboard";
import DocumentList from "./pages/documents";
import AddNewDoc from "./pages/documents/AddNewDoc";
import Login from "./pages/Login";
import './App.css';
import { ToastContainer } from "react-toastify";
import Users from "./pages/users/index.jsx";
function App() {

  return <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />} >

            <Route path="/" element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="roles" element={<Dashboard />} />
            <Route path="logs" element={<Dashboard />} />
            <Route path="settings" element={<Dashboard />} />

            <Route path="documents" >
              <Route index element={<DocumentList />} />
              {/* <Route path="add" element={<AddNewDoc />} /> */}
            </Route>

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    <ToastContainer />
  </AuthProvider>
}

export default App
