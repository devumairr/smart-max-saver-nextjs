import { FC, ReactElement } from "react";

import { withLayout } from "@/layouts";
import { AllProduct } from "@/views";

const ProductsPage: FC = (): ReactElement => {
  return <AllProduct />;
};

export default withLayout(ProductsPage);
