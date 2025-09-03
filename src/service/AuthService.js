
import http from "../http-common";

const AuthService = {

  registerUser(userData) {
    return http.post("/auth/register/user", userData);
  },
 
  async loginUser(credentials) {
    try {
      const response = await http.post("/auth/login/user", credentials);
     
      const { token, userId } = response.data;

     
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      return { token, userId };
    } catch (error) {
      throw error; 
    }
  },
registerBusOperator(busOpData) {
  return http.post("/auth/register/busoperator", busOpData);
},

async loginBusOperator(credentials) {
  try {
    const response = await http.post("/auth/login/busoperator", credentials);
    const { token, busOpId, username } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("busOpId", busOpId);
    localStorage.setItem("username", username);
    localStorage.setItem("role", "busoperator");

    return { token, busOpId, username };
  } catch (error) {
    throw error;
  }
},


  registerAdmin(adminData) {
    return http.post("/auth/register/admin", adminData);
  },
  loginAdmin(credentials) {
    return http.post("/auth/login/admin", credentials);
  }
};

export default AuthService;

