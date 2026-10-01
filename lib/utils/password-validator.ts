/**
 * Password validation utility
 * Ensures passwords meet security requirements
 */

export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0-100
  feedback: string[];
  strength: 'weak' | 'fair' | 'good' | 'strong';
}

export function validatePassword(password: string): PasswordValidationResult {
  const feedback: string[] = [];
  let score = 0;

  // Check minimum length
  if (password.length < 10) {
    feedback.push('Şifre en az 10 karakter olmalıdır');
  } else {
    score += 20;
  }

  if (password.length >= 12) {
    score += 10;
  }

  if (password.length >= 16) {
    score += 10;
  }

  // Check for uppercase letters
  if (/[A-Z]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Şifre en az bir büyük harf içermelidir (A-Z)');
  }

  // Check for lowercase letters
  if (/[a-z]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Şifre en az bir küçük harf içermelidir (a-z)');
  }

  // Check for numbers
  if (/[0-9]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Şifre en az bir rakam içermelidir (0-9)');
  }

  // Check for special characters
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Şifre en az bir özel karakter içermelidir (!@#$%^&* vb.)');
  }

  // Check for common patterns
  if (/(123|234|345|456|567|678|789|890|abc|bcd|cde)/.test(password.toLowerCase())) {
    feedback.push('Şifre ardışık karakterler içeriyor (123, abc vb.)');
    score -= 10;
  }

  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('Şifre 3 veya daha fazla ardışık aynı karakter içeriyor');
    score -= 10;
  }

  // Clamp score between 0-100
  score = Math.max(0, Math.min(100, score));

  // Determine strength
  let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak';
  if (score >= 80) strength = 'strong';
  else if (score >= 60) strength = 'good';
  else if (score >= 40) strength = 'fair';

  const isValid = score >= 60 && feedback.filter(f => !f.includes('Şifre ardışık')).length === 0;

  return {
    isValid,
    score,
    feedback,
    strength,
  };
}

export function getPasswordStrengthColor(strength: string): string {
  switch (strength) {
    case 'weak':
      return 'bg-red-500';
    case 'fair':
      return 'bg-yellow-500';
    case 'good':
      return 'bg-blue-500';
    case 'strong':
      return 'bg-green-500';
    default:
      return 'bg-slate-300';
  }
}

export function getPasswordStrengthLabel(strength: string): string {
  switch (strength) {
    case 'weak':
      return 'Zayıf';
    case 'fair':
      return 'Orta';
    case 'good':
      return 'İyi';
    case 'strong':
      return 'Çok Güçlü';
    default:
      return 'Bilinmiyor';
  }
}
