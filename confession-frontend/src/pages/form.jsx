import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { setUser } from "../store/userSlice";

function Form() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      let userCredential;

      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password,
        );

        // Fetch name from MongoDB
        const res = await fetch(
          `${process.env.API_URL}/users/${userCredential.user.uid}`,
        );
        const data = await res.json();

        dispatch(
          setUser({
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            name: data.name || "",
          }),
        );
      } else {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password,
        );

        // Save to MongoDB
        await fetch(`${process.env.API_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: userCredential.user.uid,
            name: formData.name,
            email: userCredential.user.email,
          }),
        });

        dispatch(
          setUser({
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            name: formData.name,
          }),
        );
      }

      navigate("/home");
    } catch (error) {
      console.error(error.code);
      if (error.code === "auth/invalid-credential")
        setError("Invalid email or password");
      else if (error.code === "auth/email-already-in-use")
        setError("Email already in use");
      else if (error.code === "auth/weak-password")
        setError("Password must be at least 6 characters");
      else if (error.code === "auth/invalid-email")
        setError("Invalid email address");
      else if (error.code === "auth/too-many-requests")
        setError("Too many attempts. Please try again later.");
      else setError("Something went wrong");
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="grid items-center justify-center gap-20 p-30">
        <h1 className="text-7xl font-semibold text-center">Confession App</h1>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 w-100 justify-self-center"
        >
          <div className={isLogin ? "hidden" : "block"}>
            <p className="p-2">Name</p>
            <input
              name="name"
              className="border border-white  p-4 rounded-lg text-xl bg-transparent text-white w-full"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <p className="p-2">Email</p>
            <input
              name="email"
              className="border border-white  p-4 rounded-lg text-xl bg-transparent text-white w-full"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <p className="p-2">Password</p>
            <div className="relative">
              <input
                name="password"
                className="border border-white p-4 rounded-lg text-xl bg-transparent text-white w-full"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className={isLogin ? "hidden" : "block"}>
            <p className="p-2">Re-enter Password</p>
            <div className="relative">
              <input
                name="confirmPassword"
                className="border border-white p-4 rounded-lg text-xl bg-transparent text-white w-full"
                placeholder="Re-enter password"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}

          <button
            className="justify-self-center mt-10 text-xl py-3 px-20 w-fit border rounded-lg hover:bg-white hover:text-black"
            type="submit"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
          <p
            className="text-gray-400 text-center text-sm cursor-pointer hover:text-white"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
              });
            }}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </p>
        </form>
      </div>
    </div>
  );
}

export default Form;
