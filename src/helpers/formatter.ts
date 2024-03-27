export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  const formattedDate = date.toLocaleString("en-US", options);

  return formattedDate;
};
