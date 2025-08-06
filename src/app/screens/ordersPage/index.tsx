import { useState, SyntheticEvent } from "react";
import { Container, Stack, Box } from "@mui/material";
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
    <div className="order-page">
      <Container className="order-container">
        {/* Left side with tabs and orders */}
        <Stack className="order-left">
          <TabContext value={value}>
            <Box className="order-nav-frame">
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  className="table_list"
                >
                  <Tab label="PAUSED ORDERS" value="1" />
                  <Tab label="PROCESS ORDERS" value="2" />
                  <Tab label="FINISHED ORDERS" value="3" />
                </Tabs>
              </Box>
            </Box>

            <Stack className="order-main-content">
              <PausedOrders />
              <ProcessOrders />
              <FinishedOrders />
            </Stack>
          </TabContext>
        </Stack>

        {/* Right side with user info and card form */}
        <Stack className="order-right">
          <Box className="order-info-box">
            <Box className="member-box">
              <div className="order-user-img">
                <img
                  src="/icons/default-user.svg"
                  className="order-user-avatar"
                />
                <div className="order-user-icon-box">
                  <img
                    src="/icons/user-badge.svg"
                    className="order-user-prof-img"
                  />
                </div>
              </div>
              <span className="order-user-name">Jon</span>
              <span className="order-user-prof">User</span>
            </Box>

            <Box className="liner" />

            <Box className="order-user-address">
              <div style={{ display: "flex" }}>
                <LocationOnIcon />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span className="order-user-address-info">Do not exist</span>
              </div>
            </Box>
          </Box>

          <Box className="order-info-box">
            <Box className="card-number-box">
              <input
                type="text"
                placeholder="Card number: **** 4090 2002 7495"
                className="card-input"
              />
            </Box>
          
            <Box className="card-date-box">
              <input
                type="text"
                placeholder="07 / 24"
                className="card-date-input"
              />
              <input
                type="text"
                placeholder="CVV : 010"
                className="card-cvv-input"
              />
            </Box>
           

            <Box className="card-user-box">
              <input
                type="text"
                placeholder="Justin Robertson"
                className="card-user-input"
              />
            </Box>

            <Box className="card-pay-icons">
              <img src="/icons/mastercard.svg" />
              <img src="/icons/union.svg" />
              <img src="/icons/paypal.svg" />
              <img src="/icons/visa.svg" />
            </Box>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
