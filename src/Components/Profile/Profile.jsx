import React, { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import {
  MapPinIcon,
  ClockIcon,
  ShoppingBagIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../Context/AuthProvider";
import ReviewCard from "../ReviewCard/ReviewCard";
import axios from "axios";
import { Rating, RoundedStar } from "@smastrom/react-rating";
import { Toaster, toast } from "react-hot-toast";
import StarRating from "../StarRating/StarRating";

const myStyles = {
  itemShapes: RoundedStar,
  activeFillColor: "#ffb700",
  inactiveFillColor: "#fbf1a9",
};

const Profile = () => {
  const params = useParams();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [overallRating, setOverrallRating] = useState(0);

  const [open, setOpen] = useState(false);

  const { user } = useAuth();

  const cancelButtonRef = useRef(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState,
    formState: { errors },
    formState: { isSubmitSuccessful },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      rating: 0,
    },
  });

  const notify = () => toast.success("Review added successfully.");

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  useEffect(() => {
    axios
      .get(`provider/${params._id}`)
      .then((response) => {
        setProvider(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [params]);

  useEffect(() => {
    if (provider) {
      axios
        .get(`review/${provider.email}`)
        .then((response) => {
          setReviews(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [provider]);

  useEffect(() => {
    if (reviews.length > 0) {
      const sumOfRatings = reviews.reduce(
        (total, review) => total + review.rating,
        0
      );

      const averageRating = sumOfRatings / reviews.length;

      setOverrallRating(Number(averageRating.toFixed(1)));
    }
  }, [reviews]);

  const updateReviews = () => {
    axios
      .get(`review/${provider.email}`)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (overallRating !== 0 && reviews.length > 0 && provider) {
      const updatedProvider = {
        ...provider,
        rating: overallRating,
        review: reviews.length,
      };

      axios
        .put(`provider/${provider._id}`, JSON.stringify(updatedProvider), {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          // console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [overallRating, reviews, provider]);

  const onSubmit = (data) => {
    data.providerEmail = provider.email;
    data.consumerEmail = user.email;
    data.date = new Date();

    axios
      .post("/review", JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        updateReviews();
        notify();
      })
      .catch((error) => {
        console.log(error);
      });

    setOpen(false);
  };
  return (
    <div className=" lg:flex lg:flex-row lg:items-start items-center flex flex-col gap-14">
      <Toaster />
      <div className="w-full md:mt-5  lg:max-w-sm bg-white border border-gray-200 rounded-lg shadow">
        <div className="flex flex-col items-center pb-10 mt-12">
          {provider && provider.photo && (
            <img
              className="md:w-20 md:h-20 lg:h-32 lg:w-32 h-20 w-20 mb-3 rounded-full shadow-lg"
              src={provider && provider.photo}
              alt="provider logo"
            />
          )}

          {provider && !provider.photo && (
            <div className="relative inline-flex items-center justify-center md:w-20 md:h-20 lg:h-32 lg:w-32 h-20 w-20 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <span className="font-medium text-4xl text-gray-600 dark:text-gray-300">
                {provider.firstName.charAt(0)}
                {provider.lastName.charAt(0)}
              </span>
            </div>
          )}

          <h5 className="mb-1 mt-4 text-xl font-medium text-gray-900 ">
            {provider && provider.firstName} {provider && provider.lastName}
          </h5>
          <span className="text-sm text-gray-500 ">
            {provider && provider.qualification[0].name}
          </span>
          <div className="overflow-hidden  ">
            <div className="mt-2">
              <div className="flex flex-col items-center gap-2 ">
                <span className="flex items-center gap-1 mt-2 rounded text-sm ">
                  <StarRating averageRating={overallRating} />
                  <span className="">
                    <span className="font-semibold">{overallRating}</span>{" "}
                    <span className="text-gray-500">
                      {" "}
                      ({reviews.length} reviews)
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </div>
          {user && user.role === "consumer" && (
            <div className="text-sm mt-6">
              <button
                className="flex items-center gap-2"
                onClick={() => setOpen(true)}
              >
                <span className="hover:underline">Write a review</span>{" "}
                <PencilSquareIcon className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className=" mt-10  w-[95%] px-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5" /> From
                </div>
                <div className="font-semibold">
                  {provider && provider.country}
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5" /> Experience
                </div>
                <div className="font-semibold">
                  {provider && provider.experience}
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <ShoppingBagIcon className="w-5 h-5" /> Availability
                </div>
                <div className="font-semibold">
                  {provider && provider.availability}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="basis-2/3 w-full flex flex-col gap-5 divide-y grow mb-6">
        {reviews.length > 0 &&
          reviews.map((review, i) => <ReviewCard key={i} props={review} />)}
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="flex flex-col items-center">
                      <div className="mt-3 text-center  sm:mt-0">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Write a review
                        </Dialog.Title>
                      </div>

                      <div className="mt-4 w-full">
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div>
                            <label
                              htmlFor="title"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Title
                            </label>
                            <div className="mt-2">
                              <input
                                {...register("title", {
                                  required: {
                                    value: true,
                                    message: "Title is required",
                                  },
                                  minLength: {
                                    value: 10,
                                    message: "Title is too short",
                                  },
                                })}
                                type="text"
                                id="title"
                                autoComplete="title"
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm leading-6"
                              />
                            </div>
                            {errors.title && (
                              <span className="text-red-600 text-sm">
                                {errors.title.message}
                              </span>
                            )}
                          </div>

                          <div className="mt-2">
                            <label
                              htmlFor="description"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Summary
                            </label>
                            <div className="mt-2">
                              <textarea
                                {...register("description", {
                                  required: {
                                    value: true,
                                    message: "Description is required",
                                  },
                                  minLength: {
                                    value: 15,
                                    message: "Description is too short",
                                  },
                                })}
                                id="description"
                                rows={3}
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm leading-6"
                                defaultValue={""}
                                placeholder="Tell us about the provider experience"
                              />
                            </div>
                            {errors.description && (
                              <span className="text-red-600 text-sm">
                                {errors.description.message}
                              </span>
                            )}
                          </div>

                          <div className="mt-2">
                            <label
                              htmlFor="last-name"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Rating
                            </label>
                            <div className="mt-2">
                              <Controller
                                control={control}
                                name="rating"
                                rules={{
                                  validate: (rating) => rating > 0,
                                }}
                                render={({
                                  field: { onChange, onBlur, value },
                                }) => (
                                  <Rating
                                    style={{ maxWidth: 130 }}
                                    itemStyles={myStyles}
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                  />
                                )}
                              />
                            </div>

                            {errors.rating && (
                              <span className="text-red-600 text-sm">
                                Rating is required
                              </span>
                            )}
                          </div>

                          <div className=" py-3 sm:flex sm:flex-row-reverse  ">
                            <button
                              type="submit"
                              className="inline-flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                            >
                              Submit
                            </button>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                              onClick={() => setOpen(false)}
                              ref={cancelButtonRef}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default Profile;
