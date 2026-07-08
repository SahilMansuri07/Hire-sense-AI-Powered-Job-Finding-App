const ROLES = ['candidate', 'recruiter', 'admin', 'user'];

export const authStorage = {
  setSession(role, token, user) {
    this.clearAllSessions(); // Clear all other roles to prevent leakage
    localStorage.setItem(`auth_token_${role}`, token);
    localStorage.setItem(`user_data_${role}`, JSON.stringify(user));
    localStorage.setItem('active_role', role);
  },

  getActiveRole() {
    return localStorage.getItem('active_role');
  },

  getSession() {
    const role = this.getActiveRole();
    if (!role) return null;
    
    const token = localStorage.getItem(`auth_token_${role}`);
    const userStr = localStorage.getItem(`user_data_${role}`);
    if (!token || !userStr) return null;
    
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
  },

  clearAllSessions() {
    ROLES.forEach(r => {
      localStorage.removeItem(`auth_token_${r}`);
      localStorage.removeItem(`user_data_${r}`);
    });
    localStorage.removeItem('active_role');
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
