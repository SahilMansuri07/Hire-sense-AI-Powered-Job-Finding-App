import api from './axios';

export const fetchRecruiterJobsAPI = async (page = 1, limit = 10) => {
  return await api.post('/recruiter/fetch-job', { page, limit });
};

export const fetchJobByIdAPI = async (jobId) => {
  return await api.post('/recruiter/fetch-job-by-id', { jobId });
};


export const postJobAPI = async (data) => {
  return await api.post('/recruiter/post-job', data);
};

export const editJobAPI = async (data) => {
  return await api.put('/recruiter/edit-job', data);
};

export const deleteJobAPI = async (jobId) => {
  return await api.delete('/recruiter/delete-job', { data: { jobId } });
};


export const generateJobDescriptionAPI = async (data) => {
  return await api.post('/recruiter/generate-job-description', data);
};

export const fetchDashboardSummaryAPI = async () => {
  return await api.get('/recruiter/dashboard-summary');
};

export const fetchCandidatesAPI = async (page = 1, limit = 10) => {
  return await api.get(`/recruiter/candidates?page=${page}&limit=${limit}`);
};

export const fetchCandidateProfileAPI = async (id) => {
  return await api.get(`/recruiter/candidates/${id}`);
};