import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import AuthPopup from './AuthPopup';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWithAuthProps {
  modelId: string;
  modelName: string;
  sendMessage: (message: string) => Promise<string>;
  placeholder?: string;
  initialMessages?: Message[];
}

export default function ChatWithAuth({
  modelId,
  modelName,
  sendMessage,
  placeholder = '',
  initialMessages = [],
}: ChatWithAuthProps) {
  const { user, hasModelAccess, setIsLoginOpen } = useAuth();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasAccess = user && hasModelAccess(modelId);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Check if user is logged in
    if (!user) {
      setShowLoginPrompt(true);
      setIsLoginOpen(true);
      return;
    }

    // Check if user has access to this model
    if (!hasAccess) {
      setShowLoginPrompt(true);
      return;
    }

    const userMessage = input;
    setInput('');
    setIsLoading(true);

    // Add user message to chat
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    try {
      // Get response from AI
      const response = await sendMessage(userMessage);
      
      // Add assistant message to chat
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: t('message_error') },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLoginComplete = () => {
    setShowLoginPrompt(false);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--background)] bg-opacity-10 backdrop-blur-sm rounded-2xl p-4 border border-[var(--border)] overflow-hidden">
      {/* Chat header */}
      <div className="flex justify-between items-center p-2 mb-4">
        <h3 className="text-xl font-bold text-white">{modelName}</h3>
        <button 
          onClick={clearChat} 
          className="text-violet-300 hover:text-white transition-colors"
          aria-label={t('clear_chat')}
        >
          <FiRefreshCw />
        </button>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-xl max-w-[85%] ${message.role === 'user' ? 'bg-violet-600 bg-opacity-20 ml-auto' : 'bg-white bg-opacity-5 mr-auto'}`}
            >
              <p className="text-white whitespace-pre-wrap">{message.content}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white bg-opacity-5 p-4 rounded-xl max-w-[85%] mr-auto"
          >
            <div className="flex space-x-2 items-center">
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse delay-75" />
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse delay-150" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="relative">
        {!user && showLoginPrompt && (
          <div className="absolute bottom-full left-0 right-0 mb-4 p-4 bg-purple-900 bg-opacity-90 rounded-lg text-white text-center">
            <p>{t('login_to_use_ai')}</p>
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="mt-2 px-4 py-2 bg-violet-500 rounded-lg hover:bg-violet-600 transition-colors"
            >
              {t('login_now')}
            </button>
          </div>
        )}
        
        {user && !hasAccess && showLoginPrompt && (
          <div className="absolute bottom-full left-0 right-0 mb-4 p-4 bg-purple-900 bg-opacity-90 rounded-lg text-white text-center">
            <p>{t('upgrade_for_model_access')}</p>
            <button 
              onClick={() => window.location.href = '/pricing'}
              className="mt-2 px-4 py-2 bg-violet-500 rounded-lg hover:bg-violet-600 transition-colors"
            >
              {t('view_plans')}
            </button>
          </div>
        )}
        
        <div className="flex">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || t('type_message')}
            className="flex-1 resize-none p-4 bg-white bg-opacity-5 rounded-l-lg border border-[var(--border)] focus:outline-none focus:border-violet-500 text-white placeholder-violet-300 min-h-[60px]"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className={`px-4 rounded-r-lg flex items-center justify-center ${isLoading || !input.trim() ? 'bg-violet-700 text-violet-300' : 'bg-violet-600 text-white hover:bg-violet-500'}`}
            aria-label={t('send_message')}
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Auth popup */}
      <AuthPopup 
        triggerReason="send_button"
        onAuthComplete={handleLoginComplete}
      />
    </div>
  );
}
