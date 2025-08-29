import React, { useEffect } from "react";
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
import { Product } from "../../../lib/types/product";
import { createSelector } from "reselect";
import { retrieveProducts } from "./selector";


/** REDUX SKICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
    setProducts: (data: Product[]) => dispatch(setProducts(data)),
});
const productsRetriever = createSelector(retrieveProducts,(products) => ({
   products,

   }));



const products = [
  { productName: "Cutlet", ImagePath: "/img/cutlet.webp" },
  { productName: "Kebab", ImagePath: "/img/kebab-fresh.webp" },
  { productName: "Kebab", ImagePath: "/img/kebab.webp" },
  { productName: "Lavash", ImagePath: "/img/lavash.webp" },
  { productName: "Lavash", ImagePath: "/img/lavash.webp" },
  { productName: "Cutlet", ImagePath: "/img/cutlet.webp" },
  { productName: "Kebab", ImagePath: "/img/kebab.webp" },
  { productName: "Kebab", ImagePath: "/img/kebab-fresh.webp" },
];

export default function Products() {
  return (
    <div className="products">
      <Container>
        <Stack flexDirection="column" alignItems="center">
          <Stack className="avatar-big-box">
            <Box className="category-title">Burak Restaurant</Box>

            <Box className="search-box">
              <input className="search-input" placeholder="Type here" />
              <Button variant="contained" endIcon={<SearchIcon />}>
                Search
              </Button>
            </Box>
          </Stack>

          <Stack className="dishes-filter-section">
            <Stack className="filter-box">
              <Button variant="contained" color="primary">
                NEW
              </Button>
              <Button variant="contained" color="secondary">
                PRICE
              </Button>
              <Button variant="contained" color="secondary">
                VIEWS
              </Button>
            </Stack>

            <Stack direction="row" className="list-category-section">
              <Stack className="product-category">
                <Button variant="contained" color="primary">
                  DISH
                </Button>
                <Button variant="contained" color="secondary">
                  SALAD
                </Button>
                <Button variant="contained" color="secondary">
                  DRINK
                </Button>
                <Button variant="contained" color="secondary">
                  DESSERT
                </Button>
                <Button variant="contained" color="secondary">
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
                  products.map((product, index) => {
                    return (
                      <Stack key={index} className={"product-card"}>
                        <Stack
                          className="product-img"
                          sx={{
                            backgroundImage: `url(${product.ImagePath})`,
                          }}
                        >
                          <div className={"product-sale"}>Normal size</div>
                          <Button className="shop-btn">
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
                            <Badge badgeContent={20} color="secondary">
                              <RemoveRedEyeIcon
                                sx={{
                                  color: 20 ? "gray" : "white",
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
                            {15}
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
                count={3}
                renderItem={(item) => (
                  <PaginationItem
                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                    color={"secondary"}
                  />
                )}
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
