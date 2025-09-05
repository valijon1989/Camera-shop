import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";

const selectOrdersPage = (state: AppRootState) => state.orderPage;

export const selectPausedOrders = createSelector(
    [selectOrdersPage],
    (OrderPage) => OrderPage.pausedOrders
);

export const selectProcessOrders = createSelector(
    [selectOrdersPage],
    (OrderPage) => OrderPage.processOrders
);

export const selectFinishedOrders = createSelector(
    [selectOrdersPage],
    (OrderPage) => OrderPage.finishedOrders
);

