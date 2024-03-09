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
import { useCreateAlbum } from "../../graphql/hooks/album";
import { slate } from "../../styles/theme";
import { All_Album } from "../../graphql/hooks/album/useGetAlbum";
import { useCreateNurseDuty } from "../../graphql/hooks/nurseDuty";
import { All_NurseOrder } from "../../graphql/hooks/nurseDuty/useGetNurseDuty";
interface Props {
  open: boolean;
  onClose?: () => void;
  id?: string;
}

const initialInputs = {
  nurse_order: "",
};

const AddNurseDutyModal = ({ open, onClose, id }: Props) => {
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
  let [createForModal] = useCreateNurseDuty();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  let onFormSubmit = ({ nurse_order }: any) => {
    setSubmitLoading(true);

    createForModal({
      variables: {
        data: {
          checked: false,
          note: nurse_order,
          patientsId: parseInt(id! as any),
        },
      },
      refetchQueries: [All_NurseOrder],
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
      title="إضافة امر"
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
            <TextArea
              label="الوصف*"
              placeholder="الوصف*"
              fullWidth
              minRows={4}
              maxRows={4}
              error={errors?.nurse_order}
              {...register("nurse_order", { required: true })}
            ></TextArea>
          </Grid>
        </Grid>
      </form>
    </Modal>
  );
};

export default AddNurseDutyModal;
