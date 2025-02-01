import { Component } from "react";
import { Table, Alert, Form, Pagination, Spinner } from "react-bootstrap";
import axios from "axios";
import QRCodeModule from "./Utilities/QRCodeModule";
import "./Disponibilidad.css";

class DisponibilidadArticulo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allArticulos: [],
      filteredArticulos: [],
      currentPage: 0,
      itemsPerPage: 50,
      isLoading: true,
      error: null,
      searchQuery: ""
    };
  }

  normalizeText = (text) => {
    if (text === null || text === undefined) return "";
    return text
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Mejor regex para acentos
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, ' ') // Elimina espacios múltiples
      .trim();
  };

  async fetchArticulos() {
    try {
      const response = await axios.get("http://localhost:8080/api/public/product/get_products");

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Formato de datos inválido");
      }

      const articulos = response.data.map(articulo => {
        // Construcción mejorada del searchText
        const searchParts = [
          articulo.name,
          articulo.size?.toString(),
          articulo.color,
          articulo.leatherType,
          articulo.shoeType,
          articulo.gender ? "Hombre" : "Mujer"
        ].filter(Boolean).map(part => this.normalizeText(part));

        return {
          ...articulo,
          id: articulo.id || Math.random().toString(36).substr(2, 9),
          gender: articulo.gender ? "Hombre" : "Mujer",
          searchText: searchParts.join(' '), // Unir con espacios
          numberOfElements: articulo.numberOfElements || 0,
          price: articulo.price || 0
        };
      });

      this.setState({
        allArticulos: articulos,
        filteredArticulos: articulos,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error("Error fetching articles:", error);
      this.setState({
        error: error.response?.data?.message || error.message || "Error al cargar los artículos",
        isLoading: false
      });
    }
  }

  componentDidMount() {
    this.fetchArticulos();
  }

  handleSearch = (event) => {
    const query = this.normalizeText(event.target.value);
    const searchWords = query.split(/\s+/).filter(Boolean);

    this.setState(prevState => {
      if (searchWords.length === 0) {
        return { filteredArticulos: prevState.allArticulos, searchQuery: "", currentPage: 0 };
      }

      const filtered = prevState.allArticulos.filter(articulo =>
        searchWords.every(word => 
          articulo.searchText.split(' ').some(term => term.includes(word))
        )
      );

      return { filteredArticulos: filtered, searchQuery: event.target.value, currentPage: 0 };
    });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  renderTable() {
    const { filteredArticulos, currentPage, itemsPerPage } = this.state;
    const totalPages = Math.ceil(filteredArticulos.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filteredArticulos.slice(startIndex, endIndex);

    if (filteredArticulos.length === 0) {
      return <Alert variant="info" className="mt-4">No se encontraron artículos</Alert>;
    }

    return (
      <div className="mt-4">
        <div className="table-responsive">
          <Table striped bordered hover className="shadow-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th>QR</th>
                <th>Nombre</th>
                <th>Talle</th>
                <th>Color</th>
                <th>Cuero</th>
                <th>Tipo</th>
                <th>Género</th>
                <th>Stock</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map(articulo => (
                <tr key={articulo.id}>
                  <td className="text-center">
                    <QRCodeModule url={articulo.id} data={`${articulo.name}-${articulo.size}-${articulo.color}`} size={80} />
                  </td>
                  <td>{articulo.name}</td>
                  <td>{articulo.size}</td>
                  <td>{articulo.color}</td>
                  <td>{articulo.leatherType}</td>
                  <td>{articulo.shoeType}</td>
                  <td>{articulo.gender}</td>
                  <td className={articulo.numberOfElements <= 5 ? "text-danger fw-bold" : ""}>{articulo.numberOfElements}</td>
                  <td>${articulo.price?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }

  render() {
    const { isLoading, error, searchQuery } = this.state;

    return (
      <div className="container-fluid p-4">
        <div className="card shadow border-0">
          <div className="card-header bg-primary text-white">
            <h2 className="mb-0">Consulta de Stock</h2>
          </div>

          <div className="card-body">
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-4">
              <Form.Label>Buscar Artículo</Form.Label>
              <Form.Control type="search" placeholder="Ej: 'zapatilla 42 negro cuero'..." value={searchQuery} onChange={this.handleSearch} />
            </Form.Group>

            {isLoading ? <Spinner animation="border" role="status" /> : this.renderTable()}
          </div>
        </div>
      </div>
    );
  }
}

export default DisponibilidadArticulo;
