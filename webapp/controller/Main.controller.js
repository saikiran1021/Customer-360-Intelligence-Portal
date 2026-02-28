sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
], function (Controller, Filter, FilterOperator, Sorter) {
    "use strict";

    return Controller.extend("project2.controller.Main", {

        onInit: function () {
            this._sSearchQuery = "";
            this._sCountry = "";
            this._sSortKey = "desc";
        },

        onCountryChange: function (oEvent) {
            this._sCountry = oEvent.getSource().getSelectedKey();
            this._applyFilters();
        },

        onSortChange: function (oEvent) {
            this._sSortKey = oEvent.getSource().getSelectedKey();
            this._applySorting();
        },

        _applySorting: function () {
            var oBinding = this.byId("ordersTable").getBinding("items");
            if (oBinding) {
                var bDescending = this._sSortKey === "desc";
                oBinding.sort(new Sorter("OrderDate", bDescending));
            }
        },

        onSearchLiveChange: function (oEvent) {
            this._sSearchQuery = oEvent.getParameter("newValue");
            this._applyFilters();
        },

        _applyFilters: function () {
            var aFilters = [];
            if (this._sCountry) {
                aFilters.push(new Filter("ShipCountry", FilterOperator.EQ, this._sCountry));
            }

            if (this._sSearchQuery) {
                aFilters.push(new Filter({
                    filters: [
                        new Filter("OrderID", FilterOperator.Contains, this._sSearchQuery),
                        new Filter("CustomerID", FilterOperator.Contains, this._sSearchQuery),
                        new Filter("ShipCountry", FilterOperator.Contains, this._sSearchQuery)
                    ],
                    and: false
                }));
            }

            var oBinding = this.byId("ordersTable").getBinding("items");
            if (oBinding) {
                oBinding.filter(aFilters);
            }
        },

        onOrderLinkPress: function (oEvent) {
            this.getOwnerComponent().getRouter().navTo("orderDetails", {
                orderId: oEvent.getSource().getText()
            });
        },

        onCustomerLinkPress: function (oEvent) {
            this.getOwnerComponent().getRouter().navTo("customerDashboard", {
                customerId: oEvent.getSource().getText()
            });
        }
    }); // Parenthesis and brace correctly closed here
});