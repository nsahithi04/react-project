import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setOtp, setOtpError } from "./store/userSlice";
import { useNavigate } from "react-router-dom";

function Otp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const otp = useSelector((state) => state.user.otp);
  const otpError = useSelector((state) => state.user.otpError);

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending OTP:", otp);

      const response = await fetch(`${process.env.API_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();
      console.log(data); // check this in console

      if (data.success) {
        dispatch(setOtpError(""));
        navigate("/home");
      } else {
        dispatch(setOtpError("Invalid OTP"));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white flex items-center justify-center">
      <form onSubmit={handleVerify} className="grid gap-6">
        <div>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              dispatch(setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)))
            }
            className="border p-4 rounded"
          />
          {otpError && <p className="text-red-500">{otpError}</p>}
        </div>

        <button
          className="text-xl p-5 border rounded-lg hover:bg-white hover:text-black "
          type="submit"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
}

export default Otp;
