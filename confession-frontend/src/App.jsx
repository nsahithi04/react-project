import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Form from "./form";
import Otp from "./verifyOtp";
import Home from "./home";
import { ViewConfessions, AddConfession } from "./home";

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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
