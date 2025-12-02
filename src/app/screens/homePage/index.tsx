import React, { useEffect } from "react";
import Statistics from "./Statistics";
import Events from "./Events";
import ActiveUsers from "./ActiveUsers";
import PopularDishes from "./PopularDishes";
import NewDishes from "./NewDishes";
import Advertisement from "./Advertisement";
import BrandList from "../../components/brands/BrandList";
import { useDispatch } from "react-redux";
import { Dispatch }  from "@reduxjs/toolkit";
import { setNewDishes, setPopularDishes, setTopUsers } from "./slice";
import { Product } from "../../services/types/product";
import ProductService from "../../services/ProductService";
import "../../../css/home.css";
import MemberService from "../../services/MemberService";
import { Member } from "../../../lib/types/member";
import { Box, Button, Container, Stack } from "@mui/material";
import { useGlobals } from "../../hooks/useGlobals";
import { useHistory } from "react-router-dom";
import { getMediaUrl } from "../../../lib/config";


/** REDUX SKICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
    setPopularDishes: (data: Product[]) => dispatch(setPopularDishes(data)),
    setNewDishes: (data: Product[]) => dispatch(setNewDishes(data)),
    setTopUsers: (data: Member[]) => dispatch(setTopUsers(data)),
});


export default function HomePage() {
  const { setPopularDishes, setNewDishes, setTopUsers } = actionDispatch(useDispatch());
  const { authMember } = useGlobals();
  const history = useHistory();


  useEffect(() => {
    const product = new ProductService();
    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "views",
      })
      .then((data) => {
        console.log("data passed here:", data);
        setPopularDishes(data);
      })
      .catch((err) => console.log(err));

    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "createdAt",
      })
      .then((data) => setNewDishes(data))
      .catch((err) => console.log(err));

    const member = new MemberService();
    member
      .getTopUsers()
      .then((data) => setTopUsers(data))
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
  <div className={"homepage"}>
    {authMember ? (
      <Box className="auth-ribbon">
        <Container>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <img
                src={
                  getMediaUrl(authMember.memberImage) ||
                  "/icons/default-user.svg"
                }
                alt="User avatar"
                className="auth-ribbon-avatar"
              />
              <div>
                <div className="auth-ribbon-title">Hello, {authMember.memberNick}</div>
                <div className="auth-ribbon-sub">
                  Role: {authMember.memberType} • Phone: {authMember.memberPhone}
                </div>
              </div>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={() => history.push("/add-product")}>
                Add Camera
              </Button>
              <Button variant="outlined" onClick={() => history.push("/orders")}>
                Orders
              </Button>
              <Button variant="outlined" onClick={() => history.push("/member-page")}>
                My Page
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    ) : null}
    <Statistics />
    <BrandList />
    <PopularDishes />
    <NewDishes />
    <Advertisement />
    <ActiveUsers />
    <Events />
    </div>
  );
}
