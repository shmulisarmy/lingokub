import { useState, useEffect } from "react";
import { useLocalStorage } from "./hooks";

const socket = new WebSocket('ws://localhost:5001/ws');

type ActiveUser = {
    id: string;
    username: string;
    image: string;
};

export function MessagingBox() {
  const [messages, setMessages] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [messageBoxPosition, setMessageBoxPosition] = useLocalStorage("messageBoxPosition", { x: 0, y: 0 });
  const [messageBoxUp, setMessageBoxUp] = useLocalStorage("messageBoxUp", true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastVisibleMessageCount, setLastVisibleMessageCount] = useState(0);

  useEffect(() => {
    if (messageBoxUp) {
      setLastVisibleMessageCount(messages.length);
      setUnreadCount(0);
    }
  }, [messageBoxUp, messages.length]);

  socket.onmessage = (event) => {
    const newMessage = event.data;
    console.log(newMessage);
    if (typeof newMessage !== 'string') {
      return;
    }
    
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages, newMessage];
      if (!messageBoxUp) {
        setUnreadCount(newMessages.length - lastVisibleMessageCount);
      }
      return newMessages;
    });
  }

  const getUserForMessage = (index: number) => activeUsers[index % activeUsers.length] || { username: 'User', image: '', id: '' };

  const handleMouseMove = (e: MouseEvent) => {
    setMessageBoxPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      onMouseDown={(e) => {
        window.addEventListener('mousemove', handleMouseMove);
      }}
      onMouseUp={() => {
        window.removeEventListener('mousemove', handleMouseMove);
      }}
      className={`fixed ${messageBoxUp ? "bottom-8" : "bottom-[-45%]"} right-8 z-[1000] rounded-[18px] shadow-[0_4px_32px_rgba(0,0,0,0.25)] bg-gradient-to-br from-[#ff9800] via-[#e040fb] to-[#00bcd4] opacity-97 hover:opacity-100 transition-opacity-300 p-[2px] min-w-[350px] max-w-[400px] w-full transition-shadow`}
    >
      <button 
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
        onClick={() => {
          setMessageBoxUp(prev => !prev);
        }}
      >
        {messageBoxUp ? '−' : unreadCount > 0 ? unreadCount : '+'}
      </button>
      <div className="bg-black/95 rounded-[16px] p-0 min-h-[420px] flex flex-col overflow-hidden">
        {/* Rest of the component remains the same */}
        {/* Active Users */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-2 border-b border-[#23232a] overflow-x-auto">
          {activeUsers.length === 0 ? (
            <span className="text-[#aaa] text-[13px]">No active users</span>
          ) : (
            activeUsers.map((user) => (
              <div key={user.id} className="flex flex-col items-center min-w-[48px]">
                <img 
                  src={user.image} 
                  alt={user.username} 
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#333] mb-0.5" 
                />
                <span className="text-[#eee] text-[11px] text-center max-w-[48px] truncate">{user.username}</span>
              </div>
            ))
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 bg-transparent p-4 overflow-y-auto flex flex-col gap-2.5">
          {messages.length === 0 && (
            <span className="text-[#888] text-sm text-center">No messages yet.</span>
          )}
          {messages.map((message, index) => {
            const user = getUserForMessage(index);
            return (
              <div key={index} className="flex items-start gap-2 bg-[rgba(36,36,40,0.45)] rounded-lg p-2 shadow-sm max-w-[90%]">
                {user.image && (
                  <img 
                    src={user.image} 
                    alt={user.username} 
                    className="w-[22px] h-[22px] rounded-full object-cover mt-0.5" 
                  />
                )}
                <div className="flex flex-col">
                  <span className="text-[#bbb] text-[10px] font-medium mb-0.5 tracking-[0.01em]">{user.username}</span>
                  <span className="text-[#f5f5f5] text-[15px] break-words">{message}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const message = (e.target as HTMLFormElement).message.value;
            socket.send(message);
            (e.target as HTMLFormElement).reset();
          }} 
          className="flex items-center gap-2.5 bg-[#23232a] p-3.5 border-t border-[#23232a]"
        >
          <input
            type="text"
            name="message"
            placeholder="Type your message..."
            autoComplete="off"
            className="flex-1 bg-[#18181b] text-[#f5f5f5] border-none outline-none rounded-lg px-3.5 py-2.5 text-[15px] shadow-sm transition-shadow"
          />
          <button 
            type="submit" 
            className="bg-gradient-to-r from-[#ff9800] via-[#e040fb] to-[#00bcd4] text-white border-none rounded-lg px-4.5 py-2.5 font-semibold text-[15px] cursor-pointer shadow-sm transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}