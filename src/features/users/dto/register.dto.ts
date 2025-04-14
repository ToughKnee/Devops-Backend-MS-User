import * as yup from 'yup';

export const registerSchema = yup.object({
  email: yup
    .string()
    .email('El formato del correo no es válido')
    .matches(
      /^[\w-.]+@ucr\.ac\.cr$/,
      'El correo debe ser institucional de la UCR (@ucr.ac.cr)'
    )
    .required('El correo electrónico es obligatorio'),

  full_name: yup
    .string()
    .trim()
    .min(3, 'El nombre completo debe tener al menos 3 caracteres')
    .max(25, 'El nombre completo no debe superar los 25 caracteres')
    .matches(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      'El nombre completo solo puede contener letras y espacios'
    )
    .required('El nombre completo es obligatorio'),

  auth_id: yup
    .string()
    .required('El auth_id es obligatorio'),

  auth_token: yup
    .string()
    .required('El auth_token es obligatorio')
});


export type RegisterDTO = yup.InferType<typeof registerSchema>;