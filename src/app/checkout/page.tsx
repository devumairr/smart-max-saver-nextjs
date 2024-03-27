import { FC, ReactElement } from "react";

import { withLayout } from "@/layouts";
import { CheckOut } from "@/views";

const CheckOutPage: FC = (): ReactElement => {
  return <CheckOut />;
};

export default withLayout(CheckOutPage);
