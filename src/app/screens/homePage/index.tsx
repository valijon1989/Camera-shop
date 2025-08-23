import React, { useEffect } from "react";
import Statistics from "./Statistics";
import Events from "./Events";
import ActiveUsers from "./ActiveUsers";
import PopularDishes from "./PopularDishes";
import NewDishes from "./NewDishes";
import Advertisement from "./Advertisement";
import "../../../css/home.css";

export default function HomePage() {
     // Selector: Redux Store ==> Data

  useEffect(() => {
      // Backend server data request ==> Data


     // Slice: Data ==> Redux Store

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