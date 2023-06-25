import {
  Avatar,
  Box,
  CardActionArea,
  Divider,
  Popover,
  PopoverProps,
  Stack,
  Typography,
} from "@mui/material";
import { grey, lightGreen } from "@mui/material/colors";
import { styled } from "@mui/system";
import React from "react";
import { LogOut } from "react-feather";
import { default as RAvatar } from "react-avatar";
import { useLogout } from "../../graphql/hooks/users";
import { useRouter } from "next/router";
import useStore from "../../store/useStore";
import { HelpCircle } from "lucide-react";
import theme from "../../styles/theme";
import { priceFormatHelper } from "../../utilities/helpers";
import { sortByRecentTime } from "../../utilities/helpers/filters";

interface Props extends PopoverProps {
  fullname?: string;
  email?: string;
  clientId?: string /* avatar purposes */;
}

const StyledPopOver = styled(Popover)(({ theme, color }: { theme: any; color?: any }) => {
  return {
    [`& .MuiPopover-paper`]: {
      ...theme.typography["sm"],
      boxShadow: theme.shadows[25].elevation3,
      // height: "130px",
      width: "344px",
    },

    "& .PickUpPlanPopOver-top": {
      display: "flex",
      alignItems: "center",
      padding: "0 16px",
    },
    "& .PickUpPlanPopOver-bottom": {
      display: "flex",
      alignItems: "center",
      padding: "0 28px",
    },
  };
});

export const PickUpPlanPopOver = (props: Props) => {
  const [logoutMutation] = useLogout();
  const route = useRouter();
  let userData = useStore((state: any) => state.userData);

  return (
    <StyledPopOver {...(props as any)} arrow>
      <Stack height={"100%"}>
        <Box className="PickUpPlanPopOver-top" height={"48px"} sx={{}}>
          <Stack direction={"row"} columnGap={"10px"} alignItems="center">
            <Stack gap={"8px"} direction={"row"} alignItems={"center"}>
              <HelpCircle size="16" color={grey[600]} />
              <Typography variant="xs" color={grey[600]}>
                إحتساب الشحنات
              </Typography>
            </Stack>
          </Stack>
        </Box>
        <Divider style={{ borderStyle: "dashed" }}></Divider>
        <Box flex={"1"} sx={{ padding: "16px 20px" }}>
          <Stack gap={"14px"}>
            <Typography variant="2xs" color={grey[600]}>
              يتم إحتساب أسعار الشحن كالأتي:
            </Typography>

            <Stack gap={"6px"}>
              {sortByRecentTime(["createdAt"], userData?.person?.company?.listPickUpPlan)
                ?.reverse()
                .map((plan: any, i: number) => (
                  <Stack gap={"6px"} direction="row" alignItems="center" key={i}>
                    <Box
                      sx={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: theme.palette.secondary.main,
                      }}
                    ></Box>
                    <Typography variant="2xs" color={grey[600]}>
                      عن كل{" "}
                      <Typography variant="xs" color={lightGreen[600]}>
                        {plan.number_box}{" "}
                        <Typography variant="2xs" color={lightGreen[600]}>
                          شحنات
                        </Typography>
                      </Typography>{" "}
                      أو أقل يتم إحتساب{" "}
                      <Typography variant="xs" color={"primary"}>
                        {priceFormatHelper(plan.price, "")}
                        <Typography variant="2xs" color={"primary"}>
                          د.ج
                        </Typography>
                      </Typography>{" "}
                    </Typography>
                  </Stack>
                ))}
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </StyledPopOver>
  );
};
