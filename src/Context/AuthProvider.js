import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  auth: null,
  setAuth: () => {},
  user: null,
});

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ auth, user, setAuth, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth };
export default AuthProvider;
