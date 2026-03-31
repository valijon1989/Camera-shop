import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Box, Button, Container, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch }  from "@reduxjs/toolkit";
import { setProducts } from "./slice";
import { Product, ProductInquiry } from "../../services/types/product";
import { createSelector } from "reselect";
import { retrieveProducts } from "./selector";
import ProductService from "../../services/ProductService";
import { useHistory, useLocation } from "react-router-dom";
import "../../../css/products.css";
import FilterPanel from "../../components/filters/FilterPanel";
import { getMediaUrl } from "../../../lib/config";

const parseProductSearch = (search: string): ProductInquiry => {
  const params = new URLSearchParams(search);
  return {
    page: params.get("page") ? Number(params.get("page")) : 1,
    limit: params.get("limit") ? Number(params.get("limit")) : 12,
    order: params.get("order") || "createdAt",
    search: params.get("search") || "",
    category: params.get("category") || undefined,
    brand: params.get("brand") || undefined,
    minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : undefined,
    maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : undefined,
    sensorType: params.get("sensorType") || undefined,
    resolutionMp: params.get("resolutionMp") ? Number(params.get("resolutionMp")) : undefined,
    mountType: params.get("mountType") || undefined,
    videoResolution: params.get("videoResolution") || undefined,
    isoRange: params.get("isoRange") || undefined,
    stabilization: params.get("stabilization") || undefined,
  };
};

const serializeProductSearch = (input: ProductInquiry) => {
  const params = new URLSearchParams();
  Object.entries(input).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  return params.toString();
};


/** REDUX SKICE & SELECTOR */
const productsRetriever = createSelector(retrieveProducts,(products) => ({
   products,
   }));


export default function Products() {
  const dispatch: Dispatch = useDispatch();
  const { products } = useSelector(productsRetriever);
  const history = useHistory();
  const location = useLocation();

  const [productSearch, setProductSearch] = useState<ProductInquiry>(() =>
    parseProductSearch(location.search)
  );
  const [searchText, setSearchText] = useState<string>(() =>
    parseProductSearch(location.search).search || ""
  );

  const productSearchKey = useMemo(
    () => serializeProductSearch(productSearch),
    [productSearch]
  );

  useEffect(() => {
    const incoming = parseProductSearch(location.search);
    const nextKey = serializeProductSearch(incoming);

    if (nextKey !== productSearchKey) {
      setProductSearch(incoming);
    }
    setSearchText(incoming.search || "");
  }, [location.search, productSearchKey]);

  useEffect(() => {
      const product = new ProductService();
      product
        .getProducts(productSearch)
        .then((data) => {
          dispatch(setProducts(data));
        })
        .catch(() => {
          dispatch(setProducts([]));
        });
    }, [productSearch, dispatch]);

  useEffect(() => {
    if (searchText === "" && productSearch.search) {
      const nextSearch = { ...productSearch, page: 1, search: "" };
      const nextSearchString = serializeProductSearch(nextSearch);
      if (nextSearchString === location.search.replace(/^\?/, "")) return;
      history.push({
        pathname: location.pathname,
        search: nextSearchString,
      });
    }
  }, [history, location.pathname, location.search, productSearch, searchText]);

  const updateSearch = (patch: Partial<ProductInquiry>) => {
    const nextSearch = {
      ...productSearch,
      ...patch,
    };
    const nextSearchString = serializeProductSearch(nextSearch);
    if (nextSearchString === location.search.replace(/^\?/, "")) return;
    history.push({
      pathname: location.pathname,
      search: nextSearchString,
    });
  };

  /** HANDLERS  */ 

  const searchOrderHandler = (order: string) => {
    updateSearch({ page: 1, order });
  };

  const searchProductHandler = () => {
    updateSearch({ page: 1, search: searchText });
  };

  const paginationHandler = (e: ChangeEvent<any>,value: number) => {
    updateSearch({ page: value });
  };

  const chooseProductHandler = (id: string) => {
    history.push(`/cameras/${id}`);
  }
  const handleFilterChange = (filters: ProductInquiry) => {
    updateSearch({ ...filters, page: filters.page || 1 });
  };

  return (
    <div className="products">
      <Container>
        <Stack flexDirection="column" alignItems="center">
          <Stack className="avatar-big-box">
            <Box className="category-title">Camera Marketplace Catalog</Box>

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
          <FilterPanel filters={productSearch} onChange={handleFilterChange} />

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
            </Stack>

            <Stack direction="row" className="list-category-section">
  
            <Stack className="product-category">
              <Button
                variant="contained"
                color={"primary"}
                onClick={() => updateSearch({ category: undefined, page: 1 })}
              >
                ALL
              </Button>
              <Button
                variant="contained"
                color={"primary"}
                onClick={() => updateSearch({ category: "mirrorless", page: 1 })}
              >
                MIRRORLESS
              </Button>
              <Button
                variant="contained"
                color={"primary"}
                onClick={() => updateSearch({ category: "dslr", page: 1 })}
              >
                DSLR
              </Button>
              <Button
                variant="contained"
                color={"primary"}
                onClick={() => updateSearch({ category: "lens", page: 1 })}
              >
                LENSES
              </Button>
              <Button
                variant="contained"
                color={"primary"}
                onClick={() => updateSearch({ category: "drone", page: 1 })}
              >
                DRONES
              </Button>
              <Button
                variant="contained"
                color={"primary"}
                onClick={() => updateSearch({ category: "accessory", page: 1 })}
              >
                ACCESSORIES
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
                  products.map((product: Product, idx: number) => {
                    const firstImage = product.images?.[0];
                    const imageSrc = getMediaUrl(firstImage) || "/icons/noimage-list.svg";
                    return (
                      <Stack key={product._id || idx} className={"product-card"} onClick={() => chooseProductHandler(product._id)}>
                        <Stack className="product-img">
                          <img
                            src={imageSrc}
                            alt={product.cameraModel || "Product image"}
                          />
                        </Stack>

                        <Box className={"product-desc"}>
                          <span className={"product-title"}>
                            {product.brand ? `${product.brand} ${product.cameraModel || ""}` : product.cameraModel}
                          </span>
                          <div className={"product-desc-icon"}>
                            ${product.price ?? 0}
                          </div>
                          <div className="product-meta">
                            <span>{product.condition || "Condition: N/A"}</span>
                            <span>{product.location || "Location: N/A"}</span>
                          </div>
                        </Box>
                      </Stack>
                    );
                  })
                ) : (
                  <Box className="no-data">No Cameras Available!</Box>
                )}
              </Stack>
            </Stack>

            <Stack className={"pagination-title"} alignItems={"center"}>
              {productSearch.page && (
              <Pagination
                count={(productSearch.page || 1) + (products.length === productSearch.limit ? 1 : 0)}
                page={productSearch.page || 1}
                renderItem={(item) => (
                  <PaginationItem
                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                    color={"secondary"}
                  />
                )}
                onChange={paginationHandler}
              />
              )}
            </Stack>
          </Stack>
        </Stack>
      </Container>

      <div className={"brands-logo"}>
        <Box className="category-title">Our Partner Brands</Box>
        <Stack direction="row" spacing={2} mt={2} justifyContent="center">
          <Box
            component="a"
            className="brand-img-1 brand-link"
            href="https://t.me/kamerachilar"
            target="_blank"
            rel="noreferrer"
            aria-label="Telegram - t.me/kamerachilar"
          >
            <span className="brand-link-label">
              <img src="/icons/telegram.svg" alt="Telegram" />
              t.me/kamerachilar
            </span>
          </Box>
          <Box
            component="a"
            className="brand-img-2 brand-link"
            href="https://t.me/kamereduz"
            target="_blank"
            rel="noreferrer"
            aria-label="Telegram - t.me/kamereduz"
          >
            <span className="brand-link-label">
              <img src="/icons/telegram.svg" alt="Telegram" />
              t.me/kamereduz
            </span>
          </Box>
          <Box
            component="a"
            className="brand-img-3 brand-link"
            href="https://t.me/orzularorzuligichaqolmaydixarak"
            target="_blank"
            rel="noreferrer"
            aria-label="Telegram - t.me/orzularorzuligichaqolmaydixarak"
          >
            <span className="brand-link-label">
              <img src="/icons/telegram.svg" alt="Telegram" />
              t.me/orzularorzuligichaqolmaydixarak
            </span>
          </Box>
          <Box
            component="a"
            className="brand-img-4 brand-link"
            href="https://t.me/videochilarchat"
            target="_blank"
            rel="noreferrer"
            aria-label="Telegram - t.me/videochilarchat"
          >
            <span className="brand-link-label">
              <img src="/icons/telegram.svg" alt="Telegram" />
              t.me/videochilarchat
            </span>
          </Box>
        </Stack>
        <Box className="partner-telegram">
          For advertising and services:
          <a href="https://t.me/Abu_Sabriya" target="_blank" rel="noreferrer" className="telegram-contact">
            <img src="/icons/telegram.svg" alt="Telegram" />
          </a>
        </Box>
      </div>

      <div className="address">
          <Container>
            <Stack className={"address-area"}>
            <Box className={"add-title"}>Fulfillment hub</Box>
            <Box className={"add-address"}>1443 Cheonan-daero, Seonggeo-eup, Seobuk-gu, Cheonan-si</Box>
            <iframe
              src="https://www.google.com/maps?q=KULOGISTICS%20Korea%201443%20Cheonan-daero,%20Seonggeo-eup,%20Seobuk-gu,%20Cheonan-si&output=embed"
              width="1320"
              height="500"
              referrerPolicy="no-referrer-when-downgrade"
              title="Store Location"
            ></iframe>
          </Stack>
        </Container>
      </div>
    </div>
  );
}
