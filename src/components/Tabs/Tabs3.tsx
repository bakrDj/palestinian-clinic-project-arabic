import { Box, Tabs as MuiTabs, Tab as MuiTab, TabProps, Tab, Stack } from "@mui/material";
import { MUIStyledCommonProps, styled } from "@mui/system";
import React from "react";
import { alpha, emphasize, darken, lighten } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

export interface Props extends TabProps {}

const StyledTabs = styled(MuiTabs)(({ theme, color }: { theme: any; color?: any }) => {
  let lighterShade100: string = alpha(theme.palette[color || "primary"].main, 0.1);
  return {
    //   ...theme.typography["sm"],
    //   minHeight: "54px",
    //   "&.Mui-selected": {
    //     background: `linear-gradient(180deg, rgba(255, 255, 255, 0) -29.69%, ${lighterShade} 126.56%), #FFFFFF`,
    //   },
    // background:
    "& .MuiTabs-indicator": {
      display: "none",
    },
  };
});

const Tabs3 = (props: Props) => {
  return <StyledTabs {...(props as MUIStyledCommonProps)}>{props.children}</StyledTabs>;
};

export default Tabs3;
