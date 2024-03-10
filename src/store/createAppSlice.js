"use strict";
exports.__esModule = true;
var createAppSlice = function (set, get) { return ({
    searchValue: "",
    isLayoutDisabled: false,
    actualClient: false,
    contentScrollParentRef: undefined,
    openShipScannerModal: false,
    profilePatientInformationTabIndex: true,
    onPullRefetch: function () {
        alert(1);
    }
}); };
exports["default"] = createAppSlice;
