import { body } from 'express-validator';

export const signupValidator = [
  body('name').isString().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
];

export const loginValidator = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
];

export const interviewCreateValidator = [
  body('topic').isString().isLength({ min: 2 }),
  body('difficulty').isIn(['Easy', 'Medium', 'Hard']),
];

export const questionGenerateValidator = [
  body('interviewId').isInt(),
];

export const answerCreateValidator = [
  body('questionId').isInt(),
  body('userResponse').isString().isLength({ min: 10 }),
];
