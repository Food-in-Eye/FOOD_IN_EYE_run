import React from "react";
import TableStyle from "../css/Table.module.css";
import { useTable } from "react-table";

function OrdersHistoryTable({ data }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "주문 시각",
        accessor: "orderTime",
        className: TableStyle.orderTimeCell,
      },
      {
        Header: "메뉴",
        accessor: "orderMenus",
        className: TableStyle.orderMenusCell,
      },
      {
        Header: "총 금액",
        accessor: "orderPrice",
        className: TableStyle.orderPriceCell,
        Cell: ({ value }) => <div style={{ textAlign: "right" }}>{value}</div>,
      },
    ],
    []
  );

  const tableData = React.useMemo(() => data, [data]);

  const tableInstance = useTable({ columns, data: tableData });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <table {...getTableProps()} className={TableStyle.orderTable}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()} className={TableStyle.orderTH}>
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td {...cell.getCellProps()} className={TableStyle.orderTD}>
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default OrdersHistoryTable;
