import { FC, ReactElement } from "react";
import { SwDownsell } from "@/views";

export async function generateStaticParams() {
  const keys = ["sw9pwtyk", "es9pwtyk"];
  return keys.map((key) => ({
    id: key
  }));
}

const SWDownsellPage: FC<any> = ({ params }): ReactElement => {
  return <SwDownsell type={params.id} />;
};

export default SWDownsellPage;
