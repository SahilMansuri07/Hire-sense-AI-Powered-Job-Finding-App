import api from "./axios";

export const validateUserAPI = (data) => api.post('/auth/validate-user', data);
export const SignUpAPI = (data) => api.post('/auth/signup', data);
export const loginAPI = (data) => api.post('/auth/login', data);

// Auth & User APIs
export const getSkillsAPI = () => api.get('/auth/skills');
export const getJobRolesAPI = (search = '') => api.get(`/auth/job-roles${search ? `?search=${encodeURIComponent(search)}` : ''}`);
export const getJobRoleSkillsAPI = (jobRoleId) => api.get(`/auth/job-roles/${jobRoleId}/skills`);
export const setupPreferencesAPI = (data) => api.post('/auth/set-up-preferences', data);
export const getUserProfileAPI = () => api.get('/auth/user-profile');
export const uploadResumeAPI = (data) => api.post('/auth/upload-resume', data);

// Applicant Modules
export const getUserDashboardAPI = () => api.get('/applicant/dashboard');
export const fetchJobsAPI = (data) => api.post('/applicant/fetch-jobs', data);
export const fetchSingleJobAPI = (id) => api.get(`/applicant/fetch-single-job/${id}`);
export const applyJobAPI = (id, data) => api.post(`/applicant/apply-job/${id}`, data);
export const getAppliedJobsAPI = () => api.get('/applicant/applied-jobs');
export const getApplicationStatusAPI = () => api.get('/applicant/application-status');
export const getResumeScoreAPI = () => api.get('/applicant/resume-score');