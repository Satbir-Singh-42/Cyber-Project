import crypto from 'crypto';

export interface PasswordAnalysis {
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

const COMMON_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'monkey', 
  'letmein', 'dragon', '111111', 'baseball', 'iloveyou', 'trustno1',
  'sunshine', 'master', 'welcome', 'shadow', 'ashley', 'football',
  'jesus', 'michael', 'ninja', 'mustang', 'password1', 'admin'
];

const DICTIONARY_WORDS = [
  'love', 'hate', 'life', 'death', 'fire', 'water', 'earth', 'wind',
  'happy', 'sad', 'angry', 'peace', 'war', 'light', 'dark', 'good',
  'evil', 'fast', 'slow', 'big', 'small', 'hot', 'cold', 'sweet',
  'bitter', 'strong', 'weak', 'rich', 'poor', 'young', 'old'
];

export class PasswordService {
  analyzePassword(password: string): PasswordAnalysis {
    const criteria = this.checkCriteria(password);
    const entropy = this.calculateEntropy(password);
    const score = this.calculateScore(password, criteria, entropy);
    const strength = this.getStrengthLevel(score);
    const suggestions = this.generateSuggestions(password, criteria);
    const crackTime = this.estimateCrackTime(entropy);

    return {
      score,
      strength,
      criteria,
      entropy,
      suggestions,
      crackTime
    };
  }

  private checkCriteria(password: string) {
    return {
      length: password.length >= 8,
      specialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      numbers: /\d/.test(password),
      upperCase: /[A-Z]/.test(password),
      lowerCase: /[a-z]/.test(password),
      noDictionaryWords: !this.containsDictionaryWords(password.toLowerCase())
    };
  }

  private containsDictionaryWords(password: string): boolean {
    const lowerPassword = password.toLowerCase();
    return COMMON_PASSWORDS.some(common => lowerPassword.includes(common)) ||
           DICTIONARY_WORDS.some(word => lowerPassword.includes(word));
  }

  private calculateEntropy(password: string): number {
    let charsetSize = 0;
    
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/\d/.test(password)) charsetSize += 10;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) charsetSize += 32;

    return Math.log2(Math.pow(charsetSize, password.length));
  }

  private calculateScore(password: string, criteria: any, entropy: number): number {
    let score = 0;

    // Length scoring
    if (password.length >= 12) score += 25;
    else if (password.length >= 8) score += 15;
    else if (password.length >= 6) score += 10;

    // Character variety scoring
    if (criteria.upperCase) score += 10;
    if (criteria.lowerCase) score += 10;
    if (criteria.numbers) score += 10;
    if (criteria.specialChars) score += 15;

    // Dictionary words penalty
    if (!criteria.noDictionaryWords) score -= 20;

    // Entropy bonus
    if (entropy >= 60) score += 20;
    else if (entropy >= 50) score += 15;
    else if (entropy >= 40) score += 10;

    // Repetition penalty
    if (this.hasRepeatingPatterns(password)) score -= 10;

    return Math.max(0, Math.min(100, score));
  }

  private hasRepeatingPatterns(password: string): boolean {
    // Check for repeated characters
    const repeatedChars = /(.)\1{2,}/.test(password);
    
    // Check for sequential patterns
    const sequential = /(123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password);
    
    return repeatedChars || sequential;
  }

  private getStrengthLevel(score: number): PasswordAnalysis['strength'] {
    if (score >= 80) return 'very-strong';
    if (score >= 60) return 'strong';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'weak';
    return 'very-weak';
  }

  private generateSuggestions(password: string, criteria: any): string[] {
    const suggestions: string[] = [];

    if (!criteria.length) {
      suggestions.push('Use at least 8 characters (12+ recommended)');
    }
    if (!criteria.upperCase) {
      suggestions.push('Add uppercase letters (A-Z)');
    }
    if (!criteria.lowerCase) {
      suggestions.push('Add lowercase letters (a-z)');
    }
    if (!criteria.numbers) {
      suggestions.push('Include numbers (0-9)');
    }
    if (!criteria.specialChars) {
      suggestions.push('Add special characters (!@#$%^&*)');
    }
    if (!criteria.noDictionaryWords) {
      suggestions.push('Avoid common words and phrases');
    }
    if (password.length < 12) {
      suggestions.push('Consider using a longer passphrase');
    }
    if (this.hasRepeatingPatterns(password)) {
      suggestions.push('Avoid repetitive patterns and sequences');
    }

    return suggestions;
  }

  private estimateCrackTime(entropy: number): string {
    const attempts = Math.pow(2, entropy) / 2; // Average case
    const attemptsPerSecond = 1e10; // Modern hardware assumption
    const seconds = attempts / attemptsPerSecond;

    if (seconds < 60) return 'Less than a minute';
    if (seconds < 3600) return `${Math.ceil(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.ceil(seconds / 3600)} hours`;
    if (seconds < 2592000) return `${Math.ceil(seconds / 86400)} days`;
    if (seconds < 31536000) return `${Math.ceil(seconds / 2592000)} months`;
    
    return `${Math.ceil(seconds / 31536000)} years`;
  }
}
