import { FC, ReactElement } from "react";

import { SwThankYou } from "@/views";

export async function generateStaticParams() {
  const keys = ["sw9pwtyk", "es9pwtyk"];
  return keys.map((key) => ({
    id: key
  }));
}

const SwThankYouPage: FC<any> = ({ params }): ReactElement => {
  return <SwThankYou type={params.id} />;
};

export default SwThankYouPage;
