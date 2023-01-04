import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import User from './user.interface';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: { type: String },
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const hashedPassword = await bcrypt.hash(this.password, 10);

  this.password = hashedPassword;
});

userSchema.methods.isValidPassword = async function (
  password: string
): Promise<Error | boolean> {
  return await bcrypt.compare(password, this.password);
};

export default model<User>('user', userSchema);
