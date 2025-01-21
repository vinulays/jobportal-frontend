import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const SearchContext = createContext({
  jobs: [],
  allJobs: [],
  handleSearch: () => {},
  handleCategory: () => {},
  handleFilters: () => {},
  handlePrice: () => {},
  resetJobs: () => {},
});

const useSearch = () => useContext(SearchContext);

const SearchProvider = ({ children }) => {
  const [allJobs, setAllJobs] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios
      .get("/job")
      .then((response) => {
        setJobs(response.data);
        setAllJobs(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const resetJobs = () => {
    axios
      .get("/job")
      .then((response) => {
        setJobs(response.data);
        setAllJobs(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSearch = (title, location) => {
    if (title === "" && location === "") {
      resetJobs();
    } else {
      let filteredJobs = allJobs.filter((job) => {
        let address =
          job.provider.city + job.provider.state + job.provider.country;
        return (
          (title !== "" &&
            job.title.toLowerCase().includes(title.toLowerCase())) ||
          (location !== "" &&
            address.toLowerCase().includes(location.toLowerCase()))
        );
      });
      setJobs(filteredJobs);
    }
  };

  const handleCategory = (category) => {
    if (category === "All") {
      setJobs(allJobs);
    } else {
      let filteredJobs = allJobs.filter((job) => {
        return job.provider.qualification[0].name === category;
      });

      setJobs(filteredJobs);
    }
  };

  const handleFilters = (sectionName, optionName) => {
    let filteredJobs;
    if (sectionName === "type") {
      filteredJobs = allJobs.filter((job) => {
        return job.provider.availability === optionName;
      });

      setJobs(filteredJobs);
    }

    if (sectionName === "country") {
      filteredJobs = allJobs.filter((job) => {
        return job.provider.country === optionName;
      });

      setJobs(filteredJobs);
    }

    if (sectionName === "experience") {
      filteredJobs = allJobs.filter((job) => {
        return job.provider.experience === optionName;
      });

      setJobs(filteredJobs);
    }

    if (sectionName === "rating") {
      filteredJobs = allJobs.filter((job) => {
        return job.provider.review === Number(optionName);
      });

      setJobs(filteredJobs);
    }

    console.log(sectionName);
    console.log(optionName);
  };

  const handlePrice = (price) => {
    let filteredJobs;
    if (Number(price) >= 500) {
      filteredJobs = allJobs.filter((job) => {
        return job.price >= 500;
      });
    } else {
      filteredJobs = allJobs.filter((job) => {
        return job.price <= Number(price);
      });
    }
    setJobs(filteredJobs);
  };

  return (
    <SearchContext.Provider
      value={{
        handleSearch,
        jobs,
        handleFilters,
        handleCategory,
        handlePrice,
        resetJobs,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export { useSearch };
export default SearchProvider;
