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
import { useCreateDiagnosis, useUpdateDiagnosis } from "../../graphql/hooks/diagnosis";
import { All_Diagnosis } from "../../graphql/hooks/diagnosis/useGetDiagnosis";
import { DatePicker } from "@mui/lab";
import dayjs from "dayjs";
interface Props {
  open: boolean;
  onClose?: () => void;
  id?: string;
  dataInfo?: any;
}

const initialInputs = (data?: any) => ({
  complaint: data?.complaint,
  physical_examination: data?.physical_examination,
  diagnosis: data?.diagnosis,
  recommendations: data?.recommendations,
  medical_history: data?.medical_history,
});

const EditDiagnosisModal = ({ open, onClose, id, dataInfo }: Props) => {
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
  let [updateForModal] = useUpdateDiagnosis();
  const [value, setValue] = React.useState<any | null>(null);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  let onFormSubmit = ({ complaint, physical_examination, diagnosis, recommendations, medical_history }: any) => {
    setSubmitLoading(true);
    updateForModal({
      variables: {
        updateDiagnosisId: dataInfo?.id,
        data: {
          complaint,
          physical_examination,
          diagnosis,
          recommendations,
          medical_history,
          patientsId: parseInt(id!),
        },
      },
      refetchQueries: [All_Diagnosis],
    })
      .then(() => {
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
    reset(initialInputs());
    typeof onClose == "function" && onClose();
  };

  useEffect(() => {
    if (open) {
      reset(initialInputs(dataInfo));
      setValue(dataInfo?.medical_history ? dayjs(dataInfo?.medical_history, "DD/MM/YYYY") : null);
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={closeHandler}
      title="تعديل التشخيص"
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
              label="الشكوى*"
              error={errors?.complaint}
              placeholder="الشكوى*"
              fullWidth
              {...register("complaint", { required: true })}
            ></Input>
          </Grid>

          <Grid
            item
            xs={12}
          >
            <TextArea
              label="التاريخ المرضي"
              placeholder="التاريخ المرضي"
              fullWidth
              minRows={4}
              maxRows={8}
              error={errors?.medical_history}
              {...register("medical_history", { required: false })}
            ></TextArea>
          </Grid>

          <Grid
            item
            xs={12}
          >
            <TextArea
              label="الفحص البدني"
              placeholder="الفحص البدني"
              fullWidth
              minRows={4}
              maxRows={8}
              error={errors?.physical_examination}
              {...register("physical_examination", { required: false })}
            ></TextArea>
          </Grid>

          <Grid
            item
            xs={12}
          >
            <TextArea
              label="التشخيص"
              placeholder="التشخيص"
              fullWidth
              minRows={3}
              maxRows={4}
              error={errors?.diagnosis}
              {...register("diagnosis", { required: false })}
            ></TextArea>
          </Grid>

          <Grid
            item
            xs={12}
          >
            <TextArea
              label="امر الطبيب"
              placeholder="امر الطبيب"
              fullWidth
              minRows={3}
              maxRows={4}
              error={errors?.recommendations}
              {...register("recommendations", { required: false })}
            ></TextArea>
          </Grid>
        </Grid>
      </form>
    </Modal>
  );
};

export default EditDiagnosisModal;
