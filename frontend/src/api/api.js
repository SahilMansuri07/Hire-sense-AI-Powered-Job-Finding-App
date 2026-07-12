import api from "./axios";

export const validateUserAPI = (data) => api.post('/v1/auth/validate-user', data);
export const SignUpAPI = (data) => api.post('/v1/auth/signup', data);
export const loginAPI = (data) => api.post('/v1/auth/login', data);
export const logoutAPI = () => api.post('/v1/auth/logout');

// Auth & User APIs
export const getSkillsAPI = () => api.get('/v1/auth/skills');
export const getJobRolesAPI = (search = '') => api.get(`/v1/auth/job-roles${search ? `?search=${encodeURIComponent(search)}` : ''}`);
export const getJobRoleSkillsAPI = (jobRoleId) => api.get(`/v1/auth/job-roles/${jobRoleId}/skills`);
export const setupPreferencesAPI = (data) => api.post('/v1/auth/set-up-preferences', data);
export const getUserProfileAPI = () => api.get('/v1/auth/user-profile');
export const uploadResumeAPI = (data) => api.post('/v1/auth/upload-resume', data);
export const editProfileAPI = (data) => api.put('/v1/auth/edit-profile', data);

// Applicant Modules
export const getUserDashboardAPI = () => api.get('/v1/applicant/dashboard');
export const fetchJobsAPI = (data) => api.post('/v1/applicant/fetch-jobs', data);
export const fetchSingleJobAPI = (id) => api.get(`/v1/applicant/fetch-single-job/${id}`);
export const applyJobAPI = (id, data) => api.post(`/v1/applicant/apply-job/${id}`, data);
export const getAppliedJobsAPI = () => api.get('/v1/applicant/applied-jobs');
export const getApplicationStatusAPI = () => api.get('/v1/applicant/application-status');
export const getResumeScoreAPI = () => api.get('/v1/applicant/resume-score');
export const getSkillGapAnalysisAPI = () => api.get('/v1/applicant/skill-gap-analysis');

// recruiter modules API 
