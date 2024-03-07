import { Box, Divider, Grid, IconButton, InputAdornment, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { amber, blue, grey, red } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { Check, Plus, Search, Trash2, Upload, X } from "react-feather";
import { ClipboardList } from "lucide-react";
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
import { DatePicker } from "@mui/lab";
import dayjs, { Dayjs } from "dayjs";
import { slate } from "../../styles/theme";
import ChooseTemplateModal from "./ChooseTemplateModal";
interface Props {
  open: boolean;
  onClose?: () => void;
  id?: string;
}

const initialInputs = {
  complaint: "",
  physical_examination: "",
  diagnosis: "",
  recommendations: "",
  medical_history: "",
};

const AddDiagnosisModal = ({ open, onClose, id }: Props) => {
  let {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm();

  let [templateInputData, setTemplateInputData] = useState<any>("");
  const [value, setValue] = React.useState<any | null>(null);

  let [submitLoading, setSubmitLoading] = useState<boolean>(false);

  let userData = useStore((state: any) => state.userData);
  let [createForModal] = useCreateDiagnosis();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [OpenAddTemplateModal, setOpenAddTemplateModal] = React.useState<{
    open?: boolean;
    inputWho?: any;
  }>({
    open: false,
    inputWho: "",
  });

  let onFormSubmit = ({ complaint, physical_examination, diagnosis, recommendations, medical_history }: any) => {
    setSubmitLoading(true);
    createForModal({
      variables: {
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
        enqueueSnackbar("הוספת בהצלחה", {
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
  useEffect(() => {
    // if (open) {
    reset({ [OpenAddTemplateModal?.inputWho]: templateInputData });
    // }
  }, [templateInputData]);
  return (
    <Modal
      open={open}
      onClose={closeHandler}
      title="إضافة التشخيص"
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
      <>
        <form
          id="add_shipment"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <Grid
            container
            boxSizing={"border-box"}
            spacing={2}
          >
            {/* complaint,
    physical_examination,
    diagnosis,
    recommendations,
    nurse_order, */}

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
                label="التاريخ المريضي"
                placeholder="التاريخ المريضي"
                fullWidth
                minRows={4}
                maxRows={8}
                // InputProps={{
                //   endAdornment: (
                //     <InputAdornment
                //       position="end"
                //       sx={{ paddingRight: "10px", marginTop: "-5px" }}
                //     >
                //       <IconButton
                //         onClick={() =>
                //           setOpenAddTemplateModal({
                //             ...OpenAddTemplateModal,
                //             open: true,
                //             inputWho: "medical_history",
                //           })
                //         }
                //       >
                //         <ClipboardList
                //           size={20}
                //           color={slate[600]}
                //         />
                //       </IconButton>
                //     </InputAdornment>
                //   ),
                // }}
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
                label="توصيات الطبيب"
                placeholder="توصيات الطبيب"
                fullWidth
                minRows={3}
                maxRows={4}
                // InputProps={{
                //   endAdornment: (
                //     <InputAdornment
                //       position="end"
                //       sx={{ paddingRight: "10px", marginTop: "-5px" }}
                //     >
                //       <IconButton
                //         onClick={() =>
                //           setOpenAddTemplateModal({
                //             ...OpenAddTemplateModal,
                //             open: true,
                //             inputWho: "recommendations",
                //           })
                //         }
                //       >
                //         <ClipboardList
                //           size={20}
                //           color={slate[600]}
                //         />
                //       </IconButton>
                //     </InputAdornment>
                //   ),
                // }}
                error={errors?.recommendations}
                {...register("recommendations", { required: false })}
              ></TextArea>
            </Grid>
          </Grid>
        </form>
        <ChooseTemplateModal
          open={OpenAddTemplateModal?.open!}
          inputWho={OpenAddTemplateModal?.inputWho}
          setTemplateInputData={setTemplateInputData}
          onClose={() =>
            setOpenAddTemplateModal({
              ...OpenAddTemplateModal,
              open: false,
            })
          }
          // id={route.query?.id as any}
        ></ChooseTemplateModal>
      </>
    </Modal>
  );
};

export default AddDiagnosisModal;
