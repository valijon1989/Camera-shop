import React, { useEffect, useState } from "react";
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
import "../../../css/home.css";
import MemberService from "../../services/MemberService";
import { Member } from "../../../lib/types/member";
import { Box, Button, Container, Stack } from "@mui/material";
import { useGlobals } from "../../hooks/useGlobals";
import { useHistory } from "react-router-dom";
import { getApiUrl, getMediaUrl } from "../../../lib/config";
import axios from "../../../api/axios";


/** REDUX SKICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
    setPopularDishes: (data: Product[]) => dispatch(setPopularDishes(data)),
    setNewDishes: (data: Product[]) => dispatch(setNewDishes(data)),
    setTopUsers: (data: Member[]) => dispatch(setTopUsers(data)),
});

const extractProducts = (payload: any): Product[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.cameras)) return payload.cameras;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};


export default function HomePage() {
  const { setPopularDishes, setNewDishes, setTopUsers } = actionDispatch(useDispatch());
  const { authMember } = useGlobals();
  const history = useHistory();
  const [cameras, setCameras] = useState<Product[]>([]);
  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });


  useEffect(() => {
    let isMounted = true;

    axios
      .get(getApiUrl("cameras"))
      .then((response) => {
        if (!isMounted) return;
        const items = extractProducts(response.data);
        setCameras(items);

        const popular = [...items]
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 4);
        const newest = [...items]
          .sort(
            (a, b) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          )
          .slice(0, 4);

        setPopularDishes(popular);
        setNewDishes(newest);
      })
      .catch(() => {
        if (!isMounted) return;
        setCameras([]);
        setPopularDishes([]);
        setNewDishes([]);
      });

    const member = new MemberService();
    member
      .getTopUsers()
      .then((data) => setTopUsers(data))
      .catch(() => setTopUsers([]));

    return () => {
      isMounted = false;
    };
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
    {cameras.length ? (
      <Box sx={{ py: 6, background: "#f5f7fb" }}>
        <Container>
          <Stack spacing={1} alignItems="center">
            <Box
              className="category-kicker"
              sx={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#4f6b8a",
              }}
            >
              Live API feed
            </Box>
            <Box
              className="category-title"
              sx={{
                textAlign: "center",
                fontSize: { xs: 30, md: 42 },
                fontWeight: 700,
                color: "#10233b",
              }}
            >
              Cameras loaded from `/api/cameras`
            </Box>
            <Box
              className="category-subtitle"
              sx={{
                textAlign: "center",
                maxWidth: 760,
                color: "#506176",
                fontSize: 16,
                lineHeight: 1.7,
              }}
            >
              This section is rendered directly from the API response so the browser
              network panel always shows a live camera request.
            </Box>
            <Stack
              direction="row"
              flexWrap="wrap"
              justifyContent="center"
              gap={2}
              sx={{ width: "100%", mt: 3 }}
            >
              {cameras.slice(0, 4).map((camera) => {
                const primaryImage = camera.images?.[0];
                const imagePath = getMediaUrl(primaryImage) || "/icons/noimage-list.svg";

                return (
                  <Box
                    key={camera._id}
                    onClick={() => history.push(`/cameras/${camera._id}`)}
                    sx={{
                      width: { xs: "100%", sm: "calc(50% - 16px)", lg: "calc(25% - 16px)" },
                      borderRadius: 3,
                      overflow: "hidden",
                      cursor: "pointer",
                      bgcolor: "#fff",
                      boxShadow: "0 18px 48px rgba(10, 25, 41, 0.12)",
                      border: "1px solid rgba(12, 27, 47, 0.08)",
                    }}
                  >
                    <Box
                      sx={{
                        height: 220,
                        backgroundImage: `url(${imagePath})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundColor: "#dde6f2",
                      }}
                    />
                    <Stack spacing={1} sx={{ p: 2 }}>
                      <Box
                        sx={{
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "#4f6b8a",
                        }}
                      >
                        {camera.category || "camera"}
                      </Box>
                      <Box sx={{ fontSize: 22, fontWeight: 700, color: "#10233b" }}>
                        {camera.brand ? `${camera.brand} ${camera.cameraModel}` : camera.cameraModel}
                      </Box>
                      <Box sx={{ color: "#506176", minHeight: 48 }}>
                        {camera.description || "Live product data from the backend API."}
                      </Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box sx={{ fontSize: 20, fontWeight: 700, color: "#0d4f8b" }}>
                          {priceFormatter.format(camera.price || 0)}
                        </Box>
                        <Box sx={{ color: "#6b7c90", fontSize: 14 }}>
                          {camera.views ?? 0} views
                        </Box>
                      </Stack>
                    </Stack>
                  </Box>
                );
              })}
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
