import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Container, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Badge from "@mui/material/Badge";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch }  from "@reduxjs/toolkit";
import { setProducts } from "./slice";
import { Product, ProductInquiry } from "../../../lib/types/product";
import { createSelector } from "reselect";
import { retrieveProducts } from "./selector";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";


/** REDUX SKICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
    setProducts: (data: Product[]) => dispatch(setProducts(data)),
});
const productsRetriever = createSelector(retrieveProducts,(products) => ({
   products,
   }));


   interface ProductsProps {
    onAdd: (item: CartItem) => void;
   }

export default function Products(props: ProductsProps) {
  const { onAdd } = props;
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
          page: 1,
          limit: 8,
          order: "createdAt",
          productCollection: ProductCollection.DISH,
          search: "",
        });

    const [searchText, setSearchText] = useState<string>("");
    const history = useHistory();


    useEffect(() => {
      const product = new ProductService();
      product
        .getProducts(productSearch)
        .then((data) => {
          console.log("data passed here:", data);
          setProducts(data);
        })
        .catch((err) => console.log(err));
    }, [productSearch]);


    useEffect(() => {
      if (searchText === "") {
        productSearch.search = "";
        setProductSearch({ ...productSearch });
      }
    }, [searchText]);


    /** HANDLERS  */ 

    const searchCollectionHandler = (collection: ProductCollection) => {
     productSearch.page = 1;
     productSearch.productCollection = collection;
      setProductSearch({ ...productSearch });
    };

    const searchOrderHandler = (order: string) => {
     productSearch.page = 1;
     productSearch.order = order;
      setProductSearch({ ...productSearch });
    };

    const searchProductHandler = () => {
     productSearch.search = searchText;
      setProductSearch({ ...productSearch });
    };

    const paginationHandler = (e: ChangeEvent<any>,value: number) => {
      productSearch.page = value;
      setProductSearch({ ...productSearch });
    };


    const chooseDishHandler = (id: string) => {
    history.push(`/products/${id}`);
    }


  return (
    <div className="products">
      <Container>
        <Stack flexDirection="column" alignItems="center">
          <Stack className="avatar-big-box">
            <Box className="category-title">Burak Restaurant</Box>

            <Box className="search-box">
              <input 
                type="search"
               className="search-input"
               name={"singleResearch"}
               placeholder="Type here" 
               value={searchText}
               onChange={(e) => setSearchText(e.target.value)}
               onKeyDown={(e) => {
                if (e.key === "Enter")searchProductHandler();
               }}
               />
              <Button 
              variant="contained"
              className={"single-button-input"}
              endIcon={<SearchIcon />}
              onClick=  {searchProductHandler}
              >
                Search
              </Button>
            </Box>
          </Stack>

          <Stack className="dishes-filter-section">
            <Stack className="filter-box">
              <Button 
              variant="contained" 
              className={"order"}
              color={
                productSearch.order === "createdAt" ? "primary" : "secondary"
              }
              onClick={() => searchOrderHandler("createdAt")}>
                NEW
              </Button>
              <Button 
              variant="contained" 
              className={"order"}
              color={
                productSearch.order === "productPrice" ? "primary" : "secondary"
              }
              onClick={() => searchOrderHandler("productPrice")
              }>
                PRICE
              </Button>
              <Button 
              variant="contained" 
              className={"order"}
              color={
                productSearch.order === "productViews" ? "primary" : "secondary"
              }
              onClick={() => searchOrderHandler("productViews")}>
                VIEWS
              </Button>
            </Stack>

            <Stack direction="row" className="list-category-section">
              <Stack className="product-category">
                <Button 
                variant="contained"
                 color={
                  productSearch.productCollection === ProductCollection.DISH 
                  ? "primary"
                  :"secondary"}
                  onClick={() => searchCollectionHandler(ProductCollection.DISH)}>
                  DISH
                </Button>
                <Button 
                variant="contained" 
                color={
                  productSearch.productCollection === ProductCollection.SALAD
                  ? "primary"
                  :"secondary"}
                 onClick={() => searchCollectionHandler(ProductCollection.SALAD)}>
                  SALAD
                </Button>
                <Button 
                variant="contained" 
                color={
                  productSearch.productCollection === ProductCollection.DRINK
                  ? "primary"
                  :"secondary"
                }
                  onClick={() => searchCollectionHandler(ProductCollection.DRINK)}>
                  DRINK
                </Button>
                <Button 
                variant="contained" 
                color={
                  productSearch.productCollection === ProductCollection.DESERT
                  ? "primary"
                  :"secondary"
                }
                 onClick={() => searchCollectionHandler(ProductCollection.DESERT)}>
                  DESERT
                </Button>
                <Button 
                variant="contained" 
                color={
                  productSearch.productCollection === ProductCollection.OTHER
                  ? "primary"
                  :"secondary"
                }
                 onClick={() => searchCollectionHandler(ProductCollection.OTHER)}>
                  OTHER
                </Button>
              </Stack>

              <Stack
                className="product-wrapper"
                spacing={2}
                direction="row"
                flexWrap="wrap"
                justifyContent="center"
              >
                {products.length !== 0 ? (
                  products.map((product: Product) => {
                    const ImagePath = `${serverApi}/${product.productImages[0]}`;
                    const sizeVolume = 
                      product.productCollection === ProductCollection.DRINK
                        ? product.productVolume + "litre"
                        : product.productSize + "size";
                    return (
                      <Stack key={product._id} className={"product-card"} onClick={() => chooseDishHandler(product._id)}>
                        <Stack
                          className="product-img"
                          sx={{
                            backgroundImage: `url(${ImagePath})`,
                          }}
                        >
                          <div className={"product-sale"}>{sizeVolume}</div>
                          <Button 
                          className="shop-btn"
                          onClick={(e) => {
                            onAdd({
                              _id: product._id,
                              quantity: 1,
                              name: product.productName,
                              price: product.productPrice,
                              image: product.productImages[0],
                            });
                            e.stopPropagation();
                           
                          }}>
                            <img
                              src="/icons/shopping-cart.svg"
                              alt="Shopping Cart"
                              style={{ display: "flex" }}
                            />
                          </Button>

                          <Button
                            className="view-btn"
                            sx={{
                              right: "36px",
                              minWidth: "auto",
                              padding: "6px",
                            }}
                          >
                            <Badge badgeContent={product.productViews} color="secondary">
                              <RemoveRedEyeIcon
                                sx={{
                                  color: 
                                  product.productViews ===0 ? "gray" : "white",
                                }}
                              />
                            </Badge>
                          </Button>
                        </Stack>

                        <Box className={"product-desc"}>
                          <span className={"product-title"}>
                            {product.productName}
                          </span>
                          <div className={"product-desc-icon"}>
                            <MonetizationOnIcon />
                            {product.productPrice}
                          </div>
                        </Box>
                      </Stack>
                    );
                  })
                ) : (
                  <Box className="no-data">Products are not available!</Box>
                )}
              </Stack>
            </Stack>

            <Stack className={"pagination-title"} alignItems={"center"}>
              <Pagination
                count={
                  products.length !== 0
                  ? productSearch.page + 1
                  : productSearch.page
                }
                page={productSearch.page}
                renderItem={(item) => (
                  <PaginationItem
                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                    color={"secondary"}
                  />
                )}
                onChange={paginationHandler}
              />
            </Stack>
          </Stack>
        </Stack>
      </Container>

      <div className={"brands-logo"}>
        <Box className="category-title">Our Family Brands</Box>
        <Stack direction="row" spacing={2} mt={2} justifyContent="center">
          <Box className="brand-img-1" />
          <Box className="brand-img-2" />
          <Box className="brand-img-3" />
          <Box className="brand-img-4" />
        </Stack>
      </div>

      <div className="address">
        <Container>
          <Stack className={"address-area"}>
            <Box className={"add-title"}>Our address</Box>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1498.2231714699258!2d69.22528515394224!3d41.32090667449867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b96d86aa283%3A0x94ce07c99e2fd34e!2sMumtoz%20Restoran!5e0!3m2!1sko!2skr!4v1753959722673!5m2!1sko!2skr"
              width="1320"
              height="500"
              referrerPolicy="no-referrer-when-downgrade"
              title="Restaurant Location"
            ></iframe>
          </Stack>
        </Container>
      </div>
    </div>
  );
}
