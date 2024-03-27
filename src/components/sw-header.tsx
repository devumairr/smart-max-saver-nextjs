import { FC, ReactElement } from "react";
import { Container } from "../components";
import Image from "next/image";
import logo from "../../public/assets/images/stopwatt.png";

const SwHeader: FC = (): ReactElement => {
  return (
    <header>
      <Container>
        <div className="bg-white flex justify-center">
          <Image className="w-52 object-contain" src={logo} alt="logo" />
        </div>
      </Container>
    </header>
  );
};

export default SwHeader;
