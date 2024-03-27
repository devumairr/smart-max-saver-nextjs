import { FC, ReactElement } from "react";

import { withLayout } from "@/layouts";
import { ThankYou } from "@/views";

const ThankYouPage: FC = (): ReactElement => {
  return <ThankYou />;
};

export default withLayout(ThankYouPage);
