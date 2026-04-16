export const transformFirstVal = (value) => {
  return value.split(" ")[0].toUpperCase();
}

export const thisYear = () => {
  const date = new Date();
  return date.getFullYear();
}
