import React from "react";
import {  Route, Switch, useRouteMatch } from "react-router-dom";
import ChoosenProduct from "./ChosenProduct";
import Products from "./Products";
import '../../../css/products.css'; 
import { CartItem } from "../../../lib/types/search";

interface ProductsPageProps {
  onAdd?: (item: CartItem) => void;
}

export default function ProductsPage(props: ProductsPageProps) {
  const onAdd = props.onAdd || (() => undefined);
  const products = useRouteMatch();

  return <div className={"products-page"}>
    <Switch>
      <Route path={`${products.path}/:productId`}>
      <ChoosenProduct onAdd={onAdd}/>
      </Route>
      <Route path={`${products.path}`}>
        <Products />
      </Route>
    </Switch>
  </div>
}
