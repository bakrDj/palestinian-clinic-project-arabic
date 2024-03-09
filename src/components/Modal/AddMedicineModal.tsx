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
import { useCreatePrescription } from "../../graphql/hooks/prescription";
import { All_Prescription } from "../../graphql/hooks/prescription/useGetPrescription";
import { useCreateMedicine } from "../../graphql/hooks/medicine";
interface Props {
  open: boolean;
  onClose?: () => void;
  id?: string;
  dataInfo?: any;
}

const initialInputs = {
  duration: "",
  name: "",
  note: "",
  quantity: "",
  times_per_day: "",
  giving: "",
};

const AddMedicineModal = ({ open, onClose, id, dataInfo }: Props) => {
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
  let [createForModal] = useCreateMedicine();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  let onFormSubmit = ({ duration, name, note, quantity, times_per_day, giving }: any) => {
    setSubmitLoading(true);
    createForModal({
      variables: {
        data: {
          duration: duration,
          name,
          note,
          quantity,
          times_per_day: times_per_day,
          giving,
          prescriptionId: parseInt(id as any),
        },
      },
      refetchQueries: [All_Prescription],
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
      title="إضافة دواء"
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
          {/* 
         duration: "",
  name: "",
  note: "",
  quantity: "",
  times_per_day: "",
         
         */}

          <Grid
            item
            xs={12}
            md={6}
          >
            <Input
              label="إسم الدواء*"
              error={errors?.name}
              placeholder="إسم الدواء*"
              fullWidth
              {...register("name", { required: true })}
            ></Input>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
          >
            <Input
              label="طريقة إعطاءه"
              error={errors?.giving}
              placeholder="طريقة إعطاءه"
              fullWidth
              {...register("giving", { required: false })}
            ></Input>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
          >
            <Input
              label="الكمية"
              error={errors?.quantity}
              placeholder="الكمية"
              fullWidth
              {...register("quantity", { required: false })}
            ></Input>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
          >
            <Input
              type={"number"}
              label="عدد المرات (في اليوم)"
              error={errors?.times_per_day}
              placeholder="عدد المرات (في اليوم)"
              fullWidth
              {...register("times_per_day", { required: false })}
            ></Input>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
          >
            <Input
              type={"number"}
              label="المدة (أيام)"
              error={errors?.duration}
              placeholder="المدة (أيام)"
              fullWidth
              {...register("duration", { required: false })}
            ></Input>
          </Grid>
        </Grid>
      </form>
    </Modal>
  );
};

export default AddMedicineModal;
