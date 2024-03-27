import Swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent, { ReactSweetAlert } from "sweetalert2-react-content";

import { Button, Typography } from "@/components";

const MySwal = withReactContent(Swal);

const useAlert = () => {
  const showAlert = ({
    type,
    title,
    text,
    onOk
  }: {
    type: SweetAlertIcon;
    title: string;
    text?: string;
    // eslint-disable-next-line no-unused-vars
    onOk?: (MySwal: typeof Swal & ReactSweetAlert) => void;
  }) => {
    MySwal.fire({
      title: (
        <Typography
          text={title}
          variant="text"
          extraClasses="!text-zinc-800 !text-lg !font-medium"
        />
      ),
      ...(text
        ? {
            html: (
              <Typography
                text={text}
                variant="text"
                extraClasses="!text-zinc-800 !font-normal"
              />
            )
          }
        : {}),
      footer: (
        <Button
          variant="contained-pill-white"
          text="OK"
          extraClasses="!px-8 !py-3"
          onClick={() =>
            typeof onOk === "function" ? onOk(MySwal) : MySwal.clickConfirm()
          }
        />
      ),
      customClass: {
        footer: "border-0 !flex justify-end"
      },
      icon: type,
      showConfirmButton: false
    });
  };

  return { showAlert };
};

export default useAlert;
