
/*const initialState = {
  fileName: null,
  fileContent: null,
  documentId: null,
  loading: false,
  error: null,










};

const documentReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPLOAD_DOCUMENT_REQUEST":
      return { ...state, loading: true };

    case "UPLOAD_DOCUMENT_SUCCESS":
      return {
        ...state,
        loading: false,
        fileName: action.payload.fileName,
        fileContent: action.payload.fileContent,
        documentId: action.payload.documentId,
      };

    case "UPLOAD_DOCUMENT_FAIL":
      return { ...state, loading: false, error: action.payload };














    default:
      return state;
  }
};

export default documentReducer;*/





















const initialState={
  loading: false,
  id: null,
  doc_type: null,
  structured_data: null,
  error: null};




const documentReducer = (state = initialState, action) => {
  switch (action.type) {

    case "UPLOAD_DOCUMENT_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "UPLOAD_DOCUMENT_SUCCESS":
      return {
        ...state,
        loading: false,
        documentid: action.payload.id,
        doc_type: action.payload.doc_type,     // ✅ ADDED
        structured_data: action.payload.structured_data, // ✅ ADDED
      };

    case "UPLOAD_DOCUMENT_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default documentReducer;