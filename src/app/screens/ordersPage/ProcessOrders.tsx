import React from "react";
import { Box, Stack } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import Button from "@mui/material/Button";
import moment from "moment";
 
export default function ProcessOrders() {
return (
<TabPanel value={"2"}>
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
<p>$22</p>
<img src={"/icons/plus.svg"} style={{ marginLeft: "20px" }} />
<p>Delivery cost</p>
<p>$2</p>
<img
src={"/icons/pause.svg"}
style={{ marginLeft: "20px" }}
/>
<p>Total</p>
<p>$24</p>
</Box>
<p className={"data-compl"}>
{moment().format("YY-MM-DD HH:mm")}
</p>
<Button variant="contained" className={"verify-button"}>
Verify to Fulfil
</Button>
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