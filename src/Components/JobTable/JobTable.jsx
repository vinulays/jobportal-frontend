import React, { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../../Context/AuthProvider";
import { Toaster, toast } from "react-hot-toast";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const JobTable = () => {
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [jobID, setJobID] = useState(null);

  const notify = () => toast.success("Job added successfully.");
  const notify2 = () => toast.success("Job updated successfully.");
  const notify3 = () => toast.success("Job deleted successfully.");

  const cancelButtonRef = useRef(null);

  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors },
    formState: { isSubmitSuccessful },
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    formState: formState2,
    formState: { errors: errors2 },
    formState: { isSubmitSuccessful: isSubmitSuccessful2 },
    setValue,
  } = useForm();

  useEffect(() => {
    axios
      .get(`/job/provider/${user.email}`)
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onSubmit = (data) => {
    data.email = user.email;

    setOpen(false);

    axios
      .post("/job", JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        notify();
        setJobs([...jobs, data]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateTable = () => {
    axios
      .get(`/job/provider/${user.email}`)
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onUpdate = (data) => {
    data.email = user.email;
    // console.log(data);
    setOpenUpdate(false);

    axios
      .put(`/job/${jobID}`, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        notify2();

        updateTable();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onDelete = () => {
    axios
      .delete(`/job/${jobID}`, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        updateTable();
        notify3();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  useEffect(() => {
    if (formState2.isSubmitSuccessful) {
      reset2();
    }
  }, [formState2, reset2]);

  return (
    <div className="flex flex-col gap-4 mt-10 p-2">
      <Toaster />
      <div className="md:flex md:flex-row flex flex-col gap-3 md:items-center md:justify-between p-3">
        <div className="flex flex-col gap-3">
          <div>Jobs</div>
          <div className="text-sm text-gray-500">
            A list of all the jobs in your account including their title,
            description, and rate.
          </div>
        </div>
        <div>
          <button
            onClick={() => setOpen(true)}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3.5 py-2 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Add job
          </button>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-sm   bg-gray-50  ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Job title
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Price (/hr)
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, i) => (
              <tr key={i} className="bg-white border-b   hover:bg-gray-50 ">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                >
                  {job.title}
                </th>
                <td className="px-6 py-4 ">{job.description}</td>
                <td className="px-6 py-4">${job.price}</td>
                <td className="px-6 py-4 text-right">
                  <span
                    className="font-medium text-blue-600  hover:underline cursor-pointer"
                    onClick={() => {
                      setOpenUpdate(true);
                      setValue("title2", job.title);
                      setValue("description2", job.description);
                      setValue("price2", job.price);
                      setJobID(job._id);
                    }}
                  >
                    Edit
                  </span>
                  <span
                    className="font-medium text-red-600  hover:underline ml-3 cursor-pointer"
                    onClick={() => {
                      setOpenDelete(true);
                      setJobID(job._id);
                    }}
                  >
                    Delete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Model - ADD */}

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
                          Add a Job
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
                              Description
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
                                placeholder="Add a description about the job you provide"
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
                              Price (/hr)
                            </label>
                            <div className="mt-2">
                              <input
                                {...register("price", {
                                  required: {
                                    value: true,
                                    message: "Price is required",
                                  },
                                  min: {
                                    value: 5,
                                    message:
                                      "Price should be larger than $5/hr",
                                  },
                                })}
                                type="number"
                                id="price"
                                autoComplete="price"
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm leading-6"
                              />
                            </div>
                            {errors.price && (
                              <span className="text-red-600 text-sm">
                                {errors.price.message}
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

      {/* Model - UPDATE */}
      <Transition.Root show={openUpdate} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpenUpdate}
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
                          Edit the Job
                        </Dialog.Title>
                      </div>

                      <div className="mt-4 w-full">
                        <form onSubmit={handleSubmit2(onUpdate)}>
                          <div>
                            <label
                              htmlFor="title"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Title
                            </label>
                            <div className="mt-2">
                              <input
                                {...register2("title2", {
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
                            {errors2.title2 && (
                              <span className="text-red-600 text-sm">
                                {errors2.title2.message}
                              </span>
                            )}
                          </div>

                          <div className="mt-2">
                            <label
                              htmlFor="description"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Description
                            </label>
                            <div className="mt-2">
                              <textarea
                                {...register2("description2", {
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
                                placeholder="Add a description about the job you provide"
                              />
                            </div>
                            {errors2.description2 && (
                              <span className="text-red-600 text-sm">
                                {errors2.description2.message}
                              </span>
                            )}
                          </div>

                          <div className="mt-2">
                            <label
                              htmlFor="last-name"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Price (/hr)
                            </label>
                            <div className="mt-2">
                              <input
                                {...register2("price2", {
                                  required: {
                                    value: true,
                                    message: "Price is required",
                                  },
                                  min: {
                                    value: 5,
                                    message:
                                      "Price should be larger than $5/hr",
                                  },
                                })}
                                type="number"
                                id="price"
                                autoComplete="price"
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm leading-6"
                              />
                            </div>
                            {errors2.price2 && (
                              <span className="text-red-600 text-sm">
                                {errors2.price2.message}
                              </span>
                            )}
                          </div>

                          <div className="py-3 sm:flex sm:flex-row-reverse">
                            <button
                              type="submit"
                              className="inline-flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                            >
                              Update
                            </button>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                              onClick={() => setOpenUpdate(false)}
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

      {/* Modal - DELETE */}

      <Transition.Root show={openDelete} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpenDelete}
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Delete Job
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to delete your job? All of
                            your data will be permanently removed. This action
                            cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={() => {
                        setOpenDelete(false);
                        onDelete();
                      }}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpenDelete(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
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

export default JobTable;
