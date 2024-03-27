import { FC, ReactElement } from "react";

import { withLayout } from "@/layouts";
import { Home } from "@/views";

export const dynamic = "force-static";

const HomePage: FC = (): ReactElement => {
  return <Home />;
};

export default withLayout(HomePage);
