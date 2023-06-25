import { CalendarDaysIcon, CalendarIcon, EyeIcon } from "@heroicons/react/24/outline";
import {
  alpha,
  Box,
  Button,
  Grid,
  Chip as MuiChip,
  Stack,
  Typography,
  IconButton,
  DialogContentText,
  ListItemIcon,
  MenuItem,
  CardActionArea,
} from "@mui/material";
import { blue, green, grey } from "@mui/material/colors";
import { AlertCircle, ArrowLeftRight, ListMinus, Edit2 } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Check, MoreHorizontal, Plus, Trash2 } from "react-feather";
import Dialog from "../../components/Dialog/Dialog";
import Menu from "../../components/Menu/Menu";
import { useDeleteAlbum, useGetAlbum } from "../../graphql/hooks/album";
import theme, { secondary, slate } from "../../styles/theme";
import { priceFormatHelper } from "../../utilities/helpers";
import { sortByRecentTime } from "../../utilities/helpers/filters";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import { All_Album } from "../../graphql/hooks/album/useGetAlbum";
import dayjs from "dayjs";
import AddAlbumModal from "../../components/Modal/AddAlbumModal";
import EditAlbumModal from "../../components/Modal/EditAlbumModal";
import dynamic from "next/dynamic";
import {
  useDeleteNurseDuty,
  useGetNurseDuty,
  useUpdateNurseDuty,
} from "../../graphql/hooks/nurseDuty";
import AddNurseDutyModal from "../../components/Modal/AddNurseDutyModal";
import { All_NurseOrder } from "../../graphql/hooks/nurseDuty/useGetNurseDuty";
import EditNurseDutyModal from "../../components/Modal/EditNurseDutyModal";

const Viewer = dynamic(
  () => {
    return import("react-viewer");
  },
  { ssr: false }
);

interface Props {
  tabvalue?: any;
  allZonesQuery?: any;
}

const NurseDuties = React.forwardRef(function NurseDuties(props: Props, ref) {
  const [expanded, setExpanded] = React.useState("panel1");
  const [selectedZone, setSelectedZone] = React.useState(0);
  const [selectedTransaction, setSelectedTransaction] = React.useState({});
  const [editTransactionDialog, setEditTransactionDialog] = React.useState(false);
  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });
  const [CardDataInfo, setCardDataInfo] = React.useState<any>(null);

  let route = useRouter();

  // const [getZoneTransactionLazy, { loading: loadingTransaction, data: zoneTransactionsData }] =
  //     useGetZoneTransaction();

  let [getVitalSignLazy, { data: dataRequested }] = useGetNurseDuty({
    id: route.query?.id as any,
  });
  const [OpenAddModal, setOpenAddModal] = React.useState(false);
  const [OpenEditModal, setOpenEditModal] = React.useState(false);
  const [visibleImage, setVisibleImage] = React.useState<boolean>(false);

  const [confirmProcessDialog, setconfirmProcessDialog] = React.useState<any>(false);
  const [images, setImages] = React.useState<any>([]);
  const [confirmProcessContent, setconfirmProcessContent] = React.useState<{
    title?: string;
    content?: string;
    onAction?: any;
  }>({
    title: "",
    content: "",
    onAction: "",
  });

  let [deleteCardMutation] = useDeleteNurseDuty();
  let [updateCardMutation] = useUpdateNurseDuty();

  const accordionExpandHandler = (panel: any) => (event: any, newExpanded: any) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    if (props.tabvalue == 2) {
      getVitalSignLazy();
    }
  }, [props.tabvalue]);

  // useEffect(() => {
  //     if (props.tabvalue == 1) {
  //         getZoneTransactionLazy({
  //             variables: {
  //                 idZone: sortedZoneData?.[selectedZone]?.id,
  //             },
  //         });
  //     }
  // }, [props.tabvalue, selectedZone]);

  return (
    <Box
      sx={{
        width: "100%",
        // marginTop: "32px",
        direction: "ltr",
        overflow: "hidden",
      }}
    >
      <Grid container width={"100%"} spacing={1.5}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Box
            onClick={() => setOpenAddModal(true)}
            sx={{
              height: { xs: "72px", sm: "216px" },
              width: "100%",
              borderRadius: "2px",
              border: "2px dashed " + slate[300],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              ":hover": {
                backgroundColor: slate[100],
                border: "2px dashed " + slate[100],
              },
            }}
          >
            <Plus size={45} color={slate[300]} />
          </Box>
        </Grid>

        {sortByRecentTime(["createdAt"], dataRequested?.allNurseOrder)?.map(
          (item: any, i: number) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Box
                sx={{
                  height: "216px",
                  width: "100%",
                  borderRadius: "2px",
                  background: "#FFF",
                  border: `1px solid ${item?.completed ? green[500] : slate[200]}`,
                }}
              >
                <Stack sx={{ width: "100%", height: "100%" }}>
                  {/* upper-section */}
                  <Stack
                    direction="row"
                    justifyContent={"space-between"}
                    minHeight="48px"
                    padding="0 16px"
                    borderBottom={`1px solid ${item?.completed ? green[500] : slate[200]}`}
                  >
                    <Stack direction={"row"} alignItems="center" gap={"4px"}>
                      <CalendarDaysIcon color={slate[400]} width={"20px"} height={"24px"} />
                      <Typography
                        variant="xs"
                        color={slate[500]}
                        marginTop="1px"
                        sx={{ direction: "rtl" }}
                      >
                        {dayjs(item?.createdAt, "DD/MM/YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm")}
                      </Typography>
                    </Stack>
                    <Stack justifyContent={"center"}>
                      <IconButton
                        size={"small"}
                        {...bindTrigger(popupState)}
                        onClick={(e) => {
                          setCardDataInfo(item);

                          bindTrigger(popupState).onClick(e);
                        }}
                      >
                        <MoreHorizontal color={grey[500]} size={18} />
                      </IconButton>
                    </Stack>
                  </Stack>
                  {/* lower-section */}
                  <Stack padding={"16px"} gap={"16px"} height="100%">
                    <Stack justifyContent={"space-between"} gap="10px" height="100%">
                      <Stack gap="12px">
                        <Typography
                          component={"span"}
                          variant="2xs"
                          color={slate[400]}
                          lineHeight="142%"
                        >
                          {item?.nurse_order.length < 296
                            ? !item?.nurse_order
                              ? "(ללא הערה)"
                              : item?.nurse_order
                            : `${item?.nurse_order} ...`}
                          <Typography
                            display={item?.nurse_order.length < 296 ? "none" : "inline"}
                            component={"span"}
                            variant="2xs"
                            color={blue[400]}
                            sx={{ cursor: "pointer", ":hover": { textDecoration: "underline" } }}
                            onClick={() => {
                              setconfirmProcessDialog(true);
                              setconfirmProcessContent({
                                content: item?.nurse_order,
                                onAction: false,
                              });
                            }}
                          >
                            להראות יותר
                          </Typography>
                        </Typography>
                      </Stack>
                      <Stack justifyContent={"flex-start"} width="100%">
                        <IconButton
                          size={"small"}
                          disableRipple
                          disableTouchRipple
                          sx={{ justifyContent: "flex-end", padding: "0" }}
                        >
                          <CardActionArea
                            sx={{
                              color: blue[800],
                              // marginTop: "4px",
                              // marginRight: "4px",
                              display: "inline",
                              borderRadius: "50%",
                              width: "24px",
                            }}
                            onClick={() => {
                              updateCardMutation({
                                variables: {
                                  updateNurseOrderId: item?.id,
                                  content: {
                                    id_sick: route?.query?.id as any,
                                    completed: !item?.completed,
                                  },
                                },
                                refetchQueries: [All_NurseOrder],
                              });
                            }}
                          >
                            <Box
                              component={"button"}
                              sx={{
                                border: "none",
                                backgroundColor: item?.completed ? green[300] : "#F2F1F5",
                                cursor: "pointer",
                                borderRadius: "50%",
                                width: "24px",
                                height: "24px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 10,
                                position: "relative",
                                padding: "0 !important",
                              }}
                            >
                              <div>
                                <Check
                                  size={16}
                                  strokeWidth="3"
                                  color={item?.completed ? "#FFF" : "#D7D4E1"}
                                />
                              </div>
                            </Box>
                          </CardActionArea>
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            </Grid>
          )
        )}
      </Grid>

      <AddNurseDutyModal
        open={OpenAddModal}
        onClose={() => setOpenAddModal(false)}
        id={route.query?.id as any}
      ></AddNurseDutyModal>

      <EditNurseDutyModal
        open={OpenEditModal}
        onClose={() => setOpenEditModal(false)}
        id={route.query?.id as any}
        dataInfo={CardDataInfo}
      ></EditNurseDutyModal>

      <Menu {...bindMenu(popupState)}>
        <MenuItem
          onClick={() => {
            setOpenEditModal(true);
            // props.onshowDetailsClick();
            // grabDataInfoHandler();
            // typeof props.setOpenEditPatientModal == "function" &&
            //   props.setOpenEditPatientModal(true);
            popupState.close();
          }}
        >
          <ListItemIcon>
            <Edit2 size={18} strokeWidth={2} />
          </ListItemIcon>
          تعديل الامر
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
                    deleteNurseOrderId: CardDataInfo?.id,
                  },
                  refetchQueries: [All_NurseOrder],
                });
                setconfirmProcessDialog(false);
              },
            });
            // typeof props.setOpenEditPatientModal == "function" &&
            //   props.setOpenEditPatientModal(true);
            popupState.close();
          }}
        >
          <ListItemIcon>
            <Trash2 size={18} strokeWidth={2} />
          </ListItemIcon>
          حذف الامر
        </MenuItem>
        {/* <Divider></Divider> */}
      </Menu>
      {/* @ts-ignore */}
      <Dialog
        open={confirmProcessDialog}
        onClose={() => setconfirmProcessDialog(false)}
        title={
          <Typography variant="base" color={grey[800]}>
            {confirmProcessContent.title}
          </Typography>
        }
        footer={
          <>
            <Button
              sx={{ display: !confirmProcessContent.onAction ? "none" : "" }}
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
        <DialogContentText id="alert-dialog-description">
          {confirmProcessContent.content}
        </DialogContentText>
      </Dialog>
    </Box>
  );
});

export default NurseDuties;
