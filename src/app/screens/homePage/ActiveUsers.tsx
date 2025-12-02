import { Box, Container, Stack } from "@mui/material";
import Card from "@mui/joy/Card";
import { CssVarsProvider, Typography } from "@mui/joy";
import CardOverflow from "@mui/joy/CardOverflow";
import AspectRatio from "@mui/joy/AspectRatio";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveTopUsers } from "./selector";
import { mediaApi, getMediaUrl } from "../../../lib/config";
import { Member } from "../../../lib/types/member";
import ShieldIcon from "@mui/icons-material/Shield";
import LocationOnIcon from "@mui/icons-material/LocationOn";


/** REDUX SKICE & SELECTOR */
const topUsersRetriever = createSelector(
    retrieveTopUsers,
    (topUsers) => ({
        topUsers
    })
);


export default function ActiveUsers() {
  const { topUsers } = useSelector(topUsersRetriever);

  return (
    <div className="active-users-frame">
      <Container>
        <Stack className="main">
          <Box className="category-title">Active Agents &amp; Creators</Box>
          <Box className="category-subtitle">
            Top verified agents and creators, curated by the admin team.
          </Box>
          <Stack className="cards-frame">
            <CssVarsProvider>
              {topUsers.length !== 0 ? (
                topUsers.map((member: Member) => {
                const imagePath = getMediaUrl(member.memberImage) || (member.memberImage ? `${mediaApi}/${String(member.memberImage).replace(/^\/+/, "")}` : "/img/banner.webp");
                return (
                  <Card
                   key={member._id}
                    variant="outlined"
                    className="card member-card"
                    >
                    <CardOverflow className="member-media">
                      <div className="member-badge">
                        <img src="/icons/agent-badge.svg" alt="Top rated agent" />
                      </div>
                      <AspectRatio ratio="4/5">
                        <img src={imagePath} alt={member.memberNick || "Agent profile"}/>
                      </AspectRatio>
                    </CardOverflow>
                    <CardOverflow className="member-info">
                      <Typography level="title-lg" className="member-name">
                        {member.memberNick || "Verified agent"}
                      </Typography>
                      <Typography level="body-sm" className="member-role" startDecorator={<ShieldIcon />}>
                        Admin-vetted
                      </Typography>
                      <Typography level="body-sm" className="member-location" startDecorator={<LocationOnIcon />}>
                        {member.memberAddress || "Global"}
                      </Typography>
                    </CardOverflow>
                  </Card>
                );
              })
              ) : (
                <Box className="no-data">No active community members yet.</Box>
              )}
            </CssVarsProvider>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
