import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getUserById } from "../api/UserAPI";
import { useLocation } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Thêm hook này để theo dõi thay đổi route
  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        const response = await getUserById(userId, token);

        if (response.success && response.data) {
          setUser(response.data);
        } else {
          setUser(null);
          localStorage.removeItem("accessToken");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
        setUser(null);
        localStorage.removeItem("accessToken");
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };
  // Thêm useEffect để theo dõi thay đổi route
  useEffect(() => {
    fetchUser();
  }, []); // Chạy lại mỗi khi đường dẫn thay đổi

  const login = (userData) => {
    setUser({
      _id: userData._id,
      username: userData.username,
      avatar: userData.avatar,
      gender: userData.gender,
      dateOfBirth: userData.dateOfBirth,
      phoneNumber: userData.phoneNumber,
      email: userData.email,
      role: userData.role,
      idCinema: userData.idCinema,
      status: userData.status,
      registrationDate: userData.registrationDate,
    });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === "Administrator";
  };

  const isEmployee = () => {
    return user?.role === "Employee";
  }

  const isActive = () => {
    return user?.status === "active";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin,
        isEmployee,
        isActive,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
