import React from "react";
import { MDBDataTable } from "mdbreact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPencilAlt } from "@fortawesome/fontawesome-free-solid";

class ListCategorie extends React.Component {
  deleteMenu(id) {
    let localToken = localStorage.getItem("token");
    fetch("http://localhost:8000/css/menu/delete/" + id, {
      headers: {
        Authorization: "Token " + localToken,
      },
    }).then((response) =>
      response
        .json()
        .then((data) =>
          data.error != undefined
            ? console.log(data.error)
            : this.props.updateMenu()
        )
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

    let data = {
      columns: [
        {
          label: "Categorie",
          field: "Categorie",
          sort: "asc",
          width: 150,
        },
        {
          label: "Sport",
          field: "Sport",
          sort: "asc",
          width: 270,
        },
        {
          label: "Père",
          field: "Pere",
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
      //{"Categorie":"asba","Date":"asbtin","Action":<div><button className="btn" onClick={this.clickHandler}><FontAwesomeIcon icon={faTrashAlt} /></button></div>}
    };

    this.props.categories.forEach((menu) => {
      if (menu.type == "final") {
        data.rows.push({
          Categorie: menu.name,
          Sport: menu.name,
          Pere: "Racine",
          Action: (
            <div>
              <button className="btn" onClick={() => this.deleteMenu(menu.id)}>
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          ),
        });
      } else {
        data.rows.push({
          Categorie: menu.name,
          Sport: menu.name,
          Pere: "Racine",
          Action: <div></div>,
        });

        menu.content.forEach((submenu) => {
          if (submenu.type == "final") {
            data.rows.push({
              Categorie: submenu.name,
              Sport: menu.name,
              Pere: menu.name,
              Action: (
                <div>
                  <button
                    className="btn"
                    onClick={() => this.deleteMenu(submenu.id)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              ),
            });
          } else {
            data.rows.push({
              Categorie: submenu.name,
              Sport: menu.name,
              Pere: menu.name,
              Action: <div></div>,
            });

            submenu.content.forEach((subsubmenu) => {
              data.rows.push({
                Categorie: subsubmenu.name,
                Sport: menu.name,
                Pere: submenu.name,
                Action: (
                  <div>
                    <button
                      className="btn"
                      onClick={() => this.deleteMenu(subsubmenu.id)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </div>
                ),
              });
            });
          }
        });
      }
    });
    return (
      <div style={{ margin: 100 }}>
        <MDBDataTable striped bordered small data={data} />
      </div>
    );
  }
}
export default ListCategorie;
