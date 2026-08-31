import bcrypt from 'bcryptjs';
import { createModel } from '../utils/nativeModel.js';

const User = createModel('users');
const create = User.create;
User.create = async (document: Record<string, any>) => {
  const user = await create(document);
  user.comparePassword = (candidatePassword: string) => bcrypt.compare(candidatePassword, user.password);
  user.password = await bcrypt.hash(user.password, 12);
  await user.save();
  return user;
};

export default User;
