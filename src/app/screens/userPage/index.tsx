import { Box, Container, Stack } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Settings } from "./Settings";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { getMediaUrl } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";
import "../../../css/userPage.css";

export default function UserPage() {
  const history = useHistory();
  const { authMember } = useGlobals();
  const profileImage =
    authMember?.memberImage && authMember.memberImage !== "undefined"
      ? getMediaUrl(authMember.memberImage) || "/icons/default-user.svg"
      : "/icons/default-user.svg";
  const roleIcon =
    authMember?.memberType === MemberType.ADMIN ||
    authMember?.memberType === MemberType.RESTAURANT
      ? "/icons/admin-badge.svg"
      : authMember?.memberType === MemberType.AGENT
      ? "/icons/agent-badge.svg"
      : "/icons/user-badge.svg";
  const roleLabel =
    authMember?.memberType === MemberType.RESTAURANT
      ? "ADMIN"
      : authMember?.memberType || "";

  if (!authMember) {
    history.push("/");
  }
  return (
    <div className={"user-page"}>
      <div
        className="user-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(5,5,9,0.75), rgba(5,5,9,0.9)), url(${profileImage})`,
        }}
      >
        <Container>
          <Stack direction="row" alignItems="center" spacing={2}>
            <img src={profileImage} alt="Profile" className="user-hero-avatar" />
            <Box>
              <Box className="user-hero-name">{authMember?.memberNick || "Member"}</Box>
              <Box className="user-hero-role">{roleLabel}</Box>
              <Box className="user-hero-address">
                {authMember?.memberAddress || "No address"}
              </Box>
            </Box>
          </Stack>
        </Container>
      </div>
      <Container>
        <Stack className={"my-page-frame"}>
          <Stack className={"my-page-left"}>
            <Box display={"flex"} flexDirection={"column"}>
              <Box className={"menu-name"}>Modify Member Details</Box>
              <Box className={"menu-content"}>
                <Settings />
              </Box>
            </Box>
          </Stack>

          <Stack className={"my-page-right"}>
            <Box className={"order-info-box"}>
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <div className={"order-user-img"}>
                  <img
                    src={profileImage}
                    className={"order-user-avatar"}
                    alt="User avatar"
                  />
                  <div className={"order-user-icon-box"}>
                    <img src={roleIcon} alt="Role badge" />
                  </div>
                </div>
                <span 
                className={"order-user-name"}>
                  {authMember?.memberNick}</span>
                <span 
                className={"order-user-prof"}>
                  {roleLabel}</span>
                <span 
                className={"order-user-prof"}>
                  {authMember?.memberAddress 
                  ? authMember?.memberAddress 
                  : "No address"}</span>
              </Box>
              <Box className={"user-media-box"}>
                <a href="https://www.facebook.com/ValijonSirojov" target="_blank" rel="noreferrer">
                  <img src="/icons/facebook.svg" alt="Facebook" />
                </a>
                <a href="https://www.instagram.com/vali__jon_/" target="_blank" rel="noreferrer">
                  <img src="/icons/instagram.svg" alt="Instagram" />
                </a>
                <a href="https://t.me/Abu_Sabriya" target="_blank" rel="noreferrer">
                  <img src="/icons/telegram.svg" alt="Telegram" />
                </a>
              </Box>
              <p className={"user-desc"}>{authMember?.memberDesc
                ? authMember.memberDesc
                : "No description"}</p>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
