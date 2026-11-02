const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');
const seedDataHelper = require('./seedDataHelper');

dotenv.config({ path: path.join(__dirname, '../.env') });

const runSeed = async () => {
  try {
    await connectDB();
    await seedDataHelper();
    console.log('----------------------------------------------------');
    console.log('SEED COMPLETE! DEMO ACCOUNTS:');
    console.log('1. Admin: admin@hirenet.com / password123');
    console.log('2. Recruiter: recruiter@techcorp.com / password123');
    console.log('3. Candidate: candidate@gmail.com / password123');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

runSeed();
