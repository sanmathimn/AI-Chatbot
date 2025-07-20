import { useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

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
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUrl = reader.result;

      // Add image to chat history
      const imageMessage = {
        role: "user",
        text: (
          <div>
            📎 Uploaded image: <br />
            <img src={imageDataUrl} alt={file.name} style={{ maxWidth: "150px", borderRadius: "8px" }} />
          </div>
        ),
        imageData: imageDataUrl, // Optional: for logic if needed
      };

      // Update chat history
      setChatHistory((history) => [...history, imageMessage]);

      // Auto-generate a bot response after showing image
      setTimeout(() => {
        setChatHistory((history) => [
          ...history,
          { role: "model", text: "Analyzing image..." },
        ]);

        generateBotResponse([
          ...chatHistory,
          {
            role: "user",
            text: `Please analyze the uploaded image named "${file.name}"`,
          },
        ]);
      }, 800);
    };
    reader.readAsDataURL(file);
  } else if (file) {
    // Handle non-image files normally
    setChatHistory((history) => [
      ...history,
      { role: "user", text: `📎 Uploaded file: ${file.name}` },
    ]);
  }
};


  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice input not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        inputRef.current.value += transcript;
      };

      recognitionRef.current.onend = () => setListening(false);
    }

    if (!listening) {
      recognitionRef.current.start();
      setListening(true);
    } else {
      recognitionRef.current.stop();
      setListening(false);
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
              setShowEmojiPicker(false);
            }}
            emojiStyle="native"
          />
        </div>
      )}

      {/* Voice Button */}
      <button
        type="button"
        onClick={handleVoiceInput}
        title="Voice Input"
        style={{ marginLeft: "5px", cursor: "pointer" }}
      >
        🎤
      </button>

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
          accept="image/*"
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
