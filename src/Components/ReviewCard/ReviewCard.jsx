import React, { useEffect } from "react";
import StarRating from "../StarRating/StarRating";

const ReviewCard = ({ props }) => {
  const formatDate = (date) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const monthIndex = dateObj.getMonth();
    const year = dateObj.getFullYear();

    const formattedDate = `${months[monthIndex]} ${day}, ${year}`;
    return formattedDate;
  };

  return (
    <article>
      <div className="flex items-center mb-4 space-x-4 mt-8">
        {/* <img
          className="w-10 h-10 rounded-full"
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
          alt=""
        /> */}
        {props.consumer.photo && (
          <img
            className=" h-10 w-10 mb-3 rounded-full shadow-lg"
            src={props.consumer.photo}
            alt="provider image"
          />
        )}

        {!props.consumer.photo && (
          <div className="relative inline-flex items-center justify-center h-10 w-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
            <span className="font-medium text-base text-gray-600 dark:text-gray-300">
              {props.consumer.firstName.charAt(0)}
              {props.consumer.lastName.charAt(0)}
            </span>
          </div>
        )}
        <div className="space-y-1 font-medium ">
          <p>
            {props.consumer.firstName} {props.consumer.lastName}
          </p>
        </div>
      </div>
      <div className="flex items-center mb-1">
        <StarRating averageRating={props.rating} />
        <h3 className="ml-2 text-sm font-semibold text-gray-900 ">
          {props.title}
        </h3>
      </div>
      <footer className="mb-5 text-sm text-gray-500 dark:text-gray-400">
        <p>
          Reviewed in the {props.consumer.country} on{" "}
          <time dateTime={`${props.date}`}>{formatDate(props.date)}</time>
        </p>
      </footer>
      <p className="mb-2 text-gray-500 dark:text-gray-400 text-sm">
        {props.description}
      </p>
    </article>
  );
};

export default ReviewCard;
