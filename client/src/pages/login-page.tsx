import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield, Key, Network, Fish, Keyboard, FilePen, Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const securityFeatures = [
  {
    icon: Key,
    title: "Password Analysis",
    description: "Advanced strength testing with entropy calculation and crack time estimation"
  },
  {
    icon: Fish,
    title: "Phishing Detection", 
    description: "Real-time URL analysis with machine learning threat detection"
  },
  {
    icon: Network,
    title: "Network Scanning",
    description: "Comprehensive port scanning with service fingerprinting"
  },
  {
    icon: Keyboard,
    title: "Malware Detection",
    description: "System process monitoring and suspicious activity alerts"
  },
  {
    icon: FilePen,
    title: "File Integrity",
    description: "Baseline monitoring with cryptographic hash verification"
  },
  {
    icon: Shield,
    title: "Security Reports",
    description: "Detailed analytics with exportable compliance documentation"
  }
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest('POST', '/api/auth/login', {
        email: data.email,
        password: data.password,
      });
      return response.json();
    },
    onSuccess: async (data) => {
      toast({
        title: "Login Successful!",
        description: `Welcome back, ${data.user.name}!`,
      });
      
      // Clear and refetch user data to ensure fresh session state
      await queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      await queryClient.refetchQueries({ queryKey: ['/api/auth/user'] });
      
      // Add a delay to ensure session is fully established
      setTimeout(() => {
        window.location.reload(); // Force full page reload to ensure session is recognized
      }, 500);
    },
    onError: (error: any) => {
      // Extract clean error message
      let errorMessage = "Invalid email or password. Please try again.";
      if (error?.message) {
        errorMessage = error.message.replace(/^\d+:\s*/, ''); // Remove status codes
      }
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="text-primary-foreground text-2xl" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to your CyberSec account</p>
          </div>

          {/* Login Form */}
          <Card className="border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-center">Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Enter your email"
                              className="pl-10"
                              data-testid="input-email"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="pl-10 pr-10"
                              data-testid="input-password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                              onClick={() => setShowPassword(!showPassword)}
                              data-testid="button-toggle-password"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="remember" className="w-4 h-4" />
                      <label htmlFor="remember" className="text-muted-foreground cursor-pointer">
                        Remember me
                      </label>
                    </div>
                    <Link href="/forgot-password" className="text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loginMutation.isPending}
                    data-testid="button-signin"
                  >
                    {loginMutation.isPending ? "Signing In..." : "Sign In"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link href="/signup" className="text-primary hover:underline font-medium">
                  Create account
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}