import React, { useEffect } from "react";
import { Container, Stack, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Divider from "../../components/divider";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper";
import { useDispatch, useSelector } from "react-redux";
import { setRestaurant, setChosenProduct } from "./slice";
import { Product } from "../../services/types/product";
import { createSelector } from "reselect";
import { retrieveChosenProduct, retrieveRestaurant } from "./selector";
import { useParams } from "react-router-dom";
import ProductService from "../../services/ProductService";
import MemberService from "../../services/MemberService";
import { getMediaUrl, mediaApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";


/** REDUX SKICE & SELECTOR */
const chosenProductRetriever = createSelector(retrieveChosenProduct,(chosenProduct) => ({
   chosenProduct,
   }));

   const restaurantRetriever = createSelector(retrieveRestaurant,(restaurant) => ({
   restaurant,
   }));


    interface ChosenProductProps {
       onAdd: (item: CartItem) => void;
      }



export default function ChosenProduct(props: ChosenProductProps) {
  const { onAdd } = props;
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useDispatch();
  const { chosenProduct } = useSelector(chosenProductRetriever);
  const { restaurant } = useSelector(restaurantRetriever);

  useEffect(() => {
    const product = new ProductService();
    product
      .getProduct(productId)
      .then((data) => dispatch(setChosenProduct(data)))
      .catch((err) => console.log(err));

    const member = new MemberService();
    member
      .getRestaurant()
      .then((data) => dispatch(setRestaurant(data)))
      .catch((err) => console.log(err));
  // Fetch once per productId to avoid repeated backend calls
  }, [dispatch, productId]);

  if (!chosenProduct)  return null; 
  const imageList =
    chosenProduct.images && chosenProduct.images.length > 0
      ? chosenProduct.images
      : ["/icons/noimage-list.svg"];
  return (
    <div className={"chosen-product"}>
      <Box className={"title"}>Camera Detail</Box>
      <Container className={"product-container"}>
        <Stack className={"chosen-product-slider"}>
          <Swiper
            loop={true}
            spaceBetween={10}
            navigation={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="swiper-area"
          >
            {imageList.map((ele: string, index: number) => {
              const imagePath = (() => {
                if (!ele) return "/icons/noimage-list.svg";
                if (ele.startsWith("data:") || ele.startsWith("http")) return ele;
                const cleaned = ele.replace(/^\/+/, "");
                if (cleaned.toLowerCase().startsWith("uploads/")) {
                  return `http://localhost:9090/${cleaned}`;
                }
                if (cleaned.includes("/")) {
                  return `http://localhost:9090/uploads/${cleaned}`;
                }
                return `http://localhost:9090/uploads/products/${cleaned}`;
              })();
              return (
                <SwiperSlide key={index}>
                  <img
                    className="slider-image"
                    src={imagePath}
                    alt={chosenProduct?.cameraModel || "Camera image"}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Stack>
        <Stack className={"chosen-product-info"}>
          <Box className={"info-box"}>
            <strong className={"product-name"}>{chosenProduct?.brand ? `${chosenProduct.brand} ${chosenProduct.cameraModel}` : chosenProduct?.cameraModel}</strong>
            <span className={"resto-name"}>
              Managed by: {restaurant?.memberNick || "Camera Shop Dev admin"}
            </span>
             <span className={"resto-name"}>
              {restaurant?.memberPhone || "No contact listed"}
              </span>
            <Box className={"rating-box"}>
              <Rating name="half-rating" defaultValue={4.5} precision={0.5} />
              <div className={"evaluation-box"}>
                <div className={"product-view"}>
                  <RemoveRedEyeIcon sx={{ mr: "10px" }} />
                  <span>{chosenProduct?.views ?? 0}</span>
                </div>
              </div>
            </Box>
            <p className={"product-desc"}>
              {chosenProduct?.description
                ? chosenProduct?.description
                : "No Description"}
            </p>
            <Divider height="1" width="100%" bg="#000000" />
            <div className={"product-price"}>
              <span>Price:</span>
              <span>${chosenProduct?.price}</span>
            </div>
            <div className={"button-box"}>
              <Button variant="contained"
              onClick={(e) => {
                onAdd({
                  _id: chosenProduct._id,
                  quantity: 1,
                  name: chosenProduct.cameraModel,
                  price: chosenProduct.price,
                  image: chosenProduct.images?.[0],
                });
              e.stopPropagation();
                }}
              >
              Add To Basket
              </Button>
            </div>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
