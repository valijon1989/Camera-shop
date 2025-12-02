import { Box, Stack, Chip } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import { plans } from "../../../lib/data/plans";
import Button from "@mui/material/Button";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

SwiperCore.use([Autoplay, Navigation, Pagination]);

export default function Events() {
  return (
    <div className={"events-frame"}>
      <Stack className={"events-main"}>
        <Box className={"events-text"}>
          <span className={"category-title"}>Deals & Events</span>
          <span className={"category-subtitle"}>
            Limited-time bundles, livestream demos, and agent-hosted workshops. Countdown enabled for each offer.
          </span>
        </Box>

        <Swiper
          className={"events-info swiper-wrapper"}
          slidesPerView={"auto"}
          centeredSlides={true}
          spaceBetween={30}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            el: ".swiper-pagination",
            clickable: true,
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: true,
          }}
        >
          {plans.map((value, number) => {
            return (
              <SwiperSlide key={number} className={"events-info-frame"}>
                <div className={"events-img"}>
                  <img src={value.img} className={"events-img"} alt={value.title} />
                  {value.badge ? <Chip className="deal-badge" label={value.badge} /> : null}
                </div>
                <Box className={"events-desc"}>
                  <Box className={"events-bott"}>
                    <Box className={"bott-left"}>
                      <div className={"event-title-speaker"}>
                        <strong>{value.title}</strong>
                        <div className={"event-organizator"}>
                          <img src={"/icons/speaker.svg"} alt="Speaker" />
                          <p className={"spec-text-author"}>{value.author}</p>
                        </div>
                      </div>

                      <p className={"text-desc"}> {value.desc} </p>

                      <div className={"bott-info"}>
                        <div className={"bott-info-main"}>
                          <AccessTimeIcon sx={{ fontSize: 18, marginRight: "8px" }} />
                          {value.date}
                        </div>
                        <div className={"bott-info-main"}>
                          <img src={"/icons/location.svg"} alt="Location" />
                          {value.location}
                        </div>
                      </div>
                      <div className="deal-footer">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <strong className="deal-price">{value.price}</strong>
                          {value.oldPrice ? (
                            <span className="deal-old-price">{value.oldPrice}</span>
                          ) : null}
                        </Stack>
                        <Button
                          variant="contained"
                          size="small"
                          className="deal-cta"
                          startIcon={<LocalOfferIcon />}
                        >
                          View details
                        </Button>
                      </div>
                    </Box>
                  </Box>
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <Box className={"prev-next-frame"}>
          <img
            src={"/icons/arrow-right.svg"}
            className={"swiper-button-prev"}
            alt="Previous deals"
          />
          <div className={"dot-frame-pagination swiper-pagination"}></div>
          <img
            src={"/icons/arrow-right.svg"}
            className={"swiper-button-next"}
            style={{ transform: "rotate(-180deg)" }}
            alt="Next deals"
          />
        </Box>
      </Stack>
    </div>
  );
}
