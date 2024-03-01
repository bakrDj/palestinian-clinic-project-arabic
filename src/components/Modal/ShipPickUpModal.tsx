// import Quagga from "@ericblade/quagga2";
import {
  Chip as MuiChip,
  IconButton,
  Popover,
  Stack,
  Typography,
  alpha,
  Tabs,
  Divider,
} from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import produce from "immer";
import { AlertTriangle, ClipboardList, HelpCircle, Plus, Redo, Redo2 } from "lucide-react";
import { bindPopover, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import { useEffect, useState } from "react";
import { Camera, Check, X } from "react-feather";
import SwipeableViews from "react-swipeable-views";
import {
  useCreateChangeMultiStatus,
  useGetAllPickupShipments,
  useUpdatePickupGroup,
} from "../../graphql/hooks/shipments";
import { LIST_PICKUP_CLIENT } from "../../graphql/hooks/shipments/useGetAllPickupShipments";
// import useCreateChangeMultiStatus from "../../graphql/hooks/shipments/useCreateChangeMultiStatus";
import useStore from "../../store/useStore";
import theme from "../../styles/theme";
import traking_status from "../../utilities/data/tracking_status";
import { sortByRecentTime } from "../../utilities/helpers/filters";
import SocketClient from "../../utilities/lib/socket";
import Button from "../Button";
import Chip from "../Chip/Chip";
import { PickUpPlanPopOver } from "../generated/PickUpPlanPopOver";
import Tab from "../Tabs/Tab";
// import Scanner from "../Scanner/Scanner";
import Modal, { Props as ModalProps } from "./Modal";

interface Props extends ModalProps {
  open: boolean;
  // onClose?: (callback?: () => any) => void;
  onClose?: () => void;
  requestStatus?: number;
  oneShipmentInfo?: string;
  allBoxesInPrimaryStatus?: any;
}

const ShipPickUpModal = (props: Props) => {
  const [updatePickUpGroupMutation] = useUpdatePickupGroup();
  const [createRequestMutation, { data: requestData }] = useCreateChangeMultiStatus();
  const [getAllPickupsShipmentsLazy, { data: pickUpShipmentData, loading: pickUpShipmentLoading }] =
    useGetAllPickupShipments();
  let pickUpShipmentDataSorted: any = sortByRecentTime(
    ["createdAt"],
    pickUpShipmentData?.listPickUpClient
  );
  let userData = useStore((state: any) => state.userData);
  let scanShipmentResult: any = useStore((state: any) => state.scanShipmentResult);
  const [tabvalue, setTabvalue] = useState<number | string>(0);

  const [isScanning, setIsScanning] = useState(false);
  const [scanCode, setScanCode] = useState(false);
  const popupPickUpPlanState = usePopupState({
    variant: "popover",
    popupId: "PickUpPlanPopover",
  });
  const [scannedShipments, setScannedShipments] = useState<any>([]);

  let [submitLoading, setSubmitLoading] = useState<boolean>(false);

  // const statusChangable = [2, 4, 6, 15, 20, 29, 32];
  // const statusChangable = [1, 2, 4, 6, 15, 20, 29, 32, 11];

  const submitHandler = async () => {
    setSubmitLoading(true);

    let res = scannedShipments.map((shipment: any, i: number) => {
      return {
        id_box: shipment?.id,
        status: 2,
      };
    });

    let queryBasedOnLastRequestStatusPromise = new Promise((resolve, reject) => {
      try {
        if (pickUpShipmentDataSorted?.[0]?.status == "2") {
          resolve(
            updatePickUpGroupMutation({
              variables: {
                codePickUp: pickUpShipmentDataSorted?.[0]?.code,
                content: {
                  boxTrace: res,
                  id_person: userData?.person?.id,
                  id_stock: userData?.person?.list_stock_accesses?.stock.id,
                  id_company: userData?.person?.company?.id,
                  note: "",
                },
              },
              update: (cache, { data: { addBoxToPickUpGroup } }) => {
                cache.modify({
                  id: cache.identify(pickUpShipmentDataSorted?.[0]),
                  fields: {
                    numberBox: (old) => old + res.length,
                  },
                });

                cache.modify({
                  fields: {
                    boxClient(existedBoxes = [], { readField }) {
                      let newdata = produce((existedBoxes: any, draft: any) => {
                        for (let i = 0; i < res.length; i++) {
                          let index = existedBoxes.findIndex(
                            (item: any) => item.id === res[i].id_box
                          );
                          draft[index].lastTrace[0].status = res[i].status;
                        }
                        return draft;
                      });

                      return newdata;
                    },
                  },
                });
              },
            })
          );
        } else {
          resolve(
            createRequestMutation({
              variables: {
                content: {
                  boxTrace: res,
                  id_person: userData?.person?.id,
                  id_stock: userData?.person?.list_stock_accesses?.stock.id,
                  id_company: userData?.person?.company?.id,
                  note: "",
                },
              },
              refetchQueries: [LIST_PICKUP_CLIENT],
            })
          );
        }
      } catch (error) {
        reject(error);
      }
    });

    await queryBasedOnLastRequestStatusPromise
      .then((res) => {
        setSubmitLoading(false);
        // setTabvalue(1);
        // props.allBoxesInPrimaryStatus = props.allBoxesInPrimaryStatus?.filter(
        //   (i: any) => !scannedShipments.filter((y: any) => y.id === i.id).length
        // ); // One Way
        // props.allBoxesInPrimaryStatus = props.allBoxesInPrimaryStatus?.filter((box:any) => )
        closeHandler();
      })
      .catch((e) => {
        setSubmitLoading(false);
        closeHandler();
      });
  };

  const closeHandler = () => {
    // setStopScanner(true);
    // Quagga.pause();
    // Quagga.offProcessed();
    // Quagga.offDetected();
    // Quagga.stop();
    typeof props.onClose == "function" && props.onClose();
    // document.querySelector("#camera").innerHTML = "";
  };

  useEffect(() => {
    if (scanShipmentResult) {
      let res: any = { ...scanShipmentResult, code: scanCode };
      setScannedShipments((prev: any) => [...prev, res]);
    }
  }, [scanShipmentResult]);

  useEffect(() => {
    if (props.open) {
      setScannedShipments(props.allBoxesInPrimaryStatus);
      setIsScanning(false);
      setSubmitLoading(false);
      // query data only one time
      if (pickUpShipmentData == null) {
        getAllPickupsShipmentsLazy({
          variables: {
            idClient: userData?.id,
          },
        });
      }
    }
  }, [props.open]);

  return (
    <>
      <Modal
        {...props}
        width="580px"
        // keepMounted
        footer={
          <>
            <Stack
              direction="row"
              justifyContent={tabvalue == 1 ? "flex-end" : "space-between"}
              width="100%"
            >
              {(props.allBoxesInPrimaryStatus.length !== scannedShipments.length && (
                <Button
                  endIcon={<Redo />}
                  variant="text"
                  // color="info"
                  type="submit"
                  form="add_request"
                  sx={{
                    display: (tabvalue == 1 && "none") as any,
                    boxShadow: "none",
                    color: blue[400],
                  }}
                  onClick={() => {
                    setScannedShipments(props.allBoxesInPrimaryStatus);
                  }}
                >
                  إعادة تعيين
                </Button>
              )) || <div></div>}
              <Stack direction="row" gap="6px">
                <Button
                  startIcon={<X></X>}
                  variant="outlined"
                  color="primary"
                  onClick={closeHandler as any}
                >
                  إلغاء
                </Button>
                <Button
                  loading={submitLoading}
                  startIcon={<Check></Check>}
                  variant="contained"
                  color="primary"
                  type="submit"
                  form="add_request"
                  disabled={!scannedShipments.length}
                  onClick={submitHandler}
                  sx={{
                    display: (tabvalue == 1 && "none") as any,
                  }}
                >
                  تأكيد
                </Button>
              </Stack>
            </Stack>
          </>
        }
      >
        <Box>
          <Box bgcolor="#FFF" sx={{ margin: "-16px -20px", marginBottom: "8px" }}>
            <Tabs
              value={tabvalue}
              onChange={(_, newVal) => setTabvalue(newVal)}
              variant={"fullWidth"}
            >
              <Tab
                label={
                  <Stack direction={"row"} alignItems="center" gap="4px">
                    <img src="/pickup.png" width="24px" height="24px" />
                    {/* <Plus width="20px" height="20px" color={theme.palette.primary.main} /> */}
                    <Typography variant="sm">طلب سائق</Typography>
                  </Stack>
                }
              />
              <Tab
                label={
                  <Stack direction={"row"} alignItems="center" gap="4px">
                    <ClipboardList width="18px" height="18px" color={theme.palette.primary.main} />
                    <Typography variant="sm">قائمة الطلبات</Typography>
                  </Stack>
                }
              />
            </Tabs>
            <Divider></Divider>
          </Box>
          <Box margin="-16px -20px">
            <SwipeableViews
              // animateHeight={tabvalue === 1 ? true : false}
              animateTransitions={false}
              index={tabvalue as any}
              onChangeIndex={(index) => {
                setTabvalue(index);
              }}
              containerStyle={{ willChange: "unset" }}
            >
              <Box dir="rtl">
                {(isScanning && <></>) || (
                  <Stack rowGap={"16px"} padding="10px 20px">
                    <Box>
                      <Stack
                        direction="row"
                        width={"100%"}
                        alignItems="center"
                        // bgcolor="#CCC"
                        sx={{
                          borderBottom: "1px dashed #CCC",
                          padding: "8px 0px",
                        }}
                      >
                        <IconButton
                          size="small"
                          // color={"info"}
                          // paddingRight="28px"
                          {...bindTrigger(popupPickUpPlanState)}
                        >
                          {/* <Box component="img" src="help-circle.png" width="19px"></Box> */}
                          <HelpCircle color={theme.palette.secondary.main} size="19" />
                        </IconButton>
                        <Typography variant="xs" flex="1 0" color={grey[600]}>
                          <Stack
                            direction="row"
                            justifyContent={"flex-end"}
                            alignItems="center"
                            gap="4px"
                          >
                            <Box component={"span"} fontSize="18">
                              إجمالي الطرود:
                            </Box>
                            <Box
                              component={"span"}
                              color={theme.palette.primary.main}
                              fontSize="16px"
                            >
                              {scannedShipments.length}
                            </Box>
                          </Stack>
                        </Typography>
                      </Stack>
                    </Box>
                    <Box
                      className="alert"
                      sx={{
                        border: "2px dashed " + alpha(theme.palette.warning.main, 0.4),
                        marginTop: "-8px",
                        marginBottom: "2px",
                        padding: "10px 10px",
                        borderRadius: "4px",
                      }}
                    >
                      <Stack direction="row" gap="10px" alignItems={"center"}>
                        <AlertTriangle size={18} color={alpha(theme.palette.warning.main, 0.8)} />
                        <Typography variant="xs" color={alpha(theme.palette.warning.main, 0.7)}>
                          سيتم تعيين سائق لأخذ الشحنات بعد تأكيد الطلب !
                        </Typography>
                      </Stack>
                    </Box>
                    <Stack direction={"row"} gap="8px" flexWrap={"wrap"}>
                      {scannedShipments?.map((shipment: any, i: number) => (
                        <MuiChip
                          key={i}
                          label={shipment.code}
                          // color="primary"

                          // variant="outlined"
                          sx={{
                            fontSize: 13,
                            bgcolor: "primary.main",
                            color: "#FFF",
                          }}
                          onDelete={() => {
                            setScannedShipments((prev: any) => {
                              return prev?.filter(
                                (prevshipment: any) => prevshipment.code != shipment.code
                              );
                            });
                          }}
                        ></MuiChip>
                      ))}
                    </Stack>
                  </Stack>
                )}
                {!isScanning && scannedShipments.length == 0 && (
                  <Stack
                    justifyContent={"center"}
                    sx={{
                      textAlign: "center",
                      marginBottom: "28px",
                    }}
                  >
                    <Box
                      component={"img"}
                      width="72px"
                      src="/empty2.svg"
                      sx={{
                        margin: "0px auto",
                        marginBottom: "10px",
                      }}
                    ></Box>
                    <Typography variant="sm" color={grey[500]}>
                      لايوجد طرود
                    </Typography>
                  </Stack>
                )}
              </Box>
              <Box dir="rtl" sx={{ outline: "1px solid transparent" }}>
                <Stack rowGap={"16px"} margin="12px 0">
                  <Box>
                    <Stack
                      direction="row"
                      width={"100%"}
                      // bgcolor="#CCC"
                      sx={{
                        borderBottom: "1px dashed #CCC",
                        padding: "14px 22px",
                      }}
                    >
                      <Typography variant="xs" flex="1 0" color={grey[600]}>
                        كود الطلب
                      </Typography>
                      <Typography variant="xs" flex="1 0" color={grey[600]}>
                        عدد الطرود
                      </Typography>
                      <Typography variant="xs" flex="1 0" color={grey[600]}>
                        حالة الطلب
                      </Typography>
                      <Typography variant="xs" flex="1 0" color={grey[600]}>
                        تاريخ الإضافة
                      </Typography>
                    </Stack>
                  </Box>

                  <Stack gap={"8px"}>
                    {pickUpShipmentDataSorted?.map((pickUp: any, index: any) => (
                      <Stack key={index}>
                        {/* <input type="radio" style={}></input> */}
                        {/* <Box
                      component={"input"}
                      type="radio"
                      // sx={{ appearance: "none", WebkitAppearance: "none", MozAppearance: "none" }}
                    ></Box> */}
                        {/* @ts-ignore */}
                        <label htmlFor={`radio-${index}`}>
                          <Box
                            bgcolor={"#FFF"}
                            height={"42px"}
                            padding={"0 24px"}
                            borderRadius="2px"
                            sx={{
                              overflow: "hidden",
                              outlineColor: grey[600],
                              // cursor: "pointer",
                              // transition: "all 0.08s",
                              "&:hover": {
                                // outline: "1px solid" + grey[600],
                                // opacity: 1,
                              },
                              // ...(selectedBuyStore?.selectedIndex == index && {
                              //   outline: "2px solid" + blue[400],
                              //   "&:hover": {
                              //     outline: "2px solid" + blue[400],
                              //   },
                              // }),
                            }}
                          >
                            <Stack
                              direction="row"
                              width={"100%"}
                              height={"42px"}
                              alignItems="center"
                              // bgcolor="#CCC"
                              sx={{
                                background: "#FFF",
                                padding: "12px 0",
                              }}
                            >
                              <Typography variant="xs" flex="1 0" color={grey[700]}>
                                {pickUp?.code}
                              </Typography>
                              <Typography variant="xs" flex="1 0" color={grey[700]}>
                                {pickUp?.numberBox}
                              </Typography>
                              <Typography variant="xs" flex="1 0" color={grey[700]}>
                                <Chip
                                  size={"medium"}
                                  variant="filled"
                                  label={
                                    // traking_status?.[props.status == 9 ? 8 : props.status || 0]
                                    //   ?.nameAr
                                    pickUp?.status == 2 ? "جاري إستلامه" : "تم استلامه"
                                  }
                                  color="info"
                                  // customColor={"#4DABF5"}
                                  customColor={
                                    // traking_status?.[props.status == 9 ? 8 : props.status || 0]?.color
                                    pickUp?.status == 2
                                      ? traking_status?.[26]?.color
                                      : traking_status?.[8]?.color
                                  }
                                  rounded
                                  dir="rtl"
                                ></Chip>
                              </Typography>
                              <Typography variant="2xs" flex="1 0" color={grey[700]}>
                                {dayjs(pickUp?.createdAt, "YYYY-MM-DD[T]HH:mm:ss[Z]").format(
                                  "DD / MMMM / YYYY"
                                )}
                              </Typography>
                            </Stack>
                          </Box>
                        </label>
                      </Stack>
                    ))}
                  </Stack>

                  {/* <Box
                  display={(filteredData?.length && "none") as any}
                  sx={{
                    backgroundColor: "#FFF",
                    width: "100%",
                    margin: "0 auto",
                    textAlign: "center",
                    padding: "20px 0",
                    borderRadius: "2px",
                  }}
                >
                  <Stack gap="8px">
                    <img src="/empty2.svg" alt="empty" height="38px" />
                    <Typography variant="2xs" color={grey[500]}>
                      لايوجد مشتريات متاحة
                    </Typography>
                  </Stack>
                </Box> */}
                  {/* </RadioGroup> */}
                </Stack>
              </Box>
            </SwipeableViews>
          </Box>
        </Box>
      </Modal>

      <PickUpPlanPopOver
        {...bindPopover(popupPickUpPlanState)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      ></PickUpPlanPopOver>
    </>
  );
};

export default ShipPickUpModal;
