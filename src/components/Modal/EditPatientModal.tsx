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
import { Check, Edit2, Plus, Trash2, Upload, X } from "react-feather";
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
import { useCreatePatient, useUpdatePatient } from "../../graphql/hooks/patient";
import { All_Sicks } from "../../graphql/hooks/patient/useGetAllPatients";
import { Alert } from "@mui/lab";
interface Props {
  open: boolean;
  onClose?: () => void;
  dataInfo?: any;
}

const initialInputs = (dataInfo: any) => ({
  address: dataInfo?.person?.address,
  email: dataInfo?.person?.email,
  first_name: dataInfo?.person?.first_name,
  ID_number: dataInfo?.person?.ID_number,
  last_name: dataInfo?.person?.last_name,
  phone: dataInfo?.person?.phone,
});

const EditPatientModal = ({ open, onClose, dataInfo }: Props) => {
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
  let [updateForModal] = useUpdatePatient();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [alert, setAlert] = useState<{
    status?: string;
    msg?: string;
  }>({});
  let onFormSubmit = ({ address, email, first_name, ID_number, last_name, phone, age }: any) => {
    setSubmitLoading(true);
    updateForModal({
      variables: {
        idPerson: dataInfo?.person?.id,
        content: {
          age,
          person: {
            address,
            email,
            first_name,
            ID_number,
            last_name,
            phone,
          },
        },
      },
      refetchQueries: [All_Sicks],
    })
      .then(() => {
        enqueueSnackbar("لقد تم التحديث بنجاح", {
          variant: "success",
        });
        setSubmitLoading(false);
        closeHandler();
      })
      .catch((err) => {
        setSubmitLoading(false);
        if (err?.graphQLErrors[0]?.extensions?.code == "PHONE_EXIST") {
          setAlert({
            // code: err?.graphQLErrors[0]?.extensions?.code,
            status: "error",
            msg: "הטלפון כבר קיים!",
          });
        } else if (err?.graphQLErrors[0]?.extensions?.code == "EMAIL_EXIST") {
          setAlert({
            // code: err?.graphQLErrors[0]?.extensions?.code,
            status: "error",
            msg: "האימייל כבר קיים!",
          });
        } else if (err?.graphQLErrors[0]?.extensions?.code) {
          setAlert({
            // code: err?.graphQLErrors[0]?.extensions?.code,
            status: "error",
            msg: "אירעה שגיאה במהלך הרישום!",
          });
        }
        // closeHandler();
      });
  };

  const closeHandler = () => {
    reset(initialInputs(dataInfo));
    typeof onClose == "function" && onClose();
    setAlert({});
  };

  useEffect(() => {
    if (open) {
      reset(initialInputs(dataInfo));
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={closeHandler}
      title="تعديل المريض"
      iconTitle={<Edit2></Edit2>}
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
          {alert?.status && (
            <Grid item xs={12}>
              <Alert
                variant="filled"
                severity={"error"}
                sx={{ padding: "4px 16px" }}
                onClose={() => setAlert({})}
              >
                {alert.msg}
              </Alert>
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <Input
              label="الاسم الاول*"
              error={errors?.first_name}
              placeholder="الاسم الاول*"
              fullWidth
              {...register("first_name", { required: true })}
            ></Input>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              label="الاسم الثاني*"
              error={errors?.last_name}
              placeholder="الاسم الثاني*"
              fullWidth
              {...register("last_name", { required: true })}
            ></Input>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              label="العمر"
              error={errors?.age}
              placeholder="العمر"
              fullWidth
              {...register("age", { required: false })}
            ></Input>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              label="رقم الهاتف"
              error={errors?.phone}
              placeholder="رقم الهاتف"
              fullWidth
              {...register("phone", { required: false })}
            ></Input>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              label="الايميل الالكتروني"
              error={errors?.email}
              placeholder="الايميل الالكتروني"
              fullWidth
              {...register("email", { required: false })}
            ></Input>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              label="العنوان"
              error={errors?.address}
              placeholder="العنوان"
              fullWidth
              {...register("address", { required: false })}
            ></Input>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              label="رقم الجواز"
              error={errors?.ID_number}
              placeholder="رقم الجواز"
              fullWidth
              {...register("ID_number", { required: false })}
            ></Input>
          </Grid>
        </Grid>
      </form>
    </Modal>
  );
};

export default EditPatientModal;