import { Box, Divider, Grid, InputAdornment, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { amber, blue, grey, red } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { Check, Plus, Trash2, Upload, X } from "react-feather";
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
import { useCreateVitalSign } from "../../graphql/hooks/vitalSign";
import { All_VitalSigns } from "../../graphql/hooks/vitalSign/useGetVitalSign";
import { useCreateDiagnosis } from "../../graphql/hooks/diagnosis";
import { All_Diagnosis } from "../../graphql/hooks/diagnosis/useGetDiagnosis";
import { useCreateAlbum, useUpdateAlbum } from "../../graphql/hooks/album";
import { slate } from "../../styles/theme";
import { All_Album } from "../../graphql/hooks/album/useGetAlbum";
import { useAddImage, useDeleteImage } from "../../graphql/hooks";
import { getStorage, ref as googleRef, uploadBytes } from "firebase/storage";
import { useRouter } from "next/router";
import { client } from "../../pages/_app";
interface Props {
  open: boolean;
  onClose?: () => void;
  id?: string;
  dataInfo?: any;
}

const initialInputs = (data?: any) => ({
  title: data?.title,
  description: data?.description,
});

const EditAlbumModal = ({ open, onClose, id, dataInfo }: Props) => {
  console.log("🚀 ~ EditAlbumModal ~ dataInfo:", dataInfo);
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
  let [updateForModal] = useUpdateAlbum();
  const [createDeleteImageMutation] = useDeleteImage();
  const [createAddImageMutation] = useAddImage();
  let route = useRouter();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [images, setImages] = React.useState([]);
  let [savedPictures, setSavedPictures] = useState<any>([]);
  let [imagesUrls, setImagesUrls] = useState<any>([]);

  let [isdeletePrevented, SetIsDeletePrevented] = useState<any>(false);

  const maxNumber = 69;

  const onChange = (imageList: any, addUpdateIndex: any) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  function addTimestampToFilename(filename: string) {
    const timestamp = Date.now();
    const parts = filename.split(".");
    const extension = parts.pop();
    const name = parts.join(".");
    return `${name}_${timestamp}${Math.floor(Math.random() * 100)}.${extension}`;
  }

  let onFormSubmit = ({ title, description, pictures }: any) => {
    setSubmitLoading(true);

    let imageNames = images.map((pic: any) => addTimestampToFilename(pic.file.name));
    // convert the image files to list or FileList
    let list = new DataTransfer();
    let files = images.map((pic: any) => pic.file);
    files.length !== 0 && files?.forEach((file: any) => list.items.add(file));

    const storage = getStorage();

    updateForModal({
      variables: {
        updateRadiologyId: dataInfo?.id,
        data: {
          title,
          description,
          images: imageNames.concat(savedPictures),
          patientsId: parseInt(id! as any),
        },
      },
      // refetchQueries: [All_Album],
    })
      .then(() => {
        // Create an array to hold all the promises for file uploads
        const uploadPromises = files.map((file, i) => {
          const storageRef = googleRef(storage, "radiology/" + route.query?.id + "/" + imageNames[i]);
          console.log("🚀 ~ uploadBytes ~ file:", file);
          return uploadBytes(storageRef, file)
            .then((snapshot) => {
              console.log("Uploaded a blob or file:", imageNames[i]);
              return Promise.resolve(); // Return a resolved promise
            })
            .catch((error) => {
              console.error("Error uploading file:", imageNames[i], error);
              return Promise.reject(error); // Return a rejected promise
            });
        });

        // Wait for all file uploads to complete
        return Promise.all(uploadPromises);
      })
      .then(async () => {
        await client!.refetchQueries({
          include: [All_Album],
        });
        enqueueSnackbar("تم التعديل بنجاح", {
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
    setSavedPictures([]);

    reset(initialInputs());
    typeof onClose == "function" && onClose();
  };

  useEffect(() => {
    if (open) {
      reset(initialInputs(dataInfo));
      setSavedPictures([...dataInfo?.images]);
      setImagesUrls([...dataInfo?.imagesURLs]);
    }
  }, [open]);
  return (
    <Modal
      open={open}
      onClose={closeHandler}
      title="تعديل الصور"
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
      <form
        id="add_shipment"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <Grid
          container
          boxSizing={"border-box"}
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <Input
              label="عنوان*"
              error={errors?.title}
              placeholder="عنوان*"
              fullWidth
              {...register("title", { required: true })}
            ></Input>
          </Grid>

          <Grid
            item
            xs={12}
          >
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

          <Grid
            item
            xs={12}
          >
            <ReactImageUploading
              multiple
              value={images}
              onChange={onChange}
              maxNumber={maxNumber}
              dataURLKey="data_url"
              acceptType={["jpg", "gif", "png", "jpeg"]}
            >
              {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
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
                      <Stack
                        direction="row"
                        gap={"8px"}
                      >
                        <Upload
                          size={16}
                          color={blue[400]}
                        />
                        <Typography
                          variant="sm"
                          color={blue[400]}
                        >
                          رفع صور
                        </Typography>
                      </Stack>
                    </Box>
                    {imageList.length !== 0 && <Divider sx={{ marginBottom: "8px" }}></Divider>}

                    <Grid
                      container
                      spacing={2}
                    >
                      {imageList.length !== 0 &&
                        imageList.map((image, index) => (
                          <Grid
                            item
                            xs={4}
                            sm={3}
                            md={3}
                            sx={{ position: "relative" }}
                            key={index}
                          >
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
                                <Trash2
                                  size="24"
                                  color={red[500]}
                                ></Trash2>
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

                      {savedPictures?.length !== 0 &&
                        savedPictures?.map((image: any, index: number) => (
                          <Grid
                            item
                            xs={4}
                            sm={3}
                            md={3}
                            sx={{ position: "relative" }}
                            key={index}
                          >
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
                                  SetIsDeletePrevented(true);

                                  setSavedPictures(() => [...savedPictures.filter((pic: any, picIndex: number) => index != picIndex)]);
                                  setImagesUrls(() => [...imagesUrls.filter((pic: any, picIndex: number) => index != picIndex)]);
                                  // createDeleteImageMutation({
                                  //   variables: {
                                  //     deleteImageId: image?.id,
                                  //   },
                                  // })
                                  //   .then(() => {
                                  //     setSavedPictures(() => [...savedPictures.filter((pic: any, picIndex: number) => index != picIndex)]);
                                  //     setImagesUrls(() => [...imagesUrls.filter((pic: any, picIndex: number) => index != picIndex)]);
                                  //   })
                                  //   .finally(() => {
                                  SetIsDeletePrevented(false);
                                  //   });
                                }}
                              >
                                <Trash2
                                  size="24"
                                  color={red[500]}
                                ></Trash2>
                              </Box>
                            </Box>
                            <Box
                              src={`${imagesUrls[index]}`}
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

export default EditAlbumModal;
