import { FC, ReactElement } from "react";

import { SwHeater } from "@/views";

export async function generateStaticParams() {
  const keys = ["sw9pwtyk", "es9pwtyk"];
  return keys.map((key) => ({
    id: key
  }));
}

const SwHeaterPage: FC<any> = ({ params }): ReactElement => {
  return <SwHeater type={params.id} />;
};

export default SwHeaterPage;
