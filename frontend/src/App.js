import './App.css';
import { useState, useEffect, useRef } from 'react';
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import FooterInput from "./components/FooterInput";
import Messages from "./components/Messages";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ScrollToBottomButton from "./components/ScrollToBottomButton";
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [isSideBarVisible, setIsSideBarVisible] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
  const [showBottomButton, setShowBottomButton] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    const resetChats = async () => {
      try {
        console.log('Resetting chats...');
        const response = await axios.post('https://chatbot-ai-gydp.onrender.com/');
        console.log('Reset response:', response.data);
        setMessages([]);
        setConversationId('chat-1');
      } catch (error) {
        console.error('Error resetting chats:', error.response ? error.response.data : error.message);
        setMessages([]);
        setConversationId('chat-1');
      }
    };
    resetChats();
  }, []);

  useEffect(() => {
    if (conversationId) {
      const fetchChatHistory = async () => {
        try {
          console.log('Fetching history for:', conversationId);
          const response = await axios.get('https://chatbot-ai-gydp.onrender.com/', {
            params: { conversation_id: conversationId },
          });
          const chatHistory = response.data.chats;
          console.log('Fetched history:', chatHistory);
          const formattedMessages = chatHistory.flatMap(chat => [
            { sender: 'User', text: chat.user_input },
            { sender: 'Bot', text: chat.bot_response },
          ]);
          setMessages(formattedMessages);
        } catch (error) {
          console.error('Error fetching chat history:', error);
          setMessages([]);
        }
      };
      fetchChatHistory();
    } else {
      setMessages([]);
      console.log('No conversationId, messages cleared');
    }
  }, [conversationId]);

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (messagesRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
        const isNearTop = scrollTop < 100; // Show bottom button when near top
        const isNearBottom = scrollTop + clientHeight > scrollHeight - 100; // Show top button when far from bottom

        setShowTopButton(!isNearTop); // Show when scrolled down
        setShowBottomButton(!isNearBottom); // Show when scrolled up
      }
    };

    const messagesContainer = messagesRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (messagesContainer) {
        messagesContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scrollToTop = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
    }
  };

  const handleSendMessage = (messageText, sender = 'User') => {
    if (messageText.trim() === "") return;
    setMessages((prevMessages) => [...prevMessages, { sender, text: messageText }]);
  };

  const handleChatDeletion = (deletedId) => {
    if (conversationId === deletedId) {
      setConversationId('chat-1');
    }
  };

  return (
    <div className="App flex flex-col h-screen">
      <Header setIsSideBarVisible={setIsSideBarVisible} isSideBarVisible={isSideBarVisible} />
      <SideBar
        conversationId={conversationId}
        setConversationId={setConversationId}
        isVisible={isSideBarVisible}
        setIsVisible={setIsSideBarVisible}
        onChatDelete={handleChatDeletion}
      />
      <Messages ref={messagesRef} messages={messages} />
      <ScrollToTopButton onClick={scrollToTop} isVisible={showTopButton} />
      <ScrollToBottomButton onClick={scrollToBottom} isVisible={showBottomButton} />
      <FooterInput
        onSendMessage={handleSendMessage}
        conversationId={conversationId}
      />
    </div>
  );
}

export default App;
