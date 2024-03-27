import { FC, ReactElement } from "react";

import { withLayout } from "@/layouts";
import { ProductDetails } from "@/views";
import { fetchProducts } from "@/services";
import { CAMPAIGN_ID } from "@/constants";

export async function generateStaticParams() {
  const {
    message: { data }
  } = await fetchProducts({ campaignId: CAMPAIGN_ID });

  const productsData = data[CAMPAIGN_ID]["products"];
  return productsData.map((prod: any) => ({
    slug: prod.productId.toString()
  }));
}

const Page: FC<any> = ({ params: { slug } }): ReactElement => {
  return <ProductDetails productId={slug} />;
};

export default withLayout(Page);
