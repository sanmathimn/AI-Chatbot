import { useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react"; // ✅ Import emoji picker

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";

    setChatHistory((history) => [...history, { role: "user", text: userMessage }]);
    setTimeout(() => {
      setChatHistory((history) => [
        ...history,
        { role: "model", text: "Thinking..." },
      ]);
      generateBotResponse([
        ...chatHistory,
        {
          role: "user",
          text: `Using the details provided above, please address this query: ${userMessage}`,
        },
      ]);
    }, 600);
  };

  const handleEmojiClick = (emojiData) => {
    inputRef.current.value += emojiData.emoji;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setChatHistory((history) => [
        ...history,
        { role: "user", text: `📎 Uploaded file: ${file.name}` },
      ]);
    }
  };

  return (
    <form
      className="chat-form"
      onSubmit={handleFormSubmit}
      style={{ display: "flex", alignItems: "center", position: "relative" }}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className="message-input"
        required
      />

      {/* Emoji Button */}
      <button
        type="button"
        className="emoji-btn"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        style={{ marginLeft: "5px" }}
      >
        😊
      </button>

      {/* Full Emoji Picker */}
      {showEmojiPicker && (
  <div className="emoji-picker">
    <EmojiPicker
      onEmojiClick={(emojiData) => {
        inputRef.current.value += emojiData.emoji;
        setShowEmojiPicker(false); // Optional: close picker after selecting
      }}
      emojiStyle="native" // Optional: choose "native" or "apple" etc.
    />
  </div>
)}

      {/* Upload File Button */}
      <label
        htmlFor="file-upload"
        className="upload-btn"
        style={{ marginLeft: "5px", cursor: "pointer" }}
      >
        📎
        <input
          id="file-upload"
          type="file"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
      </label>

      {/* Send Button */}
      <button
        className="material-symbols-rounded"
        style={{ marginLeft: "5px" }}
      >
        arrow_upward
      </button>
    </form>
  );
};

export default ChatForm;
