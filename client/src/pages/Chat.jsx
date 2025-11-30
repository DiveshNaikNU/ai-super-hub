import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { 
  Send, Plus, MessageSquare, Trash2, Sparkles,
  Bot, User, Loader2, ChevronDown,
  GraduationCap, Code, FileText, Zap
} from 'lucide-react';
import { chatsAPI } from '../services/api';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const chatModes = [
  { id: 'general', name: 'General', icon: Zap },
  { id: 'tutor', name: 'Tutor', icon: GraduationCap },
  { id: 'coder', name: 'Coder', icon: Code },
  { id: 'summarizer', name: 'Summarizer', icon: FileText },
];

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedMode, setSelectedMode] = useState('general');
  const [showModeSelector, setShowModeSelector] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadChats();
  }, []);

  // Auto-scroll to bottom when messages change or when sending
  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const loadChats = async () => {
    try {
      setIsLoading(true);
      const response = await chatsAPI.getAll({ limit: 50 });
      setChats(response.data.data.chats || []);
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChat = async (chatId) => {
    try {
      const response = await chatsAPI.getOne(chatId);
      const chat = response.data.data.chat;
      setActiveChat(chat);
      setMessages(chat.messages || []);
      setSelectedMode(chat.mode || 'general');
      // Scroll after state update
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      toast.error('Failed to load chat');
    }
  };

  const createNewChat = async () => {
    setActiveChat(null);
    setMessages([]);
    inputRef.current?.focus();
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const messageText = input.trim();
    setInput('');
    setIsSending(true);

    // Add user message to UI immediately
    const userMsg = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMsg]);

    try {
      let chatId = activeChat?._id;

      // Create new chat if none exists
      if (!chatId) {
        const createResponse = await chatsAPI.create({ mode: selectedMode });
        const newChat = createResponse.data.data.chat;
        setActiveChat(newChat);
        setChats(prev => [newChat, ...prev]);
        chatId = newChat._id;
      }

      // Send message to API
      const response = await chatsAPI.sendMessage(chatId, { message: messageText });
      const data = response.data.data;

      // Add AI response to messages
      if (data.assistantMessage) {
        setMessages(prev => [...prev, data.assistantMessage]);
      }

      // Update chat title in sidebar
      if (data.chat?.title) {
        setChats(prev => prev.map(c => 
          c._id === chatId ? { ...c, title: data.chat.title } : c
        ));
        setActiveChat(prev => prev ? { ...prev, title: data.chat.title } : prev);
      }

    } catch (error) {
      console.error('Send error:', error);
      toast.error('Failed to send message');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsSending(false);
    }
  };

  const deleteChat = async (chatId, e) => {
    e.stopPropagation();
    try {
      await chatsAPI.delete(chatId);
      setChats(prev => prev.filter(c => c._id !== chatId));
      if (activeChat?._id === chatId) {
        setActiveChat(null);
        setMessages([]);
      }
      toast.success('Chat deleted');
    } catch (error) {
      toast.error('Failed to delete chat');
    }
  };

  const ModeIcon = chatModes.find(m => m.id === selectedMode)?.icon || Zap;

  return (
    <div className="h-[calc(100vh-4rem)] flex" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <div 
        className="w-64 border-r flex flex-col"
        style={{ 
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)'
        }}
      >
        <div className="p-4">
          <Button onClick={createNewChat} className="w-full" size="md">
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary)' }} />
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chats yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => loadChat(chat._id)}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all"
                  style={{ 
                    backgroundColor: activeChat?._id === chat._id ? 'rgba(0,227,165,0.1)' : 'transparent',
                    color: activeChat?._id === chat._id ? 'var(--color-primary)' : 'var(--color-text-secondary)'
                  }}
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="flex-1 truncate text-sm">{chat.title}</span>
                  <button
                    onClick={(e) => deleteChat(chat._id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div 
          className="h-14 border-b flex items-center justify-between px-4"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <h2 className="font-medium" style={{ color: 'var(--color-text)' }}>
            {activeChat?.title || 'New Chat'}
          </h2>
          
          <div className="relative">
            <button
              onClick={() => setShowModeSelector(!showModeSelector)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)'
              }}
            >
              <ModeIcon className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
              <span className="text-sm">{chatModes.find(m => m.id === selectedMode)?.name}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showModeSelector && (
              <div 
                className="absolute right-0 mt-2 w-48 border rounded-xl shadow-xl z-50"
                style={{ 
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)'
                }}
              >
                {chatModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => {
                        setSelectedMode(mode.id);
                        setShowModeSelector(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors first:rounded-t-xl last:rounded-b-xl"
                      style={{ 
                        backgroundColor: selectedMode === mode.id ? 'rgba(0,227,165,0.1)' : 'transparent',
                        color: selectedMode === mode.id ? 'var(--color-primary)' : 'var(--color-text)'
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{mode.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Messages Container - Fixed scroll */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4"
          style={{ scrollBehavior: 'smooth' }}
        >
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-4">
                  <Sparkles className="w-full h-full" style={{ color: 'var(--color-bg)' }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                  Start a conversation
                </h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>Ask me anything!</p>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: msg.role === 'user' 
                        ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' 
                        : 'var(--color-surface)',
                      border: msg.role === 'user' ? 'none' : '1px solid var(--color-border)'
                    }}
                  >
                    {msg.role === 'user' 
                      ? <User className="w-4 h-4" style={{ color: 'var(--color-bg)' }} />
                      : <Bot className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                    }
                  </div>
                  <div 
                    className="max-w-[80%] px-4 py-3 rounded-2xl"
                    style={{
                      backgroundColor: msg.role === 'user' ? 'var(--color-primary)' : 'var(--color-surface)',
                      color: msg.role === 'user' ? 'var(--color-bg)' : 'var(--color-text)',
                      border: msg.role === 'user' ? 'none' : '1px solid var(--color-border)'
                    }}
                  >
                    <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isSending && (
                <div className="flex gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <Bot className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div 
                    className="px-4 py-3 rounded-2xl"
                    style={{ 
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--color-primary)' }} />
                  </div>
                </div>
              )}
              
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t p-4" style={{ borderColor: 'var(--color-border)' }}>
          <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isSending}
              className="flex-1 px-4 py-3 rounded-xl focus:outline-none transition-colors"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)'
              }}
            />
            <Button type="submit" disabled={!input.trim() || isSending}>
              {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </form>
        </div>
      </div>

      {/* Backdrop for mode selector */}
      {showModeSelector && (
        <div className="fixed inset-0 z-40" onClick={() => setShowModeSelector(false)} />
      )}
    </div>
  );
}
