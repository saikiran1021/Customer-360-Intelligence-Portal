sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
  "use strict";

  return Controller.extend("project2.controller.CustomerDashboard", {

    onInit: function () {

      this.getOwnerComponent().getRouter()
        .getRoute("customerDashboard")
        .attachPatternMatched(this._onObjectMatched, this);

      this.getView().setModel(new JSONModel({
        totalOrders: 0,
        totalFreight: 0,
        avgFreight: 0,
        yearData: [],
        freightDistribution: []
      }), "dashboard");
    },

    _onObjectMatched: function (oEvent) {

      var sCustomerId = oEvent.getParameter("arguments").customerId;

      this.getView().bindElement({
        path: "/Customers('" + sCustomerId + "')"
      });

      this._loadOrders(sCustomerId);
    },

    _loadOrders: function (sCustomerId) {

      var oModel = this.getView().getModel();
      var oDashboardModel = this.getView().getModel("dashboard");

      oModel.read("/Orders", {
        filters: [
          new sap.ui.model.Filter("CustomerID",
            sap.ui.model.FilterOperator.EQ,
            sCustomerId)
        ],
        success: function (oData) {

          var aOrders = oData.results;
          var totalFreight = 0;
          var oYearMap = {};

          aOrders.forEach(function (oOrder) {

            totalFreight += oOrder.Freight;

            var year = new Date(oOrder.OrderDate).getFullYear();
            oYearMap[year] = (oYearMap[year] || 0) + 1;
          });

          var aYearData = Object.keys(oYearMap).map(function (key) {
            return {
              year: key,
              count: oYearMap[key]
            };
          });

          oDashboardModel.setData({
            totalOrders: aOrders.length,
            totalFreight: totalFreight.toFixed(2),
            avgFreight: (totalFreight / aOrders.length || 0).toFixed(2),
            yearData: aYearData,
            freightDistribution: [{
              value: totalFreight > 0 ? 70 : 0
            }]
          });
        }
      });
    },

    onNavBack: function () {
      this.getOwnerComponent().getRouter().navTo("home");
    }

  });
});