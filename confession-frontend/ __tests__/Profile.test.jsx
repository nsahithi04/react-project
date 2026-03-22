import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { signOut } from "firebase/auth";
import Profile from "../src/pages/Profile";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({ useNavigate: () => mockNavigate }));
jest.mock("firebase/auth", () => ({ signOut: jest.fn() }));
jest.mock("../src/firebase", () => ({ auth: {} }));
jest.mock("../src/store/store", () => ({
  persistor: {
    purge: jest.fn(() => Promise.resolve()),
    flush: jest.fn(() => Promise.resolve()),
  },
}));
jest.mock("../src/store/userSlice", () => ({
  logoutUser: () => ({ type: "user/logout" }),
  setUser: (payload) => ({ type: "user/setUser", payload }),
}));
jest.mock("../src/store/confessionSlice", () => ({
  resetConfession: () => ({ type: "confession/reset" }),
}));

global.fetch = jest.fn();

// ─── Store factory ────────────────────────────────────────────────────────────

const makeStore = (overrides = {}) =>
  configureStore({
    reducer: {
      user: () => ({
        uid: "uid1",
        email: "alice@test.com",
        name: "Alice",
        ...overrides,
      }),
    },
  });

const renderProfile = (overrides = {}) =>
  render(
    <Provider store={makeStore(overrides)}>
      <Profile />
    </Provider>,
  );

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch.mockReset();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Profile", () => {
  it("displays the user name", () => {
    renderProfile();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("displays the user email", () => {
    renderProfile();
    expect(screen.getByText("alice@test.com")).toBeInTheDocument();
  });

  it("displays Name and Email section labels", () => {
    renderProfile();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders the Logout button", () => {
    renderProfile();
    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
  });

  it("does not show input field by default", () => {
    renderProfile();
    expect(screen.queryByDisplayValue("Alice")).not.toBeInTheDocument();
  });

  it("shows input field when edit icon is clicked", () => {
    renderProfile();
    fireEvent.click(document.querySelectorAll("svg")[2]);
    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
  });

  it("pre-fills input with current name", () => {
    renderProfile({ name: "Bob" });
    fireEvent.click(document.querySelectorAll("svg")[2]);
    expect(screen.getByDisplayValue("Bob")).toBeInTheDocument();
  });

  it("updates input value as user types", () => {
    renderProfile();
    fireEvent.click(document.querySelectorAll("svg")[2]);
    fireEvent.change(screen.getByDisplayValue("Alice"), {
      target: { value: "Alice Updated" },
    });
    expect(screen.getByDisplayValue("Alice Updated")).toBeInTheDocument();
  });

  it("calls API with new name when save icon is clicked", async () => {
    global.fetch.mockResolvedValue({
      json: async () => ({ message: "Updated" }),
    });
    renderProfile();
    fireEvent.click(document.querySelectorAll("svg")[2]);
    fireEvent.change(screen.getByDisplayValue("Alice"), {
      target: { value: "Alice Updated" },
    });
    fireEvent.click(document.querySelectorAll("svg")[2]);

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/users/update-name"),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ uid: "uid1", name: "Alice Updated" }),
        }),
      ),
    );
  });

  it("hides input after saving", async () => {
    global.fetch.mockResolvedValue({
      json: async () => ({ message: "Updated" }),
    });
    renderProfile();
    fireEvent.click(document.querySelectorAll("svg")[2]);
    fireEvent.click(document.querySelectorAll("svg")[2]);
    await waitFor(() =>
      expect(screen.queryByDisplayValue("Alice")).not.toBeInTheDocument(),
    );
  });

  it("navigates to /home when back arrow is clicked", () => {
    renderProfile();
    fireEvent.click(document.querySelectorAll("svg")[1]);
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("calls signOut on logout", async () => {
    signOut.mockResolvedValue(undefined);
    renderProfile();
    fireEvent.click(screen.getByRole("button", { name: "Logout" }));
    await waitFor(() => expect(signOut).toHaveBeenCalledWith({}));
  });

  it("purges persisted store on logout", async () => {
    const { persistor } = require("../src/store/store");
    signOut.mockResolvedValue(undefined);
    renderProfile();
    fireEvent.click(screen.getByRole("button", { name: "Logout" }));
    await waitFor(() => {
      expect(persistor.purge).toHaveBeenCalled();
      expect(persistor.flush).toHaveBeenCalled();
    });
  });

  it("navigates to / after logout", async () => {
    signOut.mockResolvedValue(undefined);
    renderProfile();
    fireEvent.click(screen.getByRole("button", { name: "Logout" }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
  });
});
