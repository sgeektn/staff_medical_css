import React from "react";
import "./Dashboard.css";
class User extends React.Component {
  constructor(props) {
    super(props);
    this.permCat = [];
  }
  componentDidMount() {
    if (this.props.what == "edit") {
      const userId = window.location.href.substring(
        window.location.href.lastIndexOf("/") + 1
      );
      let localToken = localStorage.getItem("token");
      if (localToken != undefined) {
        fetch("http://localhost:8000/css/user/get/" + userId, {
          headers: {
            Authorization: "Token " + localToken,
          },
        }).then((response) =>
          response
            .json()
            .then((staffRes) =>
              staffRes.Error != "None" && staffRes.Error != undefined
                ? (alert(staffRes.Error),
                  (window.location.href = "/dashboard/staff"))
                : ((document.getElementById("fname").value =
                    staffRes.first_name),
                  (document.getElementById("lname").value = staffRes.last_name),
                  (document.getElementById("fonction").value =
                    staffRes.fonction),
                  (document.getElementById("tel").value = staffRes.tel),
                  (document.getElementById("mobile").value = staffRes.mobile),
                  (document.getElementById("mail").value = staffRes.mail),
                  staffRes.permissions
                    .split(";")
                    .forEach((permissionOfUser) =>
                      document.getElementById("perm" + permissionOfUser) != null
                        ? (document.getElementById(
                            "perm" + permissionOfUser
                          ).checked = true)
                        : console.log(permissionOfUser)
                    ))
            )
        );
      }
    }
  }
  doStuff() {
    let fname = document.getElementById("fname").value;
    let lname = document.getElementById("lname").value;
    let fonction = document.getElementById("fonction").value;
    let tel = document.getElementById("tel").value;
    let mobile = document.getElementById("mobile").value;
    let mail = document.getElementById("mail").value;
    let password = document.getElementById("password").value;

    let localToken = localStorage.getItem("token");

    let userPermissions = "";

    this.permCat.forEach((perm) =>
      document.getElementById("perm" + perm.id).checked
        ? (userPermissions += perm.id + ";")
        : (userPermissions += "")
    );

    if (this.props.what == "add") {
      if (localToken != undefined) {
        fetch(
          "http://localhost:8000/css/user/add/" +
            fname +
            "/" +
            lname +
            "/" +
            tel +
            "/" +
            mobile +
            "/" +
            fonction +
            "/" +
            mail +
            "/" +
            password +
            "/" +
            userPermissions,
          {
            headers: {
              Authorization: "Token " + localToken,
            },
          }
        ).then((response) =>
          response
            .json()
            .then((staffRes) =>
              staffRes.Error != "None" && staffRes.Error != undefined
                ? alert(staffRes.Error)
                : (window.location.href = "/dashboard/staff")
            )
        );
      }
    } else {
      if (localToken != undefined) {
        fetch(
          "http://localhost:8000/css/user/edit/" +
            fname +
            "/" +
            lname +
            "/" +
            tel +
            "/" +
            mobile +
            "/" +
            fonction +
            "/" +
            mail +
            "/" +
            (password == "" ? "no" : password) +
            "/" +
            userPermissions,
          {
            headers: {
              Authorization: "Token " + localToken,
            },
          }
        ).then((response) =>
          response
            .json()
            .then((staffRes) =>
              staffRes.Error != "None" && staffRes.Error != undefined
                ? alert(staffRes.Error)
                : (window.location.href = "/dashboard/staff")
            )
        );
      }
    }
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

    let permissions = localStorage.getItem("perms").split(";");
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
              <input id="fname" className="form-control" type="text" />
              <label>Prénom</label>
              <input id="lname" className="form-control" type="text" />
              <label>Fonction</label>
              <input id="fonction" className="form-control" type="text" />
              <label>Tél</label>
              <input id="tel" className="form-control" type="text" />
              <label>Mobile</label>
              <input id="mobile" className="form-control" type="text" />
              <label>E-Mail</label>
              <input id="mail" className="form-control" type="text" />
              <label>Mot de passe</label>
              <input id="password" className="form-control" type="password" />
            </div>
            <div className="col-md-4">
              <p>Permissions</p>
              <div className="form-check">{permissionChecks}</div>
              <button
                onClick={() => this.doStuff()}
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
export default User;
