import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Form from "../src/pages/form";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({ useNavigate: () => mockNavigate }));
jest.mock("../src/firebase", () => ({ auth: {} }));
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
}));

global.fetch = jest.fn();

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeStore = () => configureStore({ reducer: { user: () => ({}) } });

const renderForm = () =>
  render(
    <Provider store={makeStore()}>
      <Form />
    </Provider>,
  );

const fillForm = ({
  email = "",
  password = "",
  name = "",
  confirmPassword = "",
} = {}) => {
  if (email)
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { name: "email", value: email },
    });
  if (password)
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { name: "password", value: password },
    });
  if (name)
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { name: "name", value: name },
    });
  if (confirmPassword)
    fireEvent.change(screen.getByPlaceholderText("Re-enter password"), {
      target: { name: "confirmPassword", value: confirmPassword },
    });
};

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch.mockReset();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Form", () => {
  // -- rendering --

  it("renders the app title", () => {
    renderForm();
    expect(screen.getByText("Confession App")).toBeInTheDocument();
  });

  it("shows Login button by default", () => {
    renderForm();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("shows Email and Password fields by default", () => {
    renderForm();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  // -- show/hide password --

  it("toggles password visibility", () => {
    renderForm();
    const passwordInput = screen.getByPlaceholderText("Password");
    const showButtons = screen.getAllByRole("button", { name: "Show" });

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(showButtons[0]); // click the first Show button
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(screen.getAllByRole("button", { name: "Hide" })[0]);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  // -- switching modes --

  it("switches to Sign Up mode when toggle is clicked", () => {
    renderForm();
    fireEvent.click(screen.getByText("Don't have an account? Sign up"));
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  it("clears fields when switching modes", () => {
    renderForm();
    fillForm({ email: "test@test.com", password: "123456" });
    fireEvent.click(screen.getByText("Don't have an account? Sign up"));
    expect(screen.getByPlaceholderText("Email").value).toBe("");
    expect(screen.getByPlaceholderText("Password").value).toBe("");
  });

  it("switches back to Login mode from Sign Up", () => {
    renderForm();
    fireEvent.click(screen.getByText("Don't have an account? Sign up"));
    fireEvent.click(screen.getByText("Already have an account? Login"));
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  // -- login --

  it("calls signInWithEmailAndPassword with correct values", async () => {
    signInWithEmailAndPassword.mockResolvedValue({
      user: { uid: "uid1", email: "test@test.com" },
    });
    global.fetch.mockResolvedValue({ json: async () => ({ name: "Alice" }) });

    renderForm();
    fillForm({ email: "test@test.com", password: "123456" });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() =>
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        "test@test.com",
        "123456",
      ),
    );
  });

  it("navigates to /home after successful login", async () => {
    signInWithEmailAndPassword.mockResolvedValue({
      user: { uid: "uid1", email: "test@test.com" },
    });
    global.fetch.mockResolvedValue({ json: async () => ({ name: "Alice" }) });

    renderForm();
    fillForm({ email: "test@test.com", password: "123456" });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/home"));
  });

  // -- login errors --

  it("shows error for invalid credentials", async () => {
    signInWithEmailAndPassword.mockRejectedValue({
      code: "auth/invalid-credential",
    });

    renderForm();
    fillForm({ email: "wrong@test.com", password: "wrongpass" });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() =>
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument(),
    );
  });

  it("shows error for invalid email format", async () => {
    signInWithEmailAndPassword.mockRejectedValue({
      code: "auth/invalid-email",
    });

    renderForm();
    fillForm({ email: "notanemail", password: "123456" });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() =>
      expect(screen.getByText("Invalid email address")).toBeInTheDocument(),
    );
  });

  it("shows error for too many requests", async () => {
    signInWithEmailAndPassword.mockRejectedValue({
      code: "auth/too-many-requests",
    });

    renderForm();
    fillForm({ email: "test@test.com", password: "123456" });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() =>
      expect(
        screen.getByText("Too many attempts. Please try again later."),
      ).toBeInTheDocument(),
    );
  });

  it("shows generic error for unknown error codes", async () => {
    signInWithEmailAndPassword.mockRejectedValue({ code: "auth/unknown" });

    renderForm();
    fillForm({ email: "test@test.com", password: "123456" });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() =>
      expect(screen.getByText("Something went wrong")).toBeInTheDocument(),
    );
  });

  // -- sign up --

  it("shows error when passwords do not match", async () => {
    renderForm();
    fireEvent.click(screen.getByText("Don't have an account? Sign up"));
    fillForm({
      email: "test@test.com",
      password: "123456",
      name: "Alice",
      confirmPassword: "999999",
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() =>
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument(),
    );
  });

  it("calls createUserWithEmailAndPassword on valid sign up", async () => {
    createUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: "uid2", email: "new@test.com" },
    });
    global.fetch.mockResolvedValue({ json: async () => ({}) });

    renderForm();
    fireEvent.click(screen.getByText("Don't have an account? Sign up"));
    fillForm({
      email: "new@test.com",
      password: "123456",
      name: "Alice",
      confirmPassword: "123456",
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() =>
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        "new@test.com",
        "123456",
      ),
    );
  });

  it("shows error for email already in use", async () => {
    createUserWithEmailAndPassword.mockRejectedValue({
      code: "auth/email-already-in-use",
    });

    renderForm();
    fireEvent.click(screen.getByText("Don't have an account? Sign up"));
    fillForm({
      email: "taken@test.com",
      password: "123456",
      name: "Alice",
      confirmPassword: "123456",
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() =>
      expect(screen.getByText("Email already in use")).toBeInTheDocument(),
    );
  });

  it("shows error for weak password", async () => {
    createUserWithEmailAndPassword.mockRejectedValue({
      code: "auth/weak-password",
    });

    renderForm();
    fireEvent.click(screen.getByText("Don't have an account? Sign up"));
    fillForm({
      email: "new@test.com",
      password: "123",
      name: "Alice",
      confirmPassword: "123",
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() =>
      expect(
        screen.getByText("Password must be at least 6 characters"),
      ).toBeInTheDocument(),
    );
  });
});
