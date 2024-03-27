import { Header, Footer } from "@/components";
import { FC } from "react";

function withLayout(Component: FC): FC {
  return function EnhancedComponent({ ...props }) {
    return (
      <>
        <Header />
        <main>
          <Component {...props} />
        </main>
        <Footer />
      </>
    );
  };
}

export default withLayout;
