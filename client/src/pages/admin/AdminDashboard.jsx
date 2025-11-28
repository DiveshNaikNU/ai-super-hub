import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Wrench, BookOpen, MessageSquare,
  TrendingUp, ArrowUpRight, ArrowDownRight,
  Plus, Eye
} from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/ui/Button';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    tools: 0,
    courses: 0,
    chats: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load stats - these endpoints may need to be created in backend
      const [usersRes, toolsRes, coursesRes] = await Promise.all([
        api.get('/users?limit=5').catch(() => ({ data: { data: { users: [] }, meta: { pagination: { totalItems: 0 } } } })),
        api.get('/tools?limit=1').catch(() => ({ data: { meta: { pagination: { totalItems: 0 } } } })),
        api.get('/courses?limit=1').catch(() => ({ data: { meta: { pagination: { totalItems: 0 } } } })),
      ]);

      setStats({
        users: usersRes.data?.meta?.pagination?.totalItems || usersRes.data?.data?.users?.length || 0,
        tools: toolsRes.data?.meta?.pagination?.totalItems || 0,
        courses: coursesRes.data?.meta?.pagination?.totalItems || 0,
        chats: 0
      });

      setRecentUsers(usersRes.data?.data?.users || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { 
      name: 'Total Users', 
      value: stats.users, 
      icon: Users, 
      change: '+12%',
      positive: true,
      href: '/admin/users',
      color: 'var(--color-primary)'
    },
    { 
      name: 'AI Tools', 
      value: stats.tools, 
      icon: Wrench, 
      change: '+5%',
      positive: true,
      href: '/admin/tools',
      color: 'var(--color-secondary)'
    },
    { 
      name: 'Courses', 
      value: stats.courses, 
      icon: BookOpen, 
      change: '+8%',
      positive: true,
      href: '/admin/courses',
      color: '#F472B6'
    },
    { 
      name: 'Chat Sessions', 
      value: stats.chats, 
      icon: MessageSquare, 
      change: '+24%',
      positive: true,
      href: '/admin',
      color: '#FBBF24'
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Dashboard</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Welcome to the admin panel</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.href}
              className="card card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div className={`flex items-center gap-1 text-xs ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                {isLoading ? '-' : stat.value}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{stat.name}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/admin/tools">
              <Button variant="secondary" className="w-full justify-start">
                <Plus className="w-4 h-4" />
                Add New Tool
              </Button>
            </Link>
            <Link to="/admin/courses">
              <Button variant="secondary" className="w-full justify-start">
                <Plus className="w-4 h-4" />
                Create Course
              </Button>
            </Link>
            <Link to="/admin/users">
              <Button variant="secondary" className="w-full justify-start">
                <Eye className="w-4 h-4" />
                View All Users
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Users */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Recent Users</h2>
            <Link 
              to="/admin/users" 
              className="text-sm hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              View all
            </Link>
          </div>
          
          {isLoading ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
          ) : recentUsers.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No users yet</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.slice(0, 5).map((user) => (
                <div 
                  key={user._id}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--color-bg)' }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: 'var(--color-text)' }}>{user.name}</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{user.email}</p>
                    </div>
                  </div>
                  <span 
                    className="text-xs px-2 py-1 rounded-full capitalize"
                    style={{ 
                      backgroundColor: user.role === 'admin' ? 'rgba(244,114,182,0.1)' : 'rgba(0,227,165,0.1)',
                      color: user.role === 'admin' ? '#F472B6' : 'var(--color-primary)'
                    }}
                  >
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
