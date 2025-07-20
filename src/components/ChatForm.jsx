import { useRef } from "react";

const ChatForm = ({chatHistory, setChatHistory, generateBotResponse}) => {
    const inputRef = useRef();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if (!userMessage) return;
        inputRef.current.value = ""; 

        // Update chat history with user's message
        setChatHistory((history) => [...history, { role: "user", text: userMessage }]);

        //Delay 600 ms before showing "Thinking..." and generating response
        setTimeout(() => {
            // Add a "thinking..." message from the bot's response
            setChatHistory((history) => [...history, { role: "model", text: "Thinking..." }]);

            //Call the function to generate bot's response
        generateBotResponse([...chatHistory, { role: "user", text: `Using the details provided above, please address this query: ${userMessage}` }]);
    },600)};

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
            <input ref={inputRef} type="text" placeholder="Message..." className="message-input" required />
            <button className="material-symbols-rounded">arrow_upward</button>
          </form>
  )
}

export default ChatForm