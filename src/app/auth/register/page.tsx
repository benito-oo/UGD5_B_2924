'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthFormWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaSyncAlt } from 'react-icons/fa';

type RegisterFormData = {
  username: string;
  email: string;
  nomorTelp: string;
  password: string;
  confirmPassword: string;
  captcha: string;
};

const generateCaptcha = (length: number = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const RegisterPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const [captchaText, setCaptchaText] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  useEffect(() => {
    setCaptchaText(generateCaptcha());
  }, []);

  useEffect(() => {
    const strength = Math.min(
      (password.length > 7 ? 25 : 0) +
        (/[A-Z]/.test(password) ? 25 : 0) +
        (/[0-9]/.test(password) ? 25 : 0) +
        (/[^A-Za-z0-9]/.test(password) ? 25 : 0),
      100
    );

    setPasswordStrength(strength);
  }, [password]);

  const refreshCaptcha = () => {
    setCaptchaText(generateCaptcha());
    setValue('captcha', '');
  };

  const strengthColor = useMemo(() => {
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-yellow-500';
    if (passwordStrength <= 75) return 'bg-blue-500';
    return 'bg-green-500';
  }, [passwordStrength]);

  const onSubmit = (data: RegisterFormData) => {
    if (data.captcha !== captchaText) {
      toast.error('Captcha salah', { theme: 'dark', position: 'top-right' });
      refreshCaptcha();
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error('Konfirmasi password tidak cocok', {
        theme: 'dark',
        position: 'top-right',
      });
      return;
    }

    toast.success('Register berhasil!', {
      theme: 'dark',
      position: 'top-right',
    });

    router.push('/auth/login');
  };

  return (
    <AuthFormWrapper title="Register">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-gray-700">
            Username <span className="text-gray-500 text-xs">(3-8 karakter)</span>
          </label>
          <input
            id="username"
            {...register('username', {
              required: 'Username wajib diisi',
              minLength: {
                value: 3,
                message: 'Username minimal 3 karakter',
              },
              maxLength: {
                value: 8,
                message: 'Username maksimal 8 karakter',
              },
            })}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan username"
          />
          {errors.username && (
            <p className="text-red-600 text-sm italic mt-1">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email wajib diisi',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.(com|net|co)$/i,
                message: 'Format email harus valid (.com/.net/.co)',
              },
            })}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan email"
          />
          {errors.email && (
            <p className="text-red-600 text-sm italic mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="nomorTelp" className="text-sm font-medium text-gray-700">
            Nomor Telepon
          </label>
          <input
            id="nomorTelp"
            type="text"
            {...register('nomorTelp', {
              required: 'Nomor telepon wajib diisi',
              minLength: {
                value: 10,
                message: 'Nomor telepon minimal 10 digit',
              },
              pattern: {
                value: /^[0-9]+$/,
                message: 'Nomor telepon hanya boleh angka',
              },
            })}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
            }}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.nomorTelp ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan nomor telepon"
          />
          {errors.nomorTelp && (
            <p className="text-red-600 text-sm italic mt-1">{errors.nomorTelp.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password wajib diisi',
                minLength: {
                  value: 8,
                  message: 'Password minimal 8 karakter',
                },
              })}
              className={`w-full px-4 py-2.5 pr-12 rounded-lg border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-600 text-sm italic mt-1">{errors.password.message}</p>
          )}

          <div className="mt-2">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${strengthColor} transition-all duration-300`}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">Strength: {passwordStrength}%</p>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Konfirmasi Password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: 'Konfirmasi password wajib diisi',
                validate: (value) =>
                  value === password || 'Konfirmasi password harus sama dengan password',
              })}
              className={`w-full px-4 py-2.5 pr-12 rounded-lg border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan ulang password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="text-red-600 text-sm italic mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Captcha:</span>
            <span className="font-mono text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded">
              {captchaText}
            </span>
            <button
              type="button"
              onClick={refreshCaptcha}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaSyncAlt />
            </button>
          </div>

          <input
            type="text"
            {...register('captcha', {
              required: 'Captcha wajib diisi',
            })}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.captcha ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan captcha"
          />

          {errors.captcha && (
            <p className="text-red-600 text-sm italic mt-1">{errors.captcha.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg"
        >
          Register
        </button>

        <SocialAuth />
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Sudah punya akun?{' '}
        <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-semibold">
          Login
        </Link>
      </p>
    </AuthFormWrapper>
  );
};

export default RegisterPage;