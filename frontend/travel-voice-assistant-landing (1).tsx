import React from 'react';
import { 
  Airplane, 
  Globe, 
  ChatText, 
  Headphones, 
  ArrowRight, 
  Sparkle, 
  MapPin, 
  Calendar, 
  Microphone, 
  Shield, 
  Lightning, 
  TrendingUp,
  Phone
} from '@phosphor-icons/react';

export default function LandingPage() {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-lg flex items-center justify-center shadow-md">
                <Airplane className="w-6 h-6 text-white" weight="bold" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                TravelAI<span className="text-blue-600">Pro</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition font-medium">How It Works</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition font-medium">Pricing</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition font-medium">Contact</a>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 py-2 rounded-lg hover:shadow-lg transition font-medium">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                <Sparkle className="w-4 h-4" />
                <span>Enterprise-Grade AI Technology</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                Intelligent Travel Planning for 
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Modern Businesses
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Streamline corporate travel with our AI-powered voice assistant. Reduce booking time by 70% while optimizing costs and ensuring policy compliance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => window.location.href = '/assistant'}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="group bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Microphone className="w-5 h-5" />
                  <span>Launch Voice Assistant</span>
                  <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                </button>
                
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-400 hover:shadow-lg transition font-medium">
                  Schedule Demo
                </button>
              </div>

              <div className="flex items-center space-x-10 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Enterprise Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">$2.5M</div>
                  <div className="text-sm text-gray-600">Saved Annually</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-1 shadow-2xl">
                <div className="bg-white rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-500">TravelAI Pro Dashboard</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <ChatText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-blue-50 p-4 rounded-xl rounded-tl-none">
                          <p className="text-sm text-gray-800 font-medium">Corporate Travel Assistant</p>
                          <p className="text-xs text-gray-600 mt-1">Ready to optimize your business travel</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl rounded-tl-none ml-12">
                      <p className="text-sm">Hello! I'm your corporate travel assistant. How can I help optimize your team's travel today?</p>
                    </div>
                    
                    <div className="bg-gray-100 p-4 rounded-xl rounded-tr-none mr-12">
                      <p className="text-sm text-gray-800">Need to book flights for our quarterly meeting in Chicago with policy compliance</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-xl rounded-tl-none ml-12">
                      <p className="text-sm">Understood. Finding optimal flights that comply with your policy and maximize rewards points...</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg text-white text-center shadow">
                        <Shield className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs font-semibold">Policy Compliance</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-lg text-white text-center shadow">
                        <TrendingUp className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs font-semibold">Cost Savings</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-lg text-white text-center shadow">
                        <Lightning className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs font-semibold">Real-time Booking</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                AI-Powered
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Enterprise Travel Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Advanced features designed for corporate travel management and optimization</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <Headphones className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Voice Command Interface</h3>
              <p className="text-gray-600 mb-4">Natural conversation with our AI assistant for hands-free travel planning and booking.</p>
              <div className="text-sm font-semibold text-blue-600">Learn more →</div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Policy Compliance</h3>
              <p className="text-gray-600 mb-4">Automatic enforcement of corporate travel policies with real-time validation.</p>
              <div className="text-sm font-semibold text-blue-600">Learn more →</div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cost Optimization</h3>
              <p className="text-gray-600 mb-4">AI-driven insights to reduce travel costs while maintaining quality experiences.</p>
              <div className="text-sm font-semibold text-blue-600">Learn more →</div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Global Coverage</h3>
              <p className="text-gray-600 mb-4">Access to 500,000+ hotels and all major airlines with real-time pricing data.</p>
              <div className="text-sm font-semibold text-blue-600">Learn more →</div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <Lightning className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Booking</h3>
              <p className="text-gray-600 mb-4">Book flights, hotels, and transportation in seconds with our streamlined process.</p>
              <div className="text-sm font-semibold text-blue-600">Learn more →</div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <Sparkle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Analytics</h3>
              <p className="text-gray-600 mb-4">Comprehensive reporting and analytics for travel spend and policy adherence.</p>
              <div className="text-sm font-semibold text-blue-600">Learn more →</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">98%</div>
              <div className="text-blue-100">User Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">40%</div>
              <div className="text-blue-100">Avg. Cost Savings</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">150+</div>
              <div className="text-blue-100">Enterprise Clients</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Transform Your Corporate Travel Experience
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Join industry leaders who have revolutionized their travel management with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/assistant'}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Get Started Today</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-white border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-xl text-lg font-semibold hover:border-blue-400 hover:shadow-lg transition font-medium">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-400 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                  <Airplane className="w-6 h-6 text-white" weight="bold" />
                </div>
                <span className="text-2xl font-bold text-white">
                  TravelAI<span className="text-blue-400">Pro</span>
                </span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Enterprise-grade travel solutions powered by artificial intelligence. Simplify corporate travel management and reduce costs.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Solutions</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Demo</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">Guides</a></li>
                <li><a href="#" className="hover:text-white transition">API Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Partners</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm">&copy; 2025 TravelAI Pro. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-sm hover:text-white transition">Privacy Policy</a>
                <a href="#" className="text-sm hover:text-white transition">Terms of Service</a>
                <a href="#" className="text-sm hover:text-white transition">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}