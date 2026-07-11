const ROLES = ['candidate', 'recruiter', 'admin', 'user'];
let inMemoryToken = null;

export const authStorage = {
  setSession(role, token, user) {
    this.clearAllSessions(); // Clear all other roles to prevent leakage
    inMemoryToken = token || null;
    localStorage.setItem(`user_data_${role}`, JSON.stringify(user));
    if (token) {
      localStorage.setItem(`auth_token_${role}`, token);
    }
    localStorage.setItem('active_role', role);
  },

  setAccessToken(token) {
    inMemoryToken = token || null;
    const role = this.getActiveRole();
    if (role && token) {
      localStorage.setItem(`auth_token_${role}`, token);
    }
  },

  getAccessToken() {
    if (inMemoryToken) return inMemoryToken;
    const role = this.getActiveRole();
    if (role) {
      return localStorage.getItem(`auth_token_${role}`);
    }
    return null;
  },

  getActiveRole() {
    return localStorage.getItem('active_role');
  },

  getSession() {
    const role = this.getActiveRole();
    if (!role) return null;
    
    const userStr = localStorage.getItem(`user_data_${role}`);
    const token = localStorage.getItem(`auth_token_${role}`) || inMemoryToken;
    if (!userStr) return null;
    
    try {
      return { role, token, user: JSON.parse(userStr) };
    } catch {
      return null;
    }
  },

  updateUser(user) {
    const role = this.getActiveRole();
    if (role) {
      const current = this.getSession();
      if (current) {
        const updatedUser = { ...current.user, ...user };
        localStorage.setItem(`user_data_${role}`, JSON.stringify(updatedUser));
      }
    }
  },

  clearSession() {
    const role = this.getActiveRole();
    if (role) {
      localStorage.removeItem(`auth_token_${role}`);
      localStorage.removeItem(`user_data_${role}`);
      localStorage.removeItem('active_role');
    }
    inMemoryToken = null;
  },

  clearAllSessions() {
    ROLES.forEach(r => {
      localStorage.removeItem(`auth_token_${r}`);
      localStorage.removeItem(`user_data_${r}`);
    });
    localStorage.removeItem('active_role');
    inMemoryToken = null;
  },

  setResumeAnalysis(userId, data) {
    if (userId) {
      localStorage.setItem(`resume_analysis_${userId}`, JSON.stringify(data));
    }
  },

  getResumeAnalysis(userId) {
    if (!userId) return null;
    console.log(userId)
    try {
      return JSON.parse(localStorage.getItem(`resume_analysis_${userId}`));
    } catch {
      return null;
    }
  }
};
