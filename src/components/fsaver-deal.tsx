import Link from "next/link";
import { Button } from ".";

const TakeTheDeal = ({
  link = false,
  quantity = 0,
  setQuantity,
  onClick,
  searchParams,
  product,
  type
}: {
  link?: boolean;
  quantity: number;
  setQuantity: any;
  onClick: () => void;
  searchParams: any;
  product: any;
  type?: string;
}) => {
  return (
    <div>
      <div className="flex pt-1 pb-4 items-center justify-between">
        <div className="text-sm"> Select Quantity</div>
        <div className="flex  w-[60%] gap-1 px-1 border-[1px] border-[#cecece] rounded-md bg-white p-[3px]">
          {["1", "2", "3", "4"].map((item, ind) => (
            <Button
              text={item}
              variant="contained-square-white"
              className={`${
                ind + 1 === quantity
                  ? "bg-green text-white"
                  : "bg-[#e5f1ee] text-green"
              }  rounded-[4px] text-md  font-semibold w-full py-[2px] px-[4px]`}
              key={ind}
              name={`select-quantity-${ind}`}
              onClick={() => setQuantity(ind + 1)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="w-[40%] pt-2">Total price</div>
        <div className="flex gap-1 w-[60%]">
          <div className="relative w-44 flex after:flex after:flex-row after:rotate-45 after:w-7 after:h-7 after:bg-[#74c6b4] after:mt-[6px] after:-ml-[15.6px] after:rounded-e-[3px] after:z-0">
            <span className="bg-[#74c6b4] text-white font-medium p-[10px] w-[110px] rounded text-[13px] pl-[18px] z-50 ">
              Save ${(59.54 * quantity).toFixed(2)}
            </span>
          </div>
          <div className="font-bold pt-2">
            ${(product?.price * quantity).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center pt-4 pb-10">
        <Button
          text="TAKE THE DEAL"
          variant="contained-square-white"
          extraClasses="!bg-green rounded !text-white !text-lg font-bold w-full"
          onClick={onClick}
        />
        {link && (
          <Link
            href={`/offers/${type}/laundry?${searchParams}`}
            className="text-center text-[#777] pt-2"
          >
            I don&apos;t want the deal
          </Link>
        )}
      </div>
    </div>
  );
};

export default TakeTheDeal;
