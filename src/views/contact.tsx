import React from "react";
import { Container, Typography } from "@/components";

function ContactUs() {
  return (
    <div className="w-full h-full min-h-[calc(100vh-310px)]">
      <div className="w-full py-16">
        <Container>
          <div className="container mx-auto">
            <div className="flex">
              <div className="w-full md:w-1/2 lg:w-3/4 xl:w-1/2 mx-auto text-center">
                <Typography
                  extraClasses="text-center pb-2 text-[#1584bd] text-[40px]"
                  variant="heading"
                  text="Contact Us"
                />

                <Typography
                  extraClasses="text-center text-xl pb-8"
                  variant="heading"
                  text="Have any questions or concerns? Contact us today!"
                />

                <Typography
                  extraClasses="text-center !text-[20px] pb-4"
                  variant="text"
                  text="Moonstone Commerce Inc"
                />

                <Typography
                  extraClasses="text-center !text-[20px]"
                  variant="text"
                  text="Address:"
                />

                <Typography
                  extraClasses="text-center text-sm pb-4 font-normal"
                  variant="heading"
                  text="1935 West 4700 South PMB 257 Taylorsville, UT 84129"
                />

                <Typography
                  extraClasses="text-center !text-[20px]"
                  variant="text"
                  text="Phone:"
                />

                <Typography
                  extraClasses="text-center text-sm pb-4 font-normal"
                  variant="heading"
                  text="(833) 520 5397"
                />

                <Typography
                  extraClasses="text-center !text-[20px]"
                  variant="text"
                  text="Email Address:"
                />

                <Typography
                  extraClasses="text-center text-sm pb-4 font-normal"
                  variant="heading"
                  text="support@smartesaver.com"
                />

                <Typography
                  extraClasses="text-center !text-[20px]"
                  variant="text"
                  text="Return Address:"
                />

                <Typography
                  extraClasses="text-center text-sm pb-4 font-normal"
                  variant="heading"
                  text="3601 N Dixie Hwy Bay 14, Boca Raton, FL, 33431"
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default ContactUs;
