import React from "react";
import { Box, Container, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Footers = styled.div`
  width: 100%;
  height: 590px;
  display: flex;
  background:
    linear-gradient(160deg, rgba(8, 18, 34, 0.95) 0%, rgba(22, 41, 67, 0.9) 55%, rgba(8, 14, 28, 0.95) 100%),
    url("/img/camera-deal.svg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export default function Footer() {
  const authMember = null;

  return (
    <Footers>
      <Container>
        <Stack flexDirection={"row"} sx={{ mt: "94px" }}>
          <Stack flexDirection={"column"} style={{ width: "340px" }}>
            <Box>
              <img width={"140px"} src={"/icons/all-camera-world.svg"} alt="Camera Shop Dev logo" />
            </Box>
            <Box className={"foot-desc-txt"}>
              Here you can sell or buy any type of new and used cameras provided by the
              world’s leading electronics companies. Our admin team prioritizes safety for
              buyers and sellers, applying maximum anti-fraud measures. Contact the admin
              anytime via the details below.
            </Box>
            <Box className="sns-context">
              <a
                href="https://www.facebook.com/ValijonSirojov"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook - Valijon Sirojov"
                title="Facebook: Valijon Sirojov"
              >
                <img src={"/icons/facebook.svg"} alt="Facebook - Valijon Sirojov" />
              </a>
              <a href="https://www.instagram.com/vali__jon_/" target="_blank" rel="noreferrer">
                <img src={"/icons/instagram.svg"} alt="Instagram" />
              </a>
              <a href="https://t.me/Abu_Sabriya" target="_blank" rel="noreferrer">
                <img src={"/icons/telegram.svg"} alt="Telegram" />
              </a>
            </Box>
          </Stack>
          <Stack sx={{ ml: "288px" }} flexDirection={"row"}>
            <Stack>
              <Box>
                <Box className={"foot-category-title"}>Sections</Box>
                <Box className={"foot-category-link"}>
                  <Link to="/">Home</Link>
                  <Link to="/cameras">Cameras</Link>
                  {authMember && <Link to="/orders">Orders</Link>}
                  <Link to="/help">Help</Link>
                </Box>
              </Box>
            </Stack>
            <Stack sx={{ ml: "100px" }}>
              <Box>
                <Box className={"foot-category-title"}>Find us</Box>
                <Box
                  flexDirection={"column"}
                  sx={{ mt: "20px" }}
                  className={"foot-category-link"}
                  justifyContent={"space-between"}
                >
                  <Box flexDirection={"row"} className={"find-us"}>
                    <span>L.</span>
                    <div>1443 Cheonan-daero, Seonggeo-eup, Seobuk-gu, Cheonan-si, 106-dong</div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>P.</span>
                    <div>
                      <a href="tel:+821091513626">010-9151-3626</a>
                    </div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>E.</span>
                    <div>
                      <a href="mailto:kulogistics9009@gmail.com">kulogistics9009@gmail.com</a>
                    </div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>T.</span>
                    <div>
                      <a href="https://t.me/Abu_Sabriya" target="_blank" rel="noreferrer">@Abu_Sabriya</a>
                    </div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>H.</span>
                    <div>Admin-led, agents online 24/7</div>
                  </Box>
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          style={{ border: "1px solid #C5C8C9", width: "100%", opacity: "0.2" }}
          sx={{ mt: "80px" }}
        ></Stack>
        <Stack className={"copyright-txt"}>
          © Copyright Devex Global, All rights reserved.
        </Stack>
      </Container>
    </Footers>
  );
}
