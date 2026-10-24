import 'dotenv/config';
import mongoose from 'mongoose';
import { Plan, Module } from './models.js';
import { plans, modules } from './data.js';

await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tanga');
await Plan.deleteMany({});
await Module.deleteMany({});
await Plan.insertMany(plans);
await Module.insertMany(modules);
console.log(`Seed tayyor: ${plans.length} tarif, ${modules.length} modul`);
await mongoose.disconnect();
