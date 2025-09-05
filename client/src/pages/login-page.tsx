import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield, Key, Network, Fish, Keyboard, FilePen, Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

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

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginForm) => {
    console.log('Login attempt:', data);
    // TODO: Implement actual login logic
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 lg:px-8">
        <div className="w-full max-w-md space-y-6">
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
                    data-testid="button-signin"
                  >
                    Sign In
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

      {/* Right side - Features (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 border-l border-border">
        <div className="flex-1 flex flex-col justify-center px-8 py-12">
          <div className="max-w-lg mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Enterprise Security Suite</h2>
              <p className="text-lg text-muted-foreground">
                Comprehensive cybersecurity tools for threat detection and system analysis
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {securityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-background/50 rounded-lg border border-border/50">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Trusted by security professionals worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}