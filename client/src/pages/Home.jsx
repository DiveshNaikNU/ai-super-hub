import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, MessageSquare, BookOpen, Wrench, Zap, 
  ArrowRight, Bot, Brain, Code, Lightbulb, Shield, Users
} from 'lucide-react';
import Button from '../components/ui/Button';

const features = [
  {
    icon: MessageSquare,
    title: 'AI Chat Hub',
    description: 'Chat with advanced AI models. Get answers, code help, and creative assistance instantly.',
    color: 'from-primary to-emerald-400',
    href: '/chat'
  },
  {
    icon: BookOpen,
    title: 'Learn AI',
    description: 'Master artificial intelligence with curated courses, tutorials, and hands-on projects.',
    color: 'from-secondary to-blue-400',
    href: '/courses'
  },
  {
    icon: Wrench,
    title: 'AI Tools Directory',
    description: 'Discover and bookmark the best AI tools. From image generation to code assistants.',
    color: 'from-purple-500 to-pink-400',
    href: '/tools'
  },
];

const stats = [
  { value: '50+', label: 'AI Tools' },
  { value: '20+', label: 'Courses' },
  { value: '10K+', label: 'Users' },
  { value: '99%', label: 'Uptime' },
];

const benefits = [
  { icon: Zap, title: 'Lightning Fast', description: 'Optimized for speed and performance' },
  { icon: Shield, title: 'Secure', description: 'Your data is encrypted and protected' },
  { icon: Users, title: 'Community', description: 'Join thousands of AI enthusiasts' },
  { icon: Lightbulb, title: 'Always Learning', description: 'New content added weekly' },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px]" />
      </div>

      {/* Hero Section */}
      <section className="container-custom pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powered by Advanced AI</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            Your Gateway to the
            <span className="block text-gradient mt-2">AI Universe</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            Explore cutting-edge AI tools, master machine learning with expert courses, 
            and chat with intelligent assistants — all in one powerful platform.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="min-w-[200px]">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/tools">
              <Button variant="secondary" size="lg" className="min-w-[200px]">
                Explore AI Tools
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-16 pt-16 border-t border-dark-border"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-text-secondary mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container-custom py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need for AI
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            From learning to building, we've got all the tools and resources to supercharge your AI journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={feature.href}>
                  <div className="card card-hover h-full group">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary">
                      {feature.description}
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">Learn more</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container-custom py-24">
        <div className="card bg-gradient-to-br from-dark-surface to-dark-bg border-primary/20 p-8 sm:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Why Choose <span className="text-gradient">AI Super Hub</span>?
              </h2>
              <p className="text-text-secondary mb-8">
                We're building the most comprehensive AI platform for learners, developers, and enthusiasts. 
                Everything you need, all in one place.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={benefit.title} className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{benefit.title}</h4>
                        <p className="text-sm text-text-secondary">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8 flex items-center justify-center">
                <Bot className="w-32 h-32 text-primary animate-float" />
              </div>
              <div className="absolute -top-4 -right-4 p-4 rounded-xl glass">
                <Brain className="w-8 h-8 text-secondary" />
              </div>
              <div className="absolute -bottom-4 -left-4 p-4 rounded-xl glass">
                <Code className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Start Your AI Journey?
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto mb-8">
            Join thousands of users already exploring the future of artificial intelligence.
          </p>
          <Link to="/register">
            <Button size="xl" className="min-w-[250px]">
              Get Started — It's Free
              <Sparkles className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
