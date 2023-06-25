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
import { useCreateTemplate, useUpdateTemplate } from "../../graphql/hooks/template";
import { all_Formats } from "../../graphql/hooks/users/useGetTemplatesForUsers";
interface Props {
  open?: boolean;
  inputWho?: string;
  onClose?: () => void;
  dataInfo?: any;
}

const initialInputs = (data?: any) => ({
  message: data?.message,
  type: data?.type,
});

const EditTemplateModal = ({ open, onClose, inputWho, dataInfo }: Props) => {
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
  let [updateForModal] = useUpdateTemplate();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  let onFormSubmit = ({ message, type }: any) => {
    setSubmitLoading(true);
    updateForModal({
      variables: {
        updateFormatId: dataInfo?.id,
        content: {
          message,
          type: inputWho,
        },
      },
      refetchQueries: [all_Formats],
    })
      .then(() => {
        // enqueueSnackbar("הוספת בהצלחה", {
        //   variant: "success",
        // });
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
    }
  }, [open]);

  return (
    <Modal
      // @ts-ignore
      open={open}
      sx={{ zIndex: 99999999 }}
      onClose={closeHandler}
      title="הוסף תבנית"
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
            form="add_shipment1324"
          >
            تأكيد
          </Button>
        </>
      }
    >
      <form id="add_shipment1324" onSubmit={handleSubmit(onFormSubmit)}>
        <Grid container boxSizing={"border-box"} spacing={2}>
          <Grid item xs={12}>
            <TextArea
              label="תוכן תבנית*"
              placeholder="תוכן תבנית*"
              fullWidth
              minRows={4}
              maxRows={8}
              error={errors?.message}
              {...register("message", { required: true })}
            ></TextArea>
          </Grid>
        </Grid>
      </form>
    </Modal>
  );
};

export default EditTemplateModal;
