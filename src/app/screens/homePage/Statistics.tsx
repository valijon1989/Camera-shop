import React from "react";
import { Box, Container, Stack } from "@mui/material";
import Divider from "../../components/divider";

export default function Statistics() {
    return (
        <div className={"static-frame"}>
            <Container>
              <Stack className="static-header">
                <Box className="static-kicker">Snapshot</Box>
                <Box className="static-title">Trusted by brands, powered by agents</Box>
              </Stack>
              <Stack className="info">
                  <Stack className="static-box">
                     <Box className="static-num">12</Box> 
                     <Box className="static-text">Partner brands</Box>
                  </Stack>
                     <Divider height="64" width="2" bg="#E3C08D" />
                   <Stack className="static-box">
                     <Box className="static-num">18</Box> 
                     <Box className="static-text">Active agents</Box>
                  </Stack>
                     <Divider height="64" width="2" bg="#E3C08D" />
                   <Stack className="static-box">
                     <Box className="static-num">50+</Box> 
                     <Box className="static-text">Gear listings</Box>
                  </Stack>
                      <Divider height="64" width="2" bg="#E3C08D" />
                   <Stack className="static-box">
                     <Box className="static-num">200+</Box> 
                     <Box className="static-text">Customers</Box>
                  </Stack>

              </Stack>
            </Container>
        </div>
    );
}
