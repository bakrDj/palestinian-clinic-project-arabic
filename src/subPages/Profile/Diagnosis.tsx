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
import dayjs from "dayjs";
import { AlertCircle, ArrowLeftRight, ListMinus, Edit2, History } from "lucide-react";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MoreHorizontal, Plus, Printer, Trash2 } from "react-feather";
import Dialog from "../../components/Dialog/Dialog";
import Menu from "../../components/Menu/Menu";
import AddDiagnosisModal from "../../components/Modal/AddDiagnosisModal";
import AddTemplateModal from "../../components/Modal/AddTemplateModal";
import EditDiagnosisModal from "../../components/Modal/EditDiagnosisModal";
import { useDeleteDiagnosis, useGetDiagnosis } from "../../graphql/hooks/diagnosis";
import { All_Diagnosis } from "../../graphql/hooks/diagnosis/useGetDiagnosis";
import theme, { slate } from "../../styles/theme";
import { priceFormatHelper } from "../../utilities/helpers";
import { sortByRecentTime } from "../../utilities/helpers/filters";

interface Props {
  tabvalue?: any;
  allZonesQuery?: any;
}

const Diagnosis = React.forwardRef(function Diagnosis(props: Props, ref) {
  const [expanded, setExpanded] = React.useState("panel1");
  const [selectedZone, setSelectedZone] = React.useState(0);
  const [selectedTransaction, setSelectedTransaction] = React.useState({});
  const [editTransactionDialog, setEditTransactionDialog] = React.useState(false);
  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });
  const [CardDataInfo, setCardDataInfo] = React.useState<any>(null);

  let route = useRouter();

  // const [getZoneTransactionLazy, { loading: loadingTransaction, data: zoneTransactionsData }] =
  //     useGetZoneTransaction();

  let [getVitalSignLazy, { data: dataRequested }] = useGetDiagnosis({
    id: parseInt(route.query?.id as any),
  });
  const [OpenAddModal, setOpenAddModal] = React.useState(false);
  const [OpenAddTemplateModal, setOpenAddTemplateModal] = React.useState(false);
  const [OpenEditModal, setOpenEditModal] = React.useState(false);

  const [confirmProcessDialog, setconfirmProcessDialog] = useState<any>(false);
  const [confirmProcessContent, setconfirmProcessContent] = useState<{
    title?: string;
    content?: string;
    onAction?: any;
  }>({
    title: "",
    content: "",
    onAction: "",
  });

  let [deleteCardMutation] = useDeleteDiagnosis();

  const accordionExpandHandler = (panel: any) => (event: any, newExpanded: any) => {
    setExpanded(newExpanded ? panel : false);
  };

  const sortedZoneData: any = sortByRecentTime(["createdAt"], props.allZonesQuery);

  useEffect(() => {
    if (props.tabvalue == 1) {
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
              height: { xs: "72px", sm: "188px" },
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
        {sortByRecentTime(["createdAt"], dataRequested?.GetAllDiagnosesByPatientID)?.map(
          (item: any, i: number) => (
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Box
                sx={{
                  height: "188px",
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
                        {dayjs(item?.createdAt, "YYYY-MM-DD[T]HH:mm:ss[Z]").format(
                          "DD/MM/YYYY HH:mm"
                        )}
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
                  <Stack padding={"16px"} justifyContent="space-between" height="100%">
                    <Stack justifyContent={"space-between"} gap="10px">
                      <Typography variant="xs" color={slate[500]}>
                        {item?.complaint}
                      </Typography>
                      <Typography
                        component={"span"}
                        variant="2xs"
                        color={slate[400]}
                        lineHeight="142%"
                        sx={{ direction: "rtl" }}
                      >
                        {item?.diagnosis.length < 127
                          ? !item?.diagnosis
                            ? "(ללא הערה)"
                            : item?.diagnosis
                          : `${item?.diagnosis} ...`}
                        <Typography
                          display={item?.diagnosis.length < 127 ? "none" : "inline"}
                          component={"span"}
                          variant="2xs"
                          color={blue[400]}
                          sx={{ cursor: "pointer", ":hover": { textDecoration: "underline" } }}
                          onClick={() => {
                            setconfirmProcessDialog(true);
                            setconfirmProcessContent({
                              content: item?.diagnosis,
                              onAction: false,
                            });
                          }}
                        >
                          להראות יותר
                        </Typography>
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems={"center"} justifyContent="flex-end">
                      {/* <Stack direction={"row"} alignItems="flex-end" gap="6px" paddingLeft={"2px"}>
                        <img
                          src="/stethoscope.svg"
                          width={25}
                          height={25}
                          color={slate[500]}
                          style={{ fill: "blue" }}
                        />
                        <Stack alignItems={"flex-start"}>
                          <Typography color={grey[500]} fontSize="9px">
                            מחלה נוכחית
                          </Typography>
                          <Typography variant="3xs" color={grey[600]}>
                            {item?.medical_history || "--"}
                          </Typography>
                        </Stack>
                      </Stack> */}
                      <Stack direction="row" justifyContent={"flex-end"} gap="10px">
                        {item?.medical_history && (
                          <img src="/medical-history.svg" width="22px" height="22px" />
                        )}
                        {item?.physical_examination && (
                          <img src="/heart-pulse.png" width="22px" height="22px" />
                        )}
                        {item?.recommendations && (
                          <img src="/good-feedback.png" width="22px" height="22px" />
                        )}
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            </Grid>
          )
        )}
      </Grid>

      <AddDiagnosisModal
        open={OpenAddModal}
        onClose={() => setOpenAddModal(false)}
        id={route.query?.id as any}
      ></AddDiagnosisModal>

      <EditDiagnosisModal
        open={OpenEditModal}
        onClose={() => setOpenEditModal(false)}
        id={route.query?.id as any}
        dataInfo={CardDataInfo}
      ></EditDiagnosisModal>

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
          تعديل التشخيص
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
                    deleteDiagnosisId: CardDataInfo?.id,
                  },
                  refetchQueries: [All_Diagnosis],
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
          حذف التشخيص
        </MenuItem>
        <Divider></Divider>
        <Box marginBottom={"6px"}>
          <Link
            href={{
              pathname: "/printer",
              query: {
                diagnosis: true,
                sickID: route?.query?.id,
                date: dayjs(CardDataInfo?.createdAt, "YYYY-MM-DD[T]HH:mm:ss[Z]").format(
                  "YYYY-MM-DD"
                ),
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
                طباعة التشخيص
              </MenuItem>
            </a>
          </Link>
        </Box>
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

export default Diagnosis;
