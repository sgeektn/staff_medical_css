import React from "react";
import { MDBDataTable } from "mdbreact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPencilAlt } from "@fortawesome/fontawesome-free-solid";

class ListUser extends React.Component {
  deleteStaff(id) {
    let token = localStorage.getItem("token");
    fetch("http://localhost:8000/css/user/delete/" + id, {
      headers: {
        Authorization: "Token " + token,
      },
    }).then((response) =>
      response.json().then((token) => {
        token.Error != "None" ? alert(token.Error) : this.props.updateStaff();
      })
    );
  }

  render() {
    let localToken = localStorage.getItem("token");
    let super_user = localStorage.getItem("super");
    if (localToken == undefined) {
      window.location.href = "/login";
      return null;
    } else if (super_user != "true") {
      window.location.href = "/";
      return null;
    }

    let staff = [];
    this.props.staff.forEach((staffPerson) => {
      let objectStaff = Object.assign({}, staffPerson);
      objectStaff["Action"] = (
        <div>
          <button
            className="btn"
            onClick={() => {
              window.location.href = "/dashboard/staff/edit/" + objectStaff.id;
            }}
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </button>
          <button
            className="btn"
            onClick={() => this.deleteStaff(objectStaff.id)}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>
      );
      staff.push(objectStaff);
    });
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
        {
          label: "Action",
          field: "Action",
          sort: "asc",
          width: 150,
        },
      ],
      rows: staff,
    };

    return (
      <div style={{ margin: 100 }}>
        <MDBDataTable striped bordered small data={data} />
      </div>
    );
  }
}
export default ListUser;
