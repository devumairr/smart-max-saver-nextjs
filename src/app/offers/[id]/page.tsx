import { FC, ReactElement } from "react";

import { SwOffer } from "@/views";

export async function generateStaticParams() {
  const keys = ["sw9pwtyk", "es9pwtyk"];
  return keys.map((key) => ({
    id: key
  }));
}

const SwOfferPage: FC<any> = ({ params }): ReactElement => {
  return <SwOffer type={params.id} />;
};

export default SwOfferPage;
