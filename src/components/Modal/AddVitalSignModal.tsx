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
interface Props {
  open: boolean;
  onClose?: () => void;
  id?: string;
}

const initialInputs = {
  body_temperature: "",
  blood_pressure: "",
  number_breaths: "",
  blood_sugar: "",
  oxygen_saturation: "",
  heart_beat: "",
};

const AddVitalSignModal = ({ open, onClose, id }: Props) => {
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
  let [createForModal] = useCreateVitalSign();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  let onFormSubmit = ({ body_temperature, blood_pressure, number_breaths, blood_sugar, oxygen_saturation, heart_beat }: any) => {
    setSubmitLoading(true);
    createForModal({
      variables: {
        data: {
          blood_pressure,
          blood_sugar,
          body_temperature,
          heart_beat,
          number_breaths,
          oxygen_saturation,
          patientsId: parseInt(id as any),
        },
      },
      refetchQueries: [All_VitalSigns],
    })
      .then(() => {
        enqueueSnackbar("تم الإضافة بنجاح", {
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
      title="إضافة علامة حيوية"
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
            sm={6}
          >
            <Input
              label="حرارة الجسم"
              error={errors?.body_temperature}
              placeholder="حرارة الجسم"
              fullWidth
              {...register("body_temperature", { required: false })}
            ></Input>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
          >
            <Input
              label="نبضات القلب"
              error={errors?.heart_beat}
              placeholder="نبضات القلب"
              fullWidth
              {...register("heart_beat", { required: false })}
            ></Input>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
          >
            <Input
              label="ضغط الدم"
              error={errors?.blood_pressure}
              placeholder="ضغط الدم"
              fullWidth
              {...register("blood_pressure", { required: false })}
            ></Input>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
          >
            <Input
              label="عدد مرات التنفس"
              error={errors?.number_breaths}
              placeholder="عدد مرات التنفس"
              fullWidth
              {...register("number_breaths", { required: false })}
            ></Input>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
          >
            <Input
              label="السكري"
              error={errors?.blood_sugar}
              placeholder="السكري"
              fullWidth
              {...register("blood_sugar", { required: false })}
            ></Input>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
          >
            <Input
              label="تشبع الأكسجين
"
              error={errors?.oxygen_saturation}
              placeholder="تشبع الأكسجين
"
              fullWidth
              {...register("oxygen_saturation", { required: false })}
            ></Input>
          </Grid>
        </Grid>
      </form>
    </Modal>
  );
};

export default AddVitalSignModal;
