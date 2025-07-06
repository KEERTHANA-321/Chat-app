import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { Navigate, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Toaster } from 'react-hot-toast';
import { useChatStore } from './store/useChatStore';
import ChooseTeam from './pages/ChooseTeam';
import Games from './pages/Games';
import SidebarLayout from './components/Sidebarlayout';
import TeamsPage from './pages/TeamPage';
import UsersPage from './pages/UserPage';

const App = () => {
  const authUser = useAuthStore(state => state.authUser);
  const onlineUsers = useAuthStore(state => state.onlineUsers);
  const checkAuth = useAuthStore(state => state.checkAuth);
  const isCheckingAuth = useAuthStore(state => state.ischeckingAuth); 
  console.log("online users",onlineUsers);
  const {subscribeToMessages,unsubscribeFromMessages}=useChatStore();
  const {socket}=useAuthStore();

  useEffect(() => { 
    checkAuth();
  }, [checkAuth]);
  useEffect(() => {
    if (!socket) return;

    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, subscribeToMessages, unsubscribeFromMessages]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading
      </div>
    );
  }

  return (
    <div className="flex h-screen relative pt-12">
      <Navbar className="fixed top-0 w-full z-50"/>
      
  <Routes>
  <Route element={<SidebarLayout />}>
  <Route path="/teams" element={<TeamsPage />} />
  <Route path="/users" element={<UsersPage />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/games" element={authUser ? <Games /> : <Navigate to="/login" />} />

  <Route path="/" element={<Home />} />
</Route>

  <Route path="/choose-team" element={authUser ? <ChooseTeam /> : <Navigate to="/login" />} />
  <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
  <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
</Routes>



      <Toaster />
    </div>

  );
};

export default App;
