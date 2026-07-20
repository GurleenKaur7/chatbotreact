
/*import axios from "axios";

const BASE_URL = "http://192.168.86.27:8000";

export const uploadDocument = (file) => async (dispatch) => {
  try {
    dispatch({ type: "UPLOAD_DOCUMENT_REQUEST" });

    const token = localStorage.getItem("token");
    //const userId = localStorage.getItem("userId");

    const fileContent = await file.text();


     
   const res = await axios.post(
      `${BASE_URL}/docs`,
      {
        
        title: file.name,
        content: fileContent,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );



   
    dispatch({
      type: "UPLOAD_DOCUMENT_SUCCESS",
      payload: {
        fileName: file.name,
        fileContent: fileContent,
        documentId: res.data.id,
      },
    });
  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    dispatch({
      type: "UPLOAD_DOCUMENT_FAIL",
      payload: error.message,
    });
  }
};*/


























/*import axios from "axios";

const BASE_URL = "http://192.168.86.27:8000";

export const uploadDocument = (file) => async (dispatch) => {
  try {
    dispatch({ type: "UPLOAD_DOCUMENT_REQUEST" });

    const token = localStorage.getItem("token");

    // ✅ Create FormData (REQUIRED for file upload)
    const formData = new FormData();
    formData.append("file", file);          // must match backend key
    formData.append("title", file.name);   // must match backend key

    // ✅ Send as multipart/form-data
    const res = await axios.post(
      `${BASE_URL}/upload_file`,   // ✅ correct endpoint
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
      }
    );

    dispatch({
      type: "UPLOAD_DOCUMENT_SUCCESS",
      payload: {
        fileName: file.name,
        documentId: res.data.id,
        message: res.data.message,
      },
    });

    return{
      documentId:res.data.id,
    }

  } catch (error) {
    console.log("UPLOAD ERROR:", error);

    dispatch({
      type: "UPLOAD_DOCUMENT_FAIL",
      payload: error.response?.data?.detail || error.message,
    });
  }
};*/












/* ===== RESUME PARSE ACTION ===== */
/*export const parseResume = (doc_id) => async (dispatch) => {
  if (!doc_id) return;

  const token = localStorage.getItem("token");
  if (!token) return; // frontend can handle redirect

  try {
    dispatch({ type: "RESUME_PARSE_REQUEST" });

    const res = await axios.post(
      `${BASE_URL}/user/resumeparser/${doc_id}`,
      null, // no request body needed
      { headers: { Authorization: `Bearer ${token}` } }
    );

    dispatch({
      type: "RESUME_PARSE_SUCCESS",
      payload: res.data, // structured JSON returned from backend
    });

    return res.data;

  } catch (err) {
    console.error("Resume parsing failed:", err);
    dispatch({
      type: "RESUME_PARSE_FAIL",
      payload: err.response?.data?.detail || "Resume parsing failed",
    });
  }
};
/* ===== END RESUME PARSE ACTION ===== */





















import axios from "axios";

const BASE_URL = "http://192.168.86.27:8000";

export const uploadDocument = (file) => async (dispatch) => {
  try {
    dispatch({ type: "UPLOAD_DOCUMENT_REQUEST" });

    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);

    const res = await axios.post(
      `${BASE_URL}/upload_file`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    /*
      ✅ Backend now returns:
      {
        document_id,
        document_type,
        structured_data
      }
    */

    dispatch({
      type: "UPLOAD_DOCUMENT_SUCCESS",
      payload: {
        documentid: res.data.id,          // ✅ UPDATED
        doc_type: res.data.doc_type,     // ✅ ADDED
        structured_data: res.data.structured_data, // ✅ ADDED
      },
    });

    // ✅ Return full response so component can render card
    return {
      documentid: res.data.id,
      doc_type: res.data.doc_type,
      structured_data: res.data.structured_data,
    };
return res.data;
  } catch (error) {
    console.log("UPLOAD ERROR:", error);

    dispatch({
      type: "UPLOAD_DOCUMENT_FAIL",
      payload: error.response?.data?.detail || error.message,
    });
  }
};