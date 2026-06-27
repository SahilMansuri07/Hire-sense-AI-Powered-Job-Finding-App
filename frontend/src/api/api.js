import api from "./axios";

export const validateUserAPI = (data) => api.post('/auth/validate-user', data);
export const SignUpAPI = (data) => api.post('/auth/signup', data);
export const loginAPI = (data) => api.post('/auth/login', data);

// Auth & User APIs
export const getSkillsAPI = () => api.get('/auth/skills');
export const getJobRolesAPI = (search = '') => api.get(`/auth/job-roles${search ? `?search=${encodeURIComponent(search)}` : ''}`);
export const setupPreferencesAPI = (data) => api.post('/auth/set-up-preferences', data);
export const getUserProfileAPI = () => api.get('/auth/user-profile');
export const uploadResumeAPI = (data) => api.post('/auth/upload-resume', data);

// User Modules
export const getUserDashboardAPI = () => api.get('/user/dashboard');
export const fetchJobsAPI = (data) => api.post('/user/fetch-jobs', data);
export const fetchSingleJobAPI = (id) => api.get(`/user/fetch-single-job/${id}`);
export const applyJobAPI = (id, data) => api.post(`/user/apply-job/${id}`, data);
export const getAppliedJobsAPI = () => api.get('/user/applied-jobs');
export const getApplicationStatusAPI = () => api.get('/user/application-status');
export const getResumeScoreAPI = () => api.get('/user/resume-score');