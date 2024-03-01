import { Box, BoxProps, Button, CardActionArea, DialogContentText, Divider, Grid, IconButton, ListItemIcon, MenuItem, Stack, Tooltip, Typography } from "@mui/material";
import { blue, deepOrange, grey, lightGreen, orange } from "@mui/material/colors";
import { styled } from "@mui/system";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import { useEffect, useState } from "react";
import { Check, Copy, CornerUpLeft, List, MoreHorizontal, Play, Printer, Repeat, Slash, XOctagon, Image as ImageIcon, Phone, Trash2 } from "react-feather";
import traking_status from "../../utilities/data/tracking_status";
import Chip from "../Chip/Chip";
import Menu from "../Menu/Menu";
// import Menu from "../Menu/Menu";
import { default as copyToClipoard } from "copy-to-clipboard";
import Link from "next/link";
import { default as RAvatar } from "react-avatar";
import { useDebouncedCallback } from "use-debounce";
import useStore from "../../store/useStore";
import classNames from "classnames";
import { BoxSelect, Edit2, History } from "lucide-react";
import theme, { primary, secondary, slate } from "../../styles/theme";
import { IdentificationIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import Dialog from "../Dialog/Dialog";
import useDeletePatient from "../../graphql/hooks/patient/useDeletePatient";
import { Get_All_Patients } from "../../graphql/hooks/patient/useGetAllPatients";

interface PatientCardProps extends BoxProps {
  dataInfo?: any;
  setCardDataInfo?: any;
  setOpenEditPatientModal?: any;
  // ////////

  shipmentRestInfo?: any;
  isCommercial?: boolean;
  onshowDetailsClick?: () => any;
  onEditShipmentModalClick?: () => any;
  setOpenShowDetailDrawer?: (isOpen: boolean) => any;
  onRequestClick?: (isOpen: boolean) => any;
  setRequestStatus?: (status: number) => any;
  setMultiSelectionSelectedShipments?: any;
  setOneShipmentInfo?: object;
  isSelecting?: boolean;
  isSelected?: boolean;
}

const StyledPatientCard = styled(Box)(({ theme }: { theme: any }) => {
  return {
    width: "100%",
    height: "152px",
    padding: "16px",
    backgroundColor: "#FFF",
    borderRadius: 2,
    // boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",

    "&.selection-active": {
      position: "relative",
      "&:after": {
        content: "''",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        inset: 0,
        position: "absolute",
        backgroundColor: "transparent",
      },
    },
    "&.selected": {
      outline: "2px solid " + blue[300],
    },
  };
});

const PatientCard = (props: PatientCardProps) => {
  let { dataInfo } = props;
  console.log("🚀 ~ PatientCard ~ dataInfo:", dataInfo);

  let [deleteCardMutation] = useDeletePatient();

  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });
  const userData = useStore((state: any) => state.userData);
  const [copied, setCopied] = useState(false);
  const [selected, setSelected] = useState(props.isSelected || false);
  let debouncedCopy = useDebouncedCallback(() => setCopied(false), 800);
  const copy_active = {
    background: `${lightGreen["300"]}!important`,
    color: "#FFF",
    border: "unset",
    "&:hover": {
      background: lightGreen["300"],
    },
    "& svg": {
      color: "#FFF",
    },
  };

  const [confirmProcessDialog, setconfirmProcessDialog] = useState<any>(false);
  const [confirmProcessContent, setconfirmProcessContent] = useState<{
    title: string;
    content: string;
    onAction: any;
  }>({
    title: "",
    content: "",
    onAction: "",
  });

  const grabDataInfoHandler = () => {
    typeof props.setCardDataInfo == "function" &&
      props.setCardDataInfo({
        ...props.dataInfo,
      });
  };

  const requestHandler = (status: number) => {
    typeof props.setRequestStatus == "function" && props.setRequestStatus(status);
    typeof props.onRequestClick == "function" && props.onRequestClick(true);
    grabDataInfoHandler();
    popupState.close();
  };

  useEffect(() => {
    if (!props.isSelecting) {
      setSelected(false);
    }
  }, [props.isSelecting]);

  return (
    <StyledPatientCard
      // className="selection-active"
      className={classNames({ "selection-active": props.isSelecting, selected })}
      border={"1px solid " + slate[200]}
    >
      <Stack
        height={"100%"}
        justifyContent="space-between"
      >
        <Grid container>
          <Grid
            item
            width={"100%"}
          >
            <Grid
              container
              justifyContent={"space-between"}
            >
              <Grid item>
                <Stack
                  direction={"row"}
                  columnGap={"10px"}
                  alignItems="center"
                >
                  <Box sx={{ cursor: "pointer" }}>
                    <Link href={"/patient/" + dataInfo?.id}>
                      <Box
                        sx={{
                          borderRadius: "50%",
                          outline: "3px solid #FFF",
                        }}
                      >
                        <RAvatar
                          size="38px"
                          name={dataInfo?.Person?.first_name}
                          round
                          style={{
                            fontFamily: "Heebo",
                            outline: "4px solid " + primary[200],
                          }}
                          maxInitials={1}
                        ></RAvatar>
                      </Box>
                    </Link>
                  </Box>
                  <Stack rowGap={"2px"}>
                    <Box sx={{ cursor: "pointer" }}>
                      <Link href={"/patient/" + dataInfo?.id}>
                        <Typography
                          variant="xs"
                          color={grey[700]}
                        >
                          {dataInfo?.Person?.first_name + " " + dataInfo?.Person?.last_name}
                        </Typography>
                      </Link>
                    </Box>
                    <Stack
                      direction="row"
                      gap="2px"
                      alignItems="center"
                    >
                      <Typography
                        variant="2xs"
                        color={slate[500]}
                      >
                        {dataInfo?.Person?.identification_number || "?????????"}
                      </Typography>
                      <IdentificationIcon
                        width={15}
                        height={15}
                        color={slate[500]}
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item>
                {(props.isSelecting && (
                  <IconButton
                    size={"small"}
                    disableRipple
                    disableTouchRipple
                    // sx={{ borderRadius: "4px" }}
                  >
                    <CardActionArea
                      sx={{
                        color: blue[800],
                        // marginTop: "4px",
                        // marginRight: "4px",
                        display: "inline",
                        borderRadius: "4px",
                      }}
                      onClick={() => {
                        setSelected(!selected);
                        props.setMultiSelectionSelectedShipments((prev: any) => {
                          let foundShipmentIndex = [...prev].findIndex((v: any) => v.id == props.shipmentRestInfo.id);
                          // add selection
                          if (foundShipmentIndex > -1) {
                            console.log("removed");
                            return [...prev].filter((v: any) => v.id != props.shipmentRestInfo.id);
                          }
                          // remove selection
                          return [...prev, props.shipmentRestInfo];
                        });
                      }}
                    >
                      <Box
                        component={"button"}
                        sx={{
                          border: "none",
                          backgroundColor: selected ? blue[300] : "#F2F1F5",
                          cursor: "pointer",
                          borderRadius: "4px",
                          width: "19px",
                          height: "19px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                          position: "relative",
                        }}
                      >
                        <div>
                          <Check
                            size={13}
                            strokeWidth="3"
                            color={selected ? "#FFF" : "#D7D4E1"}
                          />
                        </div>
                      </Box>
                    </CardActionArea>
                  </IconButton>
                )) || (
                  <IconButton
                    size={"small"}
                    {...bindTrigger(popupState)}
                  >
                    <MoreHorizontal
                      color={grey[500]}
                      size={18}
                    />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item></Grid>
        </Grid>
        <Grid
          container
          justifyContent={"space-between"}
          alignItems="center"
          sx={{ direction: "rtl" }}
        >
          <Grid item>
            <Box
              component={"a"}
              href={dataInfo?.Person?.phone ? `tel:${dataInfo?.Person?.phone}` : "#"}
            >
              <Stack
                direction={"row"}
                alignItems="center"
                height={"100%"}
                columnGap={"4px"}
              >
                <IconButton
                  disabled={!dataInfo?.Person?.phone}
                  size={"small"}
                  sx={{ width: "28px", height: "28px", background: secondary[50] }}
                >
                  <Phone
                    color={dataInfo?.Person?.phone ? secondary[500] : slate[400]}
                    size={13}
                  />
                </IconButton>
              </Stack>
            </Box>
          </Grid>
          <Grid item>
            <Stack
              direction={"row"}
              alignItems="center"
              gap="6px"
              paddingLeft={"2px"}
            >
              <Stack alignItems={"flex-end"}>
                <Typography
                  color={grey[500]}
                  fontSize="9px"
                >
                  أخر تحديث
                </Typography>
                <Typography
                  variant="3xs"
                  color={grey[600]}
                >
                  {dayjs(dataInfo?.updatedAt, "YYYY-MM-DD[T]HH:mm:ss[Z]").fromNow()}
                </Typography>
              </Stack>
              <History
                color={slate[500]}
                strokeWidth="1.5px"
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>

      <Menu {...bindMenu(popupState)}>
        <MenuItem
          onClick={() => {
            // props.onshowDetailsClick();
            grabDataInfoHandler();
            typeof props.setOpenEditPatientModal == "function" && props.setOpenEditPatientModal(true);
            popupState.close();
          }}
        >
          <ListItemIcon>
            <Edit2
              size={18}
              strokeWidth={2}
            />
          </ListItemIcon>
          تعديل المريض
        </MenuItem>
        <MenuItem
          onClick={() => {
            // props.onshowDetailsClick();
            // grabDataInfoHandler();
            setconfirmProcessDialog(true);
            setconfirmProcessContent({
              title: "إجراء عملية حذف",
              content: "لايمكن إسترجاع المعلومات بعد الحذف!",
              onAction: () => {
                deleteCardMutation({
                  variables: {
                    idPerson: dataInfo?.person?.id,
                  },
                  refetchQueries: [Get_All_Patients],
                });
              },
            });
            // typeof props.setOpenEditPatientModal == "function" &&
            //   props.setOpenEditPatientModal(true);
            popupState.close();
          }}
        >
          <ListItemIcon>
            <Trash2
              size={18}
              strokeWidth={2}
            />
          </ListItemIcon>
          حذف المريض
        </MenuItem>
        {/* <Divider></Divider> */}
      </Menu>
      {/* @ts-ignore */}
      <Dialog
        open={confirmProcessDialog}
        onClose={() => setconfirmProcessDialog(false)}
        title={
          <Typography
            variant="base"
            color={grey[800]}
          >
            {confirmProcessContent.title}
          </Typography>
        }
        footer={
          <>
            <Button
              onClick={() => {
                confirmProcessContent.onAction();
              }}
              autoFocus
            >
              تأكيد
            </Button>
            <Button
              onClick={() => {
                setconfirmProcessDialog(false);
              }}
            >
              إلغاء
            </Button>
          </>
        }
      >
        <DialogContentText id="alert-dialog-description">{confirmProcessContent.content}</DialogContentText>
      </Dialog>
    </StyledPatientCard>
  );
};

export default PatientCard;
