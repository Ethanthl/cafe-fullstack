import React from "react";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
// Will use `dart-sass` once CodeSandbox supports it.
// See https://github.com/codesandbox/codesandbox-client/issues/4742
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const Grid: React.FC<AgGridReactProps> = (props) => {
   
  return (
    <div
      className="ag-theme-alpine"
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <AgGridReact  {...props} />
    </div>
  );
};

export default Grid;
