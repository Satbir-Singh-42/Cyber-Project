import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Key, Network, Fish, Keyboard, FilePen, Eye, EyeOff, Lock, Mail, User, ArrowRight, Star, Zap, TrendingUp } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

const platformBenefits = [
  {
    icon: Zap,
    title: "Real-time Threat Detection",
    description: "Instant alerts and automated response to security threats with AI-powered analysis",
    highlight: "99.9% Detection Rate"
  },
  {
    icon: TrendingUp,
    title: "Advanced Analytics Dashboard",
    description: "Comprehensive security metrics with predictive insights and trend analysis",
    highlight: "Professional Reports"
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description: "Bank-level encryption with compliance standards (SOC2, GDPR, HIPAA)",
    highlight: "256-bit Encryption"
  },
  {
    icon: Network,
    title: "Multi-Layer Protection",
    description: "Network, endpoint, and application security in one unified platform",
    highlight: "5 Security Layers"
  }
];

const securityTools = [
  { name: "Password Analyzer", status: "included" },
  { name: "Phishing Detector", status: "included" },
  { name: "Port Scanner", status: "included" },
  { name: "Keylogger Detection", status: "included" },
  { name: "File Integrity Monitor", status: "included" },
  { name: "Security Reports", status: "included" }
];

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupForm) => {
      const response = await apiRequest('POST', '/api/auth/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Account Created!",
        description: `Welcome ${data.user.name}! Your account has been created successfully.`,
      });
      // Redirect to login page
      setLocation('/login');
    },
    onError: (error: any) => {
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SignupForm) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="text-primary-foreground text-2xl" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">Create your account</h1>
            <p className="text-muted-foreground">Join thousands of security professionals</p>
          </div>

          {/* Sign Up Form */}
          <Card className="border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-center">Sign Up</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Enter your full name"
                              className="pl-10"
                              data-testid="input-name"
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
                              placeholder="Create a password"
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

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              className="pl-10 pr-10"
                              data-testid="input-confirm-password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              data-testid="button-toggle-confirm-password"
                            >
                              {showConfirmPassword ? (
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

                  <div className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" id="terms" className="w-4 h-4" required />
                    <label htmlFor="terms" className="text-muted-foreground cursor-pointer">
                      I agree to the{' '}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={signupMutation.isPending}
                    data-testid="button-signup"
                  >
                    {signupMutation.isPending ? "Creating Account..." : "Create Account"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Platform Benefits (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 border-l border-border">
        <div className="flex-1 flex flex-col justify-center px-8 py-12">
          <div className="max-w-lg mx-auto space-y-8">
            <div className="text-center space-y-4">
              <Badge className="bg-accent/20 text-accent border-accent/20 mb-4">
                <Star className="w-3 h-3 mr-1" />
                Professional Security Suite
              </Badge>
              <h2 className="text-3xl font-bold">Why Choose CyberSec?</h2>
              <p className="text-lg text-muted-foreground">
                Advanced security tools trusted by industry leaders
              </p>
            </div>

            <div className="space-y-6">
              {platformBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-background/50 rounded-lg border border-border/50">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{benefit.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {benefit.highlight}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-background/50 rounded-lg border border-border/50 p-6">
              <h3 className="font-semibold mb-4">Included Security Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                {securityTools.map((tool, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <Shield className="w-3 h-3 text-accent" />
                    <span className="text-muted-foreground">{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}