export const transformFirstVal = (value) => {
  return value.split(" ")[0].toUpperCase();
}

export const thisYear = () => {
  const date = new Date();
  return date.getFullYear();
}

export const timeSched = (val) => {
  return new Date(val).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}

export const sliceToOne = (val) => {
  return val.split("")[0];
}

export const getFirstWord = (val) => {
  return val.split(" ")[0];
}

export const transformTimezone = (val) => {
  const date = new Date(val);

  let hours = date.getHours();
  const minutes = date.getMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12

  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${hours}:${formattedMinutes} ${ampm}`
}