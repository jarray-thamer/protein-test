export const formatDate = (dateString) => {
  if (!dateString) return ""; // Handle empty or undefined date

  const date = new Date(dateString);

  // Extract date components
  const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  // Extract time components for 12-hour format
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Ensure 2 digits
  const ampm = hours >= 12 ? "PM" : "AM"; // Determine AM/PM

  // Convert hours to 12-hour format
  hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
};

export const formatDateDays = (dateString) => {
  const date = new Date(dateString);

  // Extract date components
  const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
