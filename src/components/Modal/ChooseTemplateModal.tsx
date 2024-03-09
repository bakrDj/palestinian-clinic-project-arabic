import { Box, Divider, Grid, InputAdornment, MenuItem, ListItemIcon, Stack, TextField, IconButton, Typography, iconButtonClasses } from "@mui/material";
import { amber, blue, grey, red } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { Check, Edit2, MoreHorizontal, Plus, Trash2, Upload, X } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { useCreateShipment, useCreateUploadMultiFiles, useGetProvincesPrices } from "../../graphql/hooks/shipments";
import useStore from "../../store/useStore";
import Button from "../Button";
import Input from "../Input/Input";
import Select from "../Input/Select";
import TextArea from "../Input/TextArea";
import Switch from "../Switch";
import Modal from "./Modal";
import algerian_provinces from "../../utilities/data/api/yaman_provinces.json";
import { useSnackbar } from "notistack";
import ReactImageUploading from "react-images-uploading";
import { useCreatePatient } from "../../graphql/hooks/patient";
import { Get_All_Patients } from "../../graphql/hooks/patient/useGetAllPatients";
import { Masonry } from "@mui/lab";
import theme, { slate } from "../../styles/theme";
import { useGetTemplatesForUsers } from "../../graphql/hooks/users";
import AddTemplateModal from "./AddTemplateModal";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";

import Menu from "../Menu/Menu";
import { all_Formats } from "../../graphql/hooks/users/useGetTemplatesForUsers";
import { useDeleteTemplate } from "../../graphql/hooks/template";
import EditTemplateModal from "./EditTemplateModal";
interface Props {
  open: boolean;
  inputWho?: string;
  onClose?: () => void;
  setTemplateInputData?: (data?: any) => void;
}

const initialInputs = {
  address: "",
  email: "",
  first_name: "",
  ID_number: "",
  last_name: "",
  phone: "",
};

const ChooseTemplateModal = (props: Props) => {
  let { open, onClose, inputWho } = props;
  let {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const popupState23 = usePopupState({ variant: "popover", popupId: "ddsemoMenu" });

  let [wilaya, setWilaya] = useState("");

  let [submitLoading, setSubmitLoading] = useState<boolean>(false);

  let userData = useStore((state: any) => state.userData);
  let [templatesData, loading] = useGetTemplatesForUsers();
  let [deleteCardMutation] = useDeleteTemplate();

  const [OpenAddTemplateModal, setOpenAddTemplateModal] = React.useState(false);
  const [OpenEditModal, setOpenEditModal] = React.useState(false);
  const [CardDataInfo, setCardDataInfo] = React.useState<any>([]);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // let onFormSubmit = ({ address, email, first_name, ID_number, last_name, phone }: any) => {
  //   setSubmitLoading(true);
  //   createForModal({
  //     variables: {
  //       content: {
  //         person: {
  //           address,
  //           email,
  //           first_name,
  //           ID_number,
  //           last_name,
  //           phone,
  //         },
  //       },
  //     },
  //     refetchQueries: [All_Sicks],
  //   })
  //     .then(() => {
  //       enqueueSnackbar("تم الإضافة بنجاح", {
  //         variant: "success",
  //       });
  //       setSubmitLoading(false);
  //       closeHandler();
  //     })
  //     .catch(() => {
  //       setSubmitLoading(false);
  //       closeHandler();
  //     });
  // };

  const closeHandler = () => {
    reset(initialInputs);
    typeof onClose == "function" && onClose();
  };

  useEffect(() => {
    if (open) {
      reset(initialInputs);
    }
  }, [open]);

  return (
    <Modal
      disablePortal={true}
      open={open}
      onClose={closeHandler}
      // title="מטופל חדש"
      // iconTitle={<Plus></Plus>}
      width="640px"
      sx={{ zIndex: 99999999 }}
      footer={
        <>
          <Stack
            direction="row"
            justifyContent={"space-between"}
            width="100%"
          >
            <Button
              // loading={submitLoading}
              startIcon={<Plus></Plus>}
              variant="contained"
              color="secondary"
              // type="submit"
              // form="add_shipment"
              onClick={() => {
                setOpenAddTemplateModal(true);
              }}
            >
              تأكيد
            </Button>
            <Stack
              direction={"row"}
              gap="6px"
            >
              <Button
                startIcon={<X></X>}
                variant="outlined"
                color="primary"
                onClick={closeHandler as any}
              >
                إلغاء
              </Button>
              {/* <Button
                loading={submitLoading}
                startIcon={<Check></Check>}
                variant="contained"
                color="primary"
                type="submit"
                form="add_shipment"
              >
                تأكيد
              </Button> */}
            </Stack>
          </Stack>
        </>
      }
    >
      <>
        <form id="add_shipment" /* onSubmit={handleSubmit(onFormSubmit)} */>
          <Masonry
            columns={2}
            spacing="2"
          >
            {templatesData
              ?.filter((template: any, i: number) => template?.type == inputWho)
              ?.map((template: any, i: number) => (
                <Box
                  key={i}
                  sx={{
                    border: "1px solid " + slate[300],
                    // @ts-ignore
                    // boxShadow: theme.shadows[26].twShadow1,
                    borderRadius: "4px",
                    padding: "10px",
                    background: "#FFF",
                    position: "relative",
                    cursor: "pointer",
                    transition: "all 0.1s",
                    ":hover": {
                      border: "1px solid transparent",
                      background: slate[100],
                      outline: "2px solid " + slate[400],
                      boxShadow: "unset",
                    },
                    [`:hover .MuiIconButton-root`]: {
                      background: slate[400],
                    },
                  }}
                  onClick={() => {
                    typeof props?.setTemplateInputData == "function" && props?.setTemplateInputData(template?.message);
                    closeHandler();
                  }}
                >
                  <IconButton
                    size={"small"}
                    sx={{
                      position: "absolute",
                      right: -10,
                      top: -10,
                      background: slate[300],
                      // ":hover": {
                      //   background: slate[400],
                      // },
                    }}
                    {...bindTrigger(popupState23)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCardDataInfo(template);

                      bindTrigger(popupState23).onClick(e);
                    }}
                  >
                    <MoreHorizontal
                      color={"#FFF"}
                      size={10}
                    />
                  </IconButton>

                  <Typography
                    variant="xs"
                    color={grey[700]}
                    sx={{ pointerEvents: "unset" }}
                  >
                    {template?.message}
                  </Typography>
                </Box>
              ))}
            {/* 
          <Box
            sx={{
              outline: "1px solid " + slate[400],
              borderRadius: "3px",
              padding: "10px",
              background: "#FFF",
              position: "relative",
              cursor: "pointer",
              transition: "all 0.1s",
              ":hover": {
                background: slate[100],
                outline: "2px solid " + slate[400],
              },
              [`:hover ${iconButtonClasses.sizeSmall}`]: {
                background: blue[300],
              },
            }}
          >
            <IconButton
              size={"small"}
              sx={{
                position: "absolute",
                right: -10,
                top: -10,
                background: slate[300],
                ":hover": {
                  background: slate[400],
                },
              }}
            >
              <MoreHorizontal color={"#FFF"} size={10} />
            </IconButton>
            <Typography variant="xs" color={grey[700]}>
              dqsdqs
            </Typography>
          </Box> */}
          </Masonry>
        </form>

        <AddTemplateModal
          open={OpenAddTemplateModal}
          inputWho={inputWho}
          onClose={() => setOpenAddTemplateModal(false)}

          // id={route.query?.id as any}
        ></AddTemplateModal>

        <EditTemplateModal
          open={OpenEditModal}
          onClose={() => setOpenEditModal(false)}
          inputWho={inputWho}
          // id={route.query?.id as any}
          dataInfo={CardDataInfo}
        ></EditTemplateModal>

        <Menu
          {...bindMenu(popupState23)}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <MenuItem
            onClick={() => {
              setOpenEditModal(true);
              // props.onshowDetailsClick();
              // grabDataInfoHandler();
              // typeof props.setOpenEditPatientModal == "function" &&
              //   props.setOpenEditPatientModal(true);
              popupState23.close();
            }}
          >
            <ListItemIcon>
              <Edit2
                size={18}
                strokeWidth={2}
              />
            </ListItemIcon>
            לַעֲרוֹך
          </MenuItem>
          <MenuItem
            onClick={() => {
              // props.onshowDetailsClick();
              // grabDataInfoHandler();
              deleteCardMutation({
                variables: {
                  deleteFormatId: CardDataInfo?.id!,
                },
                refetchQueries: [all_Formats],
              });
              popupState23.close();

              // typeof props.setOpenEditPatientModal == "function" &&
              //   props.setOpenEditPatientModal(true);
            }}
          >
            <ListItemIcon>
              <Trash2
                size={18}
                strokeWidth={2}
              />
            </ListItemIcon>
            לִמְחוֹק
          </MenuItem>

          {/* <Divider></Divider> */}
        </Menu>
      </>
    </Modal>
  );
};

export default ChooseTemplateModal;
