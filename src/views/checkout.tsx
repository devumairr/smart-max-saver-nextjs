import { CartForm, CartTable, CheckoutBanner, Container } from "@/components";

import { CAMPAIGN_ID } from "@/constants";
import { extractCountries, extractStates } from "@/helpers";
import { fetchProducts } from "@/services";

const CheckOut = async () => {
  const {
    message: { data }
  } = await fetchProducts({ campaignId: CAMPAIGN_ID });

  const countries = extractCountries(data, CAMPAIGN_ID);

  const states = extractStates(countries);

  const products = data[CAMPAIGN_ID]["products"];

  const shippingObj = products.find(
    (product: any) => product.productName === "Shipping Fee"
  );

  return (
    <div className="w-full">
      {/* BANNER */}
      <CheckoutBanner />
      {/* CART CONTENT */}
      <div className="w-full py-16">
        <Container>
          <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-8">
            <div className="lg:col-span-2 max-sm:col-span-2 sm:col-span-3 max-md:col-span-2 md:col-span-3">
              {/* CART TABLE */}
              <CartTable shippingObj={shippingObj} />
            </div>
            <div className="lg:col-span-1 max-sm:col-span-2 sm:col-span-3 max-md:col-span-2 md:col-span-3">
              {/* CART FORM */}
              <CartForm states={states} countries={countries} />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default CheckOut;
