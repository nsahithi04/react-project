import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "./store/userSlice";
import { resetConfession } from "./store/confessionSlice";
import { persistor } from "./store/store";

function Nav() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const name = useSelector((state) => state.user.name);
  const phone = useSelector((state) => state.user.phone);

  const handleLogout = async () => {
    dispatch(logoutUser());
    dispatch(resetConfession());
    await persistor.purge();
    await persistor.flush();
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-4xl font-semibold">Welcome {name}</h1>
      <button
        onClick={handleLogout}
        className="py-2 px-4 border border-gray-600 rounded-lg text-sm hover:bg-white hover:text-black transition-all"
      >
        Logout
      </button>
    </div>
  );
}

export default Nav;
