import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UnathorizedError } from '../errors/UnauthorizedError.js';
import { schemaEmail } from '../validators/users.js';
import { emailValidationError, userUnathorizedError, userNotFoundError } from '../errors/constants.js';

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    velidate: {
      validator: (value) => !schemaEmail.validate(value).error,
      message: () => emailValidationError,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// Проверяем пользователя - есть ли пользователь с такой почтой и паролью в базе
userSchema.statics.findOneAndValidatePassword = function ({ email, password }) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnathorizedError(userNotFoundError);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnathorizedError(userUnathorizedError);
          }
          // удаляем пароль из объекта пользователя и превращаем в объект
          const { password: removed, ...userWithoutPassword } = user.toObject();
          return userWithoutPassword;
        });
    });
};

export const User = mongoose.model('User', userSchema);
