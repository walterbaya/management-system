import { Component } from "react";
import LoadExcelArticlesYesCatalogue from "./Utilities/LoadExcelArticlesYesCatalogue";


class ControlCatalogos extends Component {
  render() {
    return (
      <div className="bg-white p-4 h-100">
        <div className="form-group mt-3 d-flex">
          <div className="mt-3 ms-3">
            <LoadExcelArticlesYesCatalogue />
          </div>
        </div>
      </div>
    );
  }
}

export default ControlCatalogos;
