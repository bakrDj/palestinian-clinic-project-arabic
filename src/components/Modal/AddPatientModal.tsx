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
import { Alert } from "@mui/lab";
interface Props {
  open: boolean;
  onClose?: () => void;
}

const initialInputs = {
  address: "",
  email: "",
  first_name: "",
  ID_number: "",
  last_name: "",
  phone: "",
};

const AddPatientModal = ({ open, onClose }: Props) => {
  let {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const [alert, setAlert] = useState<{
    status?: string;
    msg?: string;
  }>({});

  let [wilaya, setWilaya] = useState("");

  let [submitLoading, setSubmitLoading] = useState<boolean>(false);

  let userData = useStore((state: any) => state.userData);
  let [createForModal] = useCreatePatient();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  let onFormSubmit = ({ age, address, email, first_name, ID_number, last_name, phone }: any) => {
    console.log("🚀 ~ onFormSubmit ~ age, address, email, first_name, ID_number, last_name, phone:", age, address, email, first_name, ID_number, last_name, phone);
    setSubmitLoading(true);
    createForModal({
      variables: {
        personData: {
          first_name: first_name,
          last_name: last_name,
          address,
          age,
          gender: "male",
          identification_number: ID_number,
          phone,
        },
      },
      refetchQueries: [Get_All_Patients],
    })
      .then(() => {
        enqueueSnackbar("הוספת בהצלחה", {
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
    reset(initialInputs);
    typeof onClose == "function" && onClose();
    setAlert({});
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
      title="إضافة مريض"
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
          {alert?.status && (
            <Grid
              item
              xs={12}
            >
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
          <Grid
            item
            xs={12}
            sm={6}
          >
            <Input
              label="الاسم الاول*"
              error={errors?.first_name}
              placeholder="الاسم الاول*"
              fullWidth
              {...register("first_name", { required: true })}
            ></Input>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
          >
            <Input
              label="الاسم الثاني*"
              error={errors?.last_name}
              placeholder="الاسم الثاني*"
              fullWidth
              {...register("last_name", { required: true })}
            ></Input>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
          >
            <Input
              label="العمر"
              error={errors?.age}
              placeholder="العمر"
              fullWidth
              {...register("age", { required: false })}
            ></Input>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
          >
            <Input
              label="رقم الهاتف"
              error={errors?.phone}
              placeholder="رقم الهاتف"
              fullWidth
              {...register("phone", { required: false })}
            ></Input>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
          >
            <Input
              label="الايميل الالكتروني"
              error={errors?.email}
              placeholder="الايميل الالكتروني"
              fullWidth
              {...register("email", { required: false })}
            ></Input>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
          >
            <Input
              label="العنوان"
              error={errors?.address}
              placeholder="العنوان"
              fullWidth
              {...register("address", { required: false })}
            ></Input>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
          >
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

export default AddPatientModal;
