import React from "react";
import "./Login.css";
import { useHistory } from "react-router-dom";

class Login extends React.Component {
  login() {
    let mail = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    fetch("http://localhost:8000/css/login/" + mail + "/" + password).then(
      (response) =>
        response.json().then((token) => {
          token.token == undefined
            ? alert("Verifier vos informations")
            : localStorage.setItem("token", token.token);
          localStorage.setItem("super", token.super_user);
          localStorage.setItem("perms", token.permissions);
          window.location.reload(false);
        })
    );
  }

  render() {
    let localToken = localStorage.getItem("token");
    let super_user = localStorage.getItem("super");

    if (localToken == undefined) {
      return (
        <div className="login-dark">
          <form method="post">
            <h2 className="sr-only">Login Form</h2>
            <div className="illustration">
              <i className="icon ion-ios-locked-outline"></i>
            </div>
            <div className="form-group black">
              <input
                className="form-control"
                type="email"
                name="email"
                id="email"
                placeholder="Email"
              />
            </div>
            <div className="form-group black">
              <input
                className="form-control"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
              />
            </div>
            <div className="form-group">
              <button
                onClick={() => this.login()}
                className="btn btn-primary btn-block"
                type="button"
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      );
    } else if (super_user == "true") {
      this.props.updatePermissions(localToken);
      window.location.href = "/dashboard/staff";
      return null;
    } else {
      this.props.updatePermissions(localToken);
      window.location.href = "/";
      return null;
    }
  }
}
export default Login;
