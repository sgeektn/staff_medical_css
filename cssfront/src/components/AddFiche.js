import React from "react";
import "./Dashboard.css";

export const fileToBase64 = (filename, filepath) => {
  return new Promise((resolve) => {
    var file = new File([filename], filepath);
    var reader = new FileReader(); // Read file content on file loaded event
    reader.onload = function (event) {
      resolve(event.target.result);
    };

    // Convert data to base64
    reader.readAsDataURL(file);
  });
};

class AddFiche extends React.Component {
  constructor(props) {
    super(props);
    this.permCat = [];
    this.state = { file: "" };
  }

  componentDidMount() {
    if (this.props.what == "edit") {
      const userId = window.location.href.substring(
        window.location.href.lastIndexOf("/") + 1
      );
      let super_user = localStorage.getItem("super");

      let localToken = localStorage.getItem("token");

      if (super_user != "true") {
        document.getElementById("first_name").disabled = true;
        document.getElementById("last_name").disabled = true;
        document.getElementById("mobile").disabled = true;
        document.getElementById("nationalite").disabled = true;
        document.getElementById("mobile").disabled = true;
        document.getElementById("poste").disabled = true;
        document.getElementById("dob").disabled = true;
        this.permCat.forEach(
          (perm) => (document.getElementById("perm" + perm.id).disabled = true)
        );
      }
      if (localToken != undefined) {
        fetch("http://localhost:8000/css/sportif/get/" + userId, {
          headers: {
            Authorization: "Token " + localToken,
          },
        }).then((response) =>
          response
            .json()
            .then((staffRes) =>
              staffRes.Error != "None" && staffRes.Error != undefined
                ? (alert(staffRes.Error), (window.location.href = "../"))
                : ((document.getElementById("first_name").value = staffRes.nom),
                  (document.getElementById("last_name").value =
                    staffRes.prenom),
                  (document.getElementById("mobile").value = staffRes.mobile),
                  (document.getElementById("nationalite").value =
                    staffRes.nationalite),
                  (document.getElementById("mobile").value = staffRes.mobile),
                  (document.getElementById("poste").value = staffRes.poste),
                  (document.getElementById("dob").value = staffRes.dob),
                  document.getElementById("perm" + staffRes.categorie) != null
                    ? (document.getElementById(
                        "perm" + staffRes.categorie
                      ).checked = true)
                    : null)
            )
        );
      }
    }
  }

  onChangeHandler = (event) => {
    console.log(event.target.files[0]);
    document.getElementById("filename").innerHTML = event.target.files[0].name;

    var file = event.target.files[0],
      reader = new FileReader();
    reader.onloadend = () => {
      // Since it contains the Data URI, we should remove the prefix and keep only Base64 string
      var b64 = reader.result.replace(/^data:.+;base64,/, "");
      console.log(b64); //-> "R0lGODdhAQABAPAAAP8AAAAAACwAAAAAAQABAAACAkQBADs="
      this.setState({ file: b64 });
    };
    reader.readAsDataURL(file);
  };

  handleValidate() {
    let localToken = localStorage.getItem("token");

    let first_name = document.getElementById("first_name").value;
    let last_name = document.getElementById("last_name").value;
    let mobile = document.getElementById("mobile").value;
    let nationalite = document.getElementById("nationalite").value;
    let poste = document.getElementById("poste").value;
    let dob = document.getElementById("dob").value;
    let categorie = "";

    this.permCat.forEach((perm) =>
      document.getElementById("perm" + perm.id).checked
        ? (categorie = perm.id)
        : null
    );
    console.log(this.permCat);
    if (this.props.what == "add") {
      if (categorie == "") {
        alert("Veuillez choisir une categorie");
        return false;
      }
      console.log(this.state.file);
      fetch("http://localhost:8000/css/sportif/add", {
        body: JSON.stringify({
          first_name: first_name,
          last_name: last_name,
          mobile: mobile,
          nationalite: nationalite,
          poste: poste,
          dob: dob,
          categorie: categorie,
          fiche: this.state.file,
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: "Token " + localToken,
        },
        method: "POST",
      }).then((response) =>
        response
          .json()
          .then((reponse) =>
            reponse.Error == "None"
              ? (window.location.href = "/dashboard/fiches")
              : alert(reponse.Error)
          )
      );
    } else {
      const userId = window.location.href.substring(
        window.location.href.lastIndexOf("/") + 1
      );
      fetch("http://localhost:8000/css/sportif/edit", {
        body: JSON.stringify({
          id: userId,
          first_name: first_name,
          last_name: last_name,
          mobile: mobile,
          nationalite: nationalite,
          poste: poste,
          dob: dob,
          categorie: categorie,
          fiche: this.state.file,
        }),
        headers: {    'Accept': 'application/json',
    'Content-Type': 'application/json',
          Authorization: "Token " + localToken,
        },
        method: "POST",
      }).then((response) =>
        response
          .json()
          .then((reponse) =>
            reponse.Error == "None"
              ? (window.location.href = "/dashboard/fiches")
              : alert(reponse.Error)
          )
      );
    }
  }
  render() {
    let data = [];
    this.permCat = [];

    this.props.categories.forEach((menu) => {
      data.push(menu);
      this.permCat.push(menu);
      if (menu.type != "final") {
        menu.content.forEach((submenu) => {
          data.push({
            name: "-> " + submenu.name,
            id: submenu.id,
            type: submenu.type,
          });
          this.permCat.push(submenu);
          if (submenu.type != "final") {
            

            submenu.content.forEach((subsubmenu) => {
              data.push({
                name: "--> " + subsubmenu.name,
                id: subsubmenu.id,
                type: "final",
              });
              this.permCat.push({
                name: "--> " + subsubmenu.name,
                id: subsubmenu.id,
                type: "final",
              });
            });
          }
        });
      }
    });
    let permissionChecks = data.map((menu, index) =>
      menu.type == "final" ? (
        <div key={"div" + index}>
          <input
            className="form-check-input"
            type="checkbox"
            id={"perm" + menu.id}
          />
          <label className="form-check-label" htmlFor={"perm" + menu.id}>
            {menu.name}
          </label>
        </div>
      ) : (
        <div key={"div" + index}>
          <input
            className="form-check-input"
            type="checkbox"
            id={"perm" + menu.id}
            disabled
          />
          <label className="form-check-label" htmlFor={"perm" + menu.id}>
            {menu.name}
          </label>
        </div>
      )
    );

    return (
      <div className="container">
        <form>
          <div className="form-row">
            <div className="col-md-4">
              <label>Nom</label>
              <input id="first_name" className="form-control" type="text" />
              <label>Prénom</label>
              <input id="last_name" className="form-control" type="text" />
              <label>Mobile</label>
              <input id="mobile" className="form-control" type="text" />
              <label>Nationalité</label>
              <input id="nationalite" className="form-control" type="text" />
              <label>Poste</label>
              <input id="poste" className="form-control" type="text" />
              <label>Date de naissance</label>
              <input id="dob" className="form-control" type="text" />
              <br />
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="inputGroupFileAddon01">
                    Fiche
                  </span>
                </div>
                <div className="custom-file">
                  <input
                    type="file"
                    className="custom-file-input"
                    id="inputGroupFile01"
                    onChange={this.onChangeHandler}
                  />
                  <label
                    className="custom-file-label"
                    htmlFor="inputGroupFile01"
                    id="filename"
                  >
                    Choose file
                  </label>
                </div>
              </div>
              <br />
            </div>
            <div className="col-md-4">
              <p>Catégorie</p>
              <div className="form-check">{permissionChecks}</div>

              <button
                onClick={() => this.handleValidate()}
                className="btn btn-primary"
                type="button"
              >
                Valider
              </button>
            </div>
            <div className="col-md-4"></div>
          </div>
        </form>
      </div>
    );
  }
}
export default AddFiche;
