import {
  Avatar,
  Badge,
  Box,
  CardActionArea,
  ClickAwayListener,
  Container,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  Tabs,
} from "@mui/material";
import React, { useState } from "react";
import { ArrowDown, Bell, Menu, Search as SearchIcon } from "react-feather";
import { useTheme, alpha } from "@mui/material/styles";

import { usePopupState, bindTrigger, bindPopover } from "material-ui-popup-state/hooks";
import Search from "../Input/Search";
import Notification from "../Notification/Notification";
import { Profile } from "./Profile";
import { SideBar } from "./SideBar";
import useStore from "../../store/useStore";
import { default as RAvatar } from "react-avatar";
import { useDebouncedCallback } from "use-debounce";
import NotificationItem from "../Notification/NotificationItem";
import ShipScannerModal from "../Modal/ShipPickUpModal";
import { grey } from "@mui/material/colors";
import Tab from "../Tabs/Tab";
import { secondary } from "../../styles/theme";
import { HomeIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { Router, useRouter } from "next/router";

interface Props {}

export const Header: React.FC<Props> = (props) => {
  const searchValue = useStore((state: any) => state.searchValue);
  const notifyCount = useStore((state: any) => state.notifyCount);
  const notificationData = useStore((state: any) => state.notificationData);
  const userData = useStore((state: any) => state.userData);
  let route = useRouter();
  const [searchValueNotDebounced, setSearchValueNotDebounced] = useState("");
  const [isNotifyLimited, setIsNotifyLimited] = useState(true);
  const [openShipScannerModal, setOpenShipScannerModal] = useState(false);
  const [openSearchbarResponsive, setOpenSearchbarResponsive] = useState(false);
  const [openDrawerNav, setOpenDrawerNav] = useState(false);
  let theme = useTheme();
  const popupNotificationState = usePopupState({
    variant: "popover",
    popupId: "notificationPopover",
  });

  const popupProfileState = usePopupState({
    variant: "popover",
    popupId: "profilePopover",
  });

  let debounced = useDebouncedCallback((value) => {
    useStore.setState({ searchValue: value });
  }, 400);

  return (
    <>
      <ClickAwayListener disableReactTree onClickAway={() => setOpenSearchbarResponsive(false)}>
        <Box
          className="q-header"
          bgcolor={"#FFF"}
          sx={{
            height: "64px",
            position: "relative",
            // boxShadow: "0.2px 0px 3px 0.4px rgba(179, 185, 204, 0.18)",
            borderBottom: "1px solid " + grey[200],
            // background: rgba(179, 185, 204, 1);
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              padding: { xs: "0 24px", lg: "0 32px", xl: "0 48px" },
              display: openSearchbarResponsive ? "flex" : "none",
              alignItems: "center",
            }}
          >
            <Search
              placeholder="بحث"
              variant="outlined"
              autoComplete="off"
              value={searchValueNotDebounced}
              onChange={(e: any) => {
                debounced(e.target.value);
                setSearchValueNotDebounced(e.target.value);
              }}
              onResetClick={() => {
                useStore.setState({ searchValue: "" });
                setSearchValueNotDebounced("");
              }}
              sx={{
                display: { xs: "flex", sm: "none" },
                width: { xs: "100%", md: "40%" },

                left: 0,
              }}
            ></Search>
          </Box>

          <Container
            maxWidth="xl"
            sx={{
              padding: { xs: "0 24px", lg: "0 32px", xl: "0 48px" },
              height: "100%",
              display: openSearchbarResponsive ? "none" : "display",
            }}
          >
            <Box className="q-container" height={"100%"}>
              <Grid
                container
                justifyContent={"space-between"}
                alignItems={"center"}
                height={"100%"}
              >
                <Grid item xs>
                  <Stack
                    direction={"row"}
                    alignItems="center"
                    // columnGap={"24px"}
                    // sx={{columnGap: {xs: ''}}}
                    spacing={{ xs: 1, md: 0 }}
                  >
                    {/* <CardActionArea
                      sx={{
                        width: "auto",
                        color: theme.palette.primary.dark,
                        borderRadius: 1,
                        display: { xs: "block", sm: "none" },
                      }}
                    >
                      <Box padding="6px" onClick={() => setOpenDrawerNav(true)}>
                        <Menu size={24} color={theme.palette.primary.main}></Menu>
                      </Box>
                    </CardActionArea> */}
                    {/* <CardActionArea
                      sx={{
                        width: "auto",
                        color: theme.palette.primary.dark,
                        borderRadius: 1,
                        display: { xs: "block", sm: "none" },
                        backgroundColor: searchValue ? theme.palette.primary.main : "",
                      }}
                      onClick={() => {
                        setOpenSearchbarResponsive(true);
                      }}
                    >
                      <Box padding="6px">
                        <SearchIcon
                          size={24}
                          color={searchValue ? "#FFF" : theme.palette.primary.main}
                        ></SearchIcon>
                      </Box>
                    </CardActionArea> */}
                    <Stack direction="row" alignItems={"center"} width="100%" gap="24px">
                      <img src="/logo.png" alt="" height="28px" />
                      {/* @ts-ignore */}
                      {/* <Search
                        placeholder="بحث"
                        value={searchValueNotDebounced}
                        autoComplete="off"
                        onChange={(e: any) => {
                          debounced(e.target.value);
                          setSearchValueNotDebounced(e.target.value);
                        }}
                        onResetClick={() => {
                          useStore.setState({ searchValue: "" });
                          setSearchValueNotDebounced("");
                        }}
                        sx={{
                          display: { xs: "none", sm: "flex" },
                          width: { xs: "100%", md: "40%" },
                        }}
                      ></Search> */}
                    </Stack>
                  </Stack>
                </Grid>
                {userData?.role !== "Nurse" && (
                  <Grid item xs>
                    <Stack width="100%" justifyContent={"center"} height="100%">
                      <Box
                        bgcolor="#FFF"
                        sx={{
                          width: { xs: "200px", sm: "300px", md: "340px" },
                          bottom: 0,
                          height: "100%",
                          margin: "0 auto",
                        }}
                      >
                        <Tabs
                          sx={{
                            "& .MuiTab-root.Mui-selected": {
                              color: secondary[400],
                            },
                            height: "63px",
                          }}
                          TabIndicatorProps={{
                            style: {
                              backgroundColor: secondary[400],
                            },
                          }}
                          value={route.pathname}
                          onChange={(_, newVal) =>
                            useStore.setState({ profilePatientInformationSubPage: newVal })
                          }
                          variant={"fullWidth"}
                        >
                          <Tab
                            value="/"
                            color={"secondary"}
                            label={
                              <Stack direction="row" alignItems={"center"} gap="6px">
                                <HomeIcon width="18px" height="18px" />
                                <Typography sx={{ display: { xs: "none", sm: "inline" } }}>
                                  الرئيسية
                                </Typography>
                              </Stack>
                            }
                            sx={{ height: "63px" }}
                            onClick={() => {
                              route.push("/");
                            }}
                          />

                          <Tab
                            value="/users"
                            color={"secondary"}
                            label={
                              <Stack direction="row" alignItems={"center"} gap="6px">
                                <UserGroupIcon width="18px" height="18px" />
                                <Typography sx={{ display: { xs: "none", sm: "inline" } }}>
                                  المستخدمين
                                </Typography>
                              </Stack>
                            }
                            sx={{ height: "63px" }}
                            onClick={() => {
                              route.push("/users");
                            }}
                          />
                        </Tabs>
                        <Divider></Divider>
                      </Box>
                    </Stack>
                  </Grid>
                )}
                <Grid item xs>
                  <Stack
                    direction={"row-reverse"}
                    alignItems="center"
                    // columnGap={"24px"}
                    // sx={{columnGap: {xs: ''}}}
                    spacing={{ xs: 2, md: 3 }}
                  >
                    {(userData?.Person && (
                      <IconButton size="small" {...bindTrigger(popupProfileState)}>
                        <RAvatar
                          size="42px"
                          name={userData?.Person?.first_name + " " + userData?.Person?.last_name}
                          round
                          style={{ fontFamily: "Heebo" }}
                          maxInitials={1}
                        ></RAvatar>
                      </IconButton>
                    )) || (
                      <Skeleton
                        variant="circular"
                        sx={{
                          width: "42px",
                          height: "42px",
                          margin: "5px",
                          // borderRadius: "4px",
                          bgcolor: "rgba(0, 0, 0, 0.05)",
                        }}
                      ></Skeleton>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      </ClickAwayListener>
      <Box>
        <Notification
          // anchorReference="anchorPosition"
          // anchorPosition={{ top:  }}
          isOpen={popupNotificationState.isOpen}
          onMaximize={(maximizeStatus: boolean) => {
            setIsNotifyLimited(maximizeStatus);
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          {...bindPopover(popupNotificationState)}
        >
          {notificationData
            ?.slice(0, isNotifyLimited ? 5 : notificationData.length)
            .map((notification: any, index: any) => {
              return (
                <NotificationItem
                  key={index}
                  fullName={notification?.recipient_name || notification?.box?.recipient_name}
                  note={notification?.note || notification?.box?.note}
                  status={
                    notification?.status_box ??
                    notification?.status ??
                    notification?.box?.status_box
                  }
                  date={notification?.createdAt}
                  shipment_code={notification?.code_box || notification?.box?.code_box}
                  bottomDivider
                ></NotificationItem>
              );
            })}
        </Notification>
      </Box>
      <Profile
        fullname={userData?.Person?.first_name + " " + userData?.Person?.last_name}
        email={userData?.Person?.email}
        clientId={userData?.Person?.id}
        {...bindPopover(popupProfileState)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      ></Profile>

      <Drawer open={openDrawerNav} onClose={() => setOpenDrawerNav(false)}>
        <SideBar closeDrawer={() => setOpenDrawerNav(false)}></SideBar>
      </Drawer>
    </>
  );
};
