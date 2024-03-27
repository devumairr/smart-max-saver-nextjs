import { FC, ReactElement } from "react";
import { SwUpsell } from "@/views";

export async function generateStaticParams() {
  const keys = ["sw9pwtyk", "es9pwtyk"];
  return keys.map((key) => ({
    id: key
  }));
}

const SwUpsellPage: FC<any> = ({ params }): ReactElement => {
  return <SwUpsell type={params.id} />;
};

export default SwUpsellPage;
