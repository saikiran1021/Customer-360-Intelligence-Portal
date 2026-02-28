sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/Sorter"
], function (Controller, Filter, FilterOperator, Sorter) {
  "use strict";

  return Controller.extend("project2.controller.Main"), {

    onInit: function () {
      this._aFilters = [];
      this._sSearchQuery = "";
      this._sCountry = "";
      this._sSortKey = "desc";

      this._applySorting();
    },

    /* ================= COUNTRY FILTER ================= */
    onCountryChange: function (oEvent) {
      this._sCountry = oEvent.getSource().getSelectedKey();
      this._applyFilters();
    },

    /* ================= SORT ================= */
    onSortChange: function (oEvent) {
      this._sSortKey = oEvent.getSource().getSelectedKey();
      this._applySorting();
    },

    _applySorting: function () {
      var oTable = this.byId("ordersTable");
      var oBinding = oTable.getBinding("items");

      if (!oBinding) return;

      var bDescending = this._sSortKey === "desc";

      var oSorter = new Sorter("OrderDate", bDescending);
      oBinding.sort(oSorter);
    },

    /* ================= SEARCH ================= */
    onSearchLiveChange: function (oEvent) {
      this._sSearchQuery = oEvent.getParameter("newValue");
      this._applyFilters();
    },

    /* ================= APPLY FILTERS ================= */
    _applyFilters: function () {

      var aFilters = [];

      // Country Filter
      if (this._sCountry) {
        aFilters.push(
          new Filter("ShipCountry", FilterOperator.EQ, this._sCountry)
        );
      }

      // Search Filter
      if (this._sSearchQuery) {

        var oSearchFilter = new Filter({
          filters: [
            new Filter("OrderID", FilterOperator.Contains, this._sSearchQuery),
            new Filter("CustomerID", FilterOperator.Contains, this._sSearchQuery),
            new Filter("ShipCountry", FilterOperator.Contains, this._sSearchQuery)
          ],
          and: false
        });

        aFilters.push(oSearchFilter);
      }

      var oTable = this.byId("ordersTable");
      var oBinding = oTable.getBinding("items");

      if (oBinding) {
        oBinding.filter(aFilters);
      }
    },

    /* ================= NAVIGATION ================= */

    onOrderLinkPress: function (oEvent) {
      var sOrderId = oEvent.getSource().getText();

      this.getOwnerComponent().getRouter().navTo("order", {
        orderId: sOrderId
      });
    },

    onCustomerLinkPress: function (oEvent) {
      var sCustomerId = oEvent.getSource().getText();

      this.getOwnerComponent().getRouter().navTo("customerDashboard", {
        customerId: sCustomerId
      });
    }

  })
