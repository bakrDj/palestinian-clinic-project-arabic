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
import { useCreateUser } from "../../graphql/hooks/users";
import { ALL_USERS } from "../../graphql/hooks/users/useGetAllUsers";
import { Alert } from "@mui/lab";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
interface Props {
  open: boolean;
  onClose?: () => void;
}

const initialInputs = {
  first_name: "",
  last_name: "",
  email: "",
  address: "",
  ID_number: "",
  phone: "",
  password: "",
  role: "",
  user_name: "",
};

const AddUserModal = ({ open, onClose }: Props) => {
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
  let [createForModal] = useCreateUser();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [alert, setAlert] = useState<{
    status?: string;
    msg?: string;
  }>({});
  let onFormSubmit = ({ first_name, last_name, email, address, ID_number, phone, password, role, user_name }: any) => {
    setSubmitLoading(true);

    createForModal({
      variables: {
        data: {
          email,
          // password,
          role,
          username: user_name,
        },
        personData: {
          first_name,
          last_name,
          address,
          identification_number: ID_number,
          phone,
          age: "",
          gender: "",
        },
      },
      refetchQueries: [ALL_USERS],
    })
      .then(() => {
        enqueueSnackbar("تم الإضافة بنجاح", {
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
            msg: "إن رقم الهاتف موجود مسبقا!",
          });
        } else if (err?.graphQLErrors[0]?.extensions?.code == "EMAIL_EXIST") {
          setAlert({
            // code: err?.graphQLErrors[0]?.extensions?.code,
            status: "error",
            msg: "إن هذا البريد الإلكتروني موجود بالفعل!",
          });
        } else if (err?.graphQLErrors[0]?.extensions?.code) {
          setAlert({
            // code: err?.graphQLErrors[0]?.extensions?.code,
            status: "error",
            msg: "حدث خطأ أثناء التسجيل!",
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
      title="إضافة مستخدم"
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
              label="إسم المستخدم*"
              error={errors?.user_name}
              placeholder="إسم المستخدم*"
              fullWidth
              {...register("user_name", { required: true })}
            ></Input>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
          >
            <Input
              type={"password"}
              label="كلمة مرور*"
              error={errors?.password}
              placeholder="كلمة مرور*"
              fullWidth
              {...register("password", { required: true })}
            ></Input>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Select
              error={errors?.role}
              placeholder="نوع الحساب*"
              // defaultValue={boxData?.role}
              fullWidth
              {...register("role", { required: true })}
            >
              <MenuItem value={"doctor"}>طبيب</MenuItem>
              <MenuItem value={"nurse"}>ممرضة</MenuItem>
            </Select>
          </Grid>

          <Grid
            item
            xs={12}
          >
            <Divider></Divider>
          </Grid>
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
              label="الايميل الالكتروني*"
              error={errors?.email}
              placeholder="الايميل الالكتروني*"
              fullWidth
              {...register("email", { required: true })}
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

          <Grid
            item
            xs={12}
            sm={6}
          >
            <Input
              label="رقم الهاتق"
              error={errors?.phone}
              placeholder="رقم الهاتق"
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
              label="العنوان"
              error={errors?.address}
              placeholder="العنوان"
              fullWidth
              {...register("address", { required: false })}
            ></Input>
          </Grid>
        </Grid>
      </form>
    </Modal>
  );
};

export default AddUserModal;
