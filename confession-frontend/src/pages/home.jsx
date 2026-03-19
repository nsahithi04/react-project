import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Nav from "../components/navBar";
import { NavLink, Outlet, useOutletContext } from "react-router-dom";
import {
  setTitle,
  setDescription,
  setReceiverEmail,
  setTitleError,
  setDescriptionError,
  setReceiverEmailError,
  resetConfession,
} from "../store/confessionSlice";

export function ViewConfessions() {
  const { email } = useOutletContext();
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConfessions = async () => {
      try {
        const response = await fetch(
          `${process.env.API_URL}/confessions/${email}`,
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
  }, [email]);

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

export function SentConfessions() {
  const { email } = useOutletContext();
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConfessions = async () => {
      try {
        const response = await fetch(
          `${process.env.API_URL}/sent-confessions/${email}`,
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
  }, [email]);

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
            <div className="text-xs text-gray-500 text-end">
              <p>
                {new Date(c.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="pt-2">{c.receiverEmail}</p>
            </div>
          </div>

          <p className="text-gray-300">{c.description}</p>
        </div>
      ))}
    </div>
  );
}

export function AddConfession() {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    title,
    description,
    receiverEmail,
    titleError,
    descriptionError,
    receiverEmailError,
  } = useSelector((state) => state.confession);
  const senderEmail = useSelector((state) => state.user.email);

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

    if (!receiverEmail) {
      dispatch(setReceiverEmailError("Receiver email is required"));
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(receiverEmail)) {
      dispatch(setReceiverEmailError("Invalid email address"));
      valid = false;
    } else {
      dispatch(setReceiverEmailError(""));
    }

    if (!valid) return;

    try {
      const response = await fetch(`${process.env.API_URL}/confessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          receiverEmail,
          senderEmail,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to send confession");
        return;
      }

      console.log("Confession sent:", data);
      dispatch(resetConfession());
      setSuccess("Confession sent successfully!");
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
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
            placeholder="Receiver Email"
            value={receiverEmail}
            onChange={(e) => dispatch(setReceiverEmail(e.target.value))}
          />
          {receiverEmailError && (
            <p className="text-red-500 text-sm mt-1">{receiverEmailError}</p>
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
    </div>
  );
}

function Home() {
  const email = useSelector((state) => state.user.email);

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <Nav />

      <div className="w-[70%] mx-auto py-10 flex-shrink-0">
        <div className="flex bg-[#1a1a1a] rounded-full p-1 gap-1">
          <NavLink
            to="/home"
            end
            className={({ isActive }) =>
              `flex-1 flex px-6 py-3 text-center items-center justify-center rounded-full text-sm font-medium transition-all
                ${isActive ? "bg-white text-black" : "text-gray-400 hover:text-white"}`
            }
          >
            View Confessions
          </NavLink>
          <NavLink
            to="/home/add"
            className={({ isActive }) =>
              `flex-1 flex px-6 py-3 text-center items-center justify-center rounded-full text-sm font-medium transition-all
              ${isActive ? "bg-white text-black" : "text-gray-400 hover:text-white"}`
            }
          >
            Add Confession
          </NavLink>
          <NavLink
            to="/home/sent"
            className={({ isActive }) =>
              `flex-1 flex px-6 py-3 text-center items-center justify-center rounded-full text-sm font-medium transition-all
                ${isActive ? "bg-white text-black" : "text-gray-400 hover:text-white"}`
            }
          >
            Sent Confession
          </NavLink>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="w-[60%] mx-auto py-6 grid gap-8">
          <Outlet context={{ email }} />
        </div>
      </div>
    </div>
  );
}

export default Home;
