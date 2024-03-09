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
import Button from "../../components/Button";
import DetailsDrawer from "../../components/Drawer/DetailsDrawer";
import { ContentRefContext } from "../../components/generated/Content";
import DeliveryCard from "../../components/generated/PatientCard";
import EmptyStat from "../../components/generated/EmptyStat";
// import AddShipmentModal from "../../components/Modal/AddPatientModal";
// import EditShipmentModal from "../../components/Modal/EditShipmentModal";
import RequestModal from "../../components/Modal/RequestModal";
import ShipPickUpModal from "../../components/Modal/ShipPickUpModal";
import Tab2 from "../../components/Tabs/Tab2";
import Tabs2 from "../../components/Tabs/Tabs2";
import { useGetOneShipments } from "../../graphql/hooks/shipments";
import useGetAllClientShipments from "../../graphql/hooks/shipments/useGetAllClientShipments";
import useStore from "../../store/useStore";
import theme, { slate } from "../../styles/theme";
import algerian_provinces from "../../utilities/data/api/yaman_provinces.json";
import { searchHelper, sortByRecentTime } from "../../utilities/helpers/filters";
import Menu from "../../components/Menu/Menu";
import { isMobile, isTablet } from "react-device-detect";
import PullToRefresh from "react-simple-pull-to-refresh";
import { PulseLoader } from "react-spinners";
import ContainerPickDialog from "../../components/Dialog/ContainerPickDialog";
import yaman_provinces from "../../utilities/data/api/yaman_provinces.json";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import Search from "../../components/Input/Search";
import SwipeableViews from "react-swipeable-views";
import { VitalSign } from "../../subPages/Profile";
import Diagnosis from "../../subPages/Profile/Diagnosis";
import Album from "../../subPages/Profile/Album";
import Prescription from "../../subPages/Profile/Prescription";
import NurseDuties from "../../subPages/Profile/NurseDuties";

interface Props {}

export default function ProfilePatient({}: Props): ReactElement {
  const popupState = usePopupState({ variant: "popover", popupId: "multiSelectMenu" });
  const searchValue = useStore((state: any) => state.searchValue);
  const userData = useStore((state: any) => state.userData);
  const profilePatientInformationTabIndex = useStore((state: any) => state.profilePatientInformationTabIndex);
  const openShipScannerModal = useStore((state: any) => state.openShipScannerModal);
  const [openShowDetailDrawer, setOpenShowDetailDrawer] = React.useState(false);
  const [openAddOrderModal, setOpenAddOrderModal] = React.useState(false);
  const [openEditOrderModal, setOpenEditOrderModal] = React.useState(false);
  const [openRequestModal, setOpenRequestModal] = React.useState(false);
  const [isReceiptFormatCollapsed, setIsReceiptFormatCollapsed] = React.useState(false);
  const [oneShipmentInfo, setOneShipmentInfo] = React.useState<any>({});
  const [multiSelectionSelectedShipments, setMultiSelectionSelectedShipments] = React.useState<any>([]);
  const [tabvalue, setTabvalue] = React.useState<number | string>(0);

  const [requestStatus, setRequestStatus] = React.useState<number | undefined>(undefined);
  const [tab2value, setTab2value] = React.useState(0);
  const [allShipmentsData, setAllShipmentsData] = React.useState<object[]>([]);
  const [renderedShipmentsData, setRenderedShipmentsData] = React.useState<object[]>([]);

  // context
  const contentRef = useContext(ContentRefContext);

  // handlers
  const handleCloseShowDetailDrawer = () => setOpenShowDetailDrawer(false);
  const tabs2handler = (event: React.SyntheticEvent, newValue: number) => {
    setTab2value(newValue as any);
  };

  // // get all shipments
  // let [getShipmentsData, getShipmentsLoading, refetch] = useGetAllClientShipments({
  //   // stock_id: userData?.stock_accesses?.[0]?.id_stock,
  //   client_id: userData?.id,
  // });

  const [loadingPage, setLoadingPage] = React.useState<boolean>(false);

  // get one shipments (drawer use)
  let [GetOneShipment, { data: oneShipmentdata }] = useGetOneShipments();
  oneShipmentdata = oneShipmentdata?.box;

  // debounce
  const setLoadingPageDebounced = useDebouncedCallback((value) => {
    if (!value) setLoadingPage(false);
  }, 700);

  // filtering
  let filteredData: object[] = [];
  filteredData = sortByRecentTime(["createdAt"], allShipmentsData);
  filteredData = searchHelper(searchValue?.toLowerCase(), filteredData);

  let allShipments = filteredData;
  let notShippedShipments = filteredData.filter((v: any) => ![4, 5].includes(v.lastTrace?.[0]?.status));
  let shippedShipments = filteredData.filter((v: any) => [4].includes(v.lastTrace?.[0]?.status));
  let arrivedShipment = filteredData.filter((v: any) => [5].includes(v.lastTrace?.[0]?.status));

  // infinite scrolling
  const [hasMore, setHasMore] = useState(true);
  const [loadingDataSize, setLoadingDataSize] = useState(40);
  const [shipmentDataEnqueued, setShipmentDataEnqueued] = useState<object[]>([]);
  const contentScrollParentRef = useStore((state: any) => state.contentScrollParentRef);

  useEffect(() => {
    setShipmentDataEnqueued(() => [...renderedShipmentsData.slice(0, loadingDataSize)]);

    if (renderedShipmentsData.length < loadingDataSize) setHasMore(false);
    else setHasMore(true);
  }, [renderedShipmentsData, searchValue]);

  const moreDataHendler = () => {
    let currentChunk = renderedShipmentsData.slice(0, shipmentDataEnqueued.length + loadingDataSize);

    setTimeout(() => {
      setShipmentDataEnqueued([...currentChunk]);

      if (currentChunk.length && renderedShipmentsData.length <= currentChunk.length) {
        setHasMore(false);
        return;
      }
    }, 800);
  };

  // // watchers
  // useEffect(() => {
  //   setAllShipmentsData(() => [...getShipmentsData]);
  // }, [getShipmentsData]);

  useEffect(() => {
    setRenderedShipmentsData(() => [...allShipments]);
  }, [allShipmentsData, searchValue]);

  useEffect(() => {
    useStore.setState({ isLayoutDisabled: false });
    useStore.setState({ profilePatientInformationTabIndex: 0 });
  }, []);

  // if (loadingPage) {
  //   setLoadingPageDebounced(getShipmentsLoading);
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
      <Box
        bgcolor={alpha(theme.palette.primary.main, 0.2)}
        marginTop="-32px"
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
              height={renderedShipmentsData.length == 0 ? "100%" : ""}
              // height="100%"
            >
              <Grid
                item
                xs
              >
                <SwipeableViews
                  animateTransitions={false}
                  style={{ direction: "rtl" }}
                  width={"100%"}
                  index={profilePatientInformationTabIndex as any}
                  onChangeIndex={(index) => {
                    useStore.setState({ profilePatientInformationTabIndex: index });
                  }}
                  containerStyle={{ willChange: "unset" }}
                >
                  <VitalSign
                    tabvalue={profilePatientInformationTabIndex}
                    // allZonesQuery={allZonesQuery}
                  ></VitalSign>
                  <Diagnosis
                    tabvalue={profilePatientInformationTabIndex}
                    // allZonesQuery={allZonesQuery}
                  ></Diagnosis>
                  <NurseDuties tabvalue={profilePatientInformationTabIndex}></NurseDuties>
                  <Prescription
                    tabvalue={profilePatientInformationTabIndex}
                    // allZonesQuery={allZonesQuery}
                  ></Prescription>
                  <Album
                    tabvalue={profilePatientInformationTabIndex}
                    // allZonesQuery={allZonesQuery}
                  ></Album>
                </SwipeableViews>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}
