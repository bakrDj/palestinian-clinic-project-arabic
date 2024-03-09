import { Box, Container, DialogContentText, Divider, Grid, ListItemIcon, MenuItem, Stack, Tabs, Typography, Button as ButtinMui } from "@mui/material";
import React, { useEffect, useState } from "react";
import Tab from "../Tabs/Tab";
import useStore from "../../store/useStore";
import { primary, slate } from "../../styles/theme";
import Button from "../Button";
import { IdentificationIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { ArrowRight, Edit2, MoreHorizontal, Phone, Trash2 } from "react-feather";
import { ArrowBigLeft, History } from "lucide-react";
import { default as RAvatar } from "react-avatar";
import Tabs2 from "../Tabs/Tabs2";
import { useDeletePatient, useGetOnePatients } from "../../graphql/hooks/patient";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import Menu from "../Menu/Menu";
import { bindMenu, bindTrigger } from "material-ui-popup-state/core";
import { usePopupState } from "material-ui-popup-state/hooks";
import AddPatientModal from "../Modal/AddPatientModal";
import EditPatientModal from "../Modal/EditPatientModal";
import { grey } from "@mui/material/colors";
import Dialog from "../Dialog/Dialog";
import { Get_All_Patients } from "../../graphql/hooks/patient/useGetAllPatients";
import Head from "next/head";
import Tab3 from "../Tabs/Tab3";
import Tabs3 from "../Tabs/Tabs3";
import { Timeline, TimelineConnector, TimelineContent, timelineContentClasses, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from "@mui/lab";

interface Props {}

const ProfilePatientInformationSubPage = (props: Props) => {
  const profilePatientInformationTabIndex = useStore((state: any) => state.profilePatientInformationTabIndex);

  let route = useRouter();

  let [deleteCardMutation] = useDeletePatient();

  let [patientData] = useGetOnePatients({
    id: parseInt(route?.query?.id as any),
  });
  patientData = patientData[0];

  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });

  const [OpenAddModal, setOpenAddModal] = React.useState(false);
  const [OpenEditModal, setOpenEditModal] = React.useState(false);

  const [confirmProcessDialog, setconfirmProcessDialog] = useState<any>(false);
  const [confirmProcessDialog2, setconfirmProcessDialog2] = useState<any>(false);
  const [confirmProcessContent, setconfirmProcessContent] = useState<{
    title: string;
    content: string;
    onAction: any;
  }>({
    title: "",
    content: "",
    onAction: "",
  });

  useEffect(() => {
    useStore.setState({ profilePatientInformationTabIndex: 0 });
  }, []);

  return (
    <>
      <Head>
        <title>{patientData?.Person ? patientData?.Person?.first_name + " " + patientData?.Person?.last_name + " | نبض" : ""}</title>
      </Head>
      <Box
        sx={{
          height: "240px",
          width: "100%",
          backgroundColor: slate[100],
        }}
      >
        <Box
          className="sub-header"
          sx={{
            width: "100%",
            height: "240px",
            bgcolor: slate[100],
            //   marginTop: "-32px",
          }}
        >
          <Container
            maxWidth="xl"
            sx={{
              padding: { xs: "0 24px", lg: "0 32px", xl: "0 84px" },
              height: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Stack paddingTop={"16px"}>
              <Grid
                item
                xs={12}
              >
                <Grid
                  container
                  flexDirection={"row-reverse"}
                  justifyContent="space-between"
                  rowSpacing={3}
                >
                  <Grid
                    item
                    xs={"auto"}
                    sm="auto"
                  >
                    <Button
                      endIcon={<MoreHorizontal />}
                      variant="contained"
                      // onClick={() => setOpenAddOrderModal(true)}
                      sx={{
                        width: { xs: "auto", sm: "auto" },
                        borderRadius: "24px",
                        padding: "8px 10px",
                        minWidth: "auto",
                      }}
                      {...bindTrigger(popupState)}
                      // fullWidth
                    ></Button>
                  </Grid>

                  <Grid
                    item
                    xs={"auto"}
                    sm="auto"
                  >
                    <Button
                      endIcon={<ArrowRight />}
                      variant="contained"
                      onClick={() => route.push("/")}
                      sx={{
                        width: { xs: "auto", sm: "auto" },
                        borderRadius: "24px",
                        padding: "8px 16px",
                        minWidth: "auto",
                      }}
                      // fullWidth
                    >
                      {/* رجوع */}
                    </Button>
                  </Grid>
                </Grid>
                <Divider sx={{ borderBottomColor: slate[200], marginTop: "10px" }}></Divider>
              </Grid>
              <Stack
                direction="row"
                padding={"16px 0"}
                gap="24px"
              >
                <Box
                  sx={{
                    borderRadius: "4px",
                    outline: "2px solid " + slate[100],
                  }}
                >
                  <RAvatar
                    size="108px"
                    name={patientData?.Person?.first_name}
                    round={"4px"}
                    style={{
                      fontFamily: "Heebo",
                      outline: "4px solid " + primary[100],
                    }}
                    maxInitials={1}
                  ></RAvatar>
                </Box>
                <Stack
                  justifyContent={"space-between"}
                  gap="14px"
                >
                  <Typography
                    variant="sm"
                    color={slate[600]}
                  >
                    {patientData?.Person?.first_name + " " + patientData?.Person?.last_name}{" "}
                    <Typography
                      component={"span"}
                      variant="inherit"
                      color={slate[400]}
                      display={patientData?.Person?.age === "0" ? "none" : ""}
                    >{`( ${patientData?.Person?.age} سنة )`}</Typography>
                  </Typography>
                  <Stack
                    direction={"row"}
                    gap="24px"
                    height={"100%"}
                  >
                    <Stack
                      justifyContent={"space-between"}
                      height="100%"
                    >
                      <Stack gap={"4px"}>
                        <Stack
                          direction={"row"}
                          gap={"4px"}
                        >
                          <IdentificationIcon
                            color={slate[400]}
                            width={14}
                            height={14}
                          />
                          <Typography
                            variant="2xs"
                            color={slate[400]}
                          >
                            رقم الجواز
                          </Typography>
                        </Stack>
                        <Typography
                          variant="xs"
                          color={slate[500]}
                        >
                          {patientData?.Person?.ID_number || "?????????"}
                        </Typography>
                      </Stack>
                      <Stack gap={"4px"}>
                        <Stack
                          direction={"row"}
                          gap={"4px"}
                        >
                          <CalendarIcon
                            color={slate[400]}
                            width={14}
                            height={14}
                          />
                          <Typography
                            variant="2xs"
                            color={slate[400]}
                          >
                            تاريخ الإنشاء
                          </Typography>
                        </Stack>
                        <Typography
                          variant="xs"
                          color={slate[500]}
                          sx={{ direction: "rtl" }}
                        >
                          {dayjs(patientData?.Person?.createdAt).format("DD/MM/YYYY HH:mm")}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack
                      justifyContent={"space-between"}
                      height="100%"
                    >
                      <Stack gap={"4px"}>
                        <Stack
                          direction={"row"}
                          gap={"4px"}
                        >
                          <Phone
                            color={slate[400]}
                            width={12}
                            height={12}
                          />
                          <Typography
                            variant="2xs"
                            color={slate[400]}
                          >
                            رقم الهاتف
                          </Typography>
                        </Stack>
                        <Typography
                          variant="xs"
                          color={slate[500]}
                        >
                          {patientData?.Person?.phone || "?????????"}
                        </Typography>
                      </Stack>

                      <Stack gap={"4px"}>
                        <Stack direction={"row"}>
                          <Stack
                            direction={"row"}
                            gap={"4px"}
                            sx={{
                              // cursor: "pointer",
                              color: slate[400],
                              // borderBottom: "1px dashed " + slate[400],
                              // "&:hover": {
                              //   color: slate[500],
                              // },
                            }}
                            onClick={() => {
                              // setconfirmProcessDialog2(true);
                            }}
                          >
                            <History
                              color={slate[400]}
                              width={12}
                              height={12}
                            />
                            <Typography
                              variant="2xs"
                              color={"inherit"}
                            >
                              أخر تحديث
                            </Typography>
                          </Stack>
                        </Stack>
                        <Typography
                          variant="xs"
                          color={slate[500]}
                          sx={{ direction: "rtl" }}
                        >
                          {dayjs(patientData?.last_update).format("DD/MM/YYYY HH:mm")}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <Box
              // bgcolor="#FFF"
              sx={{
                width: { xs: "100%", md: "80%", lg: "50%" },
                // position: "absolute",
                // left: "25%",
                // bottom: "-2px",
                margin: "0 auto",
              }}
            >
              {/* @ts-ignore */}
              <Tabs3
                sx={{ flex: 1 }}
                value={profilePatientInformationTabIndex}
                //  @ts-ignore
                onChange={(_, newVal) => {
                  useStore.setState({ profilePatientInformationTabIndex: newVal });
                }}
                variant={"fullWidth"}
              >
                <Tab3 label="العلامات الحيوية" />
                <Tab3 label="التشخيص" />
                <Tab3 label="أمر الممرضة" />
                <Tab3 label="الروشيتا" />
                <Tab3 label="الصور" />
              </Tabs3>
              {/* <Divider></Divider> */}
            </Box>
          </Container>
        </Box>

        {/* Add Shipment */}
        <AddPatientModal
          open={OpenAddModal}
          onClose={() => setOpenAddModal(false)}
        ></AddPatientModal>
        {/* Edit Shipment */}
        <EditPatientModal
          open={OpenEditModal}
          onClose={() => setOpenEditModal(false)}
          dataInfo={patientData}
        ></EditPatientModal>

        <Menu {...bindMenu(popupState)}>
          <MenuItem
            onClick={() => {
              // props.onshowDetailsClick();
              // grabDataInfoHandler();
              setOpenEditModal(true);
              popupState.close();
            }}
          >
            <ListItemIcon>
              <Edit2
                size={18}
                strokeWidth={2}
              />
            </ListItemIcon>
            تعديل المستخدم
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
                      deletePatientId: patientData?.id,
                    },
                    refetchQueries: [Get_All_Patients],
                  }).then(() => {
                    route.push("/");
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
              <Trash2
                size={18}
                strokeWidth={2}
              />
            </ListItemIcon>
            حذف المستخدم
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
              <ButtinMui
                onClick={() => {
                  confirmProcessContent.onAction();
                }}
                autoFocus
              >
                تأكيد
              </ButtinMui>
              <ButtinMui
                onClick={() => {
                  setconfirmProcessDialog(false);
                }}
              >
                إلغاء
              </ButtinMui>
            </>
          }
        >
          <DialogContentText id="alert-dialog-description">{confirmProcessContent.content}</DialogContentText>
        </Dialog>

        {/* @ts-ignore */}
        <Dialog
          open={confirmProcessDialog2}
          onClose={() => setconfirmProcessDialog2(false)}
          title={""}
          footer={
            <>
              {/* <Button
                onClick={() => {
                  confirmProcessContent.onAction();
                }}
                autoFocus
              >
                تأكيد
              </Button> */}
              <Button
                onClick={() => {
                  setconfirmProcessDialog2(false);
                }}
              >
                إلغاء
              </Button>
            </>
          }
        >
          <DialogContentText id="alert-dialog-description">
            <Timeline
              sx={{
                direction: "ltr",
                [`& .${timelineContentClasses.root}`]: {
                  flex: 0.2,
                },
              }}
            >
              {patientData?.history?.map((item: any, i: number) => (
                <TimelineItem
                  key={i}
                  sx={{
                    "&:before": {
                      padding: 0,
                      flex: 0,
                    },
                  }}
                >
                  {/* <TimelineOppositeContent color="textSecondary">09:30 am</TimelineOppositeContent> */}
                  <TimelineSeparator>
                    <TimelineDot sx={{ backgroundColor: slate[100] }}>
                      <History
                        color={primary[300]}
                        width={15}
                        height={15}
                      />
                    </TimelineDot>
                    <TimelineConnector
                      sx={{
                        "background-color": slate[300],
                      }}
                    />
                  </TimelineSeparator>
                  <TimelineContent sx={{ flex: "1 !important", marginTop: "3px" }}>
                    <Stack width="100%">
                      <Typography
                        variant="sm"
                        color={slate[500]}
                        sx={{ flex: 1 }}
                      >
                        {i == 0 ? "أخر تحديث:" : "تم التحديث في:"}
                      </Typography>
                      <Typography
                        variant="xs"
                        color={primary[400]}
                        sx={{ flex: 1 }}
                      >
                        {dayjs(item.createdAt, "DD-MM-YYYY HH:mm:ss").format("DD-MM-YYYY HH:mm")}
                      </Typography>
                    </Stack>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </DialogContentText>
        </Dialog>
      </Box>
    </>
  );
};

export default ProfilePatientInformationSubPage;
