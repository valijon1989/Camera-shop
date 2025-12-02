import React from "react";
import { Box, Container, Stack } from "@mui/material";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import { CssVarsProvider } from "@mui/joy/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Divider from "../../components/divider";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveNewDishes } from "./selector";
import { Product } from "../../services/types/product";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { useHistory } from "react-router-dom";


/** REDUX SKICE & SELECTOR */


const newDishesRetriever = createSelector(retrieveNewDishes, (newDishes) => ({
  newDishes,
}));
export default function NewDishes() {

 const { newDishes } = useSelector(newDishesRetriever);
 const list = Array.isArray(newDishes) ? newDishes : [];
 const history = useHistory();
 const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
 });

     console.log("newDishes:", newDishes);

  return (
    <div className={"new-products-frame"}>
      <Container>
        <Stack className={"main"}>
          <Box className={"category-kicker"}>Fresh drops</Box>
          <Box className={"category-title"}>New Arrivals</Box>
          <Box className={"category-subtitle"}>
            Latest cameras and pro gear approved by the admin team. Transparent stock,
            verified listings, and fast checkout.
          </Box>
          <Stack className={"cards-frame"}>
            <CssVarsProvider>
                {list.length !== 0 ? (
              list.map((product: Product) => {
                const primaryImage =
                  (product.images || []).find((img) => !!img) ||
                  (product as any).coverImage ||
                  (product as any).image ||
                  "";
                const imagePath = (() => {
                  if (!primaryImage) return "/icons/noimage-list.svg";
                  if (primaryImage.startsWith("data:") || primaryImage.startsWith("http"))
                    return primaryImage;
                  const cleaned = primaryImage.replace(/^\/+/, "");
                  if (cleaned.toLowerCase().startsWith("uploads/")) {
                    return `http://localhost:9090/${cleaned}`;
                  }
                  if (cleaned.includes("/")) {
                    return `http://localhost:9090/uploads/${cleaned}`;
                  }
                  return `http://localhost:9090/uploads/products/${cleaned}`;
                })();
                const availability =
                  product.stock && product.stock > 0
                    ? `${product.stock} in stock`
                    : "Preorder";
                const price = priceFormatter.format(product.price || 0);
                const shortDesc =
                  product.description && product.description.length > 80
                    ? `${product.description.slice(0, 80)}...`
                    : product.description || "Admin-verified listing with transparent stock.";
                return (
                  <Card
                    key={product._id}
                    variant="outlined"
                    className={"card new-card"}
                    onClick={() => history.push(`/cameras/${product._id}`)}
                  >
                    <CardOverflow className="new-card-media">
                      <div className={"product-sale"}>{availability}</div>
                      <AspectRatio ratio="1">
                        <img src={imagePath} alt={product.cameraModel} />
                      </AspectRatio>
                    </CardOverflow>

                    <CardOverflow variant="soft" className={"product-detail"}>
                     <Stack className={"info"}>
                     <Stack flexDirection={"row"} alignItems={"center"} gap={1}>
                      <Typography className={"title"}>
                       {product.brand ? `${product.brand} ${product.cameraModel}` : product.cameraModel}
                     </Typography>
                     <Divider width="2" height="24" bg="#d9d9d9" />
                     <Typography className={"price"}>{price}</Typography>
                  </Stack>
                  <Stack className="meta-row">
                    <Typography className="desc" startDecorator={<DescriptionOutlinedIcon />}>
                      {shortDesc}
                    </Typography>
                    <Typography className={"views"}>
                    {product.views ?? 0} 
                    <VisibilityIcon
                      sx={{ fontSize: 20, marginLeft: "5px" }}
                     />
                    </Typography>
                  </Stack>
             </Stack>
            </CardOverflow>
          </Card>
        );
      })
                ) : (
                    <Box className={"no-data"}>New products are not available!</Box>
                )}
    </CssVarsProvider>
  </Stack>
</Stack>
</Container>
</div>
   
            );
        }
