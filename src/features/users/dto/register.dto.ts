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

  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(15, 'La contraseña no debe superar los 15 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      'La contraseña debe contener al menos una letra mayúscula, una minúscula y un número'
    )
    .required('La contraseña es obligatoria'),

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

  // source: yup.string().oneOf(['mobile', 'web'], 'Source inválido').required('El origen es obligatorio'),
});


export type RegisterDTO = yup.InferType<typeof registerSchema>;