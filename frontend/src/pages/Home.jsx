import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import SidebarLayout from "../components/Sidebarlayout";
import { useChatStore } from "../store/useChatStore";
import { useTeamStore } from "../store/useTeamStore";
import Profile from "./Profile";

const Home = () => {
  const {selectedUser}=useChatStore();
  const {currentTeam}=useTeamStore();

  return (
      
      <div className="flex-1 relative flex flex-col">
        {(!selectedUser && !currentTeam) ? <NoChatSelected /> : <ChatContainer />}
      </div>
    

  );
};
export default Home;
