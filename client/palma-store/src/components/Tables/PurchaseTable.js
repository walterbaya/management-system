import React from 'react';


const formatDate = (isoDateString) => {
    // Extraer la parte de la fecha y la hora
    const [datePart, timePart] = isoDateString.split("T");
    
    // Formatear la fecha
    const [year, month, day] = datePart.split("-");
    const formattedDate = `${day}/${month}/${year}`;

    // Formatear la hora (sin milisegundos)
    const formattedTime = timePart.substring(0, 8); // Esto toma HH:mm:ss

    return `${formattedDate}, ${formattedTime}`;
};



const PurchaseTable = ({ listOfPurchases }) => {
    // Definimos los datos del producto
    console.log(listOfPurchases);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Tabla de Productos</h2>
            <table className="table" style={{ border: '2px solid blue' }}>
                <thead className="bg-primary text-white">
                    <tr>
                        <th>DNI Cliente</th>
                        <th>Nombre y Apellido</th>
                        <th>Color</th>
                        <th>Fecha de venta</th>
                        <th>Género</th>
                        <th>Cuero</th>
                        <th>Nombre Artículo</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Tipo</th>
                        <th>Talle</th>
                    </tr>
                </thead>
                <tbody>
                    {listOfPurchases.length > 0 ? (
                        listOfPurchases.map(purchase => (
                            <tr key={purchase.id}>
                                <td>{purchase.clientDni}</td>
                                <td>{purchase.clientNameAndSurname}</td>
                                <td>{purchase.color}</td>
                                <td>{formatDate(purchase.emissionDate)}</td> {/* Formateo de la fecha */}
                                <td>{purchase.gender ? 'Masculino' : 'Femenino'}</td>
                                <td>{purchase.leatherType}</td>
                                <td>{purchase.name}</td>
                                <td>{purchase.numberOfElements}</td>
                                <td>{purchase.price}</td>
                                <td>{purchase.shoeType}</td>
                                <td>{purchase.size}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="11" className="text-center">No hay productos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};


export default PurchaseTable;
