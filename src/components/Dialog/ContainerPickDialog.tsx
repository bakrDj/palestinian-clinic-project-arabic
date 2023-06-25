import React from "react";
import Input from "../Input/Input";
import Dialog, { Props as DialogProps } from "./Dialog";
import { Button as MuiButton, CardActionArea, IconButton, Stack, Typography } from "@mui/material";
// import { useCreateZone } from "../../graphql/hooks/shipments";
import { useForm } from "react-hook-form";
import useStore from "../../store/useStore";
import { blue, green, grey, lightGreen } from "@mui/material/colors";
import { Box } from "@mui/system";
import { ArrowLeft, MessageSquare, Phone, X } from "lucide-react";
import { default as RAvatar } from "react-avatar";
import SwipeableViews from "react-swipeable-views";
import theme from "../../styles/theme";
import algerian_provinces from "../../utilities/data/api/yaman_provinces.json";

// import { ALL_ZONES } from "../../graphql/hooks/shipments/useGetAllZones";

interface Props extends DialogProps {
  oneShipmentInfo?: any;
}

const ContainerPickDialog = (props: Props) => {
  // const [createZoneMutation, { data }] = useCreateZone();
  const [tabvalue, setTabvalue] = React.useState<number | string>(0);

  const userData = useStore((state: any) => state.userData);
  let {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const onFormSubmit = ({ zone_name }: any) => {
    // createZoneMutation({
    //   variables: {
    //     content: {
    //       name: zone_name,
    //       cities: [],
    //       id_company: userData?.person?.company?.id,
    //     },
    //   },
    //   refetchQueries: [ALL_ZONES],
    // });
    // @ts-ignore
    typeof props.onClose == "function" && props.onClose();
    reset();
  };

  React.useEffect(() => {
    if (props.open) {
      setTabvalue(0);
    }
  }, [props.open]);

  return (
    <Dialog
      {...props}
      styleDialogContent={{
        marginTop: "4px",
        width: { xs: "calc(100vw - 64px)", sm: "400px" },
        overflow: "hidden",
      }}
    >
      {/* <form id="form" onSubmit={handleSubmit(onFormSubmit)}>
      </form> */}
      <Box sx={{ margin: "-20px -24px" }}>
        <Stack
          direction={"row"}
          justifyContent="space-between"
          alignItems={"center"}
          sx={{ padding: "10px 14px", borderBottom: "1px solid " + grey[100], width: "100%" }}
        >
          {(tabvalue === 0 && (
            <Typography variant="xs" color={grey[700]}>
              مراسلة العميل
            </Typography>
          )) || (
            <Typography variant="xs" color={grey[700]}>
              إختيار رسالة
            </Typography>
          )}

          <Box>
            {(tabvalue === 0 && (
              <IconButton
                size="small"
                onClick={() => {
                  // @ts-ignore
                  typeof props.onClose == "function" && props.onClose();
                  reset();
                }}
              >
                <X size="18" color={grey[800]} />
              </IconButton>
            )) || (
              <IconButton
                size="small"
                onClick={() => {
                  setTabvalue(0);
                  // @ts-ignore
                  // typeof props.onClose == "function" && props.onClose();
                  // reset();
                }}
              >
                <ArrowLeft size="18" color={grey[800]} />
              </IconButton>
            )}
          </Box>
        </Stack>
        {/* contact content */}
        <SwipeableViews
          animateHeight={tabvalue === 0 ? true : false}
          index={tabvalue as any}
          onChangeIndex={(index) => {
            setTabvalue(index);
          }}
          containerStyle={{ willChange: "unset" }}
        >
          <Stack
            justifyContent={"center"}
            alignItems="center"
            gap="12px"
            padding="22px 0"
            sx={{ direction: "ltr", overflow: "hidden" }}
          >
            <Box>
              <RAvatar
                size="64px"
                name={"props.name"}
                round
                style={{ fontFamily: "Heebo" }}
                maxInitials={1}
              ></RAvatar>
            </Box>
            <Stack gap="6px" alignItems="center">
              <Typography variant="xs" color={grey[700]}>
                {props.oneShipmentInfo?.client?.person?.first_name +
                  " " +
                  props.oneShipmentInfo?.client?.person?.last_name}
                {/* محمد مصطفى */}
              </Typography>
              <Typography variant="xs" color={grey[600]}>
                {algerian_provinces?.[props.oneShipmentInfo?.client?.person?.city - 1]?.wilaya_name}
                {/* مستغانم */}
              </Typography>
              <Typography variant="xs" color={grey[700]}>
                {props.oneShipmentInfo?.client?.person?.phone01}
                {/* +312 664 48 20 20 */}
              </Typography>
            </Stack>

            <Stack direction={"row"} gap="16px" alignItems="center">
              <a href={`tel:${props.oneShipmentInfo?.client?.person?.phone01}`}>
                <IconButton sx={{ background: lightGreen[500], color: lightGreen[500] }}>
                  <Phone size="18" color={lightGreen[100]} />
                </IconButton>
              </a>
              <IconButton
                sx={{ background: blue[500], color: blue[500] }}
                onClick={() => setTabvalue(1)}
              >
                <MessageSquare size="18" color={blue[100]} />
              </IconButton>
            </Stack>
          </Stack>
          <Stack
            // justifyContent={"center"}
            // alignItems="center"
            gap="10px"
            padding="16px 10px"
            sx={{
              direction: "ltr",
              background: "#F8F8F8",
              overflowY: "auto",
              height: "100%",
              maxHeight: "calc(100vh - 64px - 50px)",
            }}
          >
            {userData?.person?.company?.listMessages
              ?.filter((msg: any) => msg.type == "client")
              .map((msg: any, index: any) => (
                <a
                  key={index}
                  href={`sms:${
                    props.oneShipmentInfo?.client?.person?.phone01
                  }?body=${encodeURIComponent(msg?.message)}`}
                >
                  <Box
                    sx={{
                      padding: "10px 12px",
                      outline: "1px solid " + grey[200],
                      borderRadius: "2px",
                      backgroundColor: "#FFF",
                      boxShadow: "0px 1px 0px 0.5px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.08s",
                      cursor: "pointer",
                      "&:hover": {
                        boxShadow: "unset",
                        // background: blue[50],
                        outline: "2px solid " + blue[200],
                      },
                    }}
                  >
                    <Typography variant="xs" color={grey[700]}>
                      {msg.message}
                    </Typography>
                  </Box>
                </a>
              ))}
          </Stack>
        </SwipeableViews>
      </Box>
    </Dialog>
  );
};

export default ContainerPickDialog;
