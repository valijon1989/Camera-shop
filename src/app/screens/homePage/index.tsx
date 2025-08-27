import React, { useEffect } from "react";
import Statistics from "./Statistics";
import Events from "./Events";
import ActiveUsers from "./ActiveUsers";
import PopularDishes from "./PopularDishes";
import NewDishes from "./NewDishes";
import Advertisement from "./Advertisement";
import "../../../css/home.css";


import { useDispatch } from "react-redux";
import { Dispatch }  from "@reduxjs/toolkit";
import { setPopularDishes } from "./slice";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";

/** REDUX SKICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
    setPopularDishes: (data: Product[]) => dispatch(setPopularDishes(data)),
});


export default function HomePage() {
  const { setPopularDishes } = actionDispatch(useDispatch());


  useEffect(() => {
  //Backenddan popular disheslarni olib kelish va Redux store ga set qilish

  const product = new ProductService();
  product
    .getProducts({
      page: 1,
      limit: 4,
      order: "productViews",
      productCollection: ProductCollection.DISH,
    })
    .then((data) => {
      console.log("data passed here:", data);
      setPopularDishes(data);
    })
    .catch();
  }, []);

  return (
  <div className={"homepage"}>
    <Statistics />
    <PopularDishes />
    <NewDishes />
    <Advertisement />
    <ActiveUsers />
    <Events />
    </div>
  );
}