import mongoose from 'mongoose';
import dotenv from 'dotenv';
import JobPost from './models/JobPost.js';
import connectDB from './config/db.js';

dotenv.config();

const recruiter1 = "6a4240416ad8488987abb0ae";
const recruiter2 = "6a4240066ad8488987abb0ac";

const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Other"];
const expiriance_levels = ["Entry-level", "Junior", "Mid-level", "Senior-level", "Lead", "Principal", "Other"];
const employmentTypes = ["Full-time", "Part-time", "Contract", "Internship"];
const job_types = ["on-site", "remote", "hybrid"];
const statuses = ["published", "published", "published", "draft", "closed"];

const jobTitles = [
    "Frontend Developer", "Backend Engineer", "Full Stack Developer", "Marketing Specialist", "HR Manager", 
    "Data Scientist", "DevOps Engineer", "Sales Executive", "Operations Coordinator", "Product Manager",
    "UI/UX Designer", "Software Architect", "Systems Administrator", "Database Administrator", "QA Tester"
];

const locations = ["New York, NY", "San Francisco, CA", "London, UK", "Remote", "Austin, TX", "Berlin, Germany", "Toronto, Canada", "Singapore"];

const allSkills = ["React", "Node.js", "Python", "SEO", "MongoDB", "SQL", "AWS", "Docker", "Figma", "Marketing Strategy", "Agile", "TypeScript", "Java", "C++"];

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateJobs(recruiterId, count) {
    const jobs = [];
    for (let i = 0; i < count; i++) {
        const title = getRandom(jobTitles);
        const minSalary = Math.floor(Math.random() * 50000) + 40000;
        
        const numSkills = Math.floor(Math.random() * 3) + 3;
        const skills = [];
        while(skills.length < numSkills) {
            const skill = getRandom(allSkills);
            if (!skills.includes(skill)) skills.push(skill);
        }

        jobs.push({
            recruiterId: recruiterId,
            jobTitle: title,
            department: getRandom(departments),
            expiriance_level: getRandom(expiriance_levels),
            location: getRandom(locations),
            employmentType: getRandom(employmentTypes),
            job_type: getRandom(job_types),
            salaryRange: {
                min: minSalary,
                max: minSalary + Math.floor(Math.random() * 40000) + 10000
            },
            requiredSkills: skills,
            jobDescription: {
                description: `We are looking for a highly skilled ${title} to join our growing team.`,
                requirements: `Must have strong experience in ${skills.join(", ")}.`,
                benefits: "Health insurance, 401k matching, generous PTO, and flexible hours."
            },
            aiGenerated: true,
            status: getRandom(statuses),
            is_active: true,
            is_delete: false,
        });
    }
    return jobs;
}

async function seed() {
    try {
        await connectDB();

        const jobs1 = generateJobs(recruiter1, 25);
        const jobs2 = generateJobs(recruiter2, 25);
        
        await JobPost.insertMany([...jobs1, ...jobs2]);
        console.log("Successfully seeded 50 jobs!");
        
        mongoose.disconnect();
    } catch (err) {
        console.error(err);
        mongoose.disconnect();
    }
}

seed();
