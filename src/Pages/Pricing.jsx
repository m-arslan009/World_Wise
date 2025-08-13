import PageNav from "../Components/PageNav";
import PricingStyle from "../Css Modules/Pricing.module.css";
import pricingImage from "../assets/pricing-image.jpg";
import CommonStyling from "../Css Modules/CommonProperties.module.css";

export default function Pricing() {
  return (
    <div className={CommonStyling.dimensions}>
      <PageNav />
      <div
        className={`${CommonStyling.dimensions} ${PricingStyle.pricing_container}`}
      >
        <div className={PricingStyle.details_container}>
          <h1>Simple pricing Just $9/month.</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
        <img src={pricingImage} alt="Product Image" />
      </div>
    </div>
  );
}
