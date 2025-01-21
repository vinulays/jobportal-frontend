import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { ClockIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../../Context/AuthProvider";
import axios from "axios";

const Calendar = () => {
  const { user } = useAuth();
  const [jobRequests, setJobRequests] = useState([]);

  useEffect(() => {
    axios
      .get(`/jobrequests/${user.role}/${user.email}`)
      .then((response) => {
        const filteredData = response.data.filter((request) => {
          if (request.isAccepted === "true") {
            delete Object.assign(request, { ["title"]: request["job"] })["job"];
            return request;
          }
        });

        setJobRequests(filteredData);
        console.log(filteredData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <div className="mt-5 p-[1rem]">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={jobRequests}
          eventContent={renderEventContent}
          eventTimeFormat={{
            hour: "numeric",
            meridiem: "short",
          }}
        />
      </div>
      <div className="md:hidden mt-2 p-[1rem] text-sm">
        <div>This month events</div>
        <div className="flex flex-col  divide-y mt-6 border rounded-lg">
          {jobRequests &&
            jobRequests.map(
              (request) =>
                new Date(request.date).getMonth() === new Date().getMonth() && (
                  <div className="flex flex-col gap-2 px-4  py-3">
                    <div>{request.title}</div>
                    <div className="flex gap-2 text-gray-400">
                      <ClockIcon className="h-5 w-5 " />
                      {new Date(request.date).toDateString()}
                    </div>
                  </div>
                )
            )}
        </div>
      </div>
    </div>
  );
};

function renderEventContent(eventInfo) {
  return (
    <>
      <div className="text-xs md:flex items-center justify-between flex-wrap overflow-hidden gap-3 hidden ">
        <div>{eventInfo.event.title}</div>
        <div className="text-gray-500">{eventInfo.timeText}</div>
      </div>

      <div className="w-2 h-2 rounded-full bg-gray-400 md:hidden ml-1"></div>
    </>
  );
}

export default Calendar;
