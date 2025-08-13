import PageNav from "../Components/PageNav";
import style from "../Css Modules/Product.module.css";
import productImage from "../assets/product-image.jpg";

export default function Products() {
  return (
    <div className={style.product_container}>
      <PageNav />
      <div>
        <img src={productImage} alt="Product Image" />
        <div className={style.details_container}>
          <h1>About WorldWWide.</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>
    </div>
  );
}
