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
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { AlertCircle, ArrowLeftRight, ListMinus, Edit2 } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MoreHorizontal, Plus, Printer, Trash2 } from "react-feather";
import { useDeleteVitalSign, useGetVitalSign } from "../../graphql/hooks/vitalSign";
import theme, { slate } from "../../styles/theme";
import { priceFormatHelper } from "../../utilities/helpers";
import { sortByRecentTime } from "../../utilities/helpers/filters";
import dayjs from "dayjs";
import Menu from "../../components/Menu/Menu";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import Dialog from "../../components/Dialog/Dialog";
import AddVitalSignModal from "../../components/Modal/AddVitalSignModal";
import EditPatientModal from "../../components/Modal/EditPatientModal";
import EditVitalSignModal from "../../components/Modal/EditVitalSignModal";
import { Get_All_Patients } from "../../graphql/hooks/patient/useGetAllPatients";
import { All_VitalSigns } from "../../graphql/hooks/vitalSign/useGetVitalSign";
import Divider from "@mui/material/Divider";
import Link from "next/link";

interface Props {
  tabvalue?: any;
  allZonesQuery?: any;
}

const VitalSign = React.forwardRef(function VitalSign(props: Props, ref) {
  const [expanded, setExpanded] = React.useState("panel1");
  const [selectedZone, setSelectedZone] = React.useState(0);
  const [selectedTransaction, setSelectedTransaction] = React.useState({});
  const [editTransactionDialog, setEditTransactionDialog] = React.useState(false);
  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });
  const [CardDataInfo, setCardDataInfo] = React.useState<any>(null);

  let route = useRouter();

  // const [getZoneTransactionLazy, { loading: loadingTransaction, data: zoneTransactionsData }] =
  //     useGetZoneTransaction();

  let [getVitalSignLazy, { data: dataRequested }] = useGetVitalSign({
    id: parseInt(route.query?.id as any),
  });
  const [OpenAddModal, setOpenAddModal] = React.useState(false);
  const [OpenEditModal, setOpenEditModal] = React.useState(false);

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

  let [deleteCardMutation] = useDeleteVitalSign();

  const accordionExpandHandler = (panel: any) => (event: any, newExpanded: any) => {
    setExpanded(newExpanded ? panel : false);
  };

  const sortedZoneData: any = sortByRecentTime(["createdAt"], props.allZonesQuery);

  useEffect(() => {
    if (props.tabvalue == 0) {
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
      <Grid container width={"100%"} spacing={1.5}>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <Box
            onClick={() => setOpenAddModal(true)}
            sx={{
              height: { xs: "72px", sm: "254px" },
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

        {sortByRecentTime(["createdAt"], dataRequested?.GetAllVitalSignsByPatientID)?.map(
          (vitalSign: any, i: number) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={i}>
              <Box
                sx={{
                  height: "254px",
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
                    justifyContent={"space-between"}
                    minHeight="48px"
                    padding="0 16px"
                    borderBottom={"1px solid " + slate[200]}
                  >
                    <Stack direction={"row"} alignItems="center" gap={"4px"}>
                      <CalendarDaysIcon color={slate[400]} width={"20px"} height={"24px"} />
                      <Typography
                        variant="xs"
                        color={slate[500]}
                        marginTop="1px"
                        sx={{ direction: "rtl" }}
                      >
                        {dayjs(vitalSign?.createdAt, "YYYY-MM-DD[T]HH:mm:ss[Z]").format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </Typography>
                    </Stack>
                    <Stack justifyContent={"center"}>
                      <IconButton
                        size={"small"}
                        {...bindTrigger(popupState)}
                        onClick={(e) => {
                          setCardDataInfo(vitalSign);

                          bindTrigger(popupState).onClick(e);
                        }}
                      >
                        <MoreHorizontal color={grey[500]} size={18} />
                      </IconButton>
                    </Stack>
                  </Stack>
                  {/* lower-section */}
                  <Stack padding={"16px"} justifyContent="space-between" height="100%">
                    <Stack direction="row" justifyContent={"space-between"}>
                      <Typography variant="xs" color={slate[500]}>
                        حرارة الجسم
                      </Typography>
                      <Typography variant="base" color={slate[500]} sx={{ direction: "rtl" }}>
                        {vitalSign?.body_temperature || "-"}
                        <Typography variant="2xs" color={slate[400]}>
                          c°
                        </Typography>
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent={"space-between"}>
                      <Typography variant="xs" color={slate[500]}>
                        نبضات القلب
                      </Typography>
                      <Typography variant="base" color={slate[500]} sx={{ direction: "rtl" }}>
                        {vitalSign?.heart_beat || "-"}
                        <Typography variant="2xs" color={slate[400]}>
                          bpm
                        </Typography>
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent={"space-between"}>
                      <Typography variant="xs" color={slate[500]}>
                        ضغط الدم
                      </Typography>
                      <Typography variant="base" color={slate[500]} sx={{ direction: "rtl" }}>
                        {vitalSign?.blood_pressure || "-"}
                        <Typography variant="2xs" color={slate[400]}>
                          mmHg
                        </Typography>
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent={"space-between"}>
                      <Typography variant="xs" color={slate[500]}>
                        عدد مرات التنفس
                      </Typography>
                      <Typography variant="base" color={slate[500]} sx={{ direction: "rtl" }}>
                        {vitalSign?.number_breaths || "-"}
                        <Typography variant="2xs" color={slate[400]}>
                          brpm
                        </Typography>
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent={"space-between"}>
                      <Typography variant="xs" color={slate[500]}>
                        السكري
                      </Typography>
                      <Typography variant="base" color={slate[500]} sx={{ direction: "rtl" }}>
                        {vitalSign?.blood_sugar || "-"}
                        <Typography variant="2xs" color={slate[400]}>
                          mg/dl
                        </Typography>
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent={"space-between"}>
                      <Typography variant="xs" color={slate[500]}>
                        تشبع الأكسجين
                      </Typography>
                      <Typography variant="base" color={slate[500]} sx={{ direction: "rtl" }}>
                        {vitalSign?.oxygen_saturation || "-"}
                        <Typography variant="2xs" color={slate[400]}>
                          %
                        </Typography>
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            </Grid>
          )
        )}
      </Grid>

      <AddVitalSignModal
        open={OpenAddModal}
        onClose={() => setOpenAddModal(false)}
        id={route.query?.id as any}
      ></AddVitalSignModal>
      {/* Edit Shipment */}
      <EditVitalSignModal
        open={OpenEditModal}
        onClose={() => setOpenEditModal(false)}
        boxData={CardDataInfo}
        id={route.query?.id as any}
      ></EditVitalSignModal>

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
          تعديل العلامة الحيوية
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
                    deleteVitalSignsId: CardDataInfo?.id,
                  },
                  refetchQueries: [All_VitalSigns],
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
          حذف العلامة الحيوية
        </MenuItem>
        {/* <Divider></Divider>
        <Box marginBottom={"6px"}>
          <Link
            href={{
              pathname: "/printer",
              query: {
                vitalSignID: CardDataInfo?.id as any,
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
                طباعة الطرد 
              </MenuItem>
            </a>
          </Link>
        </Box> */}
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

export default VitalSign;
