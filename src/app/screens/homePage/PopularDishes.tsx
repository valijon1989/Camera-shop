import React from "react";
import { Box, Container, Stack } from "@mui/material";
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import { CssVarsProvider } from "@mui/joy";
import CardOverflow from '@mui/joy/CardOverflow';
import VisibilityIcon  from "@mui/icons-material/Visibility";
import { useHistory } from "react-router-dom";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePopularDishes } from "./selector";
import { Product } from "../../services/types/product";
import { getMediaUrl } from "../../../lib/config";


/** REDUX SKICE & SELECTOR */


const popularDishesRetriever = createSelector(
    retrievePopularDishes,
    (popularDishes) => ({
        popularDishes
    })
);



export default function PopularDishes() {
 const { popularDishes } = useSelector(popularDishesRetriever);
 const list = Array.isArray(popularDishes) ? popularDishes : [];
 const history = useHistory();
 const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
 });

    return (
        <div className={"popular-dishesh-frame"}>
            <Container>
                <Stack className={"popular-section"}>
                    <Box className={"category-kicker"}>Spotlight</Box>
                    <Box className={"category-title"}>Popular Gear</Box>
                    <Box className={"category-subtitle"}>
                      Curated cameras refreshed by the admin team with the highest views and trust signals.
                    </Box>
                    <Stack className={"cards-frame"}>
                        {list.length !== 0 ? (
                        list.map((product: Product) => {
                            const primaryImage = product.images?.[0];
                            const imagePath = getMediaUrl(primaryImage) || "/icons/noimage-list.svg";
                            const price = priceFormatter.format(product.price || 0);
                            const collection = product.category?.toLowerCase();
                            const shortDesc =
                              product.description && product.description.length > 70
                                ? `${product.description.slice(0, 70)}...`
                                : product.description || "Admin-verified listing, ready to ship.";
                            return (
                      <CssVarsProvider key={product._id}>
                         <Card
                           className={"card popular-card"}
                           sx={{ minHeight: '420px', width: '100%' }}
                           onClick={() => history.push(`/cameras/${product._id}`)}
                         >
                          <CardCover >
                           <img src={imagePath} alt={product.cameraModel}/>
                          </CardCover>
                         <CardCover className={"card-cover"} />
                         <CardContent className="popular-card-content" sx={{ justifyContent: 'flex-end' }}>
                           <Box className="card-badge">Top viewed</Box>
                           <Typography level="h2"
                                        fontSize="xl"
                                        textColor="#fff"
                                        className="card-title"
                             >
                                 {product.brand ? `${product.brand} ${product.cameraModel}` : product.cameraModel}
                             </Typography>
                          <Typography
                            className="card-subtitle"
                            sx={{
                            fontWeight: "md",
                            color: "neutral.300",
                            display: "flex",
                            alignItems: "center",
                           }}
                          >
                         {shortDesc}
                     </Typography>
                  </CardContent>
               <CardOverflow
                   className="card-meta-bar"
                   sx={{
                   display: 'flex',
                   gap:1.5,
                   py:1.5,
                   px:"var(--Card-padding)",
                   borderTop: '1px solid',
                 }}
                 >
                  <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} width={"100%"}>
                    <Box className="meta-chip">{collection}</Box>
                    <Typography className="meta-price">{price}</Typography>
                    <Typography
                      className="meta-views"
                      sx={{
                        fontWeight: "md",
                        color: "neutral.200",
                        alignItems: "center",
                        display: "flex",
                       }}
                      >
                        {product.views ?? 0}
                        <VisibilityIcon sx={{ fontSize: 22, marginLeft: "6px"}}
                        />
                    </Typography>
                  </Stack>
                      </CardOverflow>
                     </Card>
                    </CssVarsProvider>
                    );
                })
            ) : ( <Box className={"no-data"}>Popular products are not available!</Box> 
                
            )}
                 </Stack>
                </Stack>
            </Container>
        </div>
    );
}
