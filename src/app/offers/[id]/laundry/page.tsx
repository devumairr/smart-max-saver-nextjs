import { FC, ReactElement } from "react";
import { SwLaundry } from "@/views";

export async function generateStaticParams() {
  const keys = ["sw9pwtyk", "es9pwtyk"];
  return keys.map((key) => ({
    id: key
  }));
}

const LaundryPage: FC<any> = ({ params }): ReactElement => {
  return <SwLaundry type={params.id} />;
};
export default LaundryPage;
