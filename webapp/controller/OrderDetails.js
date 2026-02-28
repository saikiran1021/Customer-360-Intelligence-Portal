sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";

  return Controller.extend("project2.controller.OrderDetails", {

    onInit: function () {

      this.getOwnerComponent().getRouter()
        .getRoute("order")
        .attachPatternMatched(this._onObjectMatched, this);
    },

    _onObjectMatched: function (oEvent) {

      var sOrderId = oEvent.getParameter("arguments").orderId;

      this.getView().bindElement({
        path: "/Orders(" + sOrderId + ")"
      });
    },

    onNavBack: function () {
      this.getOwnerComponent().getRouter().navTo("home");
    }

  });
});