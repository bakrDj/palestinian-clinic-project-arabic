const createAppSlice = (set: any, get: any) => ({
  searchValue: "",
  isLayoutDisabled: false,
  actualClient: false,
  contentScrollParentRef: undefined,
  openShipScannerModal: false,
  profilePatientInformationTabIndex: true,

  onPullRefetch: () => {
    alert(1);
  },
});

export default createAppSlice;
