import React from "react";
import { MDBDataTable } from "mdbreact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faPencilAlt,
  faDownload,
} from "@fortawesome/fontawesome-free-solid";

class Fiches extends React.Component {
  constructor(props) {
    super(props);
    this.state = { fiches: [] };
  }

  updateLocalSportifs() {

    const userId = window.location.href.substring(window.location.href.lastIndexOf("/") + 1 );

    let localToken = localStorage.getItem("token");
    let super_user = localStorage.getItem("super");

    if (localToken != undefined) {
      fetch("http://localhost:8000/css/sportif/getAll/" + userId, {
        headers: {
          Authorization: "Token " + localToken,
        },
      }).then((response) =>
        response.json().then((staffRes) => {
          if (staffRes.Error == undefined) {
            let fiches = [];
            staffRes.forEach((staffMember) => {
              fiches.push({
                id: staffMember.id,
                Membre: staffMember.nom + " " + staffMember.prenom,
                edit: staffMember.updated,
                Nationalité: staffMember.nationalite,
                dob: staffMember.dob,
                Poste: staffMember.poste,
                Mobile: staffMember.mobile,
                Categorie: staffMember.categorie_name,
                fiche: staffMember.fiche,
              });
              this.setState({ fiches });
            });
          } else {
            alert(staffRes.Error);
            window.location.href = "/";
          }
        })
      );
    }
  }

  componentDidMount() {
    this.updateLocalSportifs();
  }
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
              this.updateLocalSportifs(),
              this.state.fiches.length <= 1
                ? window.location.reload(false)
                : null)
        )
    );
  }
  render() {
    let localToken = localStorage.getItem("token");
    let super_user = localStorage.getItem("super");
    if (localToken == undefined) {
      window.location.href="/login";
    }
    const cat = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );
    let perms = localStorage.getItem("perms")
    
    if ( perms!=null && ! perms.split(";").includes(cat) && super_user != "true") {
      alert("Vous n'avez pas le droit d'acceder a cette Categorie");
      window.location.href="/";
    }
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

    this.state.fiches.forEach((menu) => {
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
            <button className="btn" onClick={() =>
                (window.location.href = "/fiches/" + menu.id)
              }>
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
            {download}

            <button
              className="btn"
              onClick={() =>
                (window.location.href = "/fiches/" + menu.id)
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
             <button className="btn" onClick={() =>
                (window.location.href = "/fiches/" + menu.id)
              }>
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
