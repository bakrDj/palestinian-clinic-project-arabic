import { alpha, Box, Collapse, Container, Divider, Grid, IconButton, ListItemIcon, MenuItem, Skeleton, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { FileText, Minus, MoreHorizontal, Printer, Sheet } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import { CornerUpLeft, Play, Plus, Repeat, Slash, XOctagon } from "react-feather";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";

import InfiniteScroll from "react-infinite-scroller";
import PuffLoader from "react-spinners/PuffLoader";
import { useDebouncedCallback } from "use-debounce";
import Button from "../components/Button";
import DetailsDrawer from "../components/Drawer/DetailsDrawer";
import { ContentRefContext } from "../components/generated/Content";
import PatientCard from "../components/generated/PatientCard";
import EmptyStat from "../components/generated/EmptyStat";
import AddPatientModal from "../components/Modal/AddPatientModal";
import EditPatientModal from "../components/Modal/EditPatientModal";
import RequestModal from "../components/Modal/RequestModal";
import ShipPickUpModal from "../components/Modal/ShipPickUpModal";
import Tab2 from "../components/Tabs/Tab2";
import Tabs2 from "../components/Tabs/Tabs2";
import { useGetOneShipments } from "../graphql/hooks/shipments";
import useGetAllClientShipments from "../graphql/hooks/shipments/useGetAllClientShipments";
import useStore from "../store/useStore";
import theme, { slate } from "../styles/theme";
import algerian_provinces from "../utilities/data/api/yaman_provinces.json";
import { fuzzySearchMultipleWords, searchHelper, sortByRecentTime } from "../utilities/helpers/filters";
import Menu from "../components/Menu/Menu";
import { isMobile, isTablet } from "react-device-detect";
import PullToRefresh from "react-simple-pull-to-refresh";
import { PulseLoader } from "react-spinners";
import ContainerPickDialog from "../components/Dialog/ContainerPickDialog";
import yaman_provinces from "../utilities/data/api/yaman_provinces.json";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import Search from "../components/Input/Search";
import { useGetAllPatients } from "../graphql/hooks/patient";
import { matchSorter } from "match-sorter";

interface Props {}

export default function Home({}: Props): ReactElement {
  const popupState = usePopupState({ variant: "popover", popupId: "multiSelectMenu" });
  const searchValue = useStore((state: any) => state.searchValue);
  const userData = useStore((state: any) => state.userData);
  // const openShipScannerModal = useStore((state: any) => state.openShipScannerModal);
  const [openShowDetailDrawer, setOpenShowDetailDrawer] = React.useState(false);

  const [OpenEditPatientModal, setOpenEditPatientModal] = React.useState(false);
  const [CardDataInfo, setCardDataInfo] = React.useState(null);

  const [OpenAddModal, setOpenAddModal] = React.useState(false);
  // const [openEditOrderModal, setOpenEditOrderModal] = React.useState(false);
  // const [openRequestModal, setOpenRequestModal] = React.useState(false);
  const [isReceiptFormatCollapsed, setIsReceiptFormatCollapsed] = React.useState(false);
  // const [oneShipmentInfo, setOneShipmentInfo] = React.useState<any>({});
  const [multiSelectionSelectedShipments, setMultiSelectionSelectedShipments] = React.useState<any>([]);

  const [requestStatus, setRequestStatus] = React.useState<number | undefined>(undefined);
  const [tab2value, setTab2value] = React.useState(0);
  const [allPatientsData, setAllPatientsData] = React.useState<object[]>([]);
  const [renderedPatientsData, setRenderedPatientsData] = React.useState<object[]>([]);

  // context
  const contentRef = useContext(ContentRefContext);

  // handlers
  const handleCloseShowDetailDrawer = () => setOpenShowDetailDrawer(false);
  const tabs2handler = (event: React.SyntheticEvent, newValue: number) => {
    setTab2value(newValue as any);
  };

  // get all shipments
  let [getPatientsData, getPatientsLoading, refetch] = useGetAllPatients({});
  console.log("🚀 ~ Home ~ getPatientsData:", getPatientsData);

  const [loadingPage, setLoadingPage] = React.useState<boolean>(getPatientsLoading);

  // get one shipments (drawer use)
  // let [GetOneShipment, { data: oneShipmentdata }] = useGetOneShipments();
  // oneShipmentdata = oneShipmentdata?.box;

  // debounce
  const setLoadingPageDebounced = useDebouncedCallback((value) => {
    if (!value) setLoadingPage(false);
  }, 700);

  // filtering
  let filteredData: object[] = [];
  filteredData = fuzzySearchMultipleWords(allPatientsData, searchValue, [
    // keys: [
    "Person.first_name",
    "Person.last_name",
    "Person.ID_number",
    "Person.phone",
    "Person.address",
    "Person.email",
    // ],
  ]);
  // filteredData = matchSorter(allShipmentsData, searchValue, {
  //   keys: [
  //     "person.first_name",
  //     "person.last_name",
  //     "person.ID_number",
  //     "person.phone",
  //     "person.address",
  //     "person.email",
  //   ],
  // });
  filteredData = sortByRecentTime(["last_update"], filteredData);

  let allPatients = filteredData;
  // let notShippedShipments = filteredData.filter(
  //   (v: any) => ![4, 5].includes(v.lastTrace?.[0]?.status)
  // );
  // let shippedShipments = filteredData.filter((v: any) => [4].includes(v.lastTrace?.[0]?.status));
  // let arrivedShipment = filteredData.filter((v: any) => [5].includes(v.lastTrace?.[0]?.status));

  // infinite scrolling
  const [hasMore, setHasMore] = useState(true);
  const [loadingDataSize, setLoadingDataSize] = useState(40);
  const [patientDataEnqueued, setPatientDataEnqueued] = useState<object[]>([]);
  const contentScrollParentRef = useStore((state: any) => state.contentScrollParentRef);
  const [searchValueNotDebounced, setSearchValueNotDebounced] = useState("");

  useEffect(() => {
    setPatientDataEnqueued(() => [...renderedPatientsData.slice(0, loadingDataSize)]);

    if (renderedPatientsData.length < loadingDataSize) setHasMore(false);
    else setHasMore(true);
  }, [renderedPatientsData, searchValue]);

  const moreDataHendler = () => {
    let currentChunk = renderedPatientsData.slice(0, patientDataEnqueued.length + loadingDataSize);

    setTimeout(() => {
      setPatientDataEnqueued([...currentChunk]);

      if (currentChunk.length && renderedPatientsData.length <= currentChunk.length) {
        setHasMore(false);
        return;
      }
    }, 800);
  };

  // watchers
  useEffect(() => {
    setAllPatientsData(() => [...getPatientsData]);
  }, [getPatientsData]);

  useEffect(() => {
    setRenderedPatientsData(() => [...allPatients]);
  }, [allPatientsData, searchValue]);

  useEffect(() => {
    useStore.setState({ isLayoutDisabled: false });
    useStore.setState({ profilePatientInformationTabIndex: null });
  }, []);

  let debounced = useDebouncedCallback((value) => {
    useStore.setState({ searchValue: value });
  }, 400);

  // if (loadingPage) {
  //   setLoadingPageDebounced(getPatientsLoading);
  //   return (
  //     <>
  //       <Head>
  //         <title>الصفحة الرئيسية | نبض</title>
  //       </Head>
  //       <Container
  //         maxWidth="xl"
  //         sx={{
  //           padding: { xs: "0 24px", lg: "0 32px", xl: "0 84px" },
  //           height: "100%",
  //         }}
  //       >
  //         <Grid
  //           container
  //           spacing={3}
  //           // height={"100%"}
  //           // xs={11}
  //           // height="100%"
  //         >
  //           <Grid item xs={12}>
  //             <Grid container>
  //               <Grid item xs={10}>
  //                 <Stack direction={"row"} spacing={1}>
  //                   <Skeleton
  //                     variant="circular"
  //                     sx={{
  //                       width: "76px",
  //                       height: "36px",
  //                       borderRadius: "16px",
  //                       bgcolor: "rgba(0, 0, 0, 0.05)",
  //                     }}
  //                   ></Skeleton>
  //                   <Skeleton
  //                     variant="circular"
  //                     sx={{
  //                       width: "94px",
  //                       height: "36px",
  //                       borderRadius: "16px",
  //                       bgcolor: "rgba(0, 0, 0, 0.05)",
  //                     }}
  //                   ></Skeleton>
  //                   <Skeleton
  //                     variant="circular"
  //                     sx={{
  //                       width: "94px",
  //                       height: "36px",
  //                       borderRadius: "16px",
  //                       bgcolor: "rgba(0, 0, 0, 0.05)",
  //                     }}
  //                   ></Skeleton>
  //                 </Stack>
  //               </Grid>
  //               <Grid item xs={2} justifyContent="end">
  //                 <Skeleton
  //                   variant="rectangular"
  //                   sx={{
  //                     width: "120px",
  //                     height: "38px",
  //                     borderRadius: "4px",
  //                     marginLeft: "auto",
  //                     bgcolor: "rgba(0, 0, 0, 0.05)",
  //                   }}
  //                 ></Skeleton>
  //               </Grid>
  //             </Grid>
  //           </Grid>
  //           <Grid item xs={12}>
  //             <Grid container spacing={3}>
  //               {Array(8)
  //                 .fill(null)
  //                 .map((_, i: number) => (
  //                   <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
  //                     <Skeleton
  //                       variant="rectangular"
  //                       sx={{
  //                         width: "100%",
  //                         height: "152px",
  //                         borderRadius: "4px",
  //                         bgcolor: "rgba(0, 0, 0, 0.05)",
  //                         // marginLeft: "auto",
  //                       }}
  //                     ></Skeleton>
  //                   </Grid>
  //                 ))}
  //             </Grid>
  //           </Grid>
  //         </Grid>
  //       </Container>
  //     </>
  //   );
  // }

  return (
    <>
      <Head>
        <title>الصفحة الرئيسية | نبض</title>
      </Head>
      <Box
        bgcolor={alpha(theme.palette.primary.main, 0.2)}
        marginTop="-32px"
      >
        <PullToRefresh
          isPullable={isMobile || isTablet}
          pullDownThreshold={85}
          maxPullDownDistance={105}
          resistance={4}
          refreshingContent={
            <Box
              className="loader"
              key={0}
              sx={{
                width: "100%",
                height: "80px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px 0",
              }}
            >
              <PulseLoader
                size={10}
                speedMultiplier={0.7}
                color={theme.palette.primary.main}
              ></PulseLoader>
            </Box>
          }
          pullingContent={
            <Box
              className="loader"
              key={0}
              sx={{
                width: "100%",
                height: "80px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px 0",
              }}
            >
              <PulseLoader
                size={10}
                speedMultiplier={0}
                color={theme.palette.primary.main}
              ></PulseLoader>
            </Box>
          }
          onRefresh={async () => {
            // return location.reload();
            await refetch();
            await new Promise((resolve) => setTimeout(resolve, 700));
            // await arbitraryDebounce(true);
          }}
        >
          <Container
            maxWidth="xl"
            sx={{
              padding: { xs: "0 24px", lg: "0 32px", xl: "0 84px" },
              paddingTop: "32px !important",
              height: "100%",
              // @ts-ignore
              backgroundColor: theme.palette.background.body,
            }}
          >
            <Box
              className="q-container"
              height={"100%"}
            >
              <Grid
                container
                spacing={3}
                height={renderedPatientsData.length == 0 ? "100%" : ""}
                // height="100%"
              >
                {/* pull on refresh */}

                <Grid
                  item
                  xs={12}
                >
                  <Grid
                    container
                    flexDirection={"row-reverse"}
                    justifyContent="space-between"
                    rowSpacing={2}
                  >
                    <Grid
                      item
                      xs={12}
                      sm="auto"
                    >
                      <Button
                        endIcon={<UserPlusIcon />}
                        variant="contained"
                        onClick={() => setOpenAddModal(true)}
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                        // fullWidth
                      >
                        إضافة مريض
                      </Button>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm="auto"
                    >
                      {/* @ts-ignore */}
                      <Search
                        placeholder="بحث"
                        value={searchValueNotDebounced}
                        autoComplete="off"
                        onChange={(e: any) => {
                          debounced(e.target.value);
                          setSearchValueNotDebounced(e.target.value);
                        }}
                        onResetClick={() => {
                          useStore.setState({ searchValue: "" });
                          setSearchValueNotDebounced("");
                        }}
                        sx={{
                          // display: { xs: "none", sm: "flex" },
                          width: { xs: "100%", md: "100%" },
                        }}
                      ></Search>
                    </Grid>
                  </Grid>
                  <Divider sx={{ borderBottomColor: slate[200], marginTop: "10px" }}></Divider>
                </Grid>

                <Grid
                  item
                  xs={12}
                  paddingBottom="32px"
                >
                  <InfiniteScroll
                    pageStart={0}
                    loadMore={moreDataHendler}
                    hasMore={hasMore}
                    useWindow={false}
                    initialLoad={false}
                    getScrollParent={() => contentRef?.current}
                    // @ts-ignore
                    loader={
                      patientDataEnqueued.length && (
                        <Box
                          className="loader"
                          key={0}
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            padding: "20px 0",
                          }}
                        >
                          <PuffLoader
                            size={38}
                            color={theme.palette.primary.main}
                          ></PuffLoader>
                        </Box>
                      )
                    }
                  >
                    <Grid
                      container
                      spacing={3}
                    >
                      {patientDataEnqueued.length != 0 ? (
                        patientDataEnqueued?.map((patient: any, index: any) => {
                          return (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={4}
                              lg={3}
                              key={index}
                            >
                              <PatientCard
                                dataInfo={patient}
                                setCardDataInfo={setCardDataInfo}
                                setOpenEditPatientModal={setOpenEditPatientModal}
                                // setRequestStatus={setRequestStatus}
                                // onRequestClick={setOpenRequestModal}
                                // setOneShipmentInfo={setOneShipmentInfo}
                                // onshowDetailsClick={() =>
                                //   GetOneShipment({
                                //     variables: {
                                //       boxId: shipment.id,
                                //     },
                                //   })
                                // }
                                // onEditShipmentModalClick={() => {
                                //   GetOneShipment({
                                //     variables: {
                                //       boxId: shipment.id,
                                //     },
                                //   }).then(() => {
                                //     setOpenEditOrderModal(true);
                                //   });
                                // }}
                                // isSelecting={multiSelectionSelectedShipments.length > 0}
                                // isSelected={
                                //   multiSelectionSelectedShipments.findIndex(
                                //     (v: any) => v.id == shipment.id
                                //   ) > -1
                                // }
                                // setMultiSelectionSelectedShipments={
                                //   setMultiSelectionSelectedShipments
                                // }
                              ></PatientCard>
                            </Grid>
                          );
                        })
                      ) : (
                        <Grid
                          item
                          xs={12}
                        >
                          <EmptyStat title="لا يوجد مرضى"></EmptyStat>
                        </Grid>
                      )}
                    </Grid>
                  </InfiniteScroll>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </PullToRefresh>
      </Box>
      {/* Add Shipment */}
      <AddPatientModal
        open={OpenAddModal}
        onClose={() => setOpenAddModal(false)}
      ></AddPatientModal>
      {/* Edit Shipment */}
      <EditPatientModal
        open={OpenEditPatientModal}
        onClose={() => setOpenEditPatientModal(false)}
        dataInfo={CardDataInfo}
      ></EditPatientModal>

      <Menu
        {...bindMenu(popupState)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuItem
          onClick={() => {
            setIsReceiptFormatCollapsed(!isReceiptFormatCollapsed);
            // shipmentRestInfoHandler();
            // setSelected(true);
            // props.setMultiSelectionSelectedShipments([props.shipmentRestInfo]);
            // popupState.close();
          }}
        >
          <ListItemIcon>
            <img
              src="/receipt.svg"
              width={17}
              height={17}
            />
            {/* <BoxSelect size={18} strokeWidth={2} /> */}
          </ListItemIcon>
          <Box marginLeft={"-8px"}>إنشاء وصل إستلام</Box>
        </MenuItem>
        <Collapse
          in={isReceiptFormatCollapsed}
          timeout="auto"
          unmountOnExit
        >
          {/* <Menu> */}
          <Link
            href={{
              pathname: "/printer",
              query: {
                shipmentID: multiSelectionSelectedShipments.map((v: any) => v.id),
                receipt: true,
                format: "pdf",
              },
            }}
            passHref
          >
            <a target="_blank">
              <MenuItem
                sx={{ backgroundColor: "#F2F1F5" }}
                onClick={() => {
                  // shipmentRestInfoHandler();
                  // setSelected(true);
                  // props.setMultiSelectionSelectedShipments([props.shipmentRestInfo]);
                  popupState.close();
                }}
              >
                <ListItemIcon sx={{ marginLeft: "2px" }}>
                  <FileText
                    size={15}
                    strokeWidth={2}
                  />
                </ListItemIcon>
                <Box
                  marginLeft={"-8px"}
                  fontSize="12px"
                >
                  بصيغة PDF
                </Box>
              </MenuItem>
            </a>
          </Link>
          <Link
            href={{
              pathname: "/printer",
              query: {
                shipmentID: multiSelectionSelectedShipments.map((v: any) => v.id),
                receipt: true,
                format: "excel",
              },
            }}
            passHref
          >
            <a target="_blank">
              <MenuItem
                sx={{ backgroundColor: "#F2F1F5" }}
                onClick={() => {
                  // shipmentRestInfoHandler();
                  // setSelected(true);
                  // props.setMultiSelectionSelectedShipments([props.shipmentRestInfo]);
                  popupState.close();
                }}
              >
                <ListItemIcon sx={{ marginLeft: "2px" }}>
                  <Sheet
                    size={15}
                    strokeWidth={2}
                  />
                </ListItemIcon>
                <Box
                  marginLeft={"-8px"}
                  fontSize="12px"
                >
                  بصيغة Excel
                </Box>
              </MenuItem>
            </a>
          </Link>
          {/* </Menu> */}
        </Collapse>
      </Menu>
    </>
  );
}
