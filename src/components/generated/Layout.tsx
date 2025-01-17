import React, { FC, ReactElement, ReactInstance } from "react";
import { alpha, Avatar, Box, CardActionArea, Grid, Stack /* useTheme */ } from "@mui/material";

import theme from "../../styles/theme";

import { useRef } from "react";
import { Header } from "./Header";
import { Content } from "./Content";
import { SideBar } from "./SideBar";
import { grey } from "@mui/material/colors";

interface Props {
  disabled?: boolean;
  children?: any;
}

const Layout = (props: Props) => {
  return (
    <>
      {!props.disabled ? (
        <Grid container flexWrap="nowrap">
          {/*  <Grid
            item
            sx={{ display: { xs: "none", sm: "block" }, borderRight: "1px solid " + grey[200] }}
          >
            <SideBar></SideBar>
          </Grid> */}
          <Grid item xs>
            <Stack
              height={"100%"}
              // @ts-ignore
              bgcolor={theme?.palette?.background?.body}
            >
              <Header></Header>
              <Content>{props.children}</Content>
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <Box>{props.children}</Box>
      )}
    </>
  );
};

export default Layout;
