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
import { useCreatePrescription } from "../../graphql/hooks/prescription";
import { All_Prescription } from "../../graphql/hooks/prescription/useGetPrescription";
interface Props {
  open: boolean;
  onClose?: () => void;
  id?: string;
  dataInfo: any;
}

const initialInputs = (data?: any) => ({
  title: data?.title,
});

const EditPrescriptionModal = ({ open, onClose, id, dataInfo }: Props) => {
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
  let [createForModal] = useCreatePrescription();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  let onFormSubmit = ({ title }: any) => {
    setSubmitLoading(true);
    createForModal({
      variables: {
        content: {
          title,
          id_sick: id!,
        },
      },
      refetchQueries: [All_Prescription],
    })
      .then(() => {
        enqueueSnackbar("נערך בהצלחה", {
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
      reset(initialInputs(dataInfo));
    }
  }, [open]);
  return (
    <Modal
      open={open}
      onClose={closeHandler}
      title="تعديل روشيتا"
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
          {/* complaint,
    physical_examination,
    diagnosis,
    recommendations,
    nurse_order, */}

          <Grid item xs={12}>
            <Input
              label="عنوان"
              error={errors?.title}
              placeholder="عنوان"
              fullWidth
              {...register("title", { required: true })}
            ></Input>
          </Grid>
        </Grid>
      </form>
    </Modal>
  );
};

export default EditPrescriptionModal;
