import { useState, SyntheticEvent } from "react";
import { Box, Container, Stack } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import "../../../css/order.css";
 
export default function OrdersPage() {
const [value, setValue] = useState("1");
 
const handleChange = (e: SyntheticEvent, newValue: string) => {
setValue(newValue);
};
 
return (
<div className={"order-page"}>
<Container className={"order-container"}>
<Stack className={"order-left"}>
<TabContext value={value}>
<Box className={"order-nav-frame"}>
<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
<Tabs
value={value}
onChange={handleChange}
aria-label="basic tabs example"
className={"table-list"}
>
<Tab label="PAUSED ORDERS" value={"1"} />
<Tab label="PROCESS ORDERS" value={"2"} />
<Tab label="FINISHED ORDERS" value={"3"} />
</Tabs>
</Box>
</Box>
<Stack className={"order-main-content"}>
<PausedOrders />
<ProcessOrders />
<FinishedOrders />
</Stack>
</TabContext>
</Stack>
 
<Stack className={"order-right"}>
<Box className={"member-info-boxes"}>
<Box className={"member-box"}>
<div className={"order-user-img"}>
<img
src={"/icons/default-user.svg"}
className={"order-user-avatar"}
/>
<div className={"order-user-icon-box"}>
<img
src={"/icons/user-badge.svg"}
className={"order-user-prof-img"}
/>
</div>
</div>
<span className={"order-user-name"}>Martin</span>
<span className={"order-user-prof"}>User</span>
<Box className={"liner"}></Box>
<Box className={"order-user-address"}>
<div>
<LocationOnIcon />
</div>
<span>South Korea, Busan</span>
</Box>
</Box>
<Box className={"member-card-box"}>
<Box className={"member-card-inputs"}>
<div className={"card-number"}>
<input
type="text"
name="cardNumber"
placeholder="Card number: **** 4090 2002 7465"
className={"card-number-input"}
/>
</div>
<div className={"card-valid"}>
<input
type="text"
name="cardValDate"
placeholder="07/28"
className={"card-val-date"}
/>
<input
type="text"
name="cardCCV"
placeholder="CCV: 010"
className={"card-val-date"}
/>
</div>
<div className={"card-holder"}>
<input
type="text"
name="cardNumber"
placeholder="Jusin Robertson"
className={"card-holder-input"}
/>
</div>
</Box>
<Box className={"member-card-type"}>
<img src="/icons/western-card.svg" alt="" />
<img src="/icons/master-card.svg" alt="" />
<img src="/icons/paypal-card.svg" alt="" />
<img src="/icons/visa-card.svg" alt="" />
</Box>
</Box>
</Box>
</Stack>
</Container>
</div>
);
}
