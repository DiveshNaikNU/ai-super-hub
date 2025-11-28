import { motion } from 'framer-motion';
import { 
  BookOpen, MessageSquare, Wrench, Trophy,
  Clock, TrendingUp, Star, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const quickActions = [
  { name: 'Start Chat', icon: MessageSquare, href: '/chat', color: 'from-primary to-emerald-400' },
  { name: 'Browse Tools', icon: Wrench, href: '/tools', color: 'from-secondary to-blue-400' },
  { name: 'Learn AI', icon: BookOpen, href: '/courses', color: 'from-purple-500 to-pink-400' },
];

const stats = [
  { label: 'Courses Enrolled', value: '3', icon: BookOpen, change: '+1 this week' },
  { label: 'Chat Sessions', value: '24', icon: MessageSquare, change: '+5 today' },
  { label: 'Tools Bookmarked', value: '12', icon: Star, change: '+2 this week' },
  { label: 'Learning Hours', value: '8.5', icon: Clock, change: '+2.5 this week' },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container-custom py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>! 👋
        </h1>
        <p className="text-text-secondary">
          Here's what's happening with your AI journey today.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid sm:grid-cols-3 gap-4 mb-8"
      >
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.name} to={action.href}>
              <div className="card card-hover group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} p-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {action.name}
                    </h3>
                    <p className="text-sm text-text-muted">Quick access</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>
          );
        })}
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </div>
          );
        })}
      </motion.div>

      {/* Recent Activity & Continue Learning */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Continue Learning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Continue Learning</h2>
            <Link to="/courses" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-dark-bg border border-dark-border">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Introduction to Machine Learning</h3>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <span>65% complete</span>
                    <span>•</span>
                    <span>3 lessons left</span>
                  </div>
                  <div className="mt-2 h-2 bg-dark-border rounded-full overflow-hidden">
                    <div className="h-full w-[65%] bg-gradient-to-r from-primary to-secondary rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            
            <Link to="/courses">
              <Button variant="secondary" className="w-full">
                Browse More Courses
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Recent Chats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Recent Chats</h2>
            <Link to="/chat" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          
          <div className="space-y-3">
            {['React Hooks Explained', 'Python Data Analysis', 'Machine Learning Basics'].map((chat, i) => (
              <Link key={i} to="/chat" className="block p-3 rounded-lg bg-dark-bg border border-dark-border hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{chat}</h4>
                    <p className="text-xs text-text-muted">{i === 0 ? '2 hours ago' : i === 1 ? 'Yesterday' : '3 days ago'}</p>
                  </div>
                </div>
              </Link>
            ))}
            
            <Link to="/chat">
              <Button variant="secondary" className="w-full">
                Start New Chat
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
