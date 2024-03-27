import Image from "next/image";
import fstars from "../../public/assets/images/5-stars.png";
import tic from "../../public/assets/images/reccomend.png";

const FsaverReviews = () => {
  const ReviewContent = [
    {
      id: 1,
      heading: "Very happy and beyond impressed with this new technology!",
      authoranddate: "Michelle S. - February 03 2023",
      review:
        "“My 2009 Honda Accord had an average mpg of around 35. I wanted to improve this. So I checked the pressure on my tires and added this Fuel Save Pro chip. It says it takes about 150 miles to adjust the computer's ECU. I filled up the tank of fuel and took a trip to visit my parents out of state. It was a 167 miles round trip. My fuel mpg for that trip was a little over 47. Thanks guys!”",
      massage: "Yes, I recommend this product."
    },
    {
      id: 2,
      heading: "Wow, this is wonderful.",
      authoranddate: "Robert G. - February 24 2023",
      review:
        "I love this. It really has improved my truck’s gas mileage, almost doubling it!",
      massage: "Yes, I recommend this product."
    },
    {
      id: 3,
      heading: "I don’t understand how it works, but it does.",
      authoranddate: "Tammy S. - January 25 2023",
      review:
        "I don't understand, I feel seriously stupid. But my gas is lasting longer. I watched a few YouTube videos, they said the same thing about mileage, not much difference, but better. I drove a lot more to check and see if this works. After driving a ton more, my gas tank is still way more full than it usually is. It doesn't make sense. I also noticed a change in the feel of the drive. It made my car feel like it had more energy. Hard to explain. But I'm really happy I took a chance and got this!",
      massage: "Yes, I recommend this product."
    },
    {
      id: 4,
      heading: "Easy way to save money at the pump!",
      authoranddate: "John S. - January 23 2023",
      review:
        "It was easy to install and I gained 4 miles to the gallon on fuel so far.",
      massage: "Yes, I recommend this product."
    }
  ];
  return (
    <div>
      <ul>
        {ReviewContent.map((review) => (
          <li key={review.id} className="border-t-[1px] border-[#e3e3e3] pb-4">
            <p className="font-semibold font-roboto text-[20px] mb-5 mt-2">
              {review.heading}
            </p>
            <div className="flex flex-row my-3">
              <Image src={fstars} alt="rating" className="h-4 mr-2 mt-1" />
              <p>{review.authoranddate}</p>
            </div>
            <p>{review.review}</p>
            <div className="flex flex-row py-5">
              <Image src={tic} alt="tic image" className="w-5 h-5 mt-1" />
              <p className="pl-3">{review.massage}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FsaverReviews;
