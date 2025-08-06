import React from "react";
import { Box, Stack } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
 
export default function FinishedOrders() {
return (
<TabPanel value={"3"}>
<Stack>
{[1, 2].map((ele, index) => {
return (
<Box key={index} className={"order-main-box"}>
<Box className={"order-box-scroll"}>
{[1, 2, 3].map((ele2, index2) => {
return (
<Box key={index2} className={"order-name-price"}>
<img
src={"/img/lavash.webp"}
className={"order-dish-img"}
/>
<p className={"title-dish"}>Lavash</p>
<Box className={"price-box"}>
<p>$9</p>
<img
style={{ marginLeft: "15px" }}
src={"/icons/close.svg"}
alt=""
/>
<p style={{ marginLeft: "15px" }}>2</p>
<img src={"/icons/pause.svg"} alt="" />
<p style={{ marginLeft: "15px" }}> $24</p>
</Box>
</Box>
);
})}
</Box>
 
<Box className={"total-price-box"}>
<Box className={"box-total"}>
<p>Product price</p>
<p>$24</p>
<img src={"/icons/plus.svg"} style={{ marginLeft: "20px" }} />
<p>Delivery cost</p>
<p>$2</p>
<img
src={"/icons/pause.svg"}
style={{ marginLeft: "20px" }}
/>
<p>Total</p>
<p>$26</p>
</Box>
</Box>
</Box>
);
})}
 
{false && (
<Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
<img
src={"/icons/noimage-list.svg"}
style={{ width: 300, height: 300 }}
/>
</Box>
)}
</Stack>
</TabPanel>
);
}