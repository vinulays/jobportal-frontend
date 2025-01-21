import React, { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../../Context/AuthProvider";
import {
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const JobRequestTable = () => {
  const [openAccept, setOpenAccept] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [jobRequests, setJobRequests] = useState([]);

  const [jobToUpdate, setJobToUpdate] = useState(null);

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

  useEffect(() => {
    axios
      .get(`/jobrequests/${user.role}/${user.email}`)
      .then((response) => {
        setJobRequests(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const updateTable = () => {
    axios
      .get(`/jobrequests/provider/${user.email}`)
      .then((response) => {
        setJobRequests(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onDecline = (data) => {
    data.isAccepted = "false";
    // console.log(data);

    axios
      .put("/jobrequests", JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        updateTable();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onAccept = (data) => {
    data.isAccepted = "true";
    // console.log(data);

    axios
      .put("/jobrequests", JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        updateTable();
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

  return (
    <div className="flex flex-col gap-4 mt-10 p-2">
      <div className="md:flex md:flex-row flex flex-col gap-3 md:items-center md:justify-between p-3">
        <div className="flex flex-col gap-3">
          <div>Job Requests</div>
          <div className="text-sm text-gray-500">
            A list of all the job requests in your account including their
            title, description, date, time and status.
          </div>
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
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Time
              </th>

              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {jobRequests.map((job, i) => (
              <tr key={i} className="bg-white border-b   hover:bg-gray-50 ">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                >
                  {job.job}
                </th>
                <td className="px-6 py-4">{job.description}</td>
                <td className="px-6 py-4">
                  {new Date(job.date).toDateString()}
                </td>
                <td className="px-6 py-4">
                  {new Date(job.date).toLocaleTimeString()}
                </td>
                {job.isAccepted === "pending" && (
                  <td className="px-6 py-4 text-right">
                    {user.role === "provider" ? (
                      <div className="flex items-center">
                        <span
                          className="font-medium text-blue-600  hover:underline cursor-pointer"
                          onClick={() => {
                            setOpenAccept(true);
                            setJobToUpdate(job);
                          }}
                        >
                          Accept
                        </span>
                        <span
                          className="font-medium text-red-600  hover:underline ml-3 cursor-pointer"
                          onClick={() => {
                            setOpenDelete(true);
                            setJobToUpdate(job);
                          }}
                        >
                          Decline
                        </span>
                      </div>
                    ) : (
                      <span className="font-medium text-gray-500 flex items-center  gap-2">
                        <ClockIcon className="h-5 w-5" /> Pending
                      </span>
                    )}
                  </td>
                )}

                {job.isAccepted === "true" && (
                  <td className="px-6 py-4 text-right">
                    {job.isAccepted === "true" && (
                      <span
                        className={`font-medium text-green-500  flex items-center gap-2`}
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                        Accepted
                      </span>
                    )}
                  </td>
                )}

                {job.isAccepted === "false" && (
                  <td className="px-6 py-4 text-right">
                    {job.isAccepted === "false" && (
                      <span
                        className={`font-medium text-red-600 flex items-center gap-2`}
                      >
                        <ExclamationCircleIcon className="h-5 w-5" />
                        Declined
                      </span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal - ACCEPT */}

      <Transition.Root show={openAccept} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpenAccept}
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
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-green-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Accept job request
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to accept this job? This
                            action will notify the consumer and cannot be
                            undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={() => {
                        setOpenAccept(false);
                        onAccept(jobToUpdate);
                      }}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpenAccept(false)}
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

      {/* Modal - DECLINE */}

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
                          Delete job request
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to delete this job request?
                            This action will notify the consumer and cannot be
                            undone.
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
                        onDecline(jobToUpdate);
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

export default JobRequestTable;
