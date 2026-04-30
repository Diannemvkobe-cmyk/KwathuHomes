/**
 * Password validation rules:
 * - At least 8 characters
 * - At least one letter (uppercase or lowercase)
 */
export const validatePassword = (password) => {
  if (!password) return { isValid: false, message: 'Password is required' };
  
  const minLength = 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  
  if (password.length < minLength) {
    return { 
      isValid: false, 
      message: `Password must be at least ${minLength} characters long` 
    };
  }
  
  if (!hasLetter) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one letter' 
    };
  }
  
  return { isValid: true, message: '' };
};
