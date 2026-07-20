













"use client";

import React from "react";
import { useEffect,useState,useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactMarkdown from "react-markdown";
import styles from "./styles.module.css";



const BASE_URL = "http://192.168.86.30:9000";
export default function Bot(){
const[question,setQuestion]=useState("");
const [messages,setMessages]=useState([
  {type:"bot",text:"Hey! how can i help you"}
])
const [loading,setLoading]=useState();
const [profileImage,setProfileImage]=useState(null);
//
const[sessionId,setSessionId]=useState(null);
const [sessions, setSessions] = useState([]);
///
const [userInfo, setUserInfo] = useState({ username: "", email: "" });
//const [sessionTitles, setSessionTitles] = useState({});
/* ===== SEARCH ADDITION START ===== */
const [searchText, setSearchText] = useState("");

 const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [answerStyle, setAnswerStyle] = useState("normal");
  const [liveStream, setLiveStream] = useState("");//new



/* ===== SEARCH ADDITION END ===== */



 
const fileInputRef=useRef(null);
const router=useRouter();
const chatEndRef=useRef(null);

//new load







useEffect(()=>{
  const token=localStorage.getItem("token");
  if(!token){
    router.push("/login");
  }
  else{
    fetchProfileImage(token);
    fetchAllSessions();
    
    
  }
},[router]);
useEffect(()=>{
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
},[messages,liveStream]);//new




useEffect(() => {
    if (searchText.length >= 3) {
      setSearchLoading(true);
      const filtered = sessions.filter((session) =>
        session.firstQuestion?.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchResults(filtered);
      setSearchLoading(false);
    } else {
      setSearchResults([]);
    }
  }, [searchText, sessions])






const fetchProfileImage=async(token)=>{
  try{
const res=await axios.get(`${BASE_URL}/profile`,{
  headers: { Authorization: `Bearer ${token}` },
})
if(res.data.profileImage) setProfileImage(res.data.profileImage);
///
setUserInfo({
        username: res.data.username || "",
        email: res.data.email || "",
      }); 



  }
  catch (err) {
      console.error("Failed to fetch profile:", err);
    }
}

 const handleProfileClick = () => fileInputRef.current.click();

const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(URL.createObjectURL(file)); // preview

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${BASE_URL}/user/image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.profileImage)
        setProfileImage(`${res.data.profileImage}?t=${Date.now()}`);
      alert("Profile image uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Try again.");
    }
  };

 const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

//


const fetchChatHistory=async(session_id)=>{
  const token=localStorage.getItem("token");
  if(!token) return router.push("/login");
  try{
    const res=await axios.get(`${BASE_URL}/user/chathistory/${session_id}`,
      {
         headers: { Authorization: `Bearer ${token}` },
      }

    );
    if(res.data.messages){
     setMessages(
      res.data.messages.map((m) => ({
            type: m.role === "user" ? "user" : "bot",
            text: m.message,
          }))
     );
     setSessionId(res.data.session_id);



///new///



    }

  }
  catch(err){
    console.error("Failed to fetch chat history:", err);
      setMessages([{ type: "bot", text: "Failed to load chat history." }]);
  }
}







/* ===== ADDITION START: DELETE SESSION FUNCTION ===== */
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

    // If currently opened session is deleted
    if (sessionId === id) {
      setSessionId(null);
      setMessages([{ type: "bot", text: "Session deleted." }]);
    }

  } catch (err) {
    console.error("Failed to delete session:", err);
    alert("Failed to delete session.");
  }
};
/* ===== ADDITION END ===== */







const handleNewChat = () => {
    setSessionId(null);
    setMessages([{ type: "bot", text: "New chat started!" }]);
  };

/*const handleAsk=async()=>{
  if(!question.trim()) return;
  const token=localStorage.getItem("token");
  if(!token){
    router.push("/login");
    return;
  }
  const userQuestion=question;
  setMessages((prev)=>[
    ...prev,
    {type:"user",text:userQuestion},
  ])
  setQuestion("");
  setLoading(true);
  try{
    const response = await axios.post(
        `${BASE_URL}/user/ask`,
        { question:userQuestion,sessionId,style:answerStyle},//new
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      
      setMessages((prev)=>[
        ...prev,{type:"bot",text:response.data.answer||"No response from backend",},
      ]);

// ======== UPDATE SESSION ID FROM BACKEND (START) ========
      if (response.data.sessionId) {
        
const newSession = response.data.sessionId;

        setSessionId(newSession);

      if (!sessions.includes(newSession)) {
          setSessions((prev) => [...prev, newSession]);
        }

        
          
      

if (!sessions.some((s) => s.id === newSession)) {
        setSessions((prev) => [
          ...prev,
          {
            id: newSession,
            firstQuestion: userQuestion,
          },
        ]);
      }




      }



  }
  catch(error){
    if (error.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
    }

    else {
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: "Backend error. Please try again." },
        ]);
      }

  }
  finally{
    setLoading(false);
  }

};*/




 // ================= HANDLE ASK =================
  const handleAsk = async () => {
    if (!question.trim()) return;
/* ===== AUTO STOP ADDITION START ===== */
  


    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const userQuestion = question;

    setMessages((prev) => [
      ...prev,
      { type: "user", text: userQuestion },
      { type: "bot", text: "" },
    ]);

    setQuestion("");
    setLoading(true);
    setLiveStream("");

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
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      if (!response.body) throw new Error("No response body from backend");

      const newSessionId = response.headers.get("X-Session-Id");
      if (!sessionId && newSessionId) {
        setSessionId(newSessionId);

      setSessions((prev) => {
    if (!prev.some((s) => s.id === newSessionId)) {
      return [
        ...prev,
        {
          id: newSessionId,
          firstQuestion: userQuestion,
        },
      ];
    }
    return prev;
  });
}


      // 🔴 LIVE STREAM START

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;
      let buffer = "";
      const flushInterval = 25;
      let lastFlush = Date.now();

      while (!done) {//load
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          buffer += decoder.decode(value, { stream: true });

          if (Date.now() - lastFlush > flushInterval) {
            setLiveStream(buffer + "|");
            lastFlush = Date.now();
          }
        }
      }

     setLiveStream(buffer);









      // 🔴 LIVE STREAM END

     /* setMessages((prev) => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        newMessages[lastIndex].text = buffer;
        return newMessages;
      });*/






// 🔥 TYPEWRITER EFFECT (Character by Character)

let i = 0;
let currentText = "";

const typingInterval = setInterval(() => {
  if (i < buffer.length) {//new load
    currentText += buffer[i];
    setLiveStream(currentText + "▌");  // cursor effect
    i++;
  } else {
    clearInterval(typingInterval);//typingInterval

    // Final text without cursor
    setLiveStream("");

    setMessages((prev) => {
      const newMessages = [...prev];
      const lastIndex = newMessages.length - 1;
      newMessages[lastIndex].text = buffer;
      return newMessages;
    });
  }
}, 25); // 🔧 Change this number to control speed









    } catch (error) {
      console.error("Streaming error:", error);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Error receiving response. Please try again." },
      ]);
    } finally {
      setLoading(false);
      setLiveStream("");
    }
  };










const handleKeyDown=(e)=>{
  if(e.key==="Enter"){
    e.preventDefault();
      handleAsk();
  }
}




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








//search
const handleSearchChat = () => {
  if (!searchText.trim()) return;

  const foundSession = sessions.find((session) =>
    session.firstQuestion
      ?.toLowerCase()
      .includes(searchText.toLowerCase())
  );

  if (foundSession) {
    fetchChatHistory(foundSession.id);
  } else {
    alert("No matching chat found");
  }
};
/* ===== SEARCH ADDITION END ===== */







//DESIGNING PART
  return(

   <div className="d-flex vh-100">

      
      <div className="bg-dark text-white p-3 h-100" style={{ width: "300px" }}>
        <div>
          <h5>Your Chats</h5>

          <button
            className="btn btn-sm btn-light w-100 mb-3"
            onClick={handleNewChat}
          >
            + New Chat
          </button>




<input
  type="text"
  className="form-control form-control-sm mb-2"
  placeholder="Search chats..."
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
/>

<button
  className="btn btn-sm btn-warning w-100 mb-3"
  onClick={handleSearchChat}
>
  🔍 Search Chat
</button>







{searchLoading && <div>Loading...</div>}
          {searchResults.length > 0 && searchText.length >= 3 && (
            <div className="mb-3">
              <strong>Matching chats:</strong>
              {searchResults.map((session) => (
                <div
                  key={session.id}
                  className={`${styles.sessionItem} p-2 mb-2 rounded bg-secondary`}
                  style={{ cursor: "pointer" }}
                  onClick={() => fetchChatHistory(session.id)}
                >
                  {session.firstQuestion.length > 40
                    ? session.firstQuestion.substring(0, 40) + "..."
                    : session.firstQuestion}
                </div>
              ))}
            </div>
          )}




        </div>
        <div style={{
    height: "calc(100% - 250px)",
    overflow: "auto",
    paddingRight: "8px",
  }}>
        {sessions.map((session,index) => (
          <div
            key={session?.id||index}
            className={`${styles.sessionItem} p-2 mb-2 rounded ${
              sessionId === session?.id ? "bg-primary" : "bg-secondary"
            }   d-flex justify-content-between align-items-center`}
            style={{ cursor: "pointer" }}
            onClick={() => fetchChatHistory(session?.id)}
          >
            

{(session?.firstQuestion || "New Chat").length > 40
      ? (session.firstQuestion || "New Chat").substring(0, 40) + "..."
      : session?.firstQuestion || "New Chat"}
            <br />
            


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
        </div>



 
          <div className="pt-2 mt-2 border-top text-muted"
          style={{ fontSize: "0.85rem" }}>
        
          <div style={{color:"white"}}>
            <strong>Username:</strong> {userInfo.username}
          </div>
          <div style={{color:"white"}}>
            <strong>Email:</strong> {userInfo.email}
          </div>
        </div>

</div>

      

      
      <div className="flex-grow-1 d-flex flex-column bg-light">

        
        <nav className="navbar bg-white shadow-sm justify-content-between px-3">
<div className="d-flex align-items-center">
<img
      src="/chatgpt.png"          // path to your image
      alt="Logo"
      style={{ width: 30, height: 30, marginRight: 8 }}
    />

          <h4 className="mb-0">ChatBot</h4>

<div className="ms-3">
              <select
                className="form-select form-select-sm"
                value={answerStyle}
                onChange={(e) => setAnswerStyle(e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="concise">Concise</option>
                <option value="detailed">Detailed</option>
                <option value="casual">Casual</option>
                <option value="technical">Technical</option>
              </select>
            </div>




          </div>
          

          <div className="d-flex align-items-center gap-2">

            

            <div
              className="rounded-circle overflow-hidden"
              style={{ width: 40, height: 40, cursor: "pointer" }}
              onClick={handleProfileClick}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center bg-secondary text-white"
                  style={{ width: "100%", height: "100%" }}
                >
                  👤
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />

            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        </nav>

        
        <div className="flex-grow-1 overflow-auto p-3">
       {/*  {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 ${
                msg.type === "user" ? "text-end" : "text-start"
              }`}
            >
              <span
                className={`px-3 py-2 rounded d-inline-block ${
                  msg.type === "user"
                    ? "bg-primary text-white"
                    : "bg-secondary text-white"
                }`}
                style={{ maxWidth: "70%" }}
              >


{msg.type === "bot" ? (
    <ReactMarkdown>{msg.text}</ReactMarkdown>
  ) : (


                msg.text
  )}
              </span>
            </div>
       ))}*/}





{messages.map((msg, i) => {
  const textToShow =
    msg.type === "bot" &&
    i === messages.length - 1 &&
    liveStream
      ? liveStream
      : msg.text;

  return (
    <div
      key={i}
      className={`mb-2 ${
        msg.type === "user" ? "text-end" : "text-start"
      }`}
    >
      <span
        className={`px-3 py-2 rounded d-inline-block ${
          msg.type === "user"
            ? "bg-primary text-white"
            : "bg-secondary text-white"
        }`}
        style={{ maxWidth: "70%" }}
      >
        {msg.type === "bot" ? (
          <ReactMarkdown>{textToShow}</ReactMarkdown>  
        ) : (
          textToShow
        )}
      </span>
    </div>
  );
})}




    <div ref={chatEndRef}></div>
        </div>

        
        <div className="border-top p-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="btn btn-primary"
              onClick={handleAsk}
              disabled={loading}
            >
              {loading ? "..." : "Ask"}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}




















