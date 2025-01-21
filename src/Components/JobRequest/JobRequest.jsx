import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  MapPinIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/20/solid";
import axios from "axios";
import { useAuth } from "../../Context/AuthProvider";
import { Toaster, toast } from "react-hot-toast";

const JobRequest = () => {
  const params = useParams();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    submittedData,
    formState,
    formState: { errors },
    formState: { isSubmitSuccessful },
  } = useForm();

  const [dateFinal, setDateFinal] = useState(null);
  const [job, setJob] = useState(null);

  const notify = () => toast.success("Job requested successfully.");

  useEffect(() => {
    axios
      .get(`/job/${params._id}`)
      .then((response) => {
        setJob(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [params]);

  const onSubmit = async (data) => {
    const output = await formatDate(data);
    output.providerId = job.provider._id;
    output.consumerId = user._id;
    output.isAccepted = "pending";
    output.job = job.title;

    delete output.am;
    delete output.time;

    axios
      .post("/jobrequests", JSON.stringify(output), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response.data);
        var testDate = new Date(response.data.date);
        console.log(testDate);
        notify();
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(output);
  };

  React.useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, submittedData, reset]);

  const formatDate = async (dateInfo) => {
    let [year, month, day] = dateInfo.date.split("-").map(Number);
    let [hours, minutes] = dateInfo.time
      .split(":")
      .map((part) => parseInt(part.trim(), 10));

    // Adjust hours for AM/PM
    if (dateInfo["am"].toLowerCase() === "pm" && hours !== 12) {
      hours += 12;
    }

    // Create the Date object
    let dateObject = new Date(year, month - 1, day, hours, minutes);

    dateInfo.date = dateObject;
    return dateInfo;
  };

  return (
    <div className="lg:flex lg:gap-2 lg:items-start mt-7  lg:justify-between p-[1rem]">
      <Toaster />
      <div className="flex flex-col basis-1/2 ">
        <div>
          <div className="min-w-0 ">
            <h2 className="text-2xl text-center md:text-left  leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {job && job.title}
            </h2>
          </div>
        </div>

        {/* provider */}
        <div className="md:flex items-center gap-6 mt-10">
          <div className="flex justify-center md:justify-normal shrink-0">
            {job && job.provider.photo && (
              <img
                className="lg:h-32 lg:w-32 md:h-20 w-20 h-20  rounded-full ring-2 ring-white"
                // src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                src={job.provider.photo}
                alt=""
              />
            )}
            {job && !job.provider.photo && (
              <div class="relative inline-flex items-center justify-center md:w-20 md:h-20 lg:h-32 lg:w-32 h-20 w-20 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                <span class="font-medium text-4xl text-gray-600 dark:text-gray-300">
                  {job.provider.firstName.charAt(0)}
                  {job.provider.lastName.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-2xl text-center md:text-left mt-6 md:mt-0">
                <NavLink to={`/provider/${job && job.provider._id}`}>
                  {job && job.provider.firstName} {job && job.provider.lastName}
                </NavLink>
              </h1>
            </div>
            <div className="text-gray-500 text-sm flex flex-col md:flex md:flex-row flex-wrap gap-2 md:gap-3 mt-4 md:mt-0">
              <span className="flex gap-1 items-center">
                <MapPinIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                {job && job.provider.city}, {job && job.provider.state},{" "}
                {job && job.provider.country}
              </span>
              <span className="flex gap-1 items-center">
                <AcademicCapIcon
                  className="h-5 w-5  text-gray-400"
                  aria-hidden="true"
                />
                {job && job.provider.qualification[0].name}
              </span>
              <span className="flex gap-1 items-center">
                <CurrencyDollarIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                {job && job.price} /hr
              </span>
            </div>
          </div>
        </div>

        {/* Job description */}
        <div className="mt-10 lg:mt-14 ">
          <div>
            <h1 className="font-semibold text-xl">About this Job</h1>
          </div>
          <div className="mt-4">
            <span className="text-xs md:text-base">
              {job && job.description}
            </span>
          </div>
        </div>
      </div>

      {/* Job request form */}
      <div className="basis-1/3 mt-7 lg:mt-0">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label
            htmlFor="description"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Write a few sentences about what you want.
          </label>
          <div className="mt-2">
            <textarea
              {...register("description", {
                required: {
                  value: true,
                  message: "Please enter what you expect from the provider.",
                },
                minLength: {
                  value: 20,
                  message: "Your message should longer than 20 letters.",
                },
              })}
              id="description"
              rows={10}
              className="block w-full px-2 py-2 rounded-md border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue={""}
            />
          </div>
          {errors.description && (
            <span className="text-red-600 text-sm">
              {errors.description.message}
            </span>
          )}
          <label
            htmlFor="date"
            className="block text-sm font-medium leading-6 text-gray-900 mt-4"
          >
            Pick a date.
          </label>
          <div className="mt-4 text-sm">
            <input
              {...register("date", {
                required: {
                  value: true,
                  message: "Date is required",
                },
              })}
              className="focus:outline-none block  rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              type="date"
              id="date"
            />
          </div>
          {errors.date && (
            <span className="text-red-600 text-sm">{errors.date.message}</span>
          )}
          <label
            htmlFor="time"
            className="block text-sm font-medium leading-6 text-gray-900 mt-4"
          >
            Pick a time.
          </label>
          <div className="flex gap-2">
            <div>
              <div className="mt-2">
                <select
                  {...register("time", {
                    required: {
                      value: true,
                      message: "Time is required",
                    },
                  })}
                  id="time"
                  name="time"
                  autoComplete="time"
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs text-sm sm:leading-6"
                >
                  <option value="">Select a time</option>
                  <option value="01 : 00">01 : 00</option>
                  <option value="02 : 00">02 : 00</option>
                  <option value="03 : 00">03 : 00</option>
                  <option value="04 : 00">04 : 00</option>
                  <option value="05 : 00">05 : 00</option>
                  <option value="06 : 00">06 : 00</option>
                  <option value="07 : 00">07 : 00</option>
                  <option value="08 : 00">08 : 00</option>
                  <option value="09 : 00">09 : 00</option>
                  <option value="10 : 00">10 : 00</option>
                  <option value="11 : 00">11 : 00</option>
                  <option value="12 : 00">12 : 00</option>
                </select>
              </div>
              <div>
                {errors.time && (
                  <span className="text-red-600 text-sm">
                    {errors.time.message}
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="mt-2">
                <select
                  {...register("am", {
                    required: {
                      value: true,
                      message: "AM / PM is required",
                    },
                  })}
                  id="am"
                  name="am"
                  autoComplete="am"
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs text-sm sm:leading-6"
                >
                  <option value="">AM / PM</option>
                  <option value="am">AM</option>
                  <option value="pm">PM</option>
                </select>
              </div>

              <div>
                {errors.am && (
                  <span className="text-red-600 text-sm">
                    {errors.am.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            className="w-full mt-4 bg-indigo-600 text-white rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={user.role === "provider"}
          >
            Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobRequest;
