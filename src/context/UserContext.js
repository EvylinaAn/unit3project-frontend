import { useContext, createContext, useState, useCallback } from "react";
import axios from "axios";

export const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UsersProvider({ children }) {
  const [user, setUser] = useState(null);

  const googleAuth = useCallback(() => {
    const result = window.open(
      `${process.env.REACT_APP_AUTH_URL}/auth/google/callback`,
      "_self",    
      );
      console.log(result)
  }, []);

  const getUser = async () => {
    try {
      const url = `${process.env.REACT_APP_AUTH_URL}/auth/login/success`;
      const { data } = await axios.get(url, { withCredentials: true });
      console.log(data.user._json);
      setUser(data.user._json);
    } catch (e) {
      console.error(e);
    }
  }

  const handleLogout = async () => {
    window.open(`${process.env.REACT_APP_AUTH_URL}/auth/logout`, "_self");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        getUser,
        handleLogout,
        googleAuth,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
