'use client'
import React,{useState, useEffect} from 'react'
import { signIn } from 'next-auth/react';
import { useRouter } from "next/navigation";
import {FaEye, FaEyeSlash} from 'react-icons/fa'
import ButtonLoading from '@/components/ButtonLoading';
import { useSession } from 'next-auth/react';
import { useGlobalContext } from '@/context/GlobalContext';

function Register() {
    const router = useRouter()
    const {data:session, status} = useSession()

    const { darkMode } = useGlobalContext()

    const [email, setEmail]= useState('')
    const [password, setPassword]= useState('')
    const [showPassword, setShowPassword]= useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)

    useEffect(()=>{
      if(status === 'loading'){
        setBtnDisabled(true)
      } else {
        setBtnDisabled(false)
      }
      if(session?.user){
        router.push('/')
      }
    },[status, router, session])
  

  // Sign in with email
  const handleLogin = async (e) => {
   e.preventDefault();

    setBtnDisabled(true)
    setLoading(true)
    
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res.error) {
      if (res.error === "Invalid credentials" ) {
      setError("Invalid email or password. Please try again.");
      }else if(res.error === "User not found"){
          setError('User with this email was not found please signup to continue')
      } else {
        setError("An error occurred during login. Please try again later.");
      }
      setLoading(false)
      setBtnDisabled(false)
    } else {
      
      router.push('/')
      setError('')
      setLoading(false)
      setBtnDisabled(false)
    }
  };

  return (
    <div className={darkMode ? 'w-screen h-screen bg-slate-900 ' : 'w-screen h-screen bg-zinc-50 '}>
        <div className='flex justify-center items-center h-screen w-full'>
            <div className='container text-zinc-50 h-full flex justify-center items-center px-4  md:px-6  '>
              
                <div className={`${darkMode ? 'bg-slate-700  border-slate-200 text-zinc-50 ' : 'bg-zinc-100 border-zinc-300 text-slate-900'} md:w-125  w-100 sm-w-full  border p-6 rounded-md`}>

                  {/* header */}
                    <h2 className='text-2xl font-bold text-center mb-6'> Login</h2>

                        {/* Email signin form */}
                        <div>  
                          <p className='text-sm'>Don't have an account <span onClick={()=> router.push('/register')} className='underline cursor-pointer'>Sign up</span></p>
                            <form onSubmit={handleLogin} className='text-zinc-50'>
                            <div className='my-4'>
                                <input type='email' 
                                placeholder='Enter your email address'
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)} 
                                required
                                className={`${darkMode ? 'bg-slate-800 text-zinc-50 placeholder:text-zinc-500 border-slate-200 focus:border-indigo-500' : 'bg-zinc-200 text-slate-900 placeholder:text-slate-500 border-zinc-300 focus:border-indigo-500'} py-2 w-full px-4 border outline-0 rounded-md`}/>
                            </div>
                            <div className='my-4 relative'>
                                <input type={showPassword ? 'text' : 'password'} 
                                placeholder='Enter you password'
                                value={password} 
                                required
                                onChange={(e)=> setPassword(e.target.value)}
                                className={`${darkMode ? 'bg-slate-800 text-zinc-50 placeholder:text-zinc-500 border-slate-200 focus:border-indigo-500' : 'bg-zinc-200 text-slate-900 placeholder:text-slate-500 border-zinc-300 focus:border-indigo-500'} py-2 w-full px-4 border outline-0 rounded-md`}
                                />
                                <span onClick={()=> setShowPassword(prev => !prev)} className='absolute top-1/3 text-slate-900 cursor-pointer right-3 my-auto '>{showPassword ? <FaEye/> : <FaEyeSlash/>}</span>
                            </div>
                            <button disabled={btnDisabled} 
                              className='text-zinc-50 px-4 py-2 cursor-pointer disabled:cursor-not-allowed disabled:bg-zinc-400 flex items-center gap-4 justify-center hover:bg-indigo-500 w-full rounded-md bg-indigo-600 mt-6'>
                              {loading ? <><ButtonLoading/> Signing in...</>  : "Sign in" }
                            </button>
                          </form>
                          <span className='block text-red-500 hover:bg-red-400 text-xs mt-2'>{error}</span>
                          <span className='text-zinc-50 text-sm mt-2'>forgot password?</span>
                        </div>

                    
                </div>
            </div>
        </div>
         {/*  */}
    </div>
  )
}

export default Register
