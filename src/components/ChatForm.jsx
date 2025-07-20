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
      setChatHistory((history) => [...history, { role: "model", text: "Thinking..." }]);
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
        const imageMessage = {
          role: "user",
          text: (
            <div>
              📎 Uploaded image: <br />
              <img
                src={imageDataUrl}
                alt={file.name}
                style={{ maxWidth: "150px", borderRadius: "8px" }}
              />
            </div>
          ),
        };

        setChatHistory((history) => [...history, imageMessage]);

        setTimeout(() => {
          setChatHistory((history) => [...history, { role: "model", text: "Analyzing image..." }]);
          generateBotResponse([
            ...chatHistory,
            {
              role: "user",
              text: `Please analyze the uploaded image named \"${file.name}\"`,
            },
          ]);
        }, 800);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      setChatHistory((history) => [...history, { role: "user", text: `📎 Uploaded file: ${file.name}` }]);
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
      onSubmit={handleFormSubmit}
      style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "10px", borderTop: "1px solid #ccc" }}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        style={{ flex: 1, padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc" }}
        required
      />

      <button
        type="button"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        title="Emoji"
        style={{ fontSize: "20px", cursor: "pointer", background: "none", border: "none" }}
      >
        😊
      </button>

      {showEmojiPicker && (
        <div style={{ position: "absolute", bottom: "60px", right: "70px", zIndex: 1000 }}>
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              handleEmojiClick(emojiData);
              setShowEmojiPicker(false);
            }}
            emojiStyle="native"
          />
        </div>
      )}

      <button
        type="button"
        onClick={handleVoiceInput}
        title="Voice Input"
        style={{ fontSize: "20px", cursor: "pointer", background: "none", border: "none" }}
      >
        🎤
      </button>

      <label
        htmlFor="file-upload"
        title="Upload image"
        style={{ fontSize: "20px", cursor: "pointer" }}
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

      <button
        type="submit"
        title="Send"
        style={{ fontSize: "20px", cursor: "pointer", background: "none", border: "none" }}
      >
        ↑
      </button>
    </form>
  );
};

export default ChatForm;
