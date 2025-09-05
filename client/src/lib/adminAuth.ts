export interface AdminCredentials {
  email: string;
  password: string;
}

export interface AdminUser {
  id: string;
  email: string;
}

class AdminAuth {
  private readonly validEmails = ['jeremias062009@gmail.com', 'eli.as.23@hotmail.com'];
  private readonly validPassword = '0609';

  validateCredentials(credentials: AdminCredentials): boolean {
    return (
      this.validEmails.includes(credentials.email) && 
      credentials.password === this.validPassword
    );
  }

  isValidEmail(email: string): boolean {
    return this.validEmails.includes(email);
  }

  // Store admin session in localStorage
  setAdminSession(user: AdminUser): void {
    localStorage.setItem('admin_user', JSON.stringify(user));
    localStorage.setItem('admin_session', 'true');
  }

  // Get admin session from localStorage
  getAdminSession(): AdminUser | null {
    try {
      const userStr = localStorage.getItem('admin_user');
      const isAdmin = localStorage.getItem('admin_session') === 'true';
      
      if (userStr && isAdmin) {
        return JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Error parsing admin session:', error);
    }
    return null;
  }

  // Clear admin session
  clearAdminSession(): void {
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_session');
  }

  // Check if current user is admin
  isAdmin(): boolean {
    return localStorage.getItem('admin_session') === 'true';
  }

  // Generate admin session token (simple implementation)
  generateSessionToken(): string {
    return `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Validate session token
  validateSessionToken(token: string): boolean {
    // Simple validation - check if token starts with 'admin_' and is recent
    if (!token.startsWith('admin_')) return false;
    
    const timestamp = parseInt(token.split('_')[1]);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    return (now - timestamp) < oneDay;
  }
}

export const adminAuth = new AdminAuth();
