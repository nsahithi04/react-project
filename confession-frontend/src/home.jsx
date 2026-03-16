import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Nav from "./navBar";
import { NavLink, Outlet, useOutletContext } from "react-router-dom";
import {
  setTitle,
  setDescription,
  setReceiverPhone,
  setTitleError,
  setDescriptionError,
  setReceiverPhoneError,
  resetConfession,
} from "./store/confessionSlice";

export function ViewConfessions() {
  const { phone } = useOutletContext();
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConfessions = async () => {
      try {
        const response = await fetch(
          `${process.env.API_URL}/confessions/${phone}`,
        );
        const data = await response.json();
        setConfessions(data.data);
      } catch (err) {
        setError("Failed to load confessions");
      } finally {
        setLoading(false);
      }
    };
    fetchConfessions();
  }, [phone]);

  if (loading) return <p className="text-gray-400 text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (confessions.length === 0)
    return <p className="text-gray-400 text-center">No confessions yet.</p>;

  return (
    <div className="grid gap-4">
      {confessions.map((c) => (
        <div
          key={c._id}
          className="border border-gray-700 rounded-xl p-5 grid gap-2"
        >
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">{c.title}</p>
            <p className="text-xs text-gray-500">
              {new Date(c.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <p className="text-gray-300">{c.description}</p>
        </div>
      ))}
    </div>
  );
}

export function AddConfession() {
  const dispatch = useDispatch();
  const {
    title,
    description,
    receiverPhone,
    titleError,
    descriptionError,
    receiverPhoneError,
  } = useSelector((state) => state.confession);
  const senderPhone = useSelector((state) => state.user.phone);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;

    if (!title) {
      dispatch(setTitleError("Title is required"));
      valid = false;
    } else {
      dispatch(setTitleError(""));
    }

    if (!description) {
      dispatch(setDescriptionError("Description is required"));
      valid = false;
    } else {
      dispatch(setDescriptionError(""));
    }

    if (!receiverPhone) {
      dispatch(setReceiverPhoneError("Receiver phone is required"));
      valid = false;
    } else if (receiverPhone.length !== 10) {
      dispatch(setReceiverPhoneError("Phone must be 10 digits"));
      valid = false;
    } else {
      dispatch(setReceiverPhoneError(""));
    }

    if (!valid) return;

    try {
      const response = await fetch(`${process.env.API_URL}/confessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          receiverPhone,
          senderPhone,
        }),
      });
      const data = await response.json();
      console.log("Confession sent:", data);
      dispatch(resetConfession());
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <input
          className="border p-4 rounded-lg bg-transparent text-white w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => dispatch(setTitle(e.target.value))}
        />
        {titleError && (
          <p className="text-red-500 text-sm mt-1">{titleError}</p>
        )}
      </div>

      <div>
        <textarea
          className="border p-4 rounded-lg bg-transparent text-white w-full h-40 resize-none"
          placeholder="Write your confession..."
          value={description}
          onChange={(e) => dispatch(setDescription(e.target.value))}
        />
        {descriptionError && (
          <p className="text-red-500 text-sm mt-1">{descriptionError}</p>
        )}
      </div>

      <div>
        <input
          className="border p-4 rounded-lg bg-transparent text-white w-full"
          placeholder="Receiver Phone"
          value={receiverPhone}
          onChange={(e) =>
            dispatch(
              setReceiverPhone(e.target.value.replace(/\D/g, "").slice(0, 10)),
            )
          }
        />
        {receiverPhoneError && (
          <p className="text-red-500 text-sm mt-1">{receiverPhoneError}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <button
          type="button"
          className="p-4 border rounded-lg hover:bg-white hover:text-black transition-all"
          onClick={() => dispatch(resetConfession())}
        >
          Reset
        </button>
        <button
          type="submit"
          className="p-4 border rounded-lg hover:bg-white hover:text-black transition-all"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

function Home() {
  const phone = useSelector((state) => state.user.phone);

  return (
    <div className="bg-black min-h-screen text-white p-10">
      <div className="max-w-xl mx-auto grid gap-8">
        <Nav />
        {/* Tabs */}
        <div className="flex bg-[#1a1a1a] rounded-full p-1 gap-1">
          <NavLink
            to="/home"
            end
            className={({ isActive }) =>
              `flex-1 py-2 px-4 rounded-full text-sm font-medium text-center transition-all
              ${isActive ? "bg-white text-black" : "text-gray-400 hover:text-white"}`
            }
          >
            View Confessions
          </NavLink>
          <NavLink
            to="/home/add"
            className={({ isActive }) =>
              `flex-1 py-2 px-4 rounded-full text-sm font-medium text-center transition-all
              ${isActive ? "bg-white text-black" : "text-gray-400 hover:text-white"}`
            }
          >
            Add Confession
          </NavLink>
        </div>

        <Outlet context={{ phone }} />
      </div>
    </div>
  );
}

export default Home;
