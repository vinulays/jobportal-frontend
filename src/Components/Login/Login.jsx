import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../../Context/AuthProvider";

const Login = (props) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const { setAuth, setUser } = useAuth();

  const onSubmit = async (data) => {
    axios
      .post(`login/${props.role}`, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        // console.log(response.data);
        if (response.status === 200) {
          if (props.role === "consumer") {
            response.data.role = "consumer";
          } else {
            response.data.role = "provider";
          }
          setUser(response.data);
          setAuth(true);

          navigate("/", { replace: true });
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          setError("password", { type: "custom", message: "Invalid password" });
        }

        if (error.response.status === 404) {
          setError("email", { type: "custom", message: "Email not found" });
        }
      });
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 h-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-center text-[32px]">
          <NavLink to="/">
            <strong>L</strong>S
          </NavLink>
        </h1>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                {...register("email", {
                  required: { value: true, message: "Email is required" },
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Email is invalid",
                  },
                })}
                autoComplete="email"
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            {errors.email && (
              <span className="text-red-600 text-sm">
                {errors?.email?.message}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <NavLink to="/signup" className="font-semibold text-white">
                  Forgot password?
                </NavLink>
              </div>
            </div>
            <div className="mt-2">
              <input
                {...register("password", {
                  required: { value: true, message: "Password is required" },
                })}
                type="password"
                autoComplete="current-password"
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            {errors.password && (
              <span className="text-red-600 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?
          <NavLink
            to={`/signup/${props.role}`}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            {" "}
            Register now
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
