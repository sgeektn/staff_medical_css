import React from "react";
import { MDBDataTable } from "mdbreact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faPencilAlt,
  faDownload,
} from "@fortawesome/fontawesome-free-solid";

class Fiches extends React.Component {
  deleteMenu(id) {
    let localToken = localStorage.getItem("token");
    fetch("http://localhost:8000/css/sportif/delete/" + id, {
      headers: {
        Authorization: "Token " + localToken,
      },
    }).then((response) =>
      response
        .json()
        .then((data) =>
          data.Error != "None"
            ? console.log(data.Error)
            : (this.props.updateSportifs(),
              this.props.sportifs.length <= 1
                ? window.location.reload(false)
                : null)
        )
    );
  }
  render() {
    let data = {
      columns: [
        {
          label: "Membre",
          field: "Membre",
          sort: "asc",
          width: 150,
        },
        {
          label: "Categorie",
          field: "Categorie",
          sort: "asc",
          width: 150,
        },
        {
          label: "Modifié le",
          field: "edit",
          sort: "asc",
          width: 270,
        },
        {
          label: "Nationalité",
          field: "Nationalité",
          sort: "asc",
          width: 270,
        },
        {
          label: "Poste",
          field: "Poste",
          sort: "asc",
          width: 270,
        },
        {
          label: "Date de naissance",
          field: "dob",
          sort: "asc",
          width: 270,
        },
        {
          label: "Mobile",
          field: "Mobile",
          sort: "asc",
          width: 270,
        },
        {
          label: "Action",
          field: "Action",
          sort: "asc",
          width: 200,
        },
      ],
      rows: [],
    };
    let super_user = localStorage.getItem("super");

    this.props.sportifs.forEach((menu) => {
      let clone = Object.assign({}, menu);

      let download =
        menu.fiche == "" ? null : (
          <a
            href={"data:application/pdf;base64," + menu.fiche}
            className="btn"
            download="fiche.pdf"
          >
            <FontAwesomeIcon icon={faDownload} />
          </a>
        );
      if (super_user == "true") {
        clone["Action"] = (
          <div>
            <button className="btn" onClick={() => this.deleteMenu(menu.id)}>
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
            {download}

            <button
              className="btn"
              onClick={() =>
                (window.location.href = "/dashboard/fiches/edit/" + menu.id)
              }
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
          </div>
        );
        data.rows.push(clone);
      } else {
        clone["Action"] = (
          <div>
            {download}
            <button className="btn" onClick={() => this.deleteMenu(menu.id)}>
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
          </div>
        );
        data.rows.push(clone);
      }
    });
    return (
      <div style={{ margin: 100 }}>
        <MDBDataTable striped bordered small data={data} />
      </div>
    );
  }
}
export default Fiches;
