import React, { useEffect, useState } from "react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../Context/AuthProvider";

import {
  MapPinIcon,
  ArrowLongRightIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

import { StarIcon } from "@heroicons/react/20/solid";
import axios from "axios";

const JobCard = ({ props }) => {
  const { auth } = useAuth();

  return (
    <div className="flex flex-col gap-4  max-w-full md:flex md:flex-row md:items-center md:justify-between border-[1px] p-[2rem] border-card-border rounded-lg shadow-card">
      <div className="flex flex-col">
        <div>
          <div className="md:flex md:flex-row flex flex-col justify-center items-center md:justify-start ">
            <div>
              {props.provider.photo && (
                <img
                  className="inline-block h-10 w-10 object-cover rounded-full ring-2 ring-white"
                  src={props.provider.photo}
                  alt="Avatar of Jonathan Reinink"
                />
              )}

              {!props.provider.photo && (
                <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                  <span className="font-medium text-gray-600 dark:text-gray-300">
                    {props.provider.firstName.charAt(0)}
                    {props.provider.lastName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal text-center md:text-left">
              <div>
                <div className="text-gray-900 text-lg mb-2 cursor-pointer ">
                  <NavLink
                    to={auth == null ? `/login/consumer` : `/job/${props._id}`}
                  >
                    {props.title}
                  </NavLink>
                </div>
                <div className="text-gray-700 text-sm md:flex gap-4 items-center ">
                  <NavLink to={`/provider/${props.provider._id}`}>
                    {props.provider.firstName} {props.provider.lastName}{" "}
                  </NavLink>
                  <span className="flex  mt-2  md:mt-0 items-center gap-1">
                    <div>
                      <StarIcon className="h-4 w-4 -mt-0.5" />{" "}
                    </div>
                    <div>
                      <strong>{props.provider.rating}</strong> (
                      {props.provider.review})
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:flex md:flex-row flex flex-col  gap-2">
          <div className="flex items-center gap-2 opacity-60">
            <ShoppingBagIcon className="h-5 w-5" />
            <span className="text-sm ">{props.provider.availability}</span>
          </div>
          <div className="flex items-center gap-2 opacity-60">
            <MapPinIcon className="h-5 w-5" />
            <span className="text-sm">
              {props.provider.city}, {props.provider.state},{" "}
              {props.provider.country}
            </span>
          </div>
          <div className="flex items-center gap-2 opacity-60">
            <CurrencyDollarIcon className="h-5 w-5" />
            <span className="text-sm">${props.price} /hr</span>
          </div>
        </div>
      </div>

      <div>
        <NavLink to={auth == null ? `/login/consumer` : `/job/${props._id}`}>
          <button className="text-sm flex items-center gap-2 cursor-pointer">
            Request <ArrowLongRightIcon className="w-5 h-5" />
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default JobCard;
