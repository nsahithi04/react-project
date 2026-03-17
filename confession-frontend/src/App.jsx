import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Form from "./pages/form";
import Otp from "./pages/verifyOtp";
import Home from "./pages/home";
import Profile from "./pages/Profile";
import { ViewConfessions, AddConfession } from "./pages/home";

const router = createBrowserRouter([
  { path: "/", element: <Form /> },
  { path: "/otp", element: <Otp /> },
  {
    path: "/home",
    element: <Home />,
    children: [
      { index: true, element: <ViewConfessions /> },
      { path: "add", element: <AddConfession /> },
    ],
  },
  { path: "/profile", element: <Profile /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
