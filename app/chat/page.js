
// {/*"use client";

// import React from "react";
// import { useEffect,useState,useRef } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import ReactMarkdown from "react-markdown";
// import styles from "./styles.module.css";
// import { useDispatch,useSelector } from "react-redux";
// import { uploadDocument } from "../redux/documentAction";
// import {  parseResume } from "../redux/documentAction"; // ✅ ADD THIS



// const BASE_URL = "http://192.168.86.27:8000";
// export default function Chat(){
// const[question,setQuestion]=useState("");
// const [messages,setMessages]=useState([
//   {type:"bot",text:"Hey! how can i help you"}
// ])
// const [loading,setLoading]=useState(false);//correction
// const [profileImage,setProfileImage]=useState(null);
// //
// const[sessionId,setSessionId]=useState(null);
// const [sessions, setSessions] = useState([]);
// ///
// const [userInfo, setUserInfo] = useState({ username: "", email: "" });
// //const [sessionTitles, setSessionTitles] = useState({});
// const [searchText, setSearchText] = useState("");

//  const [searchResults, setSearchResults] = useState([]);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [answerStyle, setAnswerStyle] = useState("normal");
//   //const [liveStream, setLiveStream] = useState("");
//   const [attachedFile, setAttachedFile] = useState(null); /* ===== ADDED ===== */
//   /* ===== ADDED: STORE DOCUMENT ID ===== */
// const [documentId, setDocumentId] = useState(null);
// /* ===== END ADDED ===== *///newtoday

// // ===== THEME STATE ADDED =====
// const [theme, setTheme] = useState("normal");
// // ===== END THEME STATE =====


//   //const docInputRef = useRef(null); /* ===== ADDED ===== *///new


  
// //const [resumeParsingMode, setResumeParsingMode] = useState(false);  



//  const docInputRef = useRef(null);  // ✅ ADD THIS








// // ===== RESUME FEATURE STATE =====
// const [resumeFile, setResumeFile] = useState(null);
// const [resumeData, setResumeData] = useState(null);
// const [resumeLoading, setResumeLoading] = useState(false);
// const [resumeError, setResumeError] = useState(null);
// // ===== END ===== //new













 
// const fileInputRef=useRef(null);
// const router=useRouter();
// const chatEndRef=useRef(null);

// //new load

// const controllerRef=useRef(null);
// //const typeRef=useRef(null);
// //const stopRef=useRef(false);

// const dispatch=useDispatch();//new 
// const {fileName,fileContent,documentId:reduxDocId}=useSelector( //new
//   (state)=>state.document

// );












// useEffect(() => {
//   if (reduxDocId) setDocumentId(reduxDocId);
// }, [reduxDocId]);




// useEffect(()=>{
//   const token=localStorage.getItem("token");
//   if(!token){
//     router.push("/login");
//   }
//   else{
//     fetchProfileImage(token);
//     fetchAllSessions();
    
    
//   }
// },[router]);
// useEffect(()=>{
//   chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
// },[messages]);//new




// useEffect(() => {
//     if (searchText.length >= 3) {
//       setSearchLoading(true);
//       const filtered = sessions.filter((session) =>
//         session.firstQuestion?.toLowerCase().includes(searchText.toLowerCase())
//       );
//       setSearchResults(filtered);
//       setSearchLoading(false);
//     } else {
//       setSearchResults([]);
//     }
//   }, [searchText, sessions])






// // WATCH reduxDocId and trigger resume parse automatically
// /*useEffect(() => {
//   if (resumeParsingMode && reduxDocId) {
//     dispatch(parseResume(reduxDocId));
//     setResumeParsingMode(false); // reset flag after parsing
//   }
// }, [reduxDocId, resumeParsingMode, dispatch]);*/









// /*const parsedResume = useSelector(state => state.document.parsedData);
// useEffect(() => {
//   if (parsedResume) {
//     setMessages(prev => [
//       ...prev,
//       { type: "bot", text: "Resume parsed successfully!", data: parsedResume }
//     ]);
//   }
// }, [parsedResume]);*/






// const fetchProfileImage=async(token)=>{
//   try{
// const res=await axios.get(`${BASE_URL}/profile`,{
//   headers: { Authorization: `Bearer ${token}` },
// })
// if(res.data.profileImage) setProfileImage(res.data.profileImage);
// ///
// setUserInfo({
//         username: res.data.username || "",
//         email: res.data.email || "",
//       }); 



//   }
  
//   catch (err) {
//       console.error("Failed to fetch profile:", err);
//     }
// }

//  const handleProfileClick = () => fileInputRef.current.click();

// const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setProfileImage(URL.createObjectURL(file)); // preview

//     const token = localStorage.getItem("token");
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await axios.post(`${BASE_URL}/user/image`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       if (res.data.profileImage)
//         setProfileImage(`${res.data.profileImage}?t=${Date.now()}`);
//       alert("Profile image uploaded successfully!");
//     } catch (err) {
//       console.error("Upload failed:", err);
//       alert("Upload failed. Try again.");
//     }
//   };

//  const handleLogout = () => {
//     localStorage.removeItem("token");
//     router.push("/login");
//   };

// //


// const fetchChatHistory=async(session_id)=>{



//   // Abort any running fetch stream
//   if (controllerRef.current) {
//     controllerRef.current.abort();
//     controllerRef.current = null;
//   }

//   // Clear typing interval if running
//   /*if (typeRef.current) {
//     clearInterval(typeRef.current);
//     typeRef.current = null;
//   }

//   stopRef.current = false;
//   setLiveStream("");
//   setLoading(false);*/
// setLoading(false);
  




//   const token=localStorage.getItem("token");
//   if(!token) return router.push("/login");
//   try{
//     const res=await axios.get(`${BASE_URL}/user/chathistory/${session_id}`,
//       {
//          headers: { Authorization: `Bearer ${token}` },
//       }

//     );
//     if(res.data.messages){
//      setMessages(
//       res.data.messages.map((m) => ({
//             type: m.role === "user" ? "user" : "bot",
//             text: m.message,
//             file: m.file || null,   /* ===== ADDED ===== */
//           }))
//      );
//      setSessionId(res.data.session_id);



// ///new///



//     }

//   }
//   catch(err){
//     console.error("Failed to fetch chat history:", err);
//       setMessages([{ type: "bot", text: "Failed to load chat history." }]);
//   }
// }








// const handleDeleteSession = async (id) => {
//   const token = localStorage.getItem("token");
//   if (!token) return router.push("/login");

//   const confirmDelete = window.confirm("Are you sure you want to delete this session?");
//   if (!confirmDelete) return;

//   try {
//     await axios.delete(`${BASE_URL}/user/session/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     // Remove from frontend
//     setSessions((prev) => prev.filter((session) => session.id !== id));

//     // If currently opened session is deleted
//     if (sessionId === id) {
//       setSessionId(null);
//       setMessages([{ type: "bot", text: "Session deleted." }]);
//     }

//   } catch (err) {
//     console.error("Failed to delete session:", err);
//     alert("Failed to delete session.");
//   }
// };








// const handleNewChat = () => {
//     setSessionId(null);
//     setMessages([{ type: "bot", text: "New chat started!" }]);
//   };

// /*const handleAsk=async()=>{
//   if(!question.trim()) return;
//   const token=localStorage.getItem("token");
//   if(!token){
//     router.push("/login");
//     return;
//   }
//   const userQuestion=question;
//   setMessages((prev)=>[
//     ...prev,
//     {type:"user",text:userQuestion},
//   ])
//   setQuestion("");
//   setLoading(true);
//   try{
//     const response = await axios.post(
//         `${BASE_URL}/user/ask`,
//         { question:userQuestion,sessionId,style:answerStyle},//new
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );


      
//       setMessages((prev)=>[
//         ...prev,{type:"bot",text:response.data.answer||"No response from backend",},
//       ]);


//       if (response.data.sessionId) {
        
// const newSession = response.data.sessionId;

//         setSessionId(newSession);

//       if (!sessions.includes(newSession)) {
//           setSessions((prev) => [...prev, newSession]);
//         }

        
          
      

// if (!sessions.some((s) => s.id === newSession)) {
//         setSessions((prev) => [
//           ...prev,
//           {
//             id: newSession,
//             firstQuestion: userQuestion,
//           },
//         ]);
//       }




//       }



//   }
//   catch(error){
//     if (error.response?.status === 401) {
//         localStorage.removeItem("token");
//         router.push("/login");
//     }

//     else {
//         setMessages((prev) => [
//           ...prev,
//           { type: "bot", text: "Backend error. Please try again." },
//         ]);
//       }

//   }
//   finally{
//     setLoading(false);
//   }

// };*/









// /*const stopCurrentResponse = () => {
//     stopRef.current = true;

//     if (controllerRef.current){ controllerRef.current.abort();controllerRef.current = null; }
//     if (typeRef.current) {clearInterval(typeRef.current); typeRef.current = null;    }

//     setMessages((prev) => {
//       const newMessages = [...prev];
//       const lastIndex = newMessages.length - 1;
//       if (newMessages[lastIndex]?.type === "bot") {
//         newMessages[lastIndex].text = liveStream.replace(/[▌|]/g, "");
//       }
//       return newMessages;
//     });

//     setLiveStream("");
//     setLoading(false);
//   };*/
  

//   const stopCurrentResponse = () => {
//   if (controllerRef.current) {
//     controllerRef.current.abort();
//     controllerRef.current = null;
//   }
//   setLoading(false);
// };



//  // ================= HANDLE ASK =================
//   const handleAsk = async () => {


//     //if(resumeParsingMode) return;
//     if (!question.trim()) return;

  


// if (attachedFile && !documentId) {
//     alert("Please wait, document is uploading...");
//     return;
//   }




//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login");
//       return;
//     }

//     const userQuestion = question;

//     /*setMessages((prev) => [
//       ...prev,
//       { type: "user", text: userQuestion },
//       { type: "bot", text: "" },
//     ]);*///temporary






// /* ===== MODIFIED USER MESSAGE WITH FILE ===== */
// setMessages((prev) => [
//   ...prev,
//   {
//     type: "user",
//     text: userQuestion,
//     file: attachedFile
//       ? {
//           name: attachedFile.name,
//           documentId: documentId,
//         }
//       : null,
//   },
//   { type: "bot", text: "" },
// ]);
// /* ===== END MODIFIED ===== */








    

//     setQuestion("");

//     /* ===== ADDED: CLEAR FILE AFTER ASK ===== */
// setAttachedFile(null);
// setDocumentId(null);
// /* ===== END ADDED ===== */
//     setLoading(true);
//    // setLiveStream("");

//     // Abort old fetch if running
//     if (controllerRef.current) {
//       controllerRef.current.abort();
//       //controllerRef.current = null;
//     }

//     // Clear old typing interval
//     /*if (typeRef.current) {
//       clearInterval(typeRef.current);
//       typeRef.current = null;
//     }

//     stopRef.current = false;*/
//     controllerRef.current = new AbortController();

    

//     try {




//       const response = await fetch(`${BASE_URL}/user/ask`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           question: userQuestion,
//           sessionId,
//           style: answerStyle,
//           documentId: documentId || null,
//         }),

         
//         signal: controllerRef.current.signal,
        
//       });

//       if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
//       if (!response.body) throw new Error("No response body from backend");

//       const newSessionId = response.headers.get("X-Session-Id");
//       if (!sessionId && newSessionId) {
//         setSessionId(newSessionId);

//       setSessions((prev) => {
//     if (!prev.some((s) => s.id === newSessionId)) {
//       return [
//         ...prev,
//         {
//           id: newSessionId,
//           firstQuestion: userQuestion,
//         },
//       ];
//     }
//     return prev;
//   });
// }


//       // 🔴 LIVE STREAM START

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder("utf-8");

//      // let done = false;
//      // let buffer = "";
//      // const flushInterval = 25;
//      // let lastFlush = Date.now();
//      let fullText="";

//      /* while (!done && !stopRef.current) {//load//stop
//         const { value, done: readerDone } = await reader.read();
//         done = readerDone;

//         if (value) {
//           buffer += decoder.decode(value, { stream: true });

//           if (Date.now() - lastFlush > flushInterval) {
//             setLiveStream(buffer + "|");
//             lastFlush = Date.now();
//           }
//         }
//       }

//      setLiveStream(buffer);*/










//       // 🔴 LIVE STREAM END

//       /*setMessages((prev) => {
//         const newMessages = [...prev];
//         const lastIndex = newMessages.length - 1;
//         newMessages[lastIndex].text = buffer;
//         return newMessages;
//       });*/




// while (true) {
//       const { done, value } = await reader.read();
//       if (done) break;
// //const chunk = decoder.decode(value, { stream: true });

//       //console.log("CHUNK:", chunk);   

//       //fullText += chunk;
//       fullText += decoder.decode(value, { stream: true });



// /*let i = 0;
// let currentText = "";

// if (typeRef.current) {
//       clearInterval(typeRef.current);
//       typeRef.current = null;
//     }*/

// /*.current = setInterval(() => {
//   if (i < buffer.length && !stopRef.current) {//new load//stop
//     currentText += buffer[i];
//     setLiveStream(currentText + "▌");  // cursor effect
//     i++;
//   } else {
//     clearInterval(typeRef.current);//typingInterval
//  typeRef.current = null;
//     // Final text without cursor
//     setLiveStream("");

//    /* setMessages((prev) => {
//       const newMessages = [...prev];
//       const lastIndex = newMessages.length - 1;
//       newMessages[lastIndex].text = buffer
//       return newMessages;
//     });*/

//     setMessages((prev) => {
//         const updated = [...prev];
//         updated[updated.length - 1].text = fullText;
//         return updated;
//       });
//     }
//   // 🔧 Change this number to control speed




//     } catch (error) {


//         if (error.name === "AbortError") {
//     console.log("Request stopped by user");
//     return; 
//         }
//       console.error("Streaming error:", error);
//       setMessages((prev) => [
//         ...prev,
//         { type: "bot", text: "Error receiving response. Please try again." },
//       ]);
//       setLoading(false)
//     } finally {
//       setLoading(false);
//       //setLiveStream("");
//     }
//   };





// const handleKeyDown=(e)=>{
//   if(e.key==="Enter"){
//     e.preventDefault();
//       handleAsk();
//   }
// }




// const fetchAllSessions = async () => {
//   const token = localStorage.getItem("token");
//   try {
//     const res = await axios.get(`${BASE_URL}/user/sessions`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     setSessions(res.data || []);






//   } catch (err) {
//     console.error("Failed to fetch sessions:", err);
//   }
// };




// //search
// const handleSearchChat = () => {
//   if (!searchText.trim()) return;

//   const foundSession = sessions.find((session) =>
//     session.firstQuestion
//       ?.toLowerCase()
//       .includes(searchText.toLowerCase())
//   );

//   if (foundSession) {
//     fetchChatHistory(foundSession.id);
//   } else {
//     alert("No matching chat found");
//   }
// };








// //new

// /*const handleDocClick = () => {
//     docInputRef.current.click();
//   };

//   const handleDocUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setAttachedFile(file);

//     const token = localStorage.getItem("token");
// //const formData = new FormData();
//    // formData.append("file", file);

//     try {
//       await axios.post(`${BASE_URL}/docs`,{
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//         await axios.post(
//       `${BASE_URL}/docs`,
//       {
//         title: file.name,
//         content: "Uploaded document file", // or any text
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//       alert("Document uploaded successfully!");
//     } catch (err) {
//       console.error("Document upload failed:", err);
//       alert("Document upload failed.");
//     }
//   };

  


// */





// /* ===== REPLACED handleDocUpload START ===== */
// /*const handleDocUpload = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("userId"); 

//   try {
//     const fileContent = await file.text(); 

//     const res = await axios.post(
//       `${BASE_URL}/docs`,
//       {
//         userId: userId,                
//         title: file.name,
//         content: fileContent,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

    
//     if (res.data.documentId) {
//       setDocumentId(res.data.documentId);
//     }

    
//     setAttachedFile({
//       name: file.name,
//       type: file.type,
//     });
//      dispatch(uploadDocument(file));//new

//   } catch (err) {
//     console.error("Document upload failed:", err);
//     alert("Document upload failed.");
//   }
// };
//  */




// useEffect(() => {
//   if (fileName && documentId&&fileContent) {
//     // now safe to attach documentId to the question
//   }
// }, [fileName, documentId,fileContent]);



// const handleDocUpload = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   // Keep the selected file locally for showing in UI
//   setAttachedFile({
//     name: file.name,
//     type: file.type,
//   });

//   // Dispatch Redux thunk to upload and store in Redux
//   dispatch(uploadDocument(file));



//   e.target.value = null;//new add





  




// };




// /*const handleDocUpload = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   setAttachedFile({ name: file.name, type: file.type });

//   try {
//     // upload document first
//     const result = await dispatch(uploadDocument(file));

    
//     const uploadedDocId = result?.documentId;

//     if (!uploadedDocId) {
//       alert("Document upload failed");
//       return;
//     }

//     setDocumentId(uploadedDocId);

//     // ✅ DIRECTLY TRIGGER PARSER
//     if (resumeParsingMode) {
//       dispatch(parseResume(uploadedDocId));
//       setResumeParsingMode(false);
//     }

//   } catch (err) {
//     console.error("Upload failed:", err);
//   }

//   e.target.value = null;
// };*/












// // ===== ADDED: OPEN FILE SELECTOR =====
// const handleDocClick = () => {
//   if (docInputRef.current) {
//     docInputRef.current.click();
//   }
// };
// // ===== END ADDED =====



// // ✅ ADD NEW FUNCTION
// /*const handleResumeButtonClick = () => {
//   // Start a new chat
//   setSessionId(null);
//   setQuestion("");
//   setMessages([{ type: "bot", text: "Upload your resume to start!" }]);
//   // Open the file selector for resume upload
  
//   setResumeParsingMode(true);
//   docInputRef.current?.click();
// };
// */








// // ===== HANDLE RESUME UPLOAD =====
// const handleResumeUpload = async () => {
//   if (!resumeFile) return;

//   setResumeError(null);

//   const result = await dispatch(uploadDocument(resumeFile));

//   if (result?.documentId) {
//     setDocumentId(result.documentId);
//     alert("Resume uploaded successfully");
//   }
// };

// // ===== HANDLE RESUME PARSE =====
// const handleResumeParse = async () => {
//   if (!documentId) return;

//   try {
//     setResumeLoading(true);
//     setResumeError(null);

//     const data = await dispatch(parseResume(documentId));

//     if (data) {
//       setResumeData(data);
//     }

//   } catch (err) {
//     setResumeError("Resume parsing failed");
//   } finally {
//     setResumeLoading(false);
//   }
// };

















// //DESIGNING PART
//   return(

//    <div className="d-flex vh-100">

      
//       <div className="bg-dark text-white p-3 h-100" style={{ width: "300px" }}>
//         <div>
//           <h5>Your Chats</h5>

//           <button
//             className="btn btn-sm btn-light w-100 mb-3"
//             onClick={handleNewChat}
//           >
//             + New Chat
//           </button>








// <hr />

// <h6>Upload Resume</h6>

// <input
//   type="file"
//   className="form-control form-control-sm mb-2"
//   accept=".pdf,.docx,.txt"
//   onChange={(e) => setResumeFile(e.target.files[0])}
// />

// <button
//   className="btn btn-sm btn-success w-100 mb-2"
//   onClick={handleResumeUpload}
//   disabled={!resumeFile}
// >
//   Upload Resume
// </button>

// {documentId && (
//   <button
//     className="btn btn-sm btn-primary w-100 mb-2"
//     onClick={handleResumeParse}
//     disabled={resumeLoading}
//   >
//     {resumeLoading ? "Parsing..." : "Parse Resume"}
//   </button>
// )}

// {resumeError && (
//   <div className="text-danger small">{resumeError}</div>
// )}
























// <input
//   type="text"
//   className="form-control form-control-sm mb-2"
//   placeholder="Search chats..."
//   value={searchText}
//   onChange={(e) => setSearchText(e.target.value)}
// />

// <button
//   className="btn btn-sm btn-warning w-100 mb-3"
//   onClick={handleSearchChat}
// >
//   🔍 Search Chat
// </button>







// {searchLoading && <div>Loading...</div>}
//           {searchResults.length > 0 && searchText.length >= 3 && (
//             <div className="mb-3">
//               <strong>Matching chats:</strong>
//               {searchResults.map((session) => (
//                 <div
//                   key={session.id}
//                   className={`${styles.sessionItem} p-2 mb-2 rounded bg-secondary`}
//                   style={{ cursor: "pointer" }}
//                   onClick={() => fetchChatHistory(session.id)}
//                 >
//                   {session.firstQuestion.length > 40
//                     ? session.firstQuestion.substring(0, 40) + "..."
//                     : session.firstQuestion}
//                 </div>
//               ))}
//             </div>
//           )}




//         </div>
//         <div style={{
//     height: "calc(100% - 350px)",
//     overflow: "auto",
//     paddingRight: "8px",
//   }}>
//         {sessions.map((session,index) => (
//           <div
//             key={session?.id||index}
//             className={`${styles.sessionItem} p-2 mb-2 rounded ${
//               sessionId === session?.id ? "bg-primary" : "bg-secondary"
//             }   d-flex justify-content-between align-items-center`}
//             style={{ cursor: "pointer" }}
//             onClick={() => fetchChatHistory(session?.id)}
//           >
            

// {(session?.firstQuestion || "New Chat").length > 40
//       ? (session.firstQuestion || "New Chat").substring(0, 40) + "..."
//       : session?.firstQuestion || "New Chat"}
//             <br />
            


//  <button
//       className="btn btn-sm btn-danger"
//       onClick={(e) => {
//         e.stopPropagation(); // prevent opening chat
//         handleDeleteSession(session.id);
//       }}
//     >
//       ❌
//     </button>


//           </div>



//         ))}
//         </div>



 
//           <div className="pt-2 mt-2 border-top text-muted"
//           style={{ fontSize: "0.85rem" }}>
        
//           <div style={{color:"white"}}>
//             <strong>Username:</strong> {userInfo.username}
//           </div>
//           <div style={{color:"white"}}>
//             <strong>Email:</strong> {userInfo.email}
//           </div>
//         </div>

// </div>

      

      
//       <div className={`flex-grow-1 d-flex flex-column ${theme==="dark"?"bg-black text-white":"bg-light text-dark"}`}>  

        
//         <nav className={`navbar  shadow-sm justify-content-between px-3 ${theme==="dark"? "bg-black text-white":"bg-white"}`}>
// <div className="d-flex align-items-center">
// <img
//       src="/chatgpt.png"          // path to your image
//       alt="Logo"
//       style={{ width: 30, height: 30, marginRight: 8 }}
//     />

//           <h4 className="mb-0">ChatBot</h4>

// <div className="ms-3">
//               <select
//                 className="form-select form-select-sm"
//                 value={answerStyle}
//                 onChange={(e) => setAnswerStyle(e.target.value)}
//               >
//                 <option value="normal">Normal</option>
//                 <option value="concise">Concise</option>
//                 <option value="detailed">Detailed</option>
//                 <option value="casual">Casual</option>
//                 <option value="technical">Technical</option>
//               </select>
//             </div>




//           </div>
          

//           <div className="d-flex align-items-center gap-2">

            



// {/* ===== THEME DROPDOWN ADDED ===== */}
// <select
//   className="form-select form-select-sm"
//   style={{ width: "120px" }}
//   value={theme}
//   onChange={(e) => setTheme(e.target.value)}
// >
//   <option value="normal">Normal</option>
//   <option value="dark">Dark</option>
// </select>





//             <div
//               className="rounded-circle overflow-hidden"
//               style={{ width: 40, height: 40, cursor: "pointer" }}
//               onClick={handleProfileClick}
//             >
//               {profileImage ? (
//                 <img
//                   src={profileImage}
//                   style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                 />
//               ) : (
//                 <div
//                   className="d-flex align-items-center justify-content-center bg-secondary text-white"
//                   style={{ width: "100%", height: "100%" }}
//                 >
//                   👤
//                 </div>
//               )}
//             </div>

//             <input
//               type="file"
//               ref={fileInputRef}
//               style={{ display: "none" }}
//               accept="image/*"
//               onChange={handleFileChange}
//             />

//             <button
//               className="btn btn-outline-danger btn-sm"
//               onClick={handleLogout}
//             >
//               Logout
//             </button>

//           </div>
//         </nav>

        
//         <div className="flex-grow-1 overflow-auto p-3">
//       {/*  {messages.map((msg, i) => (
//             <div
//               key={i}
//               className={`mb-2 ${
//                 msg.type === "user" ? "text-end" : "text-start"
//               }`}
//             >
//               <span
//                 className={`px-3 py-2 rounded d-inline-block ${
//                   msg.type === "user"
//                     ? "bg-primary text-white"
//                     : "bg-secondary text-white"
//                 }`}
//                 style={{ maxWidth: "70%" }}
//               >


// {msg.type === "bot" ? (
//     <ReactMarkdown>{msg.text}</ReactMarkdown>
//   ) : (


//                 msg.text
//   )}
//               </span>
//             </div>
// ))}*/}





// {/*{messages.map((msg, i) => {
//   const textToShow =
//     msg.type === "bot" &&
//     i === messages.length - 1 &&
//     liveStream
//       ? liveStream
//       : msg.text;

//   return (
//     <div
//       key={i}
//       className={`mb-2 ${
//         msg.type === "user" ? "text-end" : "text-start"
//       }`}
//     >
//       <span
//         className={`px-3 py-2 rounded d-inline-block ${
//           msg.type === "user"
//             ? "bg-primary text-white"
//             : "bg-secondary text-white"
//         }`}
//         style={{ maxWidth: "70%" }}
//       >
//         {msg.type === "bot" ? (
//           <ReactMarkdown>{textToShow}</ReactMarkdown>  
//         ) : (
//           textToShow
//         )}
//       </span>
//     </div>
//   );
// })}*/}










// {/*{messages.map((msg, i) => (
//   <div
//     key={i}
//     className={`mb-2 ${
//       msg.type === "user" ? "text-end" : "text-start"
//     }`}
//   >
//     <span
//       className={`px-3 py-2 rounded d-inline-block ${
//         msg.type === "user"
//           ? "bg-primary text-white"
//           : "bg-secondary text-white"
//       }`}
//       style={{ maxWidth: "70%" }}
//     >
//       {msg.type === "bot" ? (
//         <ReactMarkdown>{msg.text}</ReactMarkdown>
//       ) : (
//         msg.text
//       )}
//     </span>
//   </div>
// ))}*/}



// {messages.map((msg, i) => (
//   <div
//     key={i}
//     className={`mb-2 ${
//       msg.type === "user" ? "text-end" : "text-start"
//     }`}
//   >
//     <span
//       className={`px-3 py-2 rounded d-inline-block ${
//         msg.type === "user"
//           ? "bg-primary text-white"


//  : theme === "dark"
//     ? "bg-dark text-white"


//           : "bg-secondary text-white"
//       }`}
//       style={{ maxWidth: "70%" }}
//     >
//       {msg.type === "bot" ? (
//         <ReactMarkdown>{msg.text}</ReactMarkdown>
//       ) : (
//         <>
//           {msg.text}

          
//           {msg.file && (
//             <div style={{ marginTop: "6px", fontSize: "12px" }}>
//               📄 {msg.file.name}
//             </div>
//           )}
          
//         </>
//       )}
//     </span>
//   </div>
// ))}











// {resumeData && (
//   <div className="mt-4 p-3 border rounded bg-white text-dark">
//     <h4>{resumeData.name}</h4>

//     <p><strong>Email:</strong> {resumeData.email}</p>
//     <p><strong>Phone:</strong> {resumeData.phone}</p>

//     <h5 className="mt-3">Summary</h5>
//     <p>{resumeData.summary}</p>

//     <h5>Skills</h5>
//     <ul>
//       {resumeData.skills?.map((skill, i) => (
//         <li key={i}>{skill}</li>
//       ))}
//     </ul>

//     <h5>Education</h5>
//     <ul>
//       {resumeData.education?.map((edu, i) => (
//         <li key={i}>{edu}</li>
//       ))}
//     </ul>

//     <h5>Experience</h5>
//     <ul>
//       {resumeData.experience?.map((exp, i) => (
//         <li key={i}>{exp}</li>
//       ))}
//     </ul>
//   </div>
// )}



































//     <div ref={chatEndRef}></div>
//         </div>

        
//         <div className={`border-top p-3  ${theme==="dark"?  "bg-black text-white": "bg-white"}`}>
//           <div className="input-group align-items-center">



//           <button
//             className="btn btn-outline-secondary"
//             type="button"
//             onClick={handleDocClick}
//           >
//             📎
//           </button>








// <input
//             type="file"
//             ref={docInputRef}
//             style={{ display: "none" }}
//             accept=".pdf,.doc,.docx,.txt,image/*"
//             onChange={handleDocUpload}
//           />



//             <input
//               type="text"
//               className={`form-control  ${theme==="dark"? `bg-dark text-white border-secondary ${styles.darkInput}`:""}`}
//               placeholder="Type your question..."
//               value={question}
//               onChange={(e) => setQuestion(e.target.value)}
//               onKeyDown={handleKeyDown}
//             />



//              {loading ? (
//               <button
//                 className="btn btn-danger"
//                 onClick={stopCurrentResponse}
//               >
//                 Stop
//               </button>
//             ) : (
//             <button
//               className="btn btn-primary"
//               onClick={handleAsk}
//               //disabled={resumeParsingMode}
//             >
//               Ask
//             </button>
//             )}
//           </div>




//         {attachedFile && (
//           <div style={{ fontSize: "12px", marginTop: "6px" }}>
//             📄 {attachedFile.name}
//           </div>
//         )}















//         </div>

//       </div>
//     </div>
//   )
// }/*}



























