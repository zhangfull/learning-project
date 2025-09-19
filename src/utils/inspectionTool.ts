export function checkPasswordStrength(password: string): number {
  if (!password) return 0; // 空密码，最低强度
  let score = 0; // 初始分数，只要输入就至少为1
  // 长度要求
  if (password.length >= 8) score++;
  // 小写字母
  if (/[a-z]/.test(password)) score++;
  // 大写字母
  if (/[A-Z]/.test(password)) score++;
  // 数字
  if (/\d/.test(password)) score++;
  // 特殊字符
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return Math.min(score, 5); // 保证返回 1-5
}