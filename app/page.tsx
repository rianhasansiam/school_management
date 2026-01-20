'use client';

import Link from 'next/link';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  ClipboardCheck, 
  Calendar, 
  BarChart3,
  Shield,
  Clock,
  Award,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Play,
  Sparkles,
  Zap,
  Star,
  TrendingUp,
  Globe,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function Home() {
  const features = [
    {
      icon: Users,
      title: 'Student Management',
      description: 'Efficiently manage student records, admissions, and academic progress tracking.',
      gradient: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50',
    },
    {
      icon: BookOpen,
      title: 'Academic Management',
      description: 'Organize classes, subjects, assignments, and maintain comprehensive class notes.',
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: ClipboardCheck,
      title: 'Attendance Tracking',
      description: 'Digital attendance system with real-time tracking and detailed reports.',
      gradient: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50',
    },
    {
      icon: BarChart3,
      title: 'Financial Management',
      description: 'Handle fee collection, salary payments, and generate financial reports.',
      gradient: 'from-rose-500 to-pink-600',
      bg: 'bg-rose-50',
    },
    {
      icon: Calendar,
      title: 'Schedule Management',
      description: 'Create and manage class schedules, exam timetables, and academic calendars.',
      gradient: 'from-cyan-500 to-blue-600',
      bg: 'bg-cyan-50',
    },
    {
      icon: Award,
      title: 'Performance Reports',
      description: 'Generate comprehensive reports on student performance and school analytics.',
      gradient: 'from-indigo-500 to-violet-600',
      bg: 'bg-indigo-50',
    },
  ];

  const stats = [
    { value: '500+', label: 'Schools Trust Us', icon: Globe },
    { value: '50K+', label: 'Students Managed', icon: Users },
    { value: '5K+', label: 'Teachers Onboard', icon: GraduationCap },
    { value: '99.9%', label: 'Uptime', icon: Zap },
  ];

  const benefits = [
    'Easy to use interface designed for educators',
    'Secure cloud-based data storage',
    'Real-time notifications and updates',
    'Comprehensive reporting and analytics',
    'Multi-user access with role-based permissions',
    '24/7 customer support',
  ];

  const testimonials = [
    {
      name: 'Dr. Rahman',
      role: 'Principal, ABC School',
      text: 'EduManage has transformed how we manage our school. The efficiency gains are remarkable.',
      avatar: 'R',
    },
    {
      name: 'Sarah Ahmed',
      role: 'Administrator',
      text: 'The attendance tracking and report generation features save us hours every week.',
      avatar: 'S',
    },
    {
      name: 'Karim Hassan',
      role: 'Teacher',
      text: 'Finally, a system that understands what teachers need. Highly recommended!',
      avatar: 'K',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                EduManage
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Features</a>
              <a href="#about" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">About</a>
              <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Testimonials</a>
              <a href="#contact" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Contact</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-indigo-600">Login</Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Modern Gradient with Animated Elements */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-white to-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/30 to-blue-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">Trusted by 500+ Schools</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Modern School
                <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Management System
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Streamline your educational institution with our all-in-one platform. 
                Manage students, teachers, attendance, and finances effortlessly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/login">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-xl shadow-indigo-500/30 text-base px-8 h-14 w-full sm:w-auto"
                  >
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700 text-base px-8 h-14 w-full sm:w-auto"
                >
                  <Play className="w-5 h-5 mr-2 text-indigo-600" />
                  Watch Demo
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 flex items-center gap-6 justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {['R', 'S', 'K', 'A'].map((letter, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white font-semibold text-sm",
                        i === 0 && "bg-gradient-to-br from-pink-500 to-rose-500",
                        i === 1 && "bg-gradient-to-br from-violet-500 to-purple-500",
                        i === 2 && "bg-gradient-to-br from-indigo-500 to-blue-500",
                        i === 3 && "bg-gradient-to-br from-cyan-500 to-teal-500"
                      )}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Loved by 5,000+ educators</p>
                </div>
              </div>
            </div>

            {/* Right Content - Dashboard Preview */}
            <div className="relative hidden lg:block">
              {/* Main Card */}
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 border border-gray-100 p-6 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Layers className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Dashboard</p>
                      <p className="text-sm text-gray-500">Overview</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-emerald-700">Live</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4">
                    <Users className="w-6 h-6 text-indigo-600 mb-2" />
                    <p className="text-2xl font-bold text-gray-900">1,234</p>
                    <p className="text-sm text-gray-600">Students</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4">
                    <GraduationCap className="w-6 h-6 text-emerald-600 mb-2" />
                    <p className="text-2xl font-bold text-gray-900">56</p>
                    <p className="text-sm text-gray-600">Teachers</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4">
                    <ClipboardCheck className="w-6 h-6 text-amber-600 mb-2" />
                    <p className="text-2xl font-bold text-gray-900">94%</p>
                    <p className="text-sm text-gray-600">Attendance</p>
                  </div>
                  <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4">
                    <TrendingUp className="w-6 h-6 text-rose-600 mb-2" />
                    <p className="text-2xl font-bold text-gray-900">$45K</p>
                    <p className="text-sm text-gray-600">Revenue</p>
                  </div>
                </div>

                {/* Mini Chart Placeholder */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-700">Weekly Progress</p>
                    <span className="text-xs text-emerald-600 font-medium">+12%</span>
                  </div>
                  <div className="flex items-end gap-2 h-16">
                    {[40, 65, 45, 80, 55, 90, 75].map((height, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-md"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Card */}
              <div className="absolute -left-8 bottom-20 bg-white rounded-2xl shadow-xl shadow-emerald-500/10 border border-gray-100 p-4 transform -rotate-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Attendance Marked</p>
                    <p className="text-xs text-gray-500">Class 10A - Just now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <stat.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <p className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-50 rounded-full px-4 py-2 mb-4">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">Powerful Features</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your School
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite of tools helps you streamline operations, 
              improve communication, and focus on what matters most - education.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={cn(
                  "group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent hover:-translate-y-1",
                )}
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br",
                  feature.gradient
                )}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-2 mb-4">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Why Choose Us</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Built for Educators, by Educators
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                EduManage is designed specifically for educational institutions. 
                Our platform combines powerful features with an intuitive interface, making school 
                management effortless for administrators, teachers, and staff.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/login">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25"
                  >
                    Get Started Today
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">Save Time & Resources</h4>
                      <p className="text-gray-600">Automate repetitive tasks</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-700">Manual Data Entry</span>
                      <span className="text-rose-500 font-bold">-80%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-700">Administrative Tasks</span>
                      <span className="text-rose-500 font-bold">-65%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-700">Report Generation</span>
                      <span className="text-emerald-500 font-bold">10x Faster</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-700">Parent Satisfaction</span>
                      <span className="text-emerald-500 font-bold">+45%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-4 shadow-sm">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium text-gray-700">Testimonials</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Loved by Schools Everywhere
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what educators are saying about EduManage
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold",
                    index === 0 && "bg-gradient-to-br from-pink-500 to-rose-500",
                    index === 1 && "bg-gradient-to-br from-violet-500 to-purple-500",
                    index === 2 && "bg-gradient-to-br from-indigo-500 to-blue-500"
                  )}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your School?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join hundreds of schools already using EduManage to streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button 
                size="lg" 
                className="bg-white text-indigo-600 hover:bg-gray-100 shadow-xl text-base px-8 h-14"
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="#contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white/30 text-white hover:bg-white/10 text-base px-8 h-14"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600">Have questions? We would love to hear from you.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-8 bg-gray-50 rounded-2xl hover:bg-indigo-50 transition-colors group">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600">+880 1711-223344</p>
            </div>
            <div className="text-center p-8 bg-gray-50 rounded-2xl hover:bg-indigo-50 transition-colors group">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">info@edumanage.com</p>
            </div>
            <div className="text-center p-8 bg-gray-50 rounded-2xl hover:bg-indigo-50 transition-colors group">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-600">Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">EduManage</span>
              </div>
              <p className="text-gray-400">
                Empowering educational institutions with modern management solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 EduManage. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
