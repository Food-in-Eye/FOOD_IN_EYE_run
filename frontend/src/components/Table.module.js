import React from "react";
import "../css/Table.module.css";
import { useTable } from "react-table";

function OrderHistoryTable({ data }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "메뉴 이름",
        accessor: "menuName",
        Cell: ({ value }) => <div style={{ textAlign: "left" }}>{value}</div>,
      },
      {
        Header: "메뉴 개수",
        accessor: "menuCount",
      },
      {
        Header: "메뉴 단가",
        accessor: "menuPrice",
      },
      {
        Header: "메뉴 총 가격",
        accessor: "menuPrices",
      },
    ],
    []
  );

  const tableData = React.useMemo(() => data, [data]);

  const tableInstance = useTable({ columns, data: tableData });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const total = React.useMemo(() => {
    let sum = 0;
    data.forEach((item) => {
      sum += item.menuPrice * item.menuCount;
    });
    return sum;
  }, [data]);

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
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
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="3" style={{ textAlign: "left" }}>
            총합계:
          </td>
          <td style={{ textAlign: "right" }}>{total}</td>
        </tr>
      </tfoot>
    </table>
  );
}

export default OrderHistoryTable;
