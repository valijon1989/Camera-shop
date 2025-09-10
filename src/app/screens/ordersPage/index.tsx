import { useState, SyntheticEvent, useEffect } from "react";
import { Box, Container, Stack } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import { Order, OrderInquiry } from "../../../lib/types/order";
import OrderService from "../../services/OrderService";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { useGlobals } from "../../hooks/useGlobals";
import "../../../css/order.css";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";
import { MemberType } from "../../../lib/enums/member.enum";

const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

export default function OrdersPage() {
  const history = useHistory();

  const { setPausedOrders, setProcessOrders, setFinishedOrders } =
    actionDispatch(useDispatch());

  const { orderBuilder, authMember } = useGlobals();

  const [value, setValue] = useState("1");
  const [orderInquiry, setOrderInquiry] = useState<OrderInquiry>({
    page: 1,
    limit: 4,
    orderStatus: OrderStatus.PAUSE,
  });

  useEffect(() => {
    const order = new OrderService();
    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PAUSE })
      .then((data) => setPausedOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PROCESS })
      .then((data) => setProcessOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.FINISH })
      .then((data) => setFinishedOrders(data))
      .catch((err) => console.log(err));
  }, [orderInquiry, orderBuilder]); //hamma orderlarni order depency orali rebuild qildik

  /* HANDLERS */
  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  if (!authMember) history.push("/");

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
                  <Tab
                    label="PAUSED ORDERS"
                    value={"1"}
                    className={"table-tab"}
                  />
                  <Tab
                    label="PROCESS ORDERS"
                    value={"2"}
                    className={"table-tab"}
                  />
                  <Tab
                    label="FINISHED ORDERS"
                    value={"3"}
                    className={"table-tab"}
                  />
                </Tabs>
              </Box>
            </Box>
            <Stack className={"order-main-content"}>
              <PausedOrders setValue={setValue} />
              <ProcessOrders setValue={setValue} />
              <FinishedOrders />
            </Stack>
          </TabContext>
        </Stack>

        <Stack className={"order-right"}>
          <Box className={"member-info-boxes"}>
            <Box className={"member-box"}>
              <div className={"order-user-img"}>
                <img
                  src={
                    authMember?.memberImage
                      ? `${serverApi}/${authMember?.memberImage}`
                      : "/icons/default-user.svg"
                  }
                  className={"order-user-avatar"}
                />
                <div className={"order-user-icon-box"}>
                  <img
                    src={
                      authMember?.memberType === MemberType.RESTAURANT
                        ? "/icons/restaurant.svg"
                        : "/icons/user-badge.svg"
                    }
                    className={"order-user-prof-img"}
                  />
                </div>
              </div>
              <span className={"order-user-name"}>
                {authMember?.memberNick}
              </span>
              <span className={"order-user-prof"}>
                {authMember?.memberType}
              </span>
              <Box className={"liner"}></Box>
              <Box className={"order-user-address"}>
                <div>
                  <LocationOnIcon />
                </div>
                <span>
                  {authMember?.memberAddress
                    ? authMember?.memberAddress
                    : "Not inserted"}
                </span>
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
