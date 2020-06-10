import React from "react";
import "./Dashboard.css";
import { NavLink } from "react-router-dom";
import { Route } from "react-router-dom";
import User from "./User";
import ListFiches from "./ListFiches";
import AddFiche from "./AddFiche";
import ListUser from "./ListUser";
import Categorie from "./Categorie";
import ListCategorie from "./ListCategorie";
class Dashboard extends React.Component {
  componentDidMount() {
    this.updateSelectedMenu();
  }
  updateSelectedMenu() {
    if (window.location.href.indexOf("staff") !== -1) {
      document.getElementById("btnmenu1").classList.remove("dashmenu");
      document.getElementById("btnmenu1").classList.add("dashmenuselected");
      document.getElementById("btnmenu2").classList.remove("dashmenuselected");
      document.getElementById("btnmenu2").classList.add("dashmenu");
      document.getElementById("btnmenu3").classList.remove("dashmenuselected");
      document.getElementById("btnmenu3").classList.add("dashmenu");
    } else if (window.location.href.indexOf("categories") !== -1) {
      document.getElementById("btnmenu2").classList.remove("dashmenu");
      document.getElementById("btnmenu2").classList.add("dashmenuselected");
      document.getElementById("btnmenu1").classList.remove("dashmenuselected");
      document.getElementById("btnmenu1").classList.add("dashmenu");
      document.getElementById("btnmenu3").classList.remove("dashmenuselected");
      document.getElementById("btnmenu3").classList.add("dashmenu");
    } else {
      document.getElementById("btnmenu3").classList.remove("dashmenu");
      document.getElementById("btnmenu3").classList.add("dashmenuselected");
      document.getElementById("btnmenu2").classList.remove("dashmenuselected");
      document.getElementById("btnmenu2").classList.add("dashmenu");
      document.getElementById("btnmenu1").classList.remove("dashmenuselected");
      document.getElementById("btnmenu1").classList.add("dashmenu");
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

    return (
      <div className="containers">
        <div className="row allpage">
          <div className="col-md-2 colp">
            <h2>Dashboard</h2>
            <div style={{ margin: 10 }}>
              <button
                id="btnmenu1"
                onClick={() => this.updateSelectedMenu()}
                className="btn btn-primary nav-link dashmenuselected"
                type="button"
              >
                <NavLink className="not-active" to="/dashboard/staff">
                  STAFF
                </NavLink>
              </button>
            </div>
            <div style={{ margin: 10 }}>
              <button
                id="btnmenu2"
                onClick={() => this.updateSelectedMenu()}
                className="btn btn-primary dashmenu"
                type="button"
              >
                <NavLink className="not-active" to="/dashboard/categories">
                  CATEGORIES
                </NavLink>
              </button>
            </div>
            <div style={{ margin: 10 }}>
              <button
                id="btnmenu3"
                onClick={() => this.updateSelectedMenu()}
                className="btn btn-primary dashmenu"
                type="button"
              >
                <NavLink className="not-active" to="/dashboard/fiches">
                  FICHES
                </NavLink>
              </button>
            </div>
          </div>
          <div className="col-md-10">
            <Route
              exact
              path="/dashboard/staff"
              component={() => (
                <div>
                  <ListUser
                    updateStaff={() => this.props.updateStaff()}
                    staff={this.props.staff}
                  />{" "}
                  <NavLink className="not-active" to="/dashboard/staff/add">
                    <button className="btn btn-primary dashmenu" type="button">
                      Ajouter
                    </button>
                  </NavLink>{" "}
                </div>
              )}
            />
            <Route
              exact
              path="/dashboard/staff/add"
              component={() => (
                <div>
                  <h2>Ajout utilisateur </h2>
                  <User categories={this.props.categories} what="add" />
                </div>
              )}
            />
            <Route
              exact
              path="/dashboard/staff/edit/:id"
              component={() => (
                <div>
                  <h2>Modifier utilisateur </h2>
                  <User categories={this.props.categories} what="edit" />
                </div>
              )}
            />
            <Route
              exact
              path="/dashboard/categories"
              component={() => (
                <div>
                  <ListCategorie
                    updateMenu={this.props.updateMenu}
                    categories={this.props.categories}
                  />{" "}
                  <NavLink
                    className="not-active"
                    to="/dashboard/categories/add"
                  >
                    <button className="btn btn-primary dashmenu" type="button">
                      Ajouter
                    </button>
                  </NavLink>{" "}
                </div>
              )}
            />
            <Route
              exact
              path="/dashboard/categories/add"
              component={() => (
                <div>
                  <h2>Ajouter catégorie</h2>
                  <Categorie
                    updateMenu={this.props.updateMenu}
                    categories={this.props.categories}
                  />
                </div>
              )}
            />
            <Route
              exact
              path="/dashboard/fiches"
              component={() => (
                <div>
                  <ListFiches
                    updateSportifs={() => this.props.updateFiches()}
                    sportifs={this.props.fiches}
                  />{" "}
                  <NavLink className="not-active" to="/dashboard/fiches/add">
                    <button className="btn btn-primary dashmenu" type="button">
                      Ajouter
                    </button>
                  </NavLink>{" "}
                </div>
              )}
            />
            <Route
              exact
              path="/dashboard/fiches/add"
              component={() => (
                <div>
                  <AddFiche categories={this.props.categories} what="add" />{" "}
                </div>
              )}
            />

            <Route
              exact
              path="/dashboard/fiches/edit/:id"
              component={() => (
                <div>
                  <AddFiche categories={this.props.categories} what="edit" />{" "}
                </div>
              )}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default Dashboard;
