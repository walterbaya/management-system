import { useState } from "react";
import axios from "axios";

function Login() {
  const [success, setSuccess] = useState(false);
  const [articulo, setArticulo] = useState({});

  const handleScan = (data) => {
    if (data) {
      console.log(data.text);
      setResult(data.text);
      console.log(data.text);
      saveArticle(data.text);
      setScanned(true);
    }
  };

  const saveArticle = (id) => {
    //Traemos el articulo desde la base de datos primero y luego lo pisamos

    let articulo = {};

    axios
      .get("http://localhost:3000/get_articulo/" + id)
      .then((response) => {
        console.log("datos:");
        articulo = response.data[0];
        console.log(articulo.cantidad);
        articulo.cantidad = articulo.cantidad + 1;
      })
      .catch((error) => console.log(error))
      .finally(() => {
        console.log(articulo.cantidad);
        axios
          .post("http://localhost:3000/agregar_articulo", articulo)
          .then((response) => {
            setSuccess(true);
            setArticulo(articulo);
          })
          .catch((error) => console.log(error));
      });
  };

  return (
<div className="container mt-5">
        <div className="row justify-content-center">
            <div className="col-md-6">
                <h2 className="mb-4">Login</h2>
                <form id="loginForm">
                    <div className="mb-3">
                        <label for="username" className="form-label">Username</label>
                        <input type="text" className="form-control" id="username" name="username" required></input>
                    </div>
                    <div className="mb-3">
                        <label for="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" name="password" required></input>
                    </div>
                    <button type="submit" class="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    </div>

  );
}

export default Login;
