import React from "react";
import { Box, Stack } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import Button from "@mui/material/Button";
import moment from "moment";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveProcessOrders } from "./selector";
import { Messages, mediaApi, serverApi, getMediaUrl } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../services/types/product";
import { useGlobals } from "../../hooks/useGlobals";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { T } from "../../../lib/types/common";


/** REDUX SKICE & SELECTOR */


const processOrdersRetriever = createSelector(
    retrieveProcessOrders,
    (processOrders) => ({
        processOrders
    })
);

interface ProcessOrdersProps {
    setValue: (input: string) => void;
}
 
export default function ProcessOrders(props: ProcessOrdersProps) {
     const { setValue } = props;
     const {authMember, setOrderBuilder} = useGlobals();
const { processOrders } = useSelector(processOrdersRetriever);

/** Hendlers  */

const finishOrderHandler = async (e: T) => {
     try {
         if (!authMember) throw new Error(Messages.error2);
         // Payment Process
         const orderId = e.target.value;
         const input: OrderUpdateInput = {
             orderId: orderId,
             orderStatus: OrderStatus.FINISH,
         };

         const confirmation = window.confirm("Have you received your order?");
         if (confirmation) {
         const order = new OrderService();
         await order.updateOrder(input);
         setValue("3");
         setOrderBuilder(new Date());
        }
     } catch (err) {
         console.log(err);
         sweetErrorHandling(err).then();
     }
 };


return (
<TabPanel value={"2"}>
<Stack>
{processOrders?.map((order: Order) => {
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
<Box key={item._id} className={"order-name-price"}>
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
<p>${order.orderDelivery}</p>
<img
  src={"/icons/pause.svg"}
  style={{ marginLeft: "20px" }}
  alt="Pause icon"
/>
<p>Total</p>
<p>${order.orderTotal}</p>
</Box>
<p className={"data-compl"}>
{moment().format("YY-MM-DD HH:mm")}
</p>
<Button 
value={order._id}
variant="contained" 
className={"verify-button"}
onClick={finishOrderHandler}
>
Verify to Fulfil
</Button>
</Box>
</Box>
);
})}
 
{!processOrders ||
(processOrders.length === 0 && (
    <Box display={"flex"} 
    flexDirection={"row"} 
    justifyContent={"center"}>
<img
  src={"/icons/noimage-list.svg"}
  style={{ width: 300, height: 300 }}
  alt="No data"
/>
        </Box>
      ))}
    </Stack>
   </TabPanel>
  );
}
