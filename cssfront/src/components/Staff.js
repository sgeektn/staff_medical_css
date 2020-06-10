import React from "react";
import { MDBDataTable } from "mdbreact";

const Staff = (props) => {
  let data = {
    columns: [
      {
        label: "Membre",
        field: "Membre",
        sort: "asc",
        width: 150,
      },
      {
        label: "Fonction",
        field: "Fonction",
        sort: "asc",
        width: 270,
      },
      {
        label: "Tél",
        field: "Tél",
        sort: "asc",
        width: 200,
      },
      {
        label: "Mobile",
        field: "Mobile",
        sort: "asc",
        width: 100,
      },
      {
        label: "E-Mail",
        field: "E-Mail",
        sort: "asc",
        width: 150,
      },
    ],
    rows: props.rows,
  };


    let localToken = localStorage.getItem("token");

    if (localToken == undefined) {
      window.location.href="/login";
    }
  return (

    

    <div style={{ margin: 100 }}>
      <MDBDataTable striped bordered small data={data} />
    </div>
  );
};

export default Staff;
