import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function DataTable(props) {
  //   const rows = [
  //     { id: 1, col1: "Hello", col2: "World" },
  //     { id: 2, col1: "DataGridPro", col2: "is Awesome" },
  //     { id: 3, col1: "MUI", col2: "is Amazing" },
  //   ];

  //   const columns = [
  //     { field: 'col1', headerName: 'Column 1', width: 150 },
  //     { field: 'col2', headerName: 'Column 2', width: 150 },
  //   ];

  const columnNames = Object.keys(props.output);

  const rows = [
    ...Array(
      Object.keys(props.output[Object.keys(props.output)[0]]).length
    ).keys(),
  ].map((i, j) => {
    return {
      id: j + 1,
      [columnNames[0]]: props.output[columnNames[0]][i],
      [columnNames[1]]: props.output[columnNames[1]][i],
      [columnNames[2]]: props.output[columnNames[2]][i],
    };
  });

  const columns = columnNames.map((col, b) => {
    return { field: col, headerName: col };
  });

  return (
    <div style={{ height: "35rem", width: "100%" }} className="mt-5 mb-2">
      <DataGrid
        rows={rows}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
        disableSelectionOnClick
      />
    </div>
  );
}
