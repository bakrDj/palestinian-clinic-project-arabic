import {
  Box,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { amber, blue, grey, red } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { Check, Plus, Trash2, Upload, X } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import {
  useCreateShipment,
  useCreateUploadMultiFiles,
  useGetProvincesPrices,
} from "../../graphql/hooks/shipments";
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
import { All_Sicks } from "../../graphql/hooks/patient/useGetAllPatients";
import { useCreateVitalSign } from "../../graphql/hooks/vitalSign";
import { All_VitalSigns } from "../../graphql/hooks/vitalSign/useGetVitalSign";
import { useCreateDiagnosis } from "../../graphql/hooks/diagnosis";
import { All_Diagnosis } from "../../graphql/hooks/diagnosis/useGetDiagnosis";
import { useCreateAlbum } from "../../graphql/hooks/album";
import { slate } from "../../styles/theme";
import { All_Album } from "../../graphql/hooks/album/useGetAlbum";
interface Props {
  open: boolean;
  onClose?: () => void;
  id?: string;
}

const initialInputs = {
  title: "",
  description: "",
};

const AddAlbumModal = ({ open, onClose, id }: Props) => {
  let {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm();

  let [wilaya, setWilaya] = useState("");

  let [submitLoading, setSubmitLoading] = useState<boolean>(false);

  let userData = useStore((state: any) => state.userData);
  let [createForModal] = useCreateAlbum();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [images, setImages] = React.useState([]);

  const maxNumber = 69;

  const onChange = (imageList: any, addUpdateIndex: any) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  let onFormSubmit = ({ title, description, pictures }: any) => {
    setSubmitLoading(true);

    let list = new DataTransfer();
    let files = images.map((pic: any) => pic.file);
    files.length !== 0 && files?.forEach((file: any) => list.items.add(file));

    createForModal({
      variables: {
        content: {
          title,
          description,
          pictures: list.files,
          id_sick: id!,
        },
      },
      refetchQueries: [All_Album],
    })
      .then(() => {
        enqueueSnackbar("הוספת בהצלחה", {
          variant: "success",
        });
        setSubmitLoading(false);
        closeHandler();
      })
      .catch(() => {
        setSubmitLoading(false);
        closeHandler();
      });
  };

  const closeHandler = () => {
    setImages([]);
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
      open={open}
      onClose={closeHandler}
      title="إضافة صور"
      iconTitle={<Plus></Plus>}
      width="640px"
      footer={
        <>
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
            form="add_shipment"
          >
            تأكيد
          </Button>
        </>
      }
    >
      <form id="add_shipment" onSubmit={handleSubmit(onFormSubmit)}>
        <Grid container boxSizing={"border-box"} spacing={2}>
          <Grid item xs={12}>
            <Input
              label="عنوان*"
              error={errors?.title}
              placeholder="عنوان*"
              fullWidth
              {...register("title", { required: true })}
            ></Input>
          </Grid>

          <Grid item xs={12}>
            <TextArea
              label="وصف"
              placeholder="وصف"
              fullWidth
              minRows={4}
              maxRows={4}
              error={errors?.description}
              {...register("description", { required: false })}
            ></TextArea>
          </Grid>

          <Grid item xs={12}>
            <ReactImageUploading
              multiple
              value={images}
              onChange={onChange}
              maxNumber={maxNumber}
              dataURLKey="data_url"
              acceptType={["jpg", "gif", "png", "jpeg"]}
            >
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
              }) => (
                <Box
                  bgcolor={"white"}
                  padding={"16px 16px"}
                  borderRadius="2px"
                  border={"1px solid " + slate[200]}
                >
                  <Stack gap="12px">
                    <Box
                      onClick={onImageUpload}
                      {...dragProps}
                      sx={{
                        width: "100%",
                        height: "42px",
                        backgroundColor: blue[50],
                        border: "1px dashed " + blue[400],
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        ":hover": {
                          backgroundColor: blue[100],
                          borderColor: blue[100],
                        },
                      }}
                    >
                      <Stack direction="row" gap={"8px"}>
                        <Upload size={16} color={blue[400]} />
                        <Typography variant="sm" color={blue[400]}>
                          رفع صور
                        </Typography>
                      </Stack>
                    </Box>
                    {imageList.length !== 0 && <Divider sx={{ marginBottom: "8px" }}></Divider>}

                    <Grid container spacing={2}>
                      {imageList.length !== 0 &&
                        imageList.map((image, index) => (
                          <Grid item xs={4} sm={3} md={3} sx={{ position: "relative" }} key={index}>
                            {/* <Box
                              sx={{
                                position: "absolute",
                                width: "calc(100% - 16px)",
                                height: "calc(100% - 17px)",
                                borderRadius: "4px",
                                outline: "1px solid transparent",
                                backgroundColor: red[500],
                                opacity: 0.4,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                ":hover": {
                                  backgroundColor: "blue",
                                },
                              }}
                            ></Box> */}
                            <Box
                              sx={{
                                position: "absolute",
                                width: "calc(100% - 16px)",
                                height: "calc(100% - 17px)",
                                borderRadius: "4px",
                                outline: "1px solid transparent",
                                // backgroundColor: red[500],
                                // opacity: 0.2,
                                display: "flex",
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                                zIndex: "99999",
                                padding: "4px",
                              }}
                            >
                              <Box
                                sx={{
                                  width: "32px",
                                  borderRadius: "4px",

                                  height: "32px",
                                  backgroundColor: "#ffebeeA4",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                }}
                                onClick={(e) => {
                                  onImageRemove(index);
                                }}
                              >
                                <Trash2 size="24" color={red[500]}></Trash2>
                              </Box>
                            </Box>
                            <Box
                              src={image["data_url"]}
                              alt=""
                              component={"img"}
                              // width={46}

                              sx={{
                                borderRadius: "4px",
                                backgroundColor: "white",
                                outline: "1px solid #DDD",
                                objectFit: "cover",
                                minWidth: "100%",
                                height: "98px",
                              }}
                            />
                          </Grid>
                        ))}
                    </Grid>

                    {/* {imageList.length !== 0 &&
                      imageList.map((image, index) => (
                        <Box
                              src={image["data_url"]}
                              alt=""
                              component={"img"}
                              width={46}
                              height={46}
                              sx={{
                                borderRadius: "4px",
                                backgroundColor: "white",
                                outline: "1px solid #DDD",
                              }}
                            />
                        <Box
                          key={index}
                          sx={{
                            width: "100%",
                            height: "66px",
                            backgroundColor: grey[50],
                            border: "1px solid " + grey[300],
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "16px",
                          }}
                        >
                          <Stack direction="row" gap={"8px"} alignItems="center">
                            <Box
                              src={image["data_url"]}
                              alt=""
                              component={"img"}
                              width={46}
                              height={46}
                              sx={{
                                borderRadius: "4px",
                                backgroundColor: "white",
                                outline: "1px solid #DDD",
                              }}
                            />

                            <Stack
                              gap="2px"
                              height="100%"
                              justifyContent={"center"}
                              sx={{ borderRadius: "4px", height: "100%" }}
                            >
                              <Typography variant="xs" color={grey[800]}>
                                {image?.file?.name}
                              </Typography>
                              <Typography variant="2xs" color={grey[700]}>
                                {((image?.file?.size || 1) / (1024 * 1024)).toFixed(2) + "MB"}
                              </Typography>
                            </Stack>
                          </Stack>
                          <Box>
                            <IconButton
                              size="small"
                              sx={{ padding: "6px", color: red[500] }}
                              onClick={(e) => {
                                onImageRemove(index);
                              }}
                            >
                              <Trash2 size="15" color={red[400]}></Trash2>
                            </IconButton>
                          </Box>
                        </Box>
                      ))} */}
                  </Stack>
                </Box>
              )}
            </ReactImageUploading>
          </Grid>
        </Grid>
      </form>
    </Modal>
  );
};

export default AddAlbumModal;
