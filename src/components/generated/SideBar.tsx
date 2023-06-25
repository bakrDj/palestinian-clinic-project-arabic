import { Box } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { BarChart, Gift, Home, User } from "react-feather";
import Navbar, { NavbarHeader, NavbarItem, NavbarList } from "../Navbar";

interface Props {
  closeDrawer?: () => any;
}

export const SideBar: FC<Props> = (props) => {
  let route = useRouter();
  return (
    <>
      <Box className="q-sidebar" sx={{ height: "100%", backgroundColor: "#FFF" }}>
        <Navbar>
          <NavbarHeader flexShrink={0}>
            <Image src="/logo.png" width={45} height={52} alt="logo"></Image>
          </NavbarHeader>
          <NavbarList>
            <NavbarItem
              title="الصفحة الرئيسية"
              onClick={() => {
                route.push("/");
                if (typeof props.closeDrawer == "function") props.closeDrawer();
              }}
              selected={route.pathname === "/"}
            >
              <Home></Home>
            </NavbarItem>
            <NavbarItem
              title="إحصائيات"
              onClick={() => {
                route.push("/dashboard");
                if (typeof props.closeDrawer == "function") props.closeDrawer();
              }}
              selected={route.pathname === "/dashboard"}
            >
              <BarChart></BarChart>
            </NavbarItem>
          </NavbarList>
          {/* <NavbarFooter>
                <Info></Info>
              </NavbarFooter> */}
        </Navbar>
      </Box>
    </>
  );
};
