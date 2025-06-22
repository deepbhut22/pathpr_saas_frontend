import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import { authAPI } from '@/services/api';
import { IConsultantFirm } from '@/types';
import { Mail, Phone, MapPin, Globe, Shield, Users, Award } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      console.log(response);
      login(response.consultant, response.consultant.firmId as unknown as IConsultantFirm, response.token);
      console.log("here");
      

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      // navigate(`/${response.firmSlug}`); 
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen text-white overflow-hidden">
      {/* Header */}
      {/* <div className="bg-slate-800 border-b border-slate-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Immigration Experts</h1>
              <p className="text-xs text-slate-300">Professional Immigration Consulting</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-6 text-sm text-slate-300">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>contact@immigrationexperts.com</span>
            </div>
          </div>
        </div>
      </div> */}

      <div className="flex h-full bg-slate-900">
        {/* Left Panel - Company Information */}
        <div className="hidden lg:flex lg:w-1/2  p-8 flex-col justify-center">
          <div className="max-w-lg mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3 text-white">Welcome To <br /><span className="text-7xl text-secondary-500">Pr Expert</span></h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                Your trusted partner in navigating complex immigration processes with expert guidance.
              </p>
            </div>

            {/* Features */}
            {/* <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <Award className="w-5 h-5 text-white mt-1" />
                <div>
                  <h3 className="font-semibold text-white">Expert Consultants</h3>
                  <p className="text-slate-300 text-sm">Certified professionals with 15+ years experience</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-white mt-1" />
                <div>
                  <h3 className="font-semibold text-white">Personalized Service</h3>
                  <p className="text-slate-300 text-sm">Tailored immigration strategies for your unique situation</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-white mt-1" />
                <div>
                  <h3 className="font-semibold text-white">Secure & Confidential</h3>
                  <p className="text-slate-300 text-sm">Enterprise-grade security for your information</p>
                </div>
              </div>
            </div> */}

            {/* Contact Information */}
            <div className="border-4 border-gray-800 shadow-lg rounded-lg  p-5">
              <h3 className="text-lg font-semibold mb-3 text-white">Contact Information</h3>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-slate-300" />
                  <div>
                    <p className="font-medium text-white">Website</p>
                    <a href="https://immigrationexperts.com" className="text-slate-300 hover:text-white transition-colors text-xs">
                      immigrationexperts.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-slate-300" />
                  <div>
                    <p className="font-medium text-white">Phone</p>
                    <p className="text-slate-300 text-xs">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-slate-300" />
                  <div>
                    <p className="font-medium text-white">Email</p>
                    <p className="text-slate-300 text-xs">contact@immigrationexperts.com</p>
                  </div>
                </div>

                {/* <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-slate-300" />
                  <div>
                    <p className="font-medium text-white">Address</p>
                    <p className="text-slate-300 text-xs">123 Business District<br />New York, NY 10001</p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center bg-white justify-center p-6">
          <div className="w-full max-w-md">
            <Card className="bg-white shadow-2xl border-2 border-gray-200">
              <CardHeader className="space-y-3 pb-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">Consultant Portal</CardTitle>
                  <CardDescription className="text-slate-600 text-sm">
                    Sign in to access your dashboard
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-900">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-10 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-900">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-10 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <div className="pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-600 text-center mb-2">
                    Need help? Contact our support team
                  </p>
                  <div className="flex justify-center space-x-4">
                    <a href="tel:+15551234567" className="text-xs text-slate-900 hover:text-slate-700 transition-colors">
                      Call Support
                    </a>
                    <span className="text-slate-400">|</span>
                    <a href="mailto:support@immigrationexperts.com" className="text-xs text-slate-900 hover:text-slate-700 transition-colors">
                      Email Support
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Contact Info */}
            <div className="lg:hidden mt-4 bg-slate-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Contact Information</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center space-x-2">
                  <Globe className="w-3 h-3 text-slate-300" />
                  <a href="https://immigrationexperts.com" className="text-slate-300 hover:text-white">
                    Website
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3 h-3 text-slate-300" />
                  <span className="text-slate-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3 h-3 text-slate-300" />
                  <span className="text-slate-300">Email Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3 text-slate-300" />
                  <span className="text-slate-300">New York, NY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;