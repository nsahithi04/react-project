import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Form from "./pages/form";
import Home from "./pages/home";
import Profile from "./pages/Profile";
import { ViewConfessions, AddConfession, SentConfessions } from "./pages/home";

function ProtectedRoute({ children }) {
  const email = useSelector((state) => state.user.email);
  return email ? children : <Navigate to="/" replace />;
}

const router = createBrowserRouter([
  { path: "/", element: <Form /> },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ViewConfessions /> },
      { path: "add", element: <AddConfession /> },
      { path: "sent", element: <SentConfessions /> },
    ],
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
