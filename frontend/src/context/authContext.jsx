import React, { createContext, useEffect, useReducer } from "react";

const getStoredUser = () => {
  try {
    const item = localStorage.getItem("user");
    return item && item !== "undefined" && item !== "null"
      ? JSON.parse(item)
      : null;
  } catch (err) {
    return null;
  }
};

const initialState = {
  user: getStoredUser(),
  token: localStorage.getItem("token") || null,
  isAdmin: localStorage.getItem("isAdmin") || null,
  isUserLoggedIn: !!localStorage.getItem("token"),
};

export const authContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        token: null,
        isAdmin: null,
        isUserLoggedIn: false,
      };

    case "LOGIN_SUCCESS":
      return {
        user: action.payload.user,
        token: action.payload.token,
        isAdmin: action.payload.isAdmin,
        isUserLoggedIn: true,
      };

    case "LOGOUT":
      return {
        user: null,
        token: null,
        isAdmin: null,
        isUserLoggedIn: false,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
    localStorage.setItem("token", state.token);
    localStorage.setItem("isAdmin", state.isAdmin);
    localStorage.setItem("isUserLoggedIn", state.isUserLoggedIn);
  }, [state]);

  return (
    <authContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isAdmin: state.isAdmin,
        isUserLoggedIn: state.isUserLoggedIn,
        dispatch,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
