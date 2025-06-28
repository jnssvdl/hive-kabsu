export default function useAuth() {
  const token = localStorage.getItem("jwt");

  const isAuthenticated = !!token;

  const logout = () => {
    localStorage.removeItem("jwt");
    window.location.reload();
  };

  return { token, isAuthenticated, logout };
}
