export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  return password && password.length >= 6;
}

export function validateIP(ip) {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  return ipRegex.test(ip);
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
}

export function validateDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

export function validateTime(timeString) {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;
  return timeRegex.test(timeString);
}

export function validateArrayLength(arr, min = 0, max = 100) {
  return Array.isArray(arr) && arr.length >= min && arr.length <= max;
}

export function validateNumber(num, min = 0, max = Infinity) {
  const parsed = parseInt(num);
  return !isNaN(parsed) && parsed >= min && parsed <= max;
}