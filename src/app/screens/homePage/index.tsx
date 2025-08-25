import React, { useEffect } from "react";
import Statistics from "./Statistics";
import Events from "./Events";
import ActiveUsers from "./ActiveUsers";
import PopularDishes from "./PopularDishes";
import NewDishes from "./NewDishes";
import Advertisement from "./Advertisement";
import "../../../css/home.css";


import { useSelector, useDispatch } from "react-redux";
import { Dispatch }  from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { setPopularDishes } from "./slice";
import { retrievePopularDishes } from "./selector";
import { Product } from "../../../lib/types/product";

/** REDUX SKICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
    setPopularDishes: (data: Product[]) => dispatch(setPopularDishes(data)),
});

const popularDishesRetriver = createSelector(
    retrievePopularDishes,
    (popularDishes) => ({
        popularDishes
    })
);

export default function HomePage() {
  const { setPopularDishes } = actionDispatch(useDispatch());
  const { popularDishes } = useSelector(popularDishesRetriver);
     // Selector: Redux Store ==> Data


  useEffect(() => {}, []);

    // Slice: Redux Store ==> Component


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