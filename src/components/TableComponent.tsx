import React, {useState} from "react";
import {getCalculTotalOrders, isOrderTypeArray, toCamelCase} from "../Utils.tsx";
import {AgGridReact} from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

type TableComponentProps = {
    headers: string[];
    datas: any[],
    isIndex: true
    isAction: false
    isTotal: false
};
const TableComponent: React.FC<TableComponentProps> = ({headers, datas, isIndex, isAction, isTotal}) => {
    let totalOrders = {};

    if (isAction) {
        headers = [...headers, "Actions"];
    }

    if (isOrderTypeArray(datas)) {
        totalOrders = getCalculTotalOrders(datas);
    }
    const CustomButtonComponent = (props) => {
        console.log(props);
        const action = props.data.actions && props.data.actions[0];
        return action ? (
            <button className={action.className} onClick={action.action}>
                {action.btnLabel}
            </button>
        ) : null;
    };

    const newHeaders = headers.map(header => {
        if (header.toLowerCase() === 'actions') {
            return {field: "actions", flex: 2, cellRenderer: CustomButtonComponent}
        } else if (header.toLowerCase() === 'price') {
            return {
                field: 'price',
                headerName: 'Price',
                flex: 1,
                valueFormatter: (params) => {
                    if (params.node.rowPinned) {
                        let totalString = totalOrders.dollars ? '$: ' + totalOrders.dollars + ' / ' : '';
                        totalString += totalOrders.euros ? ' $: ' + totalOrders.euros : '';
                        return totalString;
                    }
                    const currency = params.data.currency ?? 'euros';
                    return (currency === 'dollars') ? '$ ' + params.value : '€ ' + params.value;
                }
            }
        } else {
            return {field: toCamelCase(header.toLowerCase()), editable: true, cellEditor: 'agSelectCellEditor', flex: 1}
        }
    });

    const [rowData, setRowData] = useState(datas);
    const [colDefs, setColDefs] = useState(newHeaders);
    const pagination = true;
    const paginationPageSize = 500;
    const paginationPageSizeSelector = [200, 500, 1000];
    const totalRow = {
        purchaseIdentifier: 'Total',
        price: 0,
        currency: 'Dollars / Euros'
    };

    return (
        <div className="ag-theme-quartz-dark" style={{height: 500}}>
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                pagination={pagination}
                paginationPageSize={paginationPageSize}
                paginationPageSizeSelector={paginationPageSizeSelector}
                pinnedBottomRowData={[totalRow]}
                domLayout="autoHeight"
            />
        </div>
    );
}

export default TableComponent;