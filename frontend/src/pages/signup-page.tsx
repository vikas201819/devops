import { Link, useNavigate } from 'react-router-dom';
import AddGoogleIcon from '@/assets/svg/google-color-icon.svg';
import AddGithubIcon from '@/assets/svg/github-icon.svg';
import { useForm } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';
import { TSignUpSchema, signUpSchema } from '@/lib/types';
import 'react-toastify/dist/ReactToastify.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { AxiosError, isAxiosError } from 'axios';
import userState from '@/utils/user-state';
import axiosInstance from '@/helpers/axiosInstance';

function signin() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<TSignUpSchema>({ resolver: zodResolver(signUpSchema) });

  const onSubmit = async (data: FieldValues) => {
    try {
      const res = axiosInstance.post('/api/auth/email-password/signup', data)
      toast.promise(res, {
        pending: 'Creating account ...',
        success: {
          render({ data }) {
            userState.setUser(data?.data?.data?.user)
            localStorage.setItem("userId", data?.data?.data?.user?._id)
            localStorage.setItem("role", data?.data?.data?.user?.role)
            reset()
            navigate('/')
            return data?.data?.message
          },
        },
        error: {
          render({ data }) {
            if (data instanceof AxiosError) {
              if (data?.response?.data?.message) {
                return data?.response?.data?.message;
              }
            }
            return "Signup failed"
          },
        },
      }
      )
      return (await res).data

    } catch (error) {
      if (isAxiosError(error)) {
        console.error(error.response?.data?.message);
      } else {
        console.error(error);
      }
    }
  };


  return (
    <div className="m-4 flex-grow cursor-default bg-white py-4">
      <div className="mb-4 flex justify-center">
        <div className="flex w-full items-center justify-center">
          <h2 className="w-3/4 text-center text-lg font-bold text-black sm:text-xl">
            Sign up to WanderLust
          </h2>
        </div>
      </div>
      <div className="m-2 mt-8 flex flex-col items-center justify-center gap-2">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full md:w-3/4 lg:w-2/5">
          <div className="mb-3">
            <input
              {...register('userName')}
              type="text"
              placeholder="Username"
              className="w-full rounded-lg bg-zinc-100 p-3 font-normal placeholder:text-sm placeholder:text-neutral-500"
            />
            {errors.userName && (
              <p className="p-3 text-xs text-red-500">{`${errors.userName.message}`}</p>
            )}
          </div>
          <div className="mb-3">
            <input
              {...register('fullName')}
              type="text"
              placeholder="Name"
              className="w-full rounded-lg bg-zinc-100 p-3 font-normal placeholder:text-sm placeholder:text-neutral-500"
            />
            {errors.fullName && (
              <p className="p-3 text-xs text-red-500">{`${errors.fullName.message}`}</p>
            )}
          </div>
          <div className="mb-3">
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="w-full rounded-lg bg-zinc-100 p-3 font-normal placeholder:text-sm placeholder:text-neutral-500"
            />
            {errors.email && (
              <p className="p-3 text-xs text-red-500">{`${errors.email.message}`}</p>
            )}
          </div>
          <div className="mb-3">
            <input
              {...register('password')}
              type="password"
              placeholder="Password"
              className="w-full rounded-lg bg-zinc-100 p-3 font-normal placeholder:text-sm placeholder:text-neutral-500"
            />
            {errors.password && (
              <p className="p-3 text-xs text-red-500">{`${errors.password.message}`}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              {...register('confirmPassword')}
              type="password"
              placeholder="Confirm Password"
              className="w-full rounded-lg bg-zinc-100 p-3 font-normal placeholder:text-sm placeholder:text-neutral-500"
            />
            {errors.confirmPassword && (
              <p className="p-3 text-xs text-red-500">{`${errors.confirmPassword.message}`}</p>
            )}
          </div>
          <button
            disabled={isSubmitting}
            type="submit"
            className="flex w-full items-center justify-center rounded-lg bg-neutral-800 p-3 text-base font-medium text-light disabled:bg-neutral-600 sm:text-lg sm:font-semibold"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-2 flex w-5/6 flex-col items-center justify-center gap-4 text-center text-sm font-normal sm:text-base">
          <p>
            Already have an account?
            <Link to={'/signin'} className="text-blue-600 hover:text-blue-500">
              {' '}
              Log in now
            </Link>
          </p>

          <span>OR</span>
        </div>

        <Link
          to={'/google-auth'}
          className="flex w-full items-center justify-center space-x-2 rounded-lg border-2 border-b-4  border-gray-300 p-3 text-center hover:bg-gray-50 md:w-3/4 lg:w-2/5"
        >
          <img className="h-4 w-6 pl-1 sm:h-5 sm:w-10" src={AddGoogleIcon} />
          <span className="text-sm sm:text-base">Continue with Google</span>
        </Link>

        <Link
          to={'/github-auth'}
          className="flex w-full items-center justify-center space-x-2 rounded-lg border-2 border-b-4 border-gray-300 p-3 text-center hover:bg-gray-50 md:w-3/4 lg:w-2/5"
        >
          <img className="h-4 w-6 sm:h-5 sm:w-10" src={AddGithubIcon} />
          <span className="text-sm sm:text-base">Continue with Github</span>
        </Link>
      </div>
    </div>
  );
}

export default signin;
