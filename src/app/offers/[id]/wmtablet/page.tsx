import { FC, ReactElement } from "react";
import { SwWmtablet } from "@/views";

export async function generateStaticParams() {
  const keys = ["sw9pwtyk", "es9pwtyk"];
  return keys.map((key) => ({
    id: key
  }));
}

const SWWmtablet: FC<any> = ({ params }): ReactElement => {
  return <SwWmtablet type={params.id} />;
};

export default SWWmtablet;
