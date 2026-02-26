import { FileInput, Image, Send, X } from "lucide-react"
import { useRef, useState } from "react"
import { useChatStore } from "../store/useChatStore"
import toast from "react-hot-toast";




const MessageInput = () => {
  const [text, setText] = useState("");
  const fileInputRef = useRef(null)
  const [imagePreview, SetImagePreview] = useState(null);
  const { sendMessage } = useChatStore();

  const handelImageChange = (e) => {
    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Please Select an image file")
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      SetImagePreview(reader.result);
    };
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    SetImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
  const handelSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,

      })
      //clear the form 
      setText("");
      SetImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message", error);
    }

  }

  return (
    <div className=" p-4 w-full flex relative">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />

            <button onClick={removeImage} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center" type="button">
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handelSendMessage} className="flex items-center gap-2 w-full">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="flex-1 input input-bordered rounded-lg input-lg"
            placeholder="Type a message...."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handelImageChange}
          />

          <button type="button" className={`hidden sm:flex btn btn-circle
           ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`} onClick={() => fileInputRef.current?.click()
            }>
            <Image size={20} />
          </button>
        </div>
        <button className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}>
          <Send size={22} />
        </button>
      </form>
    </div>
  )
}

export default MessageInput