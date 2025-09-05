import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Eye, EyeOff, Key, Check, X, Lightbulb } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Temporary client-side password analysis
function analyzePasswordClientSide(password: string): PasswordAnalysis {
  const criteria = {
    length: password.length >= 8,
    specialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    numbers: /\d/.test(password),
    upperCase: /[A-Z]/.test(password),
    lowerCase: /[a-z]/.test(password),
    noDictionaryWords: !/(password|123456|qwerty|abc123|admin|login|welcome)/.test(password.toLowerCase())
  };

  let score = 0;
  if (password.length >= 12) score += 25;
  else if (password.length >= 8) score += 15;
  else if (password.length >= 6) score += 10;

  if (criteria.upperCase) score += 10;
  if (criteria.lowerCase) score += 10;
  if (criteria.numbers) score += 10;
  if (criteria.specialChars) score += 15;
  if (!criteria.noDictionaryWords) score -= 20;

  const charsetSize = 
    (criteria.lowerCase ? 26 : 0) +
    (criteria.upperCase ? 26 : 0) +
    (criteria.numbers ? 10 : 0) +
    (criteria.specialChars ? 32 : 0);
  
  const entropy = Math.log2(Math.pow(charsetSize, password.length));
  if (entropy >= 60) score += 20;
  else if (entropy >= 50) score += 15;
  else if (entropy >= 40) score += 10;

  score = Math.max(0, Math.min(100, score));

  const strength = score >= 80 ? 'very-strong' : 
                  score >= 60 ? 'strong' :
                  score >= 40 ? 'medium' :
                  score >= 20 ? 'weak' : 'very-weak';

  const suggestions: string[] = [];
  if (!criteria.length) suggestions.push('Use at least 8 characters (12+ recommended)');
  if (!criteria.upperCase) suggestions.push('Add uppercase letters (A-Z)');
  if (!criteria.lowerCase) suggestions.push('Add lowercase letters (a-z)');
  if (!criteria.numbers) suggestions.push('Include numbers (0-9)');
  if (!criteria.specialChars) suggestions.push('Add special characters (!@#$%^&*)');
  if (!criteria.noDictionaryWords) suggestions.push('Avoid common words and phrases');

  const attempts = Math.pow(2, entropy) / 2;
  const seconds = attempts / 1e10;
  const crackTime = seconds < 60 ? 'Less than a minute' :
                   seconds < 3600 ? `${Math.ceil(seconds / 60)} minutes` :
                   seconds < 86400 ? `${Math.ceil(seconds / 3600)} hours` :
                   seconds < 2592000 ? `${Math.ceil(seconds / 86400)} days` :
                   `${Math.ceil(seconds / 2592000)} months`;

  return {
    score,
    strength: strength as PasswordAnalysis['strength'],
    criteria,
    entropy: Math.round(entropy),
    suggestions,
    crackTime
  };
}

interface PasswordAnalysis {
  score: number;
  strength: 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';
  criteria: {
    length: boolean;
    specialChars: boolean;
    numbers: boolean;
    upperCase: boolean;
    lowerCase: boolean;
    noDictionaryWords: boolean;
  };
  entropy: number;
  suggestions: string[];
  crackTime: string;
}

export function PasswordAnalyzer() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null);
  const { toast } = useToast();

  const analyzePasswordMutation = useMutation({
    mutationFn: async (password: string) => {
      // Temporary client-side analysis while database is being fixed
      return analyzePasswordClientSide(password);
    },
    onSuccess: (data) => {
      setAnalysis(data);
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze password",
        variant: "destructive",
      });
    },
  });

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value.length > 0) {
      analyzePasswordMutation.mutate(value);
    } else {
      setAnalysis(null);
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'very-weak': return 'text-destructive';
      case 'weak': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'strong': return 'text-accent';
      case 'very-strong': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-accent';
    if (score >= 40) return 'bg-yellow-500';
    if (score >= 20) return 'bg-orange-500';
    return 'bg-destructive';
  };

  return (
    <Card className="bg-card border border-border">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Key className="text-primary text-lg sm:text-xl" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold">Password Strength Analyzer</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Analyze password security and get improvement suggestions</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="password-input" className="block text-sm font-medium mb-2">
              Enter Password
            </Label>
            <div className="relative">
              <Input
                id="password-input"
                type={showPassword ? "text" : "password"}
                placeholder="Type your password here..."
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className="w-full font-mono pr-10"
                data-testid="input-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
                data-testid="button-toggle-password"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {analysis && (
            <>
              {/* Password Strength Indicator */}
              <div className="bg-secondary p-3 sm:p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium">Strength Score</span>
                  <span className={`text-sm font-bold ${getStrengthColor(analysis.strength)}`} data-testid="text-strength-score">
                    {analysis.score}/100
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-3 overflow-hidden">
                  <Progress 
                    value={analysis.score} 
                    className={`h-2 transition-all duration-300 ${getProgressColor(analysis.score)}`}
                  />
                </div>
                
                {/* Strength Criteria */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Length (8+ chars)</span>
                    {analysis.criteria.length ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Special Characters</span>
                    {analysis.criteria.specialChars ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Numbers</span>
                    {analysis.criteria.numbers ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Upper & Lower Case</span>
                    {analysis.criteria.upperCase && analysis.criteria.lowerCase ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>No Dictionary Words</span>
                    {analysis.criteria.noDictionaryWords ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Entropy Level</span>
                    <span className="text-accent">{Math.round(analysis.entropy)} bits</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Estimated Crack Time</span>
                    <span className="text-accent">{analysis.crackTime}</span>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {analysis.suggestions.length > 0 && (
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-yellow-500 flex items-center">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Suggestions
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    {analysis.suggestions.map((suggestion, index) => (
                      <li key={index}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {analyzePasswordMutation.isPending && (
            <div className="bg-secondary p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm">Analyzing password...</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
