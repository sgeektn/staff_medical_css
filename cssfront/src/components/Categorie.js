import React from "react";
import "./Dashboard.css";
class Categorie extends React.Component {
  addCategorie() {
    let newCatName = document.getElementById("newCatName").value;
    let parentName = document.getElementById("parentName").value;

    let localToken = localStorage.getItem("token");
    if (parentName == "racine") {
      fetch("http://localhost:8000/css/menu/add/" + newCatName, {
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
    } else {
      fetch(
        "http://localhost:8000/css/menu/add/" + newCatName + "/" + parentName,
        {
          headers: {
            Authorization: "Token " + localToken,
          },
        }
      ).then((response) =>
        response
          .json()
          .then((data) =>
            data.error != undefined
              ? console.log(data.error)
              : this.props.updateMenu()
          )
      );
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
    this.props.categories.forEach((menu) => {
      data.push(menu);
      if (menu.type != "final") {
        menu.content.forEach((submenu) => {
          data.push({ name: "-> " + submenu.name, id: submenu.id });
          /*if(submenu.type!="final"){
                        
                        
                            
                                     submenu.content.forEach((subsubmenu)=> {
                                        subsubmenu.name="--> "+subsubmenu.name;
                                        data.push(subsubmenu)  

                                    })          
                    
                        
                    }*/
        });
      }
    });

    let options = data.map((menu, index) => (
      <option key={index} value={menu.id}>
        {menu.name}
      </option>
    ));

    return (
      <div className="container">
        <form>
          <div className="form-row">
            <div className="col-md-4">
              <label>Nom</label>
              <input id="newCatName" className="form-control" type="text" />
              <label>Père</label>
              <br />
              <select id="parentName">
                <option value="racine">Default</option>
                {options}
              </select>
              <br />
              <br />
              <button
                onClick={() => this.addCategorie()}
                className="btn btn-primary"
                type="button"
              >
                Valider
              </button>
            </div>
          </div>
          <div className="col-md-4">
            <div className="col-md-4"></div>
          </div>
        </form>
      </div>
    );
  }
}
export default Categorie;
