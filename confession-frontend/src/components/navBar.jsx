import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Nav() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const name = useSelector((state) => state.user.name);
  const phone = useSelector((state) => state.user.phone);

  return (
    <div className="flex justify-between items-center bg-black text-white py-5 px-10">
      <h1
        className="text-2xl font-semibold cursor-pointer"
        onClick={() => navigate("/home")}
      >
        Welcome {name}
      </h1>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1"
        stroke="currentColor"
        className="size-10"
        onClick={() => navigate("/Profile")}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    </div>
  );
}

export default Nav;
