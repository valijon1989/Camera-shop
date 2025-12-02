import React from "react";
import { Box, Stack } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveFinishedOrders } from "./selector";
import { mediaApi, serverApi, getMediaUrl } from "../../../lib/config";
import { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../services/types/product";


/** REDUX SKICE & SELECTOR */

const finishedOrdersRetriever = createSelector(
    retrieveFinishedOrders,
    (finishedOrders) => ({
        finishedOrders
    })
)
 
export default function FinishedOrders() {
const { finishedOrders } = useSelector(finishedOrdersRetriever);
return (
<TabPanel value={"3"}>
<Stack>
{finishedOrders?.map((order: Order) => {
return (
<Box key={order._id} className={"order-main-box"}>
<Box className={"order-box-scroll"}>
{order?.orderItems?.map((item: OrderItem) => {
    const product: Product = order.productData.filter(
        (ele: Product) => item.productId === ele._id
    )[0];
const primaryImage = product?.images?.[0];
const imagePath = getMediaUrl(primaryImage) || (primaryImage ? `${mediaApi}/${String(primaryImage).replace(/^\/+/, "")}` : "/icons/noimage-list.svg");
return (
<Box key={item._id} 
     className={"order-name-price"}>
<img
  src={imagePath}
  className={"order-dish-img"}
  alt={product?.cameraModel || "Camera item"}
/>
<p className={"title-dish"}>{product?.brand ? `${product.brand} ${product.cameraModel}` : product?.cameraModel}</p>
<Box className={"price-box"}>
<p>${item.itemPrice}</p>
<img
  style={{ marginLeft: "15px" }}
  src={"/icons/close.svg"}
  alt="Close icon"
/>
<p style={{ marginLeft: "15px" }}>{item.itemQuantity}</p>
<img src={"/icons/pause.svg"} alt="Pause icon" />
<p style={{ marginLeft: "15px" }}> ${item.itemQuantity * item.itemPrice}</p>
</Box>
</Box>
);
})}
</Box>
 
<Box className={"total-price-box"}>
<Box className={"box-total"}>
<p>Product price</p>
<p>${order.orderTotal - order.orderDelivery}</p>
<img src={"/icons/plus.svg"} style={{ marginLeft: "20px" }} alt="Plus icon" />
<p>Delivery cost</p>
<p>$2</p><p>${order.orderDelivery}</p>
<img
  src={"/icons/pause.svg"}
  style={{ marginLeft: "20px" }}
  alt="Pause icon"
/>
<p>Total</p>
<p>${order.orderTotal}</p>
</Box>
</Box>
</Box>
);
})}
 
{!finishedOrders ||
(finishedOrders.length === 0 &&
<Box display={"flex"}
 flexDirection={"row"} 
 justifyContent={"center"}>
<img
  src={"/icons/noimage-list.svg"}
  style={{ width: 300, height: 300 }}
  alt="No data"
/>
</Box>
)}
</Stack>
</TabPanel>
);
}
