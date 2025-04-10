import * as yup from 'yup';

export const registerSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  full_name: yup.string().required(),
  // source: yup.string().oneOf(['mobile', 'web']).required()
});

export type RegisterDTO = yup.InferType<typeof registerSchema>;