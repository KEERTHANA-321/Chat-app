import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {User,Mail,Camera} from "lucide-react";
const initialUser = {
  fullName: "",
  email: "",
  accountStatus: "active",
  focusMode: false,
  memberSince: "",
  profilePic: "",
};

const Profile = () => {
  const {authUser,checkAuth,updateProfile,isUpdatingProfile} = useAuthStore();

  const [user, setUser] = useState(initialUser);
  // const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);


  useEffect(() => {
    if (!authUser) {
      checkAuth();
    }
  }, []);
  useEffect(() => {
    if (!authUser) return;

    setUser({
      fullName: authUser.fullName ?? "",
      email: authUser.email ?? "",
      accountStatus: authUser.accountStatus ?? "active",
      focusMode: authUser.focusMode ?? false,
      memberSince: authUser.createdAt ?? "",
      profilePic: authUser.profilePic ?? "",
    });
    setAvatarPreview(authUser.profilePic ?? "");
  }, [authUser]);

  

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader=new FileReader();
    reader.readAsDataURL(file);
    reader.onload=async ()=>{
      const base64Image=reader.result;

      setAvatarPreview(base64Image);
      await updateProfile( {profilePic: base64Image})
    }
    // setAvatarFile(file);
    
  };



  return (
<div className="custom-kodemono w-1/3 min-w-[22rem] h-screen bg-[#E3BE9E] p-8 relative">
  <div className="absolute inset-0 m-5 ring-2 ring-[#69421E] pointer-events-none z-0" />
  <h1 className="py-1 border-y-2 border-[#69421E]">Profile</h1>

  <div className="relative my-6 flex flex-col items-center gap-6">
    <img
      src={avatarPreview || authUser.profilePic ||  "https://placehold.co/128x128"}
      alt="avatar preview"
      className="h-32 w-32 rounded-full object-cover border border-2-[#69421E]"
    />
    <input
      type="file"
      accept="image/*"
      id="avatar"
      onChange={handleImageUpload}
      className="hidden"
      disabled={isUpdatingProfile}
    />
    <label
      htmlFor="avatar"
      className={`${isUpdatingProfile?"animate-pulse pointer-events-none":""}absolute top-20 right-32 bg-[#69421E] rounded-full p-1 cursor-pointer border border-[#69421E] hover:bg-gray-200 transition`}>
      <Camera className="w-7 h-7 p-1 text-white" />
    </label>
</div>

      <div className="flex flex-col gap-6 ">
        <div className="flex justify-between">
          <h1 className="mb-1  font-medium text-gray-700">Full Name</h1>
          <h1 className="">{user.fullName}</h1>
        </div>

        <div className="flex justify-between">
          <h1 className="mb-1  font-medium text-gray-700">Email ID</h1>
          <h1 className="">{user.email}</h1>
        </div>

        {/* <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Account Status</label>
          <select
            name="accountStatus"
            value={user.accountStatus}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div> */}

        {/* <div className="flex items-center gap-4 pt-6 md:pt-0">
          <input
            type="checkbox"
            id="focusMode"
            name="focusMode"
            checked={user.focusMode}
            onChange={handleChange}
            className="h-5 w-5 "
          />
          <label htmlFor="focusMode" className="text-sm font-medium text-gray-700">
            Focus Mode Active
          </label>
        </div> */}
        <div>
          <h1 className="py-1 border-y-2 border-[#69421E]">Account Information</h1>
        </div>
        <div className="flex justify-between">
          <h1 className="mb-1  text-sm font-medium text-gray-700">Member Since</h1>
          <h1 className="">{user.memberSince ? new Date(user.memberSince).toLocaleDateString() : ""}
            
          </h1>
        </div>
        <div className="flex justify-between">
          <h1 className="mb-1  text-sm font-medium text-gray-700">Account Status</h1>
          <h1 className="">Active
            
          </h1>
        </div>
        <div className="flex justify-between">
          <h1 className="mb-1  text-sm font-medium text-gray-700">Focus Mode</h1>
          <h1 className="">Off
            
          </h1>
        </div>
      </div>

      {/* <button
        onClick={handleSave}
        disabled={loading}
        className="mt-8 w-full rounded-lg bg-[#69421E] px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save Changes"}
      </button> */}
    </div>
  );
};

export default Profile;