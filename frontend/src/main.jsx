import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContextProvider } from "./context/authContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google"
const CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "1083427389142-dummyclientid.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <ToastContainer />
    <AuthContextProvider>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </AuthContextProvider>
  </>
);
