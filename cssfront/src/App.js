import React, { Component } from "react";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Home from "./components/Home";
import Login from "./components/Login";
import Staff from "./components/Staff";
import Fiches from "./components/Fiches";
import Dashboard from "./components/Dashboard";
import AddFiche from "./components/AddFiche";
import { Route, BrowserRouter } from "react-router-dom";

class App extends Component {
  updatePermissions(token) {
    fetch("http://localhost:8000/css/whoami", {
      headers: {
        Authorization: "Token " + token,
      },
    }).then((response) =>
      response.json().then((token) => {
        localStorage.getItem("token") == undefined
          ? alert("Veuillez vous connecter de nouveau")
          : localStorage.setItem("super", token.super_user);
        localStorage.setItem("perms", token.permissions);
      })
    );
  }

  constructor(props) {
    super(props);
    this.state = { menu: [], staff: [], fiches: [] };
  }
  componentDidMount() {
    this.updateMenu();
    this.updateStaff();
    this.updateSportifs();
  }

  updateSportifs() {
    let localToken = localStorage.getItem("token");
    let super_user = localStorage.getItem("super");

    if (localToken != undefined && super_user == "true") {
      fetch("http://localhost:8000/css/sportif/getAll", {
        headers: {
          Authorization: "Token " + localToken,
        },
      }).then((response) =>
        response.json().then((staffRes) => {
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
        })
      );
    }
  }

  updateStaff() {
    let localToken = localStorage.getItem("token");
    if (localToken != undefined) {
      fetch("http://localhost:8000/css/user/getAll", {
        headers: {
          Authorization: "Token " + localToken,
        },
      }).then((response) =>
        response.json().then((staffRes) => {
          let staff = [];
          staffRes.forEach((staffMember) => {
            staff.push({
              id: staffMember.id,
              Membre: staffMember.first_name + " " + staffMember.last_name,
              Fonction: staffMember.fonction,
              Tél: staffMember.tel,
              Mobile: staffMember.mobile,
              "E-Mail": staffMember.mail,
            });
            this.setState({ staff });
          });
        })
      );
    }
  }
  updateMenu() {
    fetch("http://localhost:8000/css/menu/getAll").then((response) =>
      response.json().then((menu) => {
        this.setState({ menu });
      })
    );
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Header />
          <br />
          <Menu menu={this.state.menu} />
          <Route exact path="/" component={Home} />
          <Route
            path="/staff"
            component={() => <Staff rows={this.state.staff} />}
          />
          <Route
            path="/login"
            component={() => (
              <Login updatePermissions={(x) => this.updatePermissions(x)} />
            )}
          />
          <Route
            path="/cat/:id"
            component={() => (
              <Fiches updateSportifs={() => this.updateSportifs()} />
            )}
          />
          <Route
              exact
              path="/fiches/:id"
              component={() => (
                <div>
                  <AddFiche categories={this.state.menu} what="edit" />{" "}
                </div>
              )}
            />

          <Route
            path="/Dashboard"
            component={() => (
              <Dashboard
                updateStaff={() => this.updateStaff()}
                staff={this.state.staff}
                updateMenu={() => this.updateMenu()}
                categories={this.state.menu}
                fiches={this.state.fiches}
                updateFiches={() => this.updateSportifs()}
              />
            )}
          />
        </div>
      </BrowserRouter>
    );
  }
}
export default App;
