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
} from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import { AlertCircle, ArrowLeftRight, ListMinus, Edit2 } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { MoreHorizontal, Plus, Trash2 } from "react-feather";
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

const Album = React.forwardRef(function Album(props: Props, ref) {
  const [expanded, setExpanded] = React.useState("panel1");
  const [selectedZone, setSelectedZone] = React.useState(0);
  const [selectedTransaction, setSelectedTransaction] = React.useState({});
  const [editTransactionDialog, setEditTransactionDialog] = React.useState(false);
  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });
  const [CardDataInfo, setCardDataInfo] = React.useState<any>(null);

  let route = useRouter();

  // const [getZoneTransactionLazy, { loading: loadingTransaction, data: zoneTransactionsData }] =
  //     useGetZoneTransaction();

  let [getVitalSignLazy, { data: dataRequested }] = useGetAlbum({
    id: route.query?.id as any,
  });
  console.log("🚀 ~ file: Diagnosis.tsx ~ line 51 ~ Diagnosis ~ dataRequested", dataRequested);
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

  let [deleteCardMutation] = useDeleteAlbum();

  const accordionExpandHandler = (panel: any) => (event: any, newExpanded: any) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    if (props.tabvalue == 4) {
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
      <Viewer
        visible={visibleImage}
        onClose={() => {
          setVisibleImage(false);
        }}
        images={images?.map((pic: any) => ({
          src: `https://clinic-api.qafilaty.com/images/${pic?.name}`,
          alt: "",
        }))}
        zIndex={9999}
        noImgDetails
        rotatable={false}
        scalable={false}
      />
      <Grid container width={"100%"} spacing={1.5}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Box
            onClick={() => setOpenAddModal(true)}
            sx={{
              height: { xs: "72px", sm: "336px" },
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

        {sortByRecentTime(["createdAt"], dataRequested?.allAlbum)?.map((item: any, i: number) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
            <Box
              sx={{
                height: "336px",
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
                  <Box
                    onClick={() => {
                      setImages(item?.pictures);
                      item?.pictures?.[0] && setVisibleImage(true);
                    }}
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "128px",
                      cursor: "pointer",
                      ":after": {
                        top: 0,
                        left: 0,
                        position: "absolute",
                        width: "100%",
                        height: "128px",
                        backgroundColor: "#FFF",
                        opacity: "0",
                        zIndex: "99999",
                        content: "''",
                      },
                      "&:hover .eyeIcon": {
                        display: "block",
                      },
                      "&:hover:after": {
                        opacity: "0.1",
                      },
                    }}
                  >
                    <Box
                      className="eyeIcon"
                      component={"img"}
                      src="/Eye.png"
                      sx={{
                        position: "absolute",
                        bottom: "12px",
                        right: "12px",
                        display: item?.pictures?.[0] ? "none" : "none !important",
                      }}
                    />
                    <Box
                      component={item?.pictures?.[0] ? "img" : "div"}
                      src={`https://clinic-api.qafilaty.com/images/${item?.pictures?.[0]?.name}`}
                      height={128}
                      sx={{
                        borderRadius: "4px",
                        width: "100%",
                        backgroundColor: item?.pictures?.[0] ? slate[50] : slate[200],
                      }}
                      style={{ objectFit: "cover" }}
                    />
                  </Box>

                  <Stack justifyContent={"space-between"} gap="10px" height="100%">
                    <Stack gap="12px">
                      <Stack gap="4px">
                        <Typography variant="2xs" color={secondary[400]}>
                          {item?.pictures?.length} תְמוּנָה
                        </Typography>
                        <Typography variant="xs" color={slate[500]}>
                          {item?.title}
                        </Typography>
                      </Stack>
                      <Typography
                        component={"span"}
                        variant="2xs"
                        color={slate[400]}
                        lineHeight="142%"
                      >
                        {item?.description.length < 190
                          ? !item?.description
                            ? "(ללא הערה)"
                            : item?.description
                          : `${item?.description} ...`}
                        <Typography
                          display={item?.description.length < 190 ? "none" : "inline"}
                          component={"span"}
                          variant="2xs"
                          color={blue[400]}
                          sx={{ cursor: "pointer", ":hover": { textDecoration: "underline" } }}
                          onClick={() => {
                            setconfirmProcessDialog(true);
                            setconfirmProcessContent({
                              content: item?.description,
                              onAction: false,
                            });
                          }}
                        >
                          להראות יותר
                        </Typography>
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>

      <AddAlbumModal
        open={OpenAddModal}
        onClose={() => setOpenAddModal(false)}
        id={route.query?.id as any}
      ></AddAlbumModal>

      <EditAlbumModal
        open={OpenEditModal}
        onClose={() => setOpenEditModal(false)}
        id={route.query?.id as any}
        dataInfo={CardDataInfo}
      ></EditAlbumModal>

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
          تعديل الصور
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
                    deleteAlbumId: CardDataInfo?.id,
                  },
                  refetchQueries: [All_Album],
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
          حذف الصور
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

export default Album;
