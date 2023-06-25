import { Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { Check, X } from "react-feather";
import { useForm } from "react-hook-form";
import { useCreateRequest } from "../../graphql/hooks/shipments";
import useStore from "../../store/useStore";
import Button from "../Button";
import TextArea from "../Input/TextArea";
import Modal, { Props as ModalProps } from "./Modal";

interface Props extends ModalProps {
  open: boolean;
  onClose?: (callback: () => any) => void;
  requestStatus?: number;
  oneShipmentInfo?: string;
}

const RequestModal = (props: Props) => {
  const [createRequestMutation, { data: requestData }] = useCreateRequest();
  let userData = useStore((state: any) => state.userData);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let [submitLoading, setSubmitLoading] = useState<boolean>(false);

  let {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm();
  let onFormSubmit = ({ note }: any) => {
    setSubmitLoading(true);

    let stockID = createRequestMutation({
      variables: {
        content: {
          id_stock:
            props.requestStatus !== 14
              ? userData?.person?.list_stock_accesses?.stock.id
              : (props?.oneShipmentInfo as any)?.lastTrace?.[0]?.stock.id,
          id_person: userData?.person?.id,
          id_box: (props?.oneShipmentInfo as any)?.id,
          status: props.requestStatus,
          note: note,
        },
      },
    })
      .then(() => {
        enqueueSnackbar("تم إرسال طلبك بنجاح", {
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
    typeof props.onClose == "function" &&
      props.onClose(() => {
        reset({ note: "" });
      });
  };

  return (
    <Modal
      {...props}
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
            form="add_request"
          >
            تأكيد
          </Button>
        </>
      }
    >
      <form id="add_request" onSubmit={handleSubmit(onFormSubmit)}>
        <Grid container>
          <Grid item xs={12}>
            <TextArea
              placeholder="ملاحظة (إختياري)"
              fullWidth
              minRows={6}
              maxRows={12}
              {...register("note")}
            ></TextArea>
          </Grid>
        </Grid>
      </form>
    </Modal>
  );
};

export default RequestModal;
