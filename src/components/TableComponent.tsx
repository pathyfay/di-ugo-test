import React, {useMemo, useState} from "react";
import {getCalculTotalOrders, getFormattedHeadersByLabel, toCamelCase} from "../Utils.tsx";
import {AgGridReact} from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

type TableComponentProps = {
    arrayData: any[],
    isTotal: boolean
};
const TableComponent: React.FC<TableComponentProps> = ({arrayData, isTotal}) => {
    let totalOrders: any = {};
    let headers: string[] = [];
    if (arrayData.length > 0) {
        headers = Object.keys(arrayData[0]);
        headers = getFormattedHeadersByLabel([arrayData[0]], "id");
    }

    let totalRow = {}
    if (isTotal) {
        totalOrders = getCalculTotalOrders(arrayData);
        totalRow = {
            orderDate: 'Total :',
            price: 0,
            currency: 'Dollars / Euros'
        };
    }

    const CustomButtonComponent = (props: { data: { actions: any[]; }; }) => {
        if (Array.isArray(props.data.actions) && props.data.actions.length > 0) {
            return (
                <div>
                    {props.data.actions.map((action, index) => (
                        <button
                            key={index}
                            className={action.className}
                            onClick={action.action}>
                            {action.btnLabel}
                        </button>
                    ))}
                </div>
            );
        }
    };

    const newHeaders = headers.map(header => {
        if (header.toLowerCase() === 'actions') {
            return {
                field: "actions",
                headerName: "Actions",
                flex: 2,
                cellRenderer: CustomButtonComponent
            };
        } else if (header.toLowerCase() === 'price') {
            return {
                field: 'price',
                headerName: 'price',
                flex: 2,
                valueFormatter: (params: {
                    node: { rowPinned: any; };
                    data: { currency: string; };
                    value: any;
                }) => {
                    if (params.node.rowPinned) {
                        let totalString = totalOrders.dollars ? '$: ' + totalOrders.dollars + ' / ' : '';
                        totalString += totalOrders.euros ? ' €: ' + totalOrders.euros : '';
                        return totalString;
                    }
                    const currency = params.data.currency ?? 'euros';
                    const value = params.value || 0;
                    return (currency === 'dollars') ? '$ ' + value : '€ ' + value;
                }
            }
        } else {
            return {
                field: toCamelCase(header.toLowerCase()),
                headerName: toCamelCase(header.toLowerCase()),
                flex: 1,
                valueFormatter: (params: { value: any }) => {
                    if (typeof params.value === 'object') {
                        return JSON.stringify(params.value);
                    }
                    return params.value || '';
                }
            }
        }
    });

    const [rowData] = useState(arrayData);
    const colDefs = useMemo(() => newHeaders, [arrayData]);
    const pagination = true;
    const paginationPageSize = 20;
    const paginationPageSizeSelector = [5, 10, 20, 50, 100];

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