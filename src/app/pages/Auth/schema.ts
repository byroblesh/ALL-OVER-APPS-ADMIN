import * as Yup from 'yup'

export interface AuthFormValues {
    email: string
    password: string
}

export const schema = Yup.object().shape({
    email: Yup.string()
        .trim()
        .email('Please enter a valid email address')
        .required('Email is required'),
    password: Yup.string()
        .trim()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
})