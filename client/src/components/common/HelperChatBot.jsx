import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, Send, Bot, User, Sparkles, 
  BookOpen, Wrench, GraduationCap, Target, Compass,
  LogIn, UserPlus, Loader2, ChevronRight, Zap,
  Brain, Code, Image, Mic, TrendingUp, Award,
  ArrowRight, RotateCcw, Minimize2
} from 'lucide-react';

// Quick action categories
const quickActions = [
  { id: 'beginner', label: "I'm new to AI", icon: Sparkles, color: '#00E3A5' },
  { id: 'learning-path', label: 'Suggest a learning path', icon: Compass, color: '#4FC3F7' },
  { id: 'courses', label: 'Browse courses', icon: BookOpen, color: '#FFB74D' },
  { id: 'tools', label: 'Explore AI tools', icon: Wrench, color: '#F06292' },
  { id: 'certificate', label: 'Get certified', icon: Award, color: '#BA68C8' },
];

// Goal-based quick actions
const goalActions = [
  { id: 'ml', label: 'Learn Machine Learning', icon: Brain },
  { id: 'prompt', label: 'Master Prompt Engineering', icon: Zap },
  { id: 'creative', label: 'AI for Creative Work', icon: Image },
  { id: 'coding', label: 'AI-Assisted Coding', icon: Code },
];

// Pre-defined responses
const responses = {
  greeting: `👋 Welcome to **AI Super Hub**! I'm your AI Learning Guide.

I can help you:
• 🛤️ Find the perfect learning path
• 📚 Discover courses for your goals
• 🛠️ Explore 70+ AI tools
• 🎯 Plan your AI journey

**What would you like to explore today?**`,

  beginner: `Great choice starting your AI journey! 🚀

Here's my recommended **Beginner's Path**:

**Step 1: Foundations** (Free)
📘 *Introduction to AI & ML* - 8 hours
Learn core concepts, types of AI, and real-world applications

**Step 2: Hands-On Skills** (Free)  
🐍 *Python for AI* - 12 hours
Essential programming for AI/ML projects

**Step 3: First Project**
🔬 *Data Science Fundamentals* - 15 hours
Build your first ML model!

💡 **Tip**: Start with our free courses to build a strong foundation.

Would you like me to explain any of these courses in detail?`,

  'learning-path': `I'll help you find the perfect path! 🎯

**What's your main goal?**

🧠 **Machine Learning** - Build AI models & algorithms
✨ **Prompt Engineering** - Master ChatGPT, Claude, etc.
🎨 **AI Creative** - Images, videos, music with AI
💻 **AI Coding** - GitHub Copilot, code assistants

Or tell me more about what you want to achieve!`,

  courses: `📚 **Our Course Categories:**

**By Skill Level:**
• 🟢 Beginner - No prior experience needed
• 🟡 Intermediate - Some AI/ML knowledge
• 🔴 Advanced - For practitioners

**Popular Categories:**
• 🧠 Machine Learning & Deep Learning
• 💬 Natural Language Processing
• 👁️ Computer Vision
• ✨ Prompt Engineering
• 📊 Data Science

**What interests you most?** I can recommend specific courses!`,

  tools: `🛠️ **AI Tools Directory** - 70+ Tools!

**Categories:**
• ✍️ **Writing** - ChatGPT, Claude, Jasper, Copy.ai
• 🎨 **Image** - Midjourney, DALL-E, Stable Diffusion
• 🎬 **Video** - Runway, Synthesia, HeyGen
• 🎵 **Audio** - ElevenLabs, Murf AI, Suno
• 💻 **Coding** - GitHub Copilot, Cursor, Replit AI
• 📊 **Productivity** - Notion AI, Zapier, Otter.ai

All tools include:
✅ Direct links to websites
✅ Pricing info (Free/Freemium/Paid)
✅ Category tags
✅ Bookmark feature (after login)

**Which category interests you?**`,

  certificate: `🎓 **Earn AI Certificates!**

**How it works:**
1. 📚 Enroll in any course
2. ▶️ Complete all video lessons
3. ✅ Pass the final quiz (70%+ score)
4. 🏆 Download your certificate!

**Certificate includes:**
• Your name & course title
• Completion date
• Unique certificate ID
• Shareable on LinkedIn!

**Popular Certified Courses:**
• Machine Learning Fundamentals
• Deep Learning with TensorFlow
• Prompt Engineering Mastery

Want me to suggest a course to get certified?`,

  ml: `🧠 **Machine Learning Path**

**Recommended Learning Order:**

**1. Foundations** (2-3 weeks)
📘 *ML Fundamentals* - 20 hours
Algorithms, supervised/unsupervised learning, model evaluation

**2. Deep Learning** (3-4 weeks)
🔥 *Deep Learning with TensorFlow* - 25 hours
Neural networks, CNNs, RNNs, transformers

**3. Deployment** (1-2 weeks)
🚀 *ML Model Deployment* - 10 hours
APIs, Docker, cloud deployment

**Tools to Practice:**
• Google Colab (Free)
• Kaggle Datasets
• HuggingFace Models

Ready to start? Create an account to enroll! 🎯`,

  prompt: `✨ **Prompt Engineering Path**

**Why Learn This?**
• High demand skill in 2024
• Works with any AI tool
• No coding required!

**Recommended Courses:**

**1. Start Here** (Free!)
💬 *ChatGPT Mastery* - 6 hours
Basic to advanced prompting techniques

**2. Level Up**
🎯 *Advanced Prompt Engineering* - 10 hours
Chain-of-thought, few-shot learning, system prompts

**3. Apply Skills**
⚡ *AI Tools for Productivity* - 8 hours
Automate tasks with AI

**Tools to Master:**
• ChatGPT & GPT-4
• Claude (Anthropic)
• Midjourney (Images)
• Perplexity (Research)

All available in our Tools section! 🛠️`,

  creative: `🎨 **AI Creative Path**

**Create Amazing Content with AI!**

**Image Generation** (Start Here)
🖼️ *Midjourney & DALL-E Mastery* - 8 hours
Create stunning AI art & graphics

**Video Creation**
🎬 *AI Video Generation* - 12 hours
Runway, Synthesia, HeyGen tutorials

**Audio & Music**
🎵 *AI Music & Audio Creation* - 10 hours
ElevenLabs, Suno AI, voice cloning

**Top Creative Tools:**
• Midjourney - Best for artistic images
• DALL-E 3 - Best for realistic images
• Runway - Professional video editing
• ElevenLabs - Voice generation
• Suno - Music creation

Explore all 70+ tools in our directory! 🚀`,

  coding: `💻 **AI-Assisted Coding Path**

**Boost Your Coding 10x!**

**Essential Tools:**
• 🤖 **GitHub Copilot** - AI pair programmer
• ⚡ **Cursor** - AI-first code editor  
• 🔄 **Replit AI** - Code generation & explanation
• 📝 **Tabnine** - AI autocomplete

**How They Help:**
✅ Write code faster
✅ Auto-complete functions
✅ Explain complex code
✅ Find & fix bugs
✅ Generate tests

**Recommended Learning:**
1. Start with GitHub Copilot (most popular)
2. Learn prompt patterns for code
3. Practice on real projects

Check our Coding tools category for all options! 🛠️`,

  login: `🔐 **How to Login:**

1. Enter your **email** and **password**
2. Click **"Sign In"**

**Or use Google:**
• Click "Continue with Google"
• Select your Google account
• You're in! 🎉

**Forgot password?**
• Click "Forgot password?"
• Enter your email
• Check inbox for reset link

Need to create an account first? Click "Sign up for free"!`,

  register: `📝 **Create Your Free Account:**

1. Click **"Sign up for free"**
2. Enter your **name**, **email**, **password**
3. Confirm your password
4. Click **"Create Account"**

**Or use Google:**
• Click "Continue with Google"
• One-click signup! ⚡

**What you get:**
✅ Access to free courses
✅ Bookmark AI tools
✅ Track your progress
✅ Earn certificates
✅ AI chat assistant

Ready to start your AI journey? 🚀`,

  default: `I'm here to help you explore AI Super Hub! 🤖

**I can help with:**
• 🛤️ Finding the right learning path
• 📚 Course recommendations
• 🛠️ AI tools exploration
• 🎓 Certificate information
• ❓ Platform navigation

**Try asking:**
• "What courses should I start with?"
• "I want to learn prompt engineering"
• "Show me image generation tools"
• "How do I get certified?"

What would you like to know?`
};

export default function HelperChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: responses.greeting }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showGoalActions, setShowGoalActions] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  // Auto-open after 5 seconds on first visit
  useEffect(() => {
    const hasSeenBot = localStorage.getItem('hasSeenHelperBot');
    if (!hasSeenBot) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('hasSeenHelperBot', 'true');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Generate response based on user input
  const generateResponse = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Keyword matching for instant responses
    if (lowerMessage.includes('login') || lowerMessage.includes('sign in')) {
      return responses.login;
    }
    if (lowerMessage.includes('register') || lowerMessage.includes('sign up') || lowerMessage.includes('create account')) {
      return responses.register;
    }
    if (lowerMessage.includes('beginner') || lowerMessage.includes('new to ai') || lowerMessage.includes('start')) {
      return responses.beginner;
    }
    if (lowerMessage.includes('learning path') || lowerMessage.includes('path') || lowerMessage.includes('roadmap')) {
      setShowGoalActions(true);
      return responses['learning-path'];
    }
    if (lowerMessage.includes('course')) {
      return responses.courses;
    }
    if (lowerMessage.includes('tool')) {
      return responses.tools;
    }
    if (lowerMessage.includes('certificate') || lowerMessage.includes('certified')) {
      return responses.certificate;
    }
    if (lowerMessage.includes('machine learning') || lowerMessage.includes(' ml ') || lowerMessage.includes('ml')) {
      return responses.ml;
    }
    if (lowerMessage.includes('prompt')) {
      return responses.prompt;
    }
    if (lowerMessage.includes('creative') || lowerMessage.includes('image') || lowerMessage.includes('art') || lowerMessage.includes('design')) {
      return responses.creative;
    }
    if (lowerMessage.includes('coding') || lowerMessage.includes('code') || lowerMessage.includes('programming') || lowerMessage.includes('developer')) {
      return responses.coding;
    }
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      return responses.greeting;
    }

    // Try backend API for complex questions
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat/helper`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, context: 'learning_guide' }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.data?.response || responses.default;
      }
    } catch (error) {
      console.log('Using fallback response');
    }

    return responses.default;
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setShowQuickActions(false);
    setShowGoalActions(false);
    setHasInteracted(true);
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);
    
    const response = await generateResponse(userMessage);
    
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
  };

  const handleQuickAction = async (actionId) => {
    setShowQuickActions(false);
    setHasInteracted(true);
    
    const action = quickActions.find(a => a.id === actionId);
    const label = action?.label || actionId;
    
    setMessages(prev => [...prev, { role: 'user', content: label }]);
    setIsTyping(true);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setIsTyping(false);
    
    if (actionId === 'learning-path') {
      setShowGoalActions(true);
    }
    
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: responses[actionId] || responses.default 
    }]);
  };

  const handleGoalAction = async (goalId) => {
    setShowGoalActions(false);
    
    const goal = goalActions.find(g => g.id === goalId);
    const label = goal?.label || goalId;
    
    setMessages(prev => [...prev, { role: 'user', content: label }]);
    setIsTyping(true);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setIsTyping(false);
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: responses[goalId] || responses.default 
    }]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setMessages([{ role: 'assistant', content: responses.greeting }]);
    setShowQuickActions(true);
    setShowGoalActions(false);
    setHasInteracted(false);
  };

  // Render markdown-like formatting
  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/•/g, '•')
      .split('\n')
      .map((line, i) => (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: line }} />
          {i < text.split('\n').length - 1 && <br />}
        </span>
      ));
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 pointer-events-none">
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl group pointer-events-auto"
            style={{ 
              background: 'linear-gradient(135deg, #00E3A5 0%, #4FC3F7 100%)',
              boxShadow: '0 8px 32px rgba(0, 227, 165, 0.4)'
            }}
          >
            <Bot className="w-7 h-7 text-black" />
            
            {/* Pulse animation */}
            <span className="absolute inset-0 rounded-full animate-ping opacity-20" 
              style={{ background: 'linear-gradient(135deg, #00E3A5 0%, #4FC3F7 100%)' }} 
            />
            
            {/* Tooltip */}
            <span className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              AI Learning Guide 🎯
            </span>
            
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-[10px] text-white font-bold">1</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '580px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-[400px] rounded-2xl overflow-hidden flex flex-col shadow-2xl pointer-events-auto"
            style={{ 
              backgroundColor: '#0a0a0a',
              border: '1px solid #1a1a1a',
              maxHeight: '90vh'
            }}
          >
            {/* Header */}
            <div 
              className="px-4 py-3 flex items-center justify-between cursor-pointer"
              style={{ 
                background: 'linear-gradient(135deg, rgba(0,227,165,0.15) 0%, rgba(79,195,247,0.15) 100%)',
                borderBottom: '1px solid #1a1a1a'
              }}
              onClick={() => isMinimized && setIsMinimized(false)}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #00E3A5 0%, #4FC3F7 100%)' }}
                >
                  <GraduationCap className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                    AI Learning Guide
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-400">
                      Online • Here to help
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); resetChat(); }}
                  className="p-2 rounded-lg transition-colors hover:bg-white/10 text-gray-400 hover:text-white"
                  title="Reset chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                  className="p-2 rounded-lg transition-colors hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg transition-colors hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '380px' }}>
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      <div 
                        className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                          msg.role === 'user' ? 'bg-blue-500/20' : ''
                        }`}
                        style={msg.role === 'assistant' ? { 
                          background: 'linear-gradient(135deg, #00E3A5 0%, #4FC3F7 100%)' 
                        } : {}}
                      >
                        {msg.role === 'user' ? (
                          <User className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Bot className="w-4 h-4 text-black" />
                        )}
                      </div>
                      
                      {/* Message Bubble */}
                      <div 
                        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'
                        }`}
                        style={{ 
                          backgroundColor: msg.role === 'user' ? 'rgba(79, 195, 247, 0.15)' : '#111',
                          color: '#e5e5e5'
                        }}
                      >
                        {formatMessage(msg.content)}
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #00E3A5 0%, #4FC3F7 100%)' }}
                      >
                        <Bot className="w-4 h-4 text-black" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5" style={{ backgroundColor: '#111' }}>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {showQuickActions && !hasInteracted && (
                  <div className="px-4 pb-2">
                    <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={action.id}
                            onClick={() => handleQuickAction(action.id)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105 active:scale-95"
                            style={{ 
                              backgroundColor: `${action.color}15`,
                              color: action.color,
                              border: `1px solid ${action.color}30`
                            }}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {action.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Goal Actions */}
                {showGoalActions && (
                  <div className="px-4 pb-2">
                    <p className="text-xs text-gray-500 mb-2">Choose your goal:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {goalActions.map((goal) => {
                        const Icon = goal.icon;
                        return (
                          <button
                            key={goal.id}
                            onClick={() => handleGoalAction(goal.id)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105 active:scale-95 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                          >
                            <Icon className="w-3.5 h-3.5 text-[#00E3A5]" />
                            {goal.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-3" style={{ borderTop: '1px solid #1a1a1a' }}>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus-within:border-[#00E3A5]/50 transition-colors">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about courses, tools, learning paths..."
                      className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                      disabled={isTyping}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping}
                      className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
                      style={{ 
                        background: input.trim() ? 'linear-gradient(135deg, #00E3A5 0%, #4FC3F7 100%)' : 'transparent',
                        color: input.trim() ? '#000' : '#666'
                      }}
                    >
                      {isTyping ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-center text-[10px] text-gray-600 mt-2">
                    Powered by AI Super Hub • Your AI Learning Companion 🎓
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
