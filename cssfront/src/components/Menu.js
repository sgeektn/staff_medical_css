import React from "react";
import { Form, Navbar, Nav, NavDropdown } from "react-bootstrap";
import "./Menu.css";
import { NavLink } from "react-router-dom";
class Menu extends React.Component {
  render() {
    let menuItems = this.props.menu.map((menu, index) =>
      menu.type === "final" ? (
        <Nav.Link key={index} className="whiteText" href={"/cat/" + menu.id}>
          {menu.name.toUpperCase()}
        </Nav.Link>
      ) : (
        <NavDropdown
          key={index}
          className="whiteText"
          title={menu.name.toUpperCase()}
          id="basic-nav-dropdown"
        >
          {menu.content.map((submenu, subindex) =>
            submenu.type === "final" ? (
              <NavDropdown.Item key={subindex} href={"/cat/" + submenu.id}>
                {submenu.name.toUpperCase()}
              </NavDropdown.Item>
            ) : (
              <NavDropdown
                key={subindex}
                className="blackText"
                title={submenu.name.toUpperCase()}
                id="basic-nav-dropdown"
              >
                {submenu.content.map((subsubmenu, subindex) => (
                  <NavDropdown.Item
                    key={subindex}
                    href={"/cat/" + subsubmenu.id}
                  >
                    {subsubmenu.name.toUpperCase()}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            )
          )}
        </NavDropdown>
      )
    );
    let adminLogout = "";
    let loginButton = (
      <NavLink to="/login" className="nav-link login whiteText">
        LOGIN
      </NavLink>
    );
    let localToken = localStorage.getItem("token");
    let super_user = localStorage.getItem("super");

    if (localToken != undefined) {
      if (super_user == "true") {
        loginButton = (
          <NavLink to="/login" className="nav-link login whiteText">
            DASHBOARD
          </NavLink>
        );
        adminLogout = (
          <NavLink
            onClick={() => {
              localStorage.clear();
              window.location.reload(false);
            }}
            to="/"
            className="nav-link staff whiteText"
          >
            LOGOUT
          </NavLink>
        );
      } else {
        loginButton = (
          <NavLink
            onClick={() => {
              localStorage.clear();
              window.location.reload(false);
            }}
            to="/"
            className="nav-link login whiteText"
          >
            LOGOUT
          </NavLink>
        );
      }
    }
    return (
      <Navbar expand="lg" className="blackBg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto scaled">{menuItems}</Nav>
          <Form inline>
            <NavLink to="/staff" className="nav-link staff whiteText">
              STAFF
            </NavLink>
            {loginButton}
            {adminLogout}
          </Form>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
export default Menu;
