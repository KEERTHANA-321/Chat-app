const  TeamMembersList = ({ members }) => {
    if (!members || members.length === 0) return <p>No members found.</p>;
  
    return (
      <div className="flex flex-wrap gap-3 p-4 border-t border-gray-300">
        {members.map((member) => (
          <div key={member._id} className="flex items-center gap-2">
            <img
              src={member.profilePic || "/default-avatar.png"}
              alt={member.fullName}
              className="w-8 h-8 rounded-full object-cover border border-gray-400"
            />
            <span className="text-sm">{member.fullName}</span>
          </div>
        ))}
      </div>
    );
  };

  export default TeamMembersList;
  