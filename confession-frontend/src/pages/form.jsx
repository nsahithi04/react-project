import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setName,
  setPhone,
  setNameError,
  setPhoneError,
} from "../store/userSlice";

function Form() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const name = useSelector((state) => state.user.name);
  const phone = useSelector((state) => state.user.phone);
  const nameError = useSelector((state) => state.user.nameError);
  const phoneError = useSelector((state) => state.user.phoneError);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;

    if (!name) {
      dispatch(setNameError("Name is required"));
      valid = false;
    } else {
      dispatch(setNameError(""));
    }

    if (!phone) {
      dispatch(setPhoneError("Phone number is required"));
      valid = false;
    } else if (phone.length !== 10) {
      dispatch(setPhoneError("Phone must be 10 digits"));
      valid = false;
    } else {
      dispatch(setPhoneError(""));
    }

    if (!valid) return;

    const user = { name, phone };

    try {
      const response = await fetch(`${process.env.API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      console.log("Message:", data);
      dispatch(setNameError(null));
      dispatch(setPhoneError(null));
      navigate("/otp");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="grid items-center justify-center gap-20 p-30">
        <h1 className="text-7xl font-semibold text-center">Confession App</h1>

        <form
          onSubmit={handleSubmit}
          className="grid gap-10 w-fit justify-self-center"
        >
          <div>
            <input
              className="border p-5 rounded-lg text-xl"
              placeholder="Name"
              value={name}
              onChange={(e) => dispatch(setName(e.target.value))}
            />
            {nameError && <p className="text-red-500">{nameError}</p>}
          </div>
          <div>
            <input
              className="border p-5 rounded-lg text-xl"
              placeholder="Phone"
              value={phone}
              onChange={(e) =>
                dispatch(
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)),
                )
              }
            />
            {phoneError && <p className="text-red-500">{phoneError}</p>}
          </div>

          <button
            className="text-xl p-5 border rounded-lg hover:bg-white hover:text-black "
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Form;
