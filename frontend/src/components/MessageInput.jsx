import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import toast from 'react-hot-toast';
import { useTeamStore } from '../store/useTeamStore';

const MessageInput = () => {
  const [text,setText]=useState("");
  const [imagePreview,setImagePreview]=useState(null);
  const fileInputRef=useRef(null);
  const {sendMessage}=useChatStore();
  const { currentTeam } = useTeamStore();

  const handleImageChange=(e)=>{
    const file=e.target.files[0];
    console.log("Selected file:", file);
console.log("File type:", file?.type);
    if(!file.type.startsWith("image/")){
      toast.error("Please select an Image file");
      return;
      
    }
    const reader=new FileReader();
    reader.onload=()=>{
      setImagePreview(reader.result)
    };
    reader.readAsDataURL(file);

  };
  const removeImage=()=>{
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value="";
  };
  const handleSendMessage=async(e)=>{
    e.preventDefault();
    if(!text.trim() && !imagePreview) return;

    try{
      await sendMessage({
        text:text.trim(),
      image:imagePreview},!!currentTeam)
      setText("");
      setImagePreview(null)
      if(fileInputRef.current) fileInputRef.current.value="";


    }catch(err){
      console.log("Error sending message",err);
    }
  };

  return (
    <div className='p-4 w-full'>
      {imagePreview && (
        <div className='mb-3 flex items-center gap-2'>
            <div className='relative'>
              <img src={imagePreview} alt="preview" className='w-20 h-20 object-cover rounded-lg '/>
              <button onClick={removeImage} className='absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center'>X</button>

          </div>
          </div>
      )}
      <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
<div className='flex flex-1 gap-2'>
  <input type="text" className='w-full border active:border-red'
  placeholder='Type a message..'
  value={text}
  onChange={(e)=>setText(e.target.value)}></input>
  <input type="file"
  className='hidden'
  accept='image/*'
  ref={fileInputRef}
  onChange={handleImageChange}></input>
  <button
  type="button"
  className={`hidden sm:flex ${imagePreview?"text-green-600":"text-zinc-900"}
  `}
  onClick={()=>fileInputRef.current?.click()}>    <img src='/image.svg' className='h-10 w-10 '/>
</button>
  <button type='submit'
  disabled={!text.trim() && !imagePreview} >
    <img src='/send.svg' className='h-10 w-10 '/>
  </button>

</div>

      </form>


      </div>
  )
}

export default MessageInput