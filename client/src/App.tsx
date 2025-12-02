import { ChatProvider } from "./components/chat-context";
import { SocketProvider } from "./components/socket-context";
import { AuthProvider } from "./components/auth-context";
import Chat from "./pages/chat";
import Home from "./pages/home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/protected-route";
import { Toaster } from "./components/ui/sonner";
import NotFound from "./pages/not-found";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <SocketProvider>
                    <ChatProvider>
                      <Chat />
                    </ChatProvider>
                  </SocketProvider>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
