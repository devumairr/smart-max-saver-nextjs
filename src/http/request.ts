export const http = async (
  url: string,
  method: "GET" | "POST" | "PATCH" | "PUT",
  data: BodyInit,
  headers?: HeadersInit
): Promise<any> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const response = await fetch(`${baseUrl}${url}`, {
    body: data,
    method,
    headers
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
};
