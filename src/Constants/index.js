export const subCategories = [
  { name: "All" },
  { name: "Plumber" },
  { name: "A / C Mechanic" },
  { name: "Electrician" },
  { name: "Software Engineer" },
  { name: "Engineer" },
];

export const filters = [
  {
    id: "country",
    name: "Location",
    options: [
      { value: "United States", label: "United States", checked: false },
      { value: "Sri Lanka", label: "Sri Lanka", checked: false },
      { value: "Canada", label: "Canada", checked: false },
      { value: "Malaysia", label: "Malaysia", checked: false },
      { value: "United Kingdom", label: "United Kingdom", checked: false },
      { value: "Australia", label: "Australia", checked: false },
    ],
  },
  {
    id: "type",
    name: "Job Type",
    options: [
      { value: "Part time", label: "Part time", checked: false },
      { value: "Full time", label: "Full time", checked: false },
    ],
  },
  {
    id: "rating",
    name: "Provider Rating",
    options: [
      { value: "1", label: "⭐", checked: false },
      { value: "2", label: "⭐⭐", checked: false },
      { value: "3", label: "⭐⭐⭐", checked: false },
      { value: "4", label: "⭐⭐⭐⭐", checked: false },
      { value: "5", label: "⭐⭐⭐⭐⭐", checked: false },
    ],
  },
  {
    id: "experience",
    name: "Years of Experience",
    options: [
      { value: "1 - 3 Years", label: "1 - 3 Years", checked: false },
      { value: "3 - 7 Years", label: "3 - 7 Years", checked: false },
      { value: "7 - 15 Years", label: "3 - 15 Years", checked: false },
      { value: "15+ Years", label: "15+ Years", checked: false },
    ],
  },
];
