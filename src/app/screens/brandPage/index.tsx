import React, { useEffect, useMemo, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Box, Container, Stack } from "@mui/material";
import ProductService from "../../services/ProductService";
import { Product, ProductInquiry } from "../../services/types/product";
import "../../../css/products.css";
import { cameraBrandData } from "../../data/brands";
import { getMediaUrl } from "../../../lib/config";

export default function BrandPage() {
  const { brandName } = useParams<{ brandName: string }>();
  const history = useHistory();
  const [products, setProducts] = useState<Product[]>([]);

  const resolvedBrand = useMemo(() => {
    if (!brandName) return "";
    const match = Object.keys(cameraBrandData).find(
      (key) => key.toLowerCase() === brandName.toLowerCase()
    );
    return match || brandName;
  }, [brandName]);

  const brandInfo = resolvedBrand ? cameraBrandData[resolvedBrand] : undefined;

  useEffect(() => {
    if (!resolvedBrand) return;
    const service = new ProductService();
    const query: ProductInquiry = { brand: resolvedBrand, page: 1, limit: 30 };
    service
      .getProducts(query)
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, [resolvedBrand]);

  const bannerSrc =
    brandInfo?.banner || "/img/all-camera-banner.svg";

  return (
    <div className="products">
      {brandInfo && (
        <Box
          className="brand-hero"
          sx={{
            backgroundImage: `linear-gradient(180deg, rgba(5,5,9,0.6) 0%, rgba(5,5,9,0.9) 100%), url(${brandInfo.banner})`,
          }}
        >
          <Container>
            <Stack direction="row" alignItems="center" spacing={2}>
              <img src={brandInfo.logo} alt={`${resolvedBrand} logo`} className="brand-hero-logo" />
              <Box>
                <Box className="brand-hero-title">{resolvedBrand}</Box>
                <Box className="brand-hero-desc">{brandInfo.description}</Box>
              </Box>
            </Stack>
            <Box className="brand-banner-wrapper">
              <img src={bannerSrc} alt={`${resolvedBrand} banner`} className="brand-banner" />
            </Box>
          </Container>
        </Box>
      )}
      <Container>
        <Stack flexDirection="column" alignItems="center">
          <Box className="category-kicker">Brand catalog</Box>
          <Box className="category-title">{resolvedBrand}</Box>
          <Stack
            className="product-wrapper"
            spacing={2}
            direction="row"
            flexWrap="wrap"
            justifyContent="center"
          >
            {products.length ? (
              products.map((product: Product) => {
                const primaryImage = product.images?.[0];
                const imagePath = getMediaUrl(primaryImage) || "/icons/noimage-list.svg";
                return (
                  <Stack
                    key={product._id}
                    className="product-card"
                    onClick={() => history.push(`/cameras/${product._id}`)}
                  >
                    <Stack className="product-img">
                      <img src={imagePath} alt={product.cameraModel || "Product image"} />
                    </Stack>
                    <Box className="product-desc">
                      <span className="product-title">
                        {product.brand ? `${product.brand} ${product.cameraModel}` : product.cameraModel}
                      </span>
                      <div className="product-desc-icon">${product.price ?? 0}</div>
                      <div className="product-meta">
                        <span>{product.condition || "Condition: N/A"}</span>
                        <span>{product.location || "Location: N/A"}</span>
                      </div>
                    </Box>
                  </Stack>
                );
              })
            ) : (
              <Box className="no-data">No cameras for this brand yet.</Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
