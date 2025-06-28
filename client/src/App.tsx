import useAuth from "./hooks/use-auth";
import Chat from "./pages/chat";
import Login from "./pages/login";

function App() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Chat />;
  }

  return <Login />;
}

export default App;
