import { CalendarDaysIcon, CalendarIcon } from "@heroicons/react/24/outline";
import {
  alpha,
  Box,
  Button,
  Grid,
  Chip as MuiChip,
  Stack,
  Typography,
  IconButton,
  MenuItem,
  ListItemIcon,
  DialogContentText,
  Divider,
} from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import { AlertCircle, ArrowLeftRight, ListMinus, Edit2 } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { MoreHorizontal, Plus, Printer, Trash2 } from "react-feather";
import { useDeletePrescription, useGetPrescription } from "../../graphql/hooks/prescription";
import theme, { primary, secondary, slate } from "../../styles/theme";
import { priceFormatHelper } from "../../utilities/helpers";
import { sortByRecentTime } from "../../utilities/helpers/filters";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import Menu from "../../components/Menu/Menu";
import { All_Prescription } from "../../graphql/hooks/prescription/useGetPrescription";
import Dialog from "../../components/Dialog/Dialog";
import dayjs from "dayjs";
import AddPrescriptionModal from "../../components/Modal/AddPrescriptionModal";
import EditPrescriptionModal from "../../components/Modal/EditPrescriptionModal";
import AddMedicineModal from "../../components/Modal/AddMedicineModal";
import EditMedicineModal from "../../components/Modal/EditMedicineModal";
import { useDeleteMedicine } from "../../graphql/hooks/medicine";
import Link from "next/link";

interface Props {
  tabvalue?: any;
  allZonesQuery?: any;
}

const Prescription = React.forwardRef(function Prescription(props: Props, ref) {
  const [expanded, setExpanded] = React.useState("panel1");
  const [selectedZone, setSelectedZone] = React.useState(0);
  const [selectedTransaction, setSelectedTransaction] = React.useState({});
  const [editTransactionDialog, setEditTransactionDialog] = React.useState(false);
  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });
  const popupState2 = usePopupState({ variant: "popover", popupId: "demoMenu" });
  const [CardDataInfo, setCardDataInfo] = React.useState<any>(null);

  let route = useRouter();

  // const [getZoneTransactionLazy, { loading: loadingTransaction, data: zoneTransactionsData }] =
  //     useGetZoneTransaction();

  let [getVitalSignLazy, { data: dataRequested }] = useGetPrescription({
    id: route.query?.id as any,
  });

  const [OpenAddModal, setOpenAddModal] = React.useState(false);
  const [OpenEditModal, setOpenEditModal] = React.useState(false);

  const [OpenAddMedicineModal, setOpenAddMedicineModal] = React.useState(false);
  const [OpenEditMedicineModal, setOpenEditMedicineModal] = React.useState(false);

  const [confirmProcessDialog, setconfirmProcessDialog] = React.useState<any>(false);
  const [confirmProcessContent, setconfirmProcessContent] = React.useState<{
    title: string;
    content: string;
    onAction: any;
  }>({
    title: "",
    content: "",
    onAction: "",
  });

  let [deleteCardMutation] = useDeletePrescription();
  let [deleteCard2Mutation] = useDeleteMedicine();

  const accordionExpandHandler = (panel: any) => (event: any, newExpanded: any) => {
    setExpanded(newExpanded ? panel : false);
  };

  const sortedZoneData: any = sortByRecentTime(["createdAt"], props.allZonesQuery);

  useEffect(() => {
    if (props.tabvalue == 3) {
      getVitalSignLazy();
    }
  }, [props.tabvalue]);

  return (
    <Box
      sx={{
        width: "100%",
        // marginTop: "32px",
        direction: "ltr",
        overflow: "hidden",
      }}
    >
      <Stack
        sx={{
          width: "100%",
        }}
        gap={"24px"}
      >
        <Stack
          onClick={() => setOpenAddModal(true)}
          direction={"row"}
          alignItems="center"
          sx={{
            padding: "8px 0",
            cursor: "pointer",
            transition: "all 0.2s",
            userSelect: "none",
            ":hover": {
              backgroundColor: primary[50],
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "1px",
              backgroundColor: primary[300],
            }}
          ></Box>
          <Stack
            direction="row"
            alignItems="center"
            gap="4px"
            width="400px"
            justifyContent={"center"}
          >
            <div style={{ marginTop: -1 }}>
              <Plus size={14} color={primary[400]} />
            </div>
            <Typography variant="xs" color={primary[400]}>
              إضافة روشيتا جديدة
            </Typography>
          </Stack>
          <Box
            sx={{
              width: "100%",
              height: "1px",
              backgroundColor: primary[300],
            }}
          ></Box>
        </Stack>

        {sortByRecentTime(["createdAt"], dataRequested?.allPrescription)?.map(
          (item: any, i: number) => (
            <Stack gap="16px">
              <Stack
                sx={{
                  height: "36px",
                  width: "100%",
                  borderBottom: "1px solid " + slate[300],
                }}
                justifyContent="space-between"
                alignItems={"center"}
                direction="row"
              >
                <Stack alignItems={"center"} direction="row" gap="10px">
                  {item?.title && (
                    <>
                      <Typography variant="xs" color={grey[600]}>
                        {item?.title}
                      </Typography>
                      <Box
                        sx={{
                          width: 4,
                          height: 4,
                          borderRadius: 4,
                          backgroundColor: secondary[400],
                        }}
                      ></Box>
                    </>
                  )}
                  <Typography variant="2xs" color={slate[400]}>
                    {item?.medicines.length} دواء
                  </Typography>
                  <Box
                    sx={{ width: 4, height: 4, borderRadius: 4, backgroundColor: secondary[400] }}
                  ></Box>
                  <Typography variant="2xs" color={slate[400]}>
                    {dayjs(item?.createdAt, "DD/MM/YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm")}
                  </Typography>
                </Stack>
                <Stack justifyContent={"center"}>
                  <IconButton
                    size={"small"}
                    /* {...bindTrigger(popupState)} */ sx={{ bgcolor: slate[100] }}
                    {...bindTrigger(popupState)}
                    onClick={(e) => {
                      setCardDataInfo(item);

                      bindTrigger(popupState).onClick(e);
                    }}
                  >
                    <MoreHorizontal color={grey[500]} size={14} />
                  </IconButton>
                </Stack>
              </Stack>
              <Grid container width={"100%"} spacing={1.5}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Box
                    onClick={() => {
                      setOpenAddMedicineModal(true);
                      setCardDataInfo(item);
                    }}
                    sx={{
                      height: { xs: "72px", sm: "174px" },
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
                {item?.medicines?.map((drug: any, i: number) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                    <Box
                      sx={{
                        height: "174px",
                        width: "100%",
                        borderRadius: "2px",
                        background: "#FFF",
                        border: "1px solid " + slate[200],
                      }}
                    >
                      <Stack sx={{ width: "100%", height: "100%" }}>
                        {/* upper-section */}
                        <Stack
                          direction="row"
                          // justifyContent={"space-between"}
                          minHeight="100%"
                          padding="16px 16px"
                          gap="12px"
                        >
                          <img src="/drug.png" width="52px" height="52px" />
                          <Stack width="100%" justifyContent={"space-between"} gap="4px">
                            <Stack direction="row" width="100%" justifyContent={"space-between"}>
                              <Typography variant="xs" color={grey[700]} marginTop="4px">
                                {drug?.name}
                              </Typography>
                              <IconButton
                                size={"small"}
                                /* {...bindTrigger(popupState)} */
                                {...bindTrigger(popupState2)}
                                onClick={(e) => {
                                  setCardDataInfo(drug);

                                  bindTrigger(popupState2).onClick(e);
                                }}
                              >
                                <MoreHorizontal color={grey[500]} size={14} />
                              </IconButton>
                            </Stack>

                            <Stack gap="10px" width="100%">
                              <Stack direction="row" gap="8px" alignItems={"center"}>
                                <img src="/pill.svg" />
                                <Typography variant="2xs" color={grey[600]}>
                                  {drug?.quantity || "-"}
                                </Typography>
                              </Stack>
                              <Stack direction="row" gap="8px" alignItems={"center"}>
                                <img src="/repeat.svg" />
                                <Typography variant="2xs" color={grey[600]}>
                                  {drug?.times_per_day || "-"} مرة
                                </Typography>
                              </Stack>
                              <Stack direction="row" gap="6px" alignItems={"center"}>
                                <img src="/history.svg" style={{ marginRight: -2 }} />
                                <Typography variant="2xs" color={grey[600]}>
                                  لمدة {drug?.duration || "-"} يوم
                                </Typography>
                              </Stack>
                              <Stack direction="row" gap="6px" alignItems={"center"}>
                                <img src="/how-to-use.svg" style={{ marginRight: -1 }} />
                                <Typography variant="2xs" color={grey[600]}>
                                  {drug?.giving || "-"}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          )
        )}
      </Stack>

      <AddPrescriptionModal
        open={OpenAddModal}
        onClose={() => setOpenAddModal(false)}
        id={route.query?.id as any}
      ></AddPrescriptionModal>

      <EditPrescriptionModal
        open={OpenEditModal}
        onClose={() => setOpenEditModal(false)}
        id={route.query?.id as any}
        dataInfo={CardDataInfo}
      ></EditPrescriptionModal>

      <AddMedicineModal
        open={OpenAddMedicineModal}
        onClose={() => setOpenAddMedicineModal(false)}
        id={CardDataInfo?.id}
      ></AddMedicineModal>

      <EditMedicineModal
        open={OpenEditMedicineModal}
        onClose={() => setOpenEditMedicineModal(false)}
        // id={route.query?.id as any}
        dataInfo={CardDataInfo}
      ></EditMedicineModal>

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
          تعديل الروشيتا
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
                    deletePrescriptionId: CardDataInfo?.id,
                  },
                  refetchQueries: [All_Prescription],
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
          حذف الروشيتا
        </MenuItem>
        <Divider></Divider>
        <Box marginBottom={"6px"}>
          <Link
            href={{
              pathname: CardDataInfo?.medicines?.length ? "/printer" : "/",
              query: {
                prescriptionID: CardDataInfo?.id as any,
                // bordereau: true,
                // format: "pdf",
              },
            }}
            passHref
          >
            <a target="_blank">
              <MenuItem
                onClick={() => {
                  popupState.close();
                }}
              >
                <ListItemIcon>
                  <Printer size={18} strokeWidth={2} />
                </ListItemIcon>
                طباعة الروشيتا
              </MenuItem>
            </a>
          </Link>
        </Box>
      </Menu>

      <Menu {...bindMenu(popupState2)}>
        <MenuItem
          onClick={() => {
            setOpenEditMedicineModal(true);
            // props.onshowDetailsClick();
            // grabDataInfoHandler();
            // typeof props.setOpenEditPatientModal == "function" &&
            //   props.setOpenEditPatientModal(true);
            popupState2.close();
          }}
        >
          <ListItemIcon>
            <Edit2 size={18} strokeWidth={2} />
          </ListItemIcon>
          تعديل الدواء
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
                deleteCard2Mutation({
                  variables: {
                    deleteMedicineId: CardDataInfo?.id,
                  },
                  refetchQueries: [All_Prescription],
                });
                setconfirmProcessDialog(false);
              },
            });
            // typeof props.setOpenEditPatientModal == "function" &&
            //   props.setOpenEditPatientModal(true);
            popupState2.close();
          }}
        >
          <ListItemIcon>
            <Trash2 size={18} strokeWidth={2} />
          </ListItemIcon>
          حذف الدواء
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

export default Prescription;
