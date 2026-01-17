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
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui';

export default function Home() {
  const features = [
    {
      icon: Users,
      title: 'Student Management',
      description: 'Efficiently manage student records, admissions, and academic progress tracking.',
      color: 'bg-blue-500',
    },
    {
      icon: BookOpen,
      title: 'Academic Management',
      description: 'Organize classes, subjects, assignments, and maintain comprehensive class notes.',
      color: 'bg-green-500',
    },
    {
      icon: ClipboardCheck,
      title: 'Attendance Tracking',
      description: 'Digital attendance system with real-time tracking and detailed reports.',
      color: 'bg-purple-500',
    },
    {
      icon: BarChart3,
      title: 'Financial Management',
      description: 'Handle fee collection, salary payments, and generate financial reports.',
      color: 'bg-orange-500',
    },
    {
      icon: Calendar,
      title: 'Schedule Management',
      description: 'Create and manage class schedules, exam timetables, and academic calendars.',
      color: 'bg-pink-500',
    },
    {
      icon: Award,
      title: 'Performance Reports',
      description: 'Generate comprehensive reports on student performance and school analytics.',
      color: 'bg-cyan-500',
    },
  ];

  const stats = [
    { value: '500+', label: 'Schools Trust Us' },
    { value: '50,000+', label: 'Students Managed' },
    { value: '5,000+', label: 'Teachers Onboard' },
    { value: '99.9%', label: 'Uptime Guaranteed' },
  ];

  const benefits = [
    'Easy to use interface designed for educators',
    'Secure cloud-based data storage',
    'Real-time notifications and updates',
    'Comprehensive reporting and analytics',
    'Multi-user access with role-based permissions',
    '24/7 customer support',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">EduManage</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/login">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Trusted by 500+ Educational Institutions</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Modern School Management Made Simple
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Streamline your educational institution with our comprehensive school management system. 
                Manage students, teachers, attendance, fees, and more - all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 w-full sm:w-auto">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="border-white/30 text-white bg-blue-700 hover:bg-white/10 w-full sm:w-auto">
                    Explore Features
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Dashboard Overview</p>
                    <p className="text-blue-200 text-sm">Real-time insights</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Total Students', value: '1,234', icon: Users },
                    { label: 'Teachers', value: '56', icon: BookOpen },
                    { label: 'Attendance', value: '94%', icon: ClipboardCheck },
                    { label: 'Revenue', value: '$45K', icon: BarChart3 },
                  ].map((stat, index) => (
                    <div key={index} className="bg-white/10 rounded-xl p-4">
                      <stat.icon className="w-5 h-5 text-blue-200 mb-2" />
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-blue-200">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-blue-600">{stat.value}</p>
                <p className="text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your School
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite of tools helps you streamline operations, 
              improve communication, and focus on what matters most - education.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
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
      <section id="about" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Why Choose EduManage?
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                EduManage is designed specifically for educational institutions in Bangladesh and beyond. 
                Our platform combines powerful features with an intuitive interface, making school 
                management effortless for administrators, teachers, and staff.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/login">
                  <Button size="lg">
                    Get Started Today
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">Save Time & Resources</h4>
                    <p className="text-gray-600">Automate repetitive tasks</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-700">Manual Data Entry</span>
                    <span className="text-red-500 font-semibold">-80%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-700">Administrative Tasks</span>
                    <span className="text-red-500 font-semibold">-65%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-700">Report Generation</span>
                    <span className="text-green-500 font-semibold">10x Faster</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-700">Parent Satisfaction</span>
                    <span className="text-green-500 font-semibold">+45%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your School Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of schools already using EduManage to streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                Start Your Free Trial
              </Button>
            </Link>
            <Link href="#contact">
              <Button size="lg" variant="outline" className="border-white/30 text-white bg-blue-700 hover:bg-white/10">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600">Have questions? We'd love to hear from you.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600">+880 1711-223344</p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">info@edumanage.com</p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-600">Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
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
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2026 EduManage. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
