import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";


import AuthRoute from "./context/AuthRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { Suspense } from "react";

const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/LoginForm'));
const Signup = React.lazy(() => import('./pages/Signup'));

function App() {
  return (
    <div className="app-bg">
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Suspense fallback={<div>Loading...</div>}>
            <AuthRoute>
              <Login />
            </AuthRoute></Suspense>} />


          <Route path="/" element={<Suspense fallback={<div>Loading...</div>}>
            <AuthRoute>
              <Signup />
            </AuthRoute></Suspense>} />

          <Route path="/" element={<Suspense fallback={<div>Loading...</div>}>
            <ProtectedRoute>
              <Home />
            </ProtectedRoute></Suspense>} />

          <Route
            path="*"
            element={<div className="text-center mt-10">Page Not Found</div>}
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </div>
  );
}

export default App;
