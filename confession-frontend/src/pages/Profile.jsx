import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser, setUser } from "../store/userSlice";
import { resetConfession } from "../store/confessionSlice";
import { persistor } from "../store/store";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = useSelector((state) => state.user.email);
  const name = useSelector((state) => state.user.name);
  const uid = useSelector((state) => state.user.uid);

  const [editing, setEditing] = useState(false);
  const [inputName, setInputName] = useState(name);

  const handleSaveName = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/users/update-name`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, name: inputName }),
      });
      const data = await response.json();
      console.log("Updated:", data);
      dispatch(setUser({ uid, email, name: inputName }));
      setEditing(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logoutUser());
    dispatch(resetConfession());
    await persistor.purge();
    await persistor.flush();
    navigate("/");
  };

  return (
    <div className="bg-black min-h-screen text-white py-20 flex justify-center items-start">
      <div className="grid gap-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1"
            stroke="currentColor"
            className="size-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
        </div>

        {/* Name — editable */}
        <div className="grid gap-2">
          <h1 className="text-lg">Name</h1>
          <div className="text-gray-400 border border-gray-600 p-3 rounded-sm w-100 flex justify-between items-center">
            {editing ? (
              <input
                className="bg-transparent text-white  flex-1"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                autoFocus
              />
            ) : (
              <p>{name}</p>
            )}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke={editing ? "white" : "currentColor"}
              className="size-6 cursor-pointer"
              onClick={editing ? handleSaveName : () => setEditing(true)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </div>
        </div>

        {/* Email — read only */}
        <div className="grid gap-2">
          <h1 className="text-lg">Email</h1>
          <div className="border border-gray-600 p-3 rounded-sm w-100">
            <p className="text-gray-400">{email}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-5 px-6 py-3 border w-fit border-gray-600 rounded-lg text-sm hover:bg-white hover:text-black transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
