'use client'
import { useState, useEffect } from "react";
import { registerUser } from "@/app/actions/registerNewUser";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import ButtonLoading from "@/components/ButtonLoading";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useGlobalContext } from "@/context/GlobalContext";

export default function RegisterForm() {
  const [error, setError] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);

  // Keep values across steps
  const [form, setForm] = useState({
    username: '',
    email: '',
    address: '',
    sex: 'male',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const router = useRouter();
  const { data: session } = useSession();
  const { darkMode } = useGlobalContext();

  useEffect(() => {
    if (session?.user) router.push('/');
  }, [session, router]);

  async function handleRegister(e) {
    e.preventDefault();

    setBtnDisabled(true);
    setBtnLoading(true);

    if (form.password !== form.confirmPassword) {
      setError('password do not match');
      setBtnDisabled(false);
      setBtnLoading(false);
      return;
    }

    // Build FormData from state (not from e.target)
    const formData = new FormData();
    formData.append('username', form.username);
    formData.append('email', form.email);
    formData.append('address', form.address);
    formData.append('sex', form.sex);
    formData.append('phone', form.phone);
    formData.append('password', form.password);
    formData.append('confirmPassword', form.confirmPassword);

    try {
      await registerUser(formData);

      const signInRes = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInRes?.error) {
        setError(
          signInRes.error === 'CredentialsSignin'
            ? 'Unable to sign in after registration. Please try again.'
            : signInRes.error
        );
        setBtnDisabled(false);
        setBtnLoading(false);
        return;
      }

      setError('');
      setBtnDisabled(false);
      setBtnLoading(false);
      router.push('/onboarding');
    } catch (err) {
      setError(err?.message || 'An error occurred during registration. Please try again.');
      setBtnDisabled(false);
      setBtnLoading(false);
    }
  }

  return (
    <div className={`${darkMode ? 'bg-slate-900 text-zinc-50' : 'bg-zinc-500 text-slate-900'} w-screen h-screen`}>
      <div className="container h-full px-6 py-8 flex justify-center items-center">
        <div className=" md:w-[500px] w-[400px] sm:w-full block px-4 md:px-6 py-4">
          {step === 1 && <h2 className="text-2xl font-bold text-center my-3">Register</h2>}

          <form className="flex flex-col space-y-3" onSubmit={handleRegister}>
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <p className="text-sm">
                  Already have an account?{'  '}
                  <span onClick={() => router.push('/login')} className="text-blue-500 underline cursor-pointer">
                    Login
                  </span>
                </p>

                <input
                  type="text"
                  className={`${darkMode ? 'bg-slate-800 text-zinc-50 border-slate-600' : 'bg-zinc-50 text-slate-900 border-slate-200'} focus:border-indigo-500 w-full py-2 px-4 border outline-0 rounded-md`}
                  name="username"
                  placeholder="Enter your username"
                  required
                  value={form.username}
                  onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                />

                <input
                  className={`${darkMode ? 'bg-slate-800 text-zinc-50 border-slate-600' : 'bg-zinc-50 text-slate-900 border-slate-200'} focus:border-indigo-500 w-full py-2 px-4 border outline-0 rounded-md`}
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                />

                <button
                  type="button"
                  className="bg-indigo-500 px-4 rounded mt-2 py-2 outline-0 hover:bg-indigo-600 mt-6 cursor-pointer"
                  onClick={() => {
                    setError('');
                    setStep(2);
                  }}
                >
                  Next
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4">
                <input
                  className={`${darkMode ? 'bg-slate-800 text-zinc-50 border-slate-600' : 'bg-zinc-50 text-slate-900 border-slate-200'} focus:border-indigo-500 w-full py-2 px-4 border outline-0 rounded-md`}
                  name="address"
                  type="text"
                  placeholder="Enter your address"
                  required
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                />

                <select
                  name="sex"
                  value={form.sex}
                  onChange={(e) => setForm((p) => ({ ...p, sex: e.target.value }))}
                  className={`${darkMode ? 'bg-slate-800 text-zinc-50 border-slate-600' : 'bg-zinc-50 text-slate-900 border-slate-200'} focus:border-indigo-500 w-full py-2 px-4 border rounded-md cursor-pointer outline-0`}
                  required
                >
                  <option className={`${darkMode ? 'bg-slate-700 text-zinc-50' : 'bg-zinc-50 text-slate-900'}`} value="male">
                    Male
                  </option>
                  <option className={`${darkMode ? 'bg-slate-700 text-zinc-50' : 'bg-zinc-50 text-slate-900'}`} value="female">
                    Female
                  </option>
                </select>

                <input
                  type="phone"
                  className={`${darkMode ? 'bg-slate-800 text-zinc-50 border-slate-600' : 'bg-zinc-50 text-slate-900 border-slate-200'} focus:border-indigo-500 w-full py-2 px-4 border outline-0 rounded-md`}
                  name="phone"
                  placeholder="Enter your phone number"
                  required
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                />

                <div className="flex justify-between items-center mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="bg-indigo-500 px-4 py-2 rounded mt-2 outline-0 hover:bg-indigo-600 cursor-pointer"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-indigo-500 px-4 py-2 rounded mt-2 outline-0 hover:bg-indigo-600 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    className={`${darkMode ? 'bg-slate-800 text-zinc-50 border-slate-600' : 'bg-zinc-50 text-slate-900 border-slate-200'} focus:border-indigo-500 w-full py-2 px-4 border outline-0 rounded-md`}
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    required
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  />
                  <span onClick={() => setShowPassword((prev) => !prev)} className="absolute cursor-pointer top-1/3 right-3 my-auto">
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>

                <div className="relative">
                  <input
                    className={`${darkMode ? 'bg-slate-800 text-zinc-50 border-slate-600' : 'bg-zinc-50 text-slate-900 border-slate-200'} focus:border-indigo-500 w-full py-2 px-4 border outline-0 rounded-md`}
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    required
                    value={form.confirmPassword}
                    onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  />
                  <span onClick={() => setShowConfirmPassword((prev) => !prev)} className="absolute cursor-pointer top-1/3 right-3">
                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>

                <span className="text-red-500 text-xs">{error}</span>

                <div className="flex justify-between items-center mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-indigo-500 px-4 py-2 rounded mt-2 outline-0 hover:bg-indigo-600 cursor-pointer"
                  >
                    Prev
                  </button>
                  <button
                    disabled={btnDisabled}
                    className="w-fit bg-indigo-500 hover:bg-indigo-600 flex items-center gap-4 justify-center disabled:bg-zinc-400 disabled:cursor-not-allowed text-gray-50 cursor-pointer rounded-md text-center px-4 py-2"
                    type="submit"
                  >
                    {btnLoading ? (
                      <>
                        {' '}
                        <ButtonLoading /> Creating account...
                      </>
                    ) : (
                      'Register'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

