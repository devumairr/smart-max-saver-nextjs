export const transformFormData = (data: {
  [key: string]: string | number | boolean;
}): string => {
  const formData: string[] = [];

  for (const value in data) {
    const encodedKey = encodeURIComponent(value);
    const encodedValue = encodeURIComponent(data[value]);
    formData.push(`${encodedKey}=${encodedValue}`);
  }

  return formData.join("&");
};
