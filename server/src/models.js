import mongoose from 'mongoose';

const { Schema, model } = mongoose;

export const Plan = model(
  'Plan',
  new Schema({
    key: { type: String, unique: true },
    name: String,
    price: Number,
    tagline: String,
    features: [String],
  })
);

export const Module = model(
  'Module',
  new Schema({
    slug: { type: String, unique: true },
    title: String,
    lessons: Number,
    tier: { type: String, enum: ['free', 'plus', 'premium'] },
  })
);

export const Waitlist = model(
  'Waitlist',
  new Schema(
    {
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      plan: { type: String, enum: ['free', 'plus', 'premium'], default: 'free' },
    },
    { timestamps: true }
  )
);
