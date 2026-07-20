
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactMarkdown from "react-markdown";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { uploadDocument } from "../redux/documentAction";

const BASE_URL = "http://192.168.86.27:8000";

export default function Gpt() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hey! How can I help you?" },
  ]);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [userInfo, setUserInfo] = useState({ username: "", email: "" });
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [answerStyle, setAnswerStyle] = useState("normal");

  // ✅ File Upload State
  const [attachedFile, setAttachedFile] = useState(null);

  // ✅ Redux stored document data
  const { id, doc_type, structured_data } = useSelector(
    (state) => state.document
  );

  const dispatch = useDispatch();
  const router = useRouter();

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const controllerRef = useRef(null);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, structured_data]);

  // Auth check & load profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
    else {
      fetchProfileImage(token);
      fetchAllSessions();
    }
  }, [router]);









//search
useEffect(() => {
  const delayDebounce = setTimeout(() => {
    const query = searchText.trim();

    // If less than 3 characters → clear results
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    handleSearch(query);
  }, 400); // 400ms debounce

  return () => clearTimeout(delayDebounce);
}, [searchText]);















  const fetchProfileImage = async (token) => {
    try {
      const res = await axios.get(`${BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.profileImage) setProfileImage(res.data.profileImage);
      setUserInfo({
        username: res.data.username || "",
        email: res.data.email || "",
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const fetchAllSessions = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${BASE_URL}/user/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    }
  };

  // ====== FILE UPLOAD HANDLERS ======
  const handleDocClick = () => {
    fileInputRef.current?.click();
  };

  const handleDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAttachedFile(file);

    try {
      const result = await dispatch(uploadDocument(file));

      if (result?.structured_data) {
        alert("Document processed successfully!");
        // ✅ Structured data will now render automatically
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("File upload failed.");
    }

    e.target.value = null; // clear input
  };

  // ====== CHAT HANDLERS ======
  const handleAsk = async () => {
    if (!question.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    const userQuestion = question;

    setMessages((prev) => [
      ...prev,
      { type: "user", text: userQuestion },
      { type: "bot", text: "" },
    ]);

    setQuestion("");
    setLoading(true);

    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();

    try {
      const response = await fetch(`${BASE_URL}/user/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: userQuestion,
          sessionId,
          style: answerStyle,
        }),
        signal: controllerRef.current.signal,
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);


const newSessionId=response.headers.get("X-Session-Id");
if(newSessionId&&newSessionId!==sessionId){
  setSessionId(newSessionId);
  localStorage.setItem("sessionId",newSessionId);
}


      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].text = fullText;
        return updated;
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: "Error receiving response. Please try again." },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const stopCurrentResponse = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAsk();
  };










const loadStoredChat = async (session) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post(`${BASE_URL}/user/session/${session.id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data?.messages) {
      setMessages(res.data.messages); // load stored messages
      setSessionId(session.id); // set current session
      localStorage.setItem("sessionId", session.id);
    }
  } catch (err) {
    console.error("Failed to load stored chat:", err);
    alert("Could not load stored chat.");
  }
};









const handleDeleteSession = async (id) => {
  const token = localStorage.getItem("token");
 if (!token) return router.push("/login");

 const confirmDelete = window.confirm("Are you sure you want to delete this session?");
  if (!confirmDelete) return;

 try {
    await axios.delete(`${BASE_URL}/user/session/${id}`, {
   headers: { Authorization: `Bearer ${token}` },
  });

   // Remove from frontend
    setSessions((prev) => prev.filter((session) => session.id !== id));

  //If currently opened session is deleted
   if (sessionId === id) {
      setSessionId(null);
      setMessages([{ type: "bot", text: "Session deleted." }]);
   }

   } catch (err) {
    console.error("Failed to delete session:", err);
        alert("Failed to delete session.");
  }
 };


//search

const handleSearch = async (query) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    setSearchLoading(true);

    const res = await axios.get(
      `${BASE_URL}/user/search?query=${encodeURIComponent(query)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setSearchResults(res.data || []);
  } catch (err) {
    console.error("Search failed:", err);
  } finally {
    setSearchLoading(false);
  }
};



















  // ====== UI ======
  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3 h-100" style={{ width: "300px" }}>
        <h5>Your Chats</h5>
        <button
          className="btn btn-sm btn-light w-100 mb-3"
          onClick={() =>
            setMessages([{ type: "bot", text: "New chat started!" }])
          }
        >
          + New Chat
        </button>
        <hr />
        <input
          type="text"
          className="form-control form-control-sm mb-2"
          placeholder="Search chats..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          className="btn btn-sm btn-warning w-100 mb-3"
          onClick={() => {}}
        >
          🔍 Search Chat
        </button>

       {/* {sessions.map((session) => (
          <div
            key={session.id}
            className="p-2 mb-2 rounded bg-secondary"
            style={{ cursor: "pointer" }}
          >
            {session.firstQuestion || "New Chat"}
          </div>
        ))}
       */}





  <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 350px)" }}>



{sessions.map((session) => (
  <div
    key={session.id}
    className="p-2 mb-2 rounded bg-secondary  d-flex justify-content-between align-items-center"
    style={{ cursor: "pointer" }}
    onClick={() => loadStoredChat(session)} // ✅ click loads stored chat
  >
   <span>{session.firstQuestion || "New Chat"}</span>


<button
  className="btn btn-sm btn-danger"
    onClick={(e) => {
      e.stopPropagation(); // prevent opening chat
       handleDeleteSession(session.id);
     }}
     >
       ❌
     </button>



  </div>
))}







{/*{searchLoading ? (
  <div className="text-center mt-2">Searching...</div>

) : (searchText.trim().length >= 3
    ? searchResults
    : sessions
  ).length === 0 ? (

  <div className="text-center text-muted mt-3">
    {searchText.trim().length >= 3
      ? "No chats found"
      : "No chats available"}
  </div>

) : (

  (searchText.trim().length >= 3
    ? searchResults
    : sessions
  ).map((session) => (
    <div
      key={session.id}
      className="p-2 mb-2 rounded bg-secondary d-flex justify-content-between align-items-center"
      style={{ cursor: "pointer" }}
      onClick={() => loadStoredChat(session)} // ✅ loads chat
    >
      <span>{session.firstQuestion || "New Chat"}</span>

      <button
        className="btn btn-sm btn-danger"
        onClick={(e) => {
          e.stopPropagation(); // prevent opening chat
          handleDeleteSession(session.id);
        }}
      >
        ❌
      </button>
    </div>
  ))
)}*/}








</div>








        <div
          className="pt-2 mt-2 border-top text-muted"
          style={{ fontSize: "0.85rem" }}
        >
          <div style={{ color: "white" }}>
            <strong>Username:</strong> {userInfo.username}
          </div>
          <div style={{ color: "white" }}>
            <strong>Email:</strong> {userInfo.email}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow-1 d-flex flex-column bg-light text-dark">
        <nav className="navbar shadow-sm justify-content-between px-3 bg-white">
          <div className="d-flex align-items-center">
            <img
              src="/chatgpt.png"
              alt="Logo"
              style={{ width: 30, height: 30, marginRight: 8 }}
            />
            <h4 className="mb-0">ChatBot</h4>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle overflow-hidden"
              style={{ width: 40, height: 40, cursor: "pointer" }}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div className="d-flex align-items-center justify-content-center bg-secondary text-white" style={{ width: "100%", height: "100%" }}>
                  👤
                </div>
              )}
            </div>


<button
    className="btn btn-sm btn-outline-danger"
    onClick={() => {
      localStorage.removeItem("token");
      localStorage.removeItem("sessionId");
      router.push("/login");
    }}
  >
    Logout
  </button>




          </div>
        </nav>

        {/* Chat messages */}
        <div className="flex-grow-1 overflow-auto p-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 ${msg.type === "user" ? "text-end" : "text-start"}`}
            >
              <span
                className={`px-3 py-2 rounded d-inline-block ${
                  msg.type === "user" ? "bg-primary text-white" : "bg-secondary text-white"
                }`}
                style={{ maxWidth: "70%" }}
              >
                {msg.type === "bot" ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
              </span>
            </div>
          ))}

          {/* Structured Document Display */}
          {structured_data && (
            <div className="mt-4 p-3 border rounded bg-white text-dark d-flex align-items-center gap-2">



  <div style={{ fontSize: 30 }}>
      {attachedFile.type.startsWith("image/")
        ? "🖼️"
        : attachedFile.type === "application/pdf"
        ? "📄"
        : "📎"}
    </div>



<div>
              <h5>Document Type: {doc_type}</h5>
              <pre>{JSON.stringify(structured_data, null, 2)}</pre>
            </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input + Upload */}
        <div className="border-top p-3 bg-white d-flex gap-2 align-items-center">
          <input
            type="text"
            className="form-control"
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* Upload button inside input label */}
          <label
            htmlFor="file-upload"
            className="btn btn-success mb-0"
            style={{ cursor: "pointer" }}
          >
            📎
          </label>
          <input
            id="file-upload"
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".pdf,.doc,.docx,.txt,image/*"
            onChange={handleDocUpload}
          />

          {loading ? (
            <button className="btn btn-danger" onClick={stopCurrentResponse}>
              Stop
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleAsk}>
              Ask
            </button>
          )}
        </div>
      </div>
    </div>
  );
}