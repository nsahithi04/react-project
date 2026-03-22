import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Nav from "../src/components/navBar";

// mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// minimal store with just what Nav needs
const makeStore = (name = "Alice") =>
  configureStore({
    reducer: {
      user: () => ({ name }),
    },
  });

const renderNav = (name) =>
  render(
    <Provider store={makeStore(name)}>
      <Nav />
    </Provider>,
  );

beforeEach(() => mockNavigate.mockClear());

describe("Nav", () => {
  it("displays the user name", () => {
    renderNav("Alice");
    expect(screen.getByText("Welcome Alice")).toBeInTheDocument();
  });

  it("navigates to /home when title is clicked", () => {
    renderNav();
    fireEvent.click(screen.getByText("Welcome Alice"));
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("navigates to /Profile when icon is clicked", () => {
    renderNav();
    const svg = document.querySelector("svg");
    fireEvent.click(svg);
    expect(mockNavigate).toHaveBeenCalledWith("/Profile");
  });
});
