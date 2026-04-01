'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthFormWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaSyncAlt } from 'react-icons/fa';

interface LoginFormData {
  email: string;
  password: string;
  captchaInput: string;
  rememberMe?: boolean;
}

interface ErrorObject {
  email?: string;
  password?: string;
  captcha?: string;
}

const LOGIN_EMAIL = '2924@gmail.com'; // ganti dengan email NPM kamu
const LOGIN_PASSWORD = '241712924'; // ganti dengan password NPM kamu

const generateCaptcha = (length: number = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const LoginPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    captchaInput: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<ErrorObject>({});
  const [showPassword, setShowPassword] = useState(false);
  const [captchaText, setCaptchaText] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState(3);

  useEffect(() => {
    const savedAttempts = localStorage.getItem('login_attempts');
    if (savedAttempts !== null) {
      setRemainingAttempts(Number(savedAttempts));
    } else {
      localStorage.setItem('login_attempts', '3');
      setRemainingAttempts(3);
    }

    setCaptchaText(generateCaptcha());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name === 'captchaInput' ? 'captcha' : name]: undefined,
    }));
  };

  const refreshCaptcha = () => {
    setCaptchaText(generateCaptcha());
    setFormData((prev) => ({ ...prev, captchaInput: '' }));
    setErrors((prev) => ({ ...prev, captcha: undefined }));
  };

  const handleResetAttempts = () => {
    if (remainingAttempts === 0) {
      setRemainingAttempts(3);
      localStorage.setItem('login_attempts', '3');
      toast.success('Kesempatan login berhasil direset!', {
        theme: 'dark',
        position: 'top-right',
      });
    }
  };

  const validateForm = () => {
    const newErrors: ErrorObject = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email tidak boleh kosong';
    } else if (formData.email !== LOGIN_EMAIL) {
      newErrors.email = 'Email harus sesuai NPM';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password tidak boleh kosong';
    } else if (formData.password !== LOGIN_PASSWORD) {
      newErrors.password = 'Password harus sesuai NPM';
    }

    if (!formData.captchaInput.trim()) {
      newErrors.captcha = 'Captcha belum diisi';
    } else if (formData.captchaInput !== captchaText) {
      newErrors.captcha = 'Captcha salah';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (remainingAttempts === 0) {
      toast.error('Kesempatan login habis!', {
        theme: 'dark',
        position: 'top-right',
      });
      return;
    }

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      const updatedAttempts = Math.max(remainingAttempts - 1, 0);
      setErrors(newErrors);
      setRemainingAttempts(updatedAttempts);
      localStorage.setItem('login_attempts', updatedAttempts.toString());

      if (updatedAttempts === 0) {
        toast.error('Login gagal! Kesempatan login habis.', {
          theme: 'dark',
          position: 'top-right',
        });
      } else {
        toast.error(`Login gagal! Sisa kesempatan: ${updatedAttempts}`, {
          theme: 'dark',
          position: 'top-right',
        });
      }

      refreshCaptcha();
      return;
    }

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('login_attempts', remainingAttempts.toString());

    toast.success('Login berhasil!', {
      theme: 'dark',
      position: 'top-right',
    });

    router.push('/home');
  };

  return (
    <AuthFormWrapper title="Login">
      <form onSubmit={handleSubmit} className="space-y-5 w-full">
        <p className="text-center text-sm text-gray-500">
          Sisa kesempatan: <span className="font-semibold">{remainingAttempts}</span>
        </p>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan email"
          />
          {errors.email && <p className="text-red-600 text-sm italic mt-1">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
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
            <p className="text-red-600 text-sm italic mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe || false}
              onChange={handleChange}
              className="mr-2 h-4 w-4 rounded border-gray-300"
            />
            Ingat Saya
          </label>

          <Link
            href="/auth/forgot-password"
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
          >
            Forgot Password?
          </Link>
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
            name="captchaInput"
            value={formData.captchaInput}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.captcha ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan captcha"
          />
          {errors.captcha && <p className="text-red-600 text-sm italic mt-1">{errors.captcha}</p>}
        </div>

        <button
          type="submit"
          disabled={remainingAttempts === 0}
          className={`w-full font-semibold py-2.5 px-4 rounded-lg text-white ${
            remainingAttempts === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Sign In
        </button>

        <button
          type="button"
          onClick={handleResetAttempts}
          disabled={remainingAttempts !== 0}
          className={`w-full font-semibold py-2.5 px-4 rounded-lg text-white ${
            remainingAttempts === 0
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Reset Kesempatan
        </button>

        <SocialAuth />

        <p className="mt-6 text-center text-sm text-gray-600">
          Tidak punya akun?{' '}
          <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-semibold">
            Daftar
          </Link>
        </p>
      </form>
    </AuthFormWrapper>
  );
};

export default LoginPage;