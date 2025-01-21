import React from "react";

import { useForm } from "react-hook-form";
import { useSearch } from "../../Context/SearchProvider";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const Search = () => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm();

  const { handleSearch } = useSearch();

  const onSubmit = (data) => {
    // console.log(data);
    handleSearch(data.title, data.location);
  };

  return (
    <div className="search-container grid gap-10  rounded-[10px] p-[1rem]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="lg:flex justify-between items-center rounded-[8px] gap-4 bg-white p-5 shadow-lg ">
          <div className="md:flex grid grid-cols-1 gap-3 justify-between lg:basis-3/4 md:divide-x-2">
            <div className="flex w-full gap-2 items-center">
              <MagnifyingGlassIcon className="h-7 w-7" />
              <input
                {...register("title", {
                  required: false,
                })}
                type="text"
                className="bg-transparent focus:outline-none w-[100%]"
                placeholder="Job title or keywords"
              />
              <XCircleIcon
                onClick={() => {
                  reset({
                    title: "",
                  });
                }}
                className="h-7 w-7 text-[#a5a6a6] hover:text-black cursor-pointer"
              />
            </div>

            <div className="flex w-full  gap-2 items-center md:pl-2">
              <MapPinIcon className="h-7 w-7" />
              <input
                {...register("location", {
                  required: false,
                })}
                type="text"
                className="bg-transparent focus:outline-none w-[100%]"
                placeholder="Location"
              />
              <XCircleIcon
                onClick={() => {
                  reset({
                    location: "",
                  });
                }}
                className="h-7 w-7 text-[#a5a6a6] hover:text-black cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 w-full lg:basis-1/4 p-3 mt-4 lg:mt-0  rounded-[10px] text-white cursor-pointer"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default Search;
