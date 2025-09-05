import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  score: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  response_time: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better performance
UserSchema.index({ username: 1 });
UserSchema.index({ score: -1 });
UserSchema.index({ createdAt: -1 });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
