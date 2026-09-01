import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import connectDB, { getDatabase } from './config/db.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mcjosephmoyo7@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'MCJOSEPHMOYO12345';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';

const ensureAdmin = async () => {
  await connectDB();

  const users = getDatabase().collection('users');
  const existing = await users.findOne({ email: ADMIN_EMAIL });

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const base = {
    username: ADMIN_USERNAME,
    role: 'admin',
    isActive: true,
    phone: existing?.phone || '',
    avatar: existing?.avatar || '',
  };

  if (existing) {
    await users.updateOne(
      { _id: existing._id },
      {
        $set: {
          ...base,
          password: passwordHash,
          updatedAt: new Date(),
        },
      }
    );
    console.log(`Owner admin updated: ${ADMIN_EMAIL} (role: admin, password refreshed)`);
  } else {
    await users.insertOne({
      ...base,
      email: ADMIN_EMAIL,
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`Owner admin created: ${ADMIN_EMAIL} (role: admin)`);
  }

  console.log('\nDashboard login (http://localhost:3000/dashboard/login):');
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log('Done.');
  process.exit(0);
};

ensureAdmin().catch((error) => {
  console.error('ensureAdmin error:', error);
  process.exit(1);
});