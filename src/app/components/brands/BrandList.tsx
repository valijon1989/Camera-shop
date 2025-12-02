import React, { useEffect, useMemo, useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import { useHistory } from "react-router-dom";
import { cameraBrandData, cameraBrands, CameraBrandAsset } from "../../data/brands";
import "../../../css/products.css";
import axios from "../../../api/axios";
import { getMediaUrl, mediaApi } from "../../../lib/config";

export default function BrandList() {
  const history = useHistory();
  const [brands, setBrands] = useState<CameraBrandAsset[]>([]);

  // Fallback: statik ma’lumotni massivga aylantiramiz
  const fallbackBrands = useMemo<CameraBrandAsset[]>(() => {
    return cameraBrands.map((brand) => ({
      name: brand,
      slug: brand.toLowerCase(),
      logo: cameraBrandData[brand]?.logo || `/brands/${brand.toLowerCase()}.png`,
      banner: cameraBrandData[brand]?.banner,
      description: cameraBrandData[brand]?.description,
    }));
  }, []);

  useEffect(() => {
    axios
      .get("/brands?rich=true")
      .then((res) => {
        const list: CameraBrandAsset[] = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

        // Logo yo‘li absolyut bo‘lmasa, mediaApi bilan to‘ldiramiz
        const normalized = list.map((item) => ({
          ...item,
          logo:
            item.logo?.startsWith("/") && !item.logo?.startsWith("//")
              ? item.logo
              : item.logo?.startsWith("http")
              ? item.logo
              : `${mediaApi}/${item.logo}`,
        }));

        if (normalized.length) {
          setBrands(normalized);
        } else {
          setBrands(fallbackBrands);
        }
      })
      .catch((err) => {
        console.log("Error fetching brands:", err);
        setBrands(fallbackBrands);
      });
  }, [fallbackBrands]);

  return (
    <div className="brands-grid-section">
      <Container>
        <Stack spacing={1} alignItems="center">
          <Box className="category-kicker">Shop by brand</Box>
          <Box className="category-title">Camera Brands</Box>
          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="center"
            gap={2}
            className="brands-grid"
          >
            {(brands.length ? brands : fallbackBrands).map((brand) => {
              // Use getMediaUrl so data:, http and uploads/ paths are handled consistently
              const logoPath =
                getMediaUrl(brand.logo) ||
                (brand.logo?.startsWith("/") && !brand.logo?.startsWith("//")
                  ? brand.logo
                  : brand.logo || `/brands/${brand.name.toLowerCase()}.png`);
              return (
                <Box
                  key={brand.slug || brand.name}
                  className="brand-card"
                  onClick={() => history.push(`/brand/${brand.slug || brand.name}`)}
                  role="button"
                  aria-label={`${brand.name} brand`}
                >
                  <div
                    className="brand-card-img"
                    style={{ backgroundImage: `url(${logoPath})` }}
                  />
                  <div className="brand-card-name">{brand.name}</div>
                </Box>
              );
            })}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
