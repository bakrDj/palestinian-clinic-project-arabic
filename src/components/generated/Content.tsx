import { Box, Container, IconButton } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { createContext, FC, useRef } from "react";
import { Printer } from "react-feather";
import useStore from "../../store/useStore";
import theme, { primary, secondary } from "../../styles/theme";
import ProfilePatientInformationSubPage from "./ProfilePatientInformationSubPage";

interface Props {}

export const ContentRefContext: React.Context<any> = createContext(null);

export const Content: FC<Props> = (props) => {
  const contentRef = useRef(null);
  let route = useRouter();
  const profilePatientInformationTabIndex = useStore(
    (state: any) => state.profilePatientInformationTabIndex
  );

  return (
    <Box>
      {profilePatientInformationTabIndex !== null && (
        <ProfilePatientInformationSubPage></ProfilePatientInformationSubPage>
      )}
      <Box
        ref={contentRef}
        className="q-content"
        sx={{
          margin: "0 auto",
          overflowY: "overlay",
          height:
            profilePatientInformationTabIndex !== null
              ? `calc(100vh - 240px - 64px)`
              : `calc(100vh - 64px)`,
          // @ts-ignore
          backgroundColor: theme?.palette?.background?.body,
        }}
        paddingTop={"32px"}
        paddingBottom={"32px"}
        width={"100%"}
      >
        <ContentRefContext.Provider value={contentRef}>{props.children}</ContentRefContext.Provider>

        {/* <IconButton
          size="small"
          sx={{
            display:
              profilePatientInformationTabIndex == 0 && route.pathname?.includes("/patient")
                ? "block"
                : "none",
            position: "fixed",
            left: 32,
            bottom: 24,
          }}
        >
          <Link
            href={{
              pathname: "/printer",
              query: {
                vitalSign: true,
                // bordereau: true,
                // format: "pdf",
              },
            }}
            passHref
          >
            <a target="_blank">
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  backgroundColor: secondary[400],
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  // @ts-ignore
                  boxShadow: theme?.shadows?.[26]?.twShadow1,
                }}
              >
                <Printer size={22} color={"#FFF"} />
              </Box>
            </a>
          </Link>
        </IconButton> */}
      </Box>
    </Box>
  );
};
