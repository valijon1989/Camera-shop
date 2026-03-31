// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Box, Button, MenuItem, Select, Stack, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import { ProductInquiry } from "../../services/types/product";
import { cameraBrands } from "../../data/brands";

interface FilterPanelProps {
  filters: ProductInquiry;
  onChange: (filters: ProductInquiry) => void;
}

const sensorTypes = ["Full-frame", "APS-C", "Micro Four Thirds", "Medium Format"];
const resolutionOptions = [24, 33, 45, 50];
const mountOptions = ["E-mount", "RF-mount", "Z-mount", "L-mount", "X-mount", "EF-mount"];
const videoResolutionOptions = ["4K60", "4K120", "6K", "8K"];
const isoOptions = ["100-51200", "64-25600", "50-102400"];
const stabilizationOptions = ["IBIS", "OIS", "Digital"];

export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<ProductInquiry>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const applyFilters = () => {
    onChange(localFilters);
  };

  const clearFilters = () => {
    const cleared: ProductInquiry = {
      page: 1,
      limit: filters.limit,
      order: filters.order,
    };
    setLocalFilters(cleared);
    onChange(cleared);
  };

  return (
    <Box className="filter-panel">
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Select
              fullWidth
              displayEmpty
              value={localFilters.brand || ""}
              onChange={(e) => setLocalFilters({ ...localFilters, brand: e.target.value || undefined })}
            >
              <MenuItem value="">Brand (any)</MenuItem>
              {cameraBrands.map((b) => (
                <MenuItem value={b} key={b}>
                  {b}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Min Price"
              value={localFilters.minPrice ?? ""}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, minPrice: e.target.value ? Number(e.target.value) : undefined })
              }
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Max Price"
              value={localFilters.maxPrice ?? ""}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, maxPrice: e.target.value ? Number(e.target.value) : undefined })
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Select
              fullWidth
              displayEmpty
              value={localFilters.sensorType || ""}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, sensorType: e.target.value || undefined })
              }
            >
              <MenuItem value="">Sensor (any)</MenuItem>
              {sensorTypes.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Select
              fullWidth
              displayEmpty
              value={localFilters.resolutionMp ?? ""}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  resolutionMp: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            >
              <MenuItem value="">Resolution (any)</MenuItem>
              {resolutionOptions.map((r) => (
                <MenuItem key={r} value={r}>
                  {r} MP
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Select
              fullWidth
              displayEmpty
              value={localFilters.mountType || ""}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, mountType: e.target.value || undefined })
              }
            >
              <MenuItem value="">Mount (any)</MenuItem>
              {mountOptions.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Select
              fullWidth
              displayEmpty
              value={localFilters.videoResolution || ""}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, videoResolution: e.target.value || undefined })
              }
            >
              <MenuItem value="">Video res (any)</MenuItem>
              {videoResolutionOptions.map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Select
              fullWidth
              displayEmpty
              value={localFilters.isoRange || ""}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, isoRange: e.target.value || undefined })
              }
            >
              <MenuItem value="">ISO (any)</MenuItem>
              {isoOptions.map((i) => (
                <MenuItem key={i} value={i}>
                  {i}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Select
              fullWidth
              displayEmpty
              value={localFilters.stabilization || ""}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, stabilization: e.target.value || undefined })
              }
            >
              <MenuItem value="">Stabilization (any)</MenuItem>
              {stabilizationOptions.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="text" onClick={clearFilters}>
            Clear
          </Button>
          <Button variant="contained" onClick={applyFilters}>
            Apply Filters
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
