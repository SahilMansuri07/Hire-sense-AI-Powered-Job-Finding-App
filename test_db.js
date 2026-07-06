import mongoose from "mongoose";
import dotenv from "dotenv";

// Load env vars
dotenv.config({ path: "./backend/.env" });

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai_resume_maker";

async function run() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  
  const jobs = await db.collection("job_posts").find({}).toArray();
  console.log(`Total jobs in DB: ${jobs.length}`);
  
  // Count by recruiterId
  const byRecruiter = {};
  for (const job of jobs) {
    const rid = job.recruiterId ? job.recruiterId.toString() : "null";
    byRecruiter[rid] = (byRecruiter[rid] || 0) + 1;
  }
  
  console.log("Jobs by recruiterId:");
  console.log(byRecruiter);

  // See details of the first 2 jobs
  console.log("\nSample jobs:");
  console.log(jobs.slice(0, 2).map(j => ({
    _id: j._id,
    jobTitle: j.jobTitle,
    recruiterId: j.recruiterId,
    is_delete: j.is_delete,
    is_active: j.is_active,
    status: j.status
  })));
  
  process.exit(0);
}

run().catch(console.error);
