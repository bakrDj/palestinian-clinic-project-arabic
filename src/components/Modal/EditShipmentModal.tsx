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
import { Check, Edit, Edit2, Plus, Trash2, Upload, X } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import {
  useCreateShipment,
  useCreateUploadMultiFiles,
  useDeleteImage,
  useGetProvincesPrices,
  useUpdateShipment,
} from "../../graphql/hooks/shipments";
import useStore from "../../store/useStore";
import Button from "../Button";
import Input from "../Input/Input";
import Select from "../Input/Select";
import TextArea from "../Input/TextArea";
import Switch from "../Switch";
import Modal from "./Modal";
import yaman_provinces from "../../utilities/data/api/yaman_provinces.json";
import { useSnackbar } from "notistack";
import ReactImageUploading from "react-images-uploading";
interface Props {
  open: boolean;
  onClose?: () => void;
  boxData: any;
}

const initialInputs = (data?: any) => ({
  recipient_name: data?.recipient_name ?? "",
  recipient_phone1: data?.recipient_phone1 ?? "",
  recipient_city: data?.recipient_city ?? "",
  recipient_address: data?.recipient_address ?? "",

  manufactured_material: data?.manufactured_material ?? "",
  number_cartons: data?.number_cartons ?? "",
  size: data?.size ?? "",
  weight: data?.weight ?? "",
  isInsurance: data?.insurance ?? "",

  invoice_amount: data?.invoice_amount ?? "",
  price_delivery: data?.price_delivery ?? "",
  ID_number: data?.ID_number ?? "",
  note: data?.note ?? "",
  product_name: data?.product_name ?? "",
});

const EditShipmentModal = ({ open, onClose, boxData }: Props) => {
  console.log("🚀 ~ file: EditShipmentModal.tsx ~ line 58 ~ EditShipmentModal ~ boxData", boxData);
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
  let [clientIdValue, setClientIdValue] = useState<any>("");
  let [savedPictures, setSavedPictures] = useState<any>(boxData?.picture);

  let [isdeletePrevented, SetIsDeletePrevented] = useState<any>(false);
  let [client, setClient] = useState<any>({
    id: `${boxData?.client?.id}`,
    person: {
      first_name: `${boxData?.client?.person?.first_name}`,
      last_name: `${boxData?.client?.person?.last_name}`,
      city: `${boxData?.client?.person?.city}`,
    },
  });
  let userData = useStore((state: any) => state.userData);

  let [updateShipmenet] = useUpdateShipment();

  const [images, setImages] = React.useState([]);
  const maxNumber = 69;

  const onChange = (imageList: any, addUpdateIndex: any) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let [createUploadMultiFiles] = useCreateUploadMultiFiles();
  // const [createMultiTraceMutation, { data: requestData }] = useCreateMultiTrace();
  const [createDeleteImageMutation] = useDeleteImage();

  let onFormSubmit = ({
    recipient_name,
    recipient_phone1,
    recipient_city,
    recipient_address,

    manufactured_material,
    number_cartons,
    size,
    weight,
    isInsurance,

    invoice_amount,
    price_delivery,
    ID_number,
    note,
    product_name,
  }: any) => {
    setSubmitLoading(true);

    updateShipmenet({
      variables: {
        updateBoxId: boxData?.id,
        content: {
          recipient_name,
          recipient_phone1,
          recipient_city,
          recipient_address,

          manufactured_material,
          number_cartons: parseInt(number_cartons),
          size,
          weight,
          insurance: isInsurance || false,

          invoice_amount: 0,
          price_delivery: 0,

          note,
          product_name,

          // status_box: "1",
          ID_number,

          id_stock: userData?.person?.list_stock_accesses?.stock.id,
          id_person: userData?.person?.id,
          id_client: clientIdValue,
        },
      },
    })
      .then((resData: any) => {
        let list = new DataTransfer();
        let files = images.map((pic: any) => pic.file);
        files.length !== 0 && files?.forEach((file: any) => list.items.add(file));

        files.length !== 0 &&
          createUploadMultiFiles({
            variables: {
              idBox: boxData?.id,
              files: list.files,
            },
          });
      })

      .then(() => {
        enqueueSnackbar("لقد تم تحديث الطرد بنجاح", {
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
    reset(initialInputs());
    setImages([]);
    setSavedPictures([]);
    typeof onClose == "function" && onClose();
  };

  useEffect(() => {
    reset(initialInputs(boxData));
    setClientIdValue(boxData?.client?.id);
    setClient({
      id: `${boxData?.client?.id}`,
      person: {
        first_name: `${boxData?.client?.person?.first_name}`,
        last_name: `${boxData?.client?.person?.last_name}`,
        city: `${boxData?.client?.person?.city}`,
      },
    });
    setSavedPictures(boxData?.picture);
  }, [boxData]);

  return (
    <Modal
      open={open}
      onClose={closeHandler}
      title={boxData?.lastTrace[0].status == 1 ? "مراجعةالطلب" : "تعديل طرد"}
      iconTitle={boxData?.lastTrace[0].status == 1 ? <Edit /> : <Edit2 />}
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
          <Grid item xs={12} sm={6}>
            <Input
              error={errors?.recipient_name}
              placeholder="إسم المستلم"
              fullWidth
              {...register("recipient_name", { required: true })}
            ></Input>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              error={errors?.recipient_phone1}
              placeholder="رقم الهاتف"
              fullWidth
              {...register("recipient_phone1", { required: true })}
            ></Input>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              error={errors?.recipient_city}
              placeholder="إختر المدينة"
              defaultValue={boxData?.recipient_city}
              fullWidth
              {...register("recipient_city", { required: true })}
              onChange={(e, c) => {
                setWilaya(e.target.value as any);
                register("recipient_city", { required: true }).onChange(e);
              }}
            >
              {[...JSON.parse(JSON.stringify(yaman_provinces))]?.map((wilaya: any, index: any) => {
                return (
                  <MenuItem value={wilaya.wilaya_code} key={index}>
                    {wilaya.wilaya_name}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              error={errors?.recipient_address}
              placeholder="العنوان"
              fullWidth
              {...register("recipient_address", { required: true })}
            ></Input>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Input
              error={errors?.manufactured_material}
              placeholder="اسم المنتج (إختياري)"
              fullWidth
              {...register("product_name", { required: false })}
            ></Input>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Input
              error={errors?.manufactured_material}
              placeholder="رقم الهوية (جواز او بطاقة شخصية)"
              fullWidth
              {...register("ID_number", { required: true })}
            ></Input>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Input
              error={errors?.manufactured_material}
              placeholder="المادة المصنعة"
              fullWidth
              {...register("manufactured_material", { required: true })}
            ></Input>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              error={errors?.number_cartons}
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
              placeholder="عدد الكراتين"
              fullWidth
              {...register("number_cartons", { required: true })}
            ></Input>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Input
              error={errors?.size}
              type="number"
              placeholder="الحجم"
              fullWidth
              {...register("size", { required: true })}
              InputProps={{
                endAdornment: <InputAdornment position="end">m³</InputAdornment>,
                inputProps: { min: 1 },
              }}
            ></Input>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              error={errors?.weight}
              type="number"
              placeholder="الوزن"
              fullWidth
              {...register("weight", { required: true })}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                inputProps: { min: 1 },
              }}
            ></Input>
          </Grid>

          <Grid item xs={12}>
            <Box bgcolor={"white"} height={"48px"} padding={"0 16px"} borderRadius="2px">
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems="center"
                height={"100%"}
              >
                <Typography variant="sm" color={grey[600]}>
                  هل على الشحنة تأمين؟
                </Typography>
                <Controller
                  control={control}
                  name="isInsurance"
                  render={({ field: { onChange, onBlur, value } }) => {
                    return <Switch checked={value} onChange={onChange as any}></Switch>;
                  }}
                />
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextArea
              placeholder="ملاحظة (إختياري) "
              fullWidth
              minRows={4}
              maxRows={4}
              {...register("note")}
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
                <Box bgcolor={"white"} padding={"16px 16px"} borderRadius="2px">
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
                          رفع صورة
                        </Typography>
                      </Stack>
                    </Box>
                    {(imageList.length !== 0 || boxData?.picture?.length !== 0) && (
                      <Divider sx={{ marginBottom: "8px" }}></Divider>
                    )}

                    <Grid
                      container
                      spacing={2}
                      sx={{
                        position: "relative",
                        transition: "all 0.3s",
                        "&::after": isdeletePrevented && {
                          content: "''",
                          position: "absolute",
                          top: "0",
                          left: "0",
                          width: "100%",
                          height: "100%",
                          backgroundColor: "white",
                          zIndex: 9999999,
                          opacity: 0.4,
                        },
                      }}
                    >
                      {imageList.length !== 0 &&
                        imageList.map((image, index) => (
                          <Grid item xs={4} sm={3} md={3} sx={{ position: "relative" }} key={index}>
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

                      {savedPictures?.length !== 0 &&
                        savedPictures?.map((image: any, index: number) => (
                          <Grid item xs={4} sm={3} md={3} sx={{ position: "relative" }} key={index}>
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
                                  createDeleteImageMutation({
                                    variables: {
                                      deleteImageId: image?.id,
                                    },
                                  })
                                    .then(() => {
                                      setSavedPictures(() => [
                                        ...savedPictures.filter(
                                          (pic: any) => pic.name != image.name
                                        ),
                                      ]);
                                    })
                                    .finally(() => {
                                      SetIsDeletePrevented(false);
                                    });
                                }}
                              >
                                <Trash2 size="24" color={red[500]}></Trash2>
                              </Box>
                            </Box>
                            <Box
                              src={`https://deliveryapi-5050.qafilaty.com/images/${image.name}`}
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

export default EditShipmentModal;
