import React, {useState} from "react";
import {getCalculTotalOrders,isOrderTypeArray, toCamelCase} from "../Utils.tsx";
import {useNavigate} from "react-router-dom";

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

    return (
        <table className="table table-xs bordered rounded-md border-collapse border border-slate-400">
            <thead>
            <tr>
                {isIndex && (<th className="border border-slate-300 text-blue-100">#</th>)}
                {headers.map((header, index) => (
                    <th className="border border-slate-300 text-blue-100"
                        key={index}>{header.replace('_', ' ').toUpperCase()}</th>
                ))}
            </tr>
            </thead>
            <tbody>

            {datas.map((data, rowIndex) => (
                <tr key={rowIndex}>
                    {isIndex && (
                        <td key={rowIndex}>{rowIndex + 1}</td>
                    )}
                    {headers.map((header, colIndex) => {
                        if (header === 'Actions') {
                            return (
                                <td className="border border-slate-300 text-amber-50" key={colIndex}>
                                    {data.actions && data.actions.map((action, actionIndex) => (
                                        <button
                                            key={actionIndex}
                                            className={action.className}
                                            onClick={action.action}
                                        >
                                            {action.btnLabel}
                                            {data.idClick}
                                        </button>
                                    ))}
                                </td>
                            );
                        } else {
                            return (
                                <td className="border border-slate-300 text-amber-50" key={colIndex}>
                                    {data[toCamelCase(header)] || ''}
                                </td>
                            );
                        }
                    })}
                </tr>
            ))}


            {isTotal && (
                <tr key="total-row">
                    <td className="border border-slate-300">Total :</td>
                    <td colSpan={headers.length} className="border border-slate-300 justify-center">
                        {totalOrders && Object.entries(totalOrders).length > 0 ? (Object.entries(totalOrders).map(([currency, total]) => (
                            <span className="text-amber-50 font-bold" key={currency.toUpperCase()}>
                                    {currency.toUpperCase()}: {total.toFixed(2)}<br/>
                            </span>
                        ))) : (
                            <span className="text-amber-50 font-bold">0</span>
                        )}
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    );
}

export default TableComponent;