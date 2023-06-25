import { Box, Tab as MuiTab, TabProps, Tabs as MuiTabs } from "@mui/material";
import { MUIStyledCommonProps, styled } from "@mui/system";
import React from "react";
import { alpha, emphasize, darken, lighten } from "@mui/material/styles";
import { secondary, slate } from "../../styles/theme";

export interface Props extends TabProps {}

const StyledTab = styled(MuiTab)(({ theme, color }: { theme: any; color?: any }) => {
  let lighterShade: string = alpha(lighten(theme.palette[color || "primary"].main, 0.75), 0.2);
  return {
    ...theme.typography["2xs"],
    fontSize: "12 !important",
    textTransform: "capitalize",
    minHeight: "45px",
    height: "45px",
    backgroundColor: slate[200],
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    margin: "0 2px",

    color: slate[400],
    transition: "all 0.2s",
    "&.Mui-selected": {
      borderTop: "3px solid " + secondary[400],
      backgroundColor: slate[50],
      color: secondary[400],
      // background: `linear-gradient(180deg, rgba(255, 255, 255, 0) -29.69%, ${lighterShade} 126.56%), #FFFFFF`,
    },
  };
});

const Tab3 = (props: Props) => {
  return <StyledTab {...(props as MUIStyledCommonProps)}></StyledTab>;
};

export default Tab3;
