from flask import Flask, request, send_file
from datetime import date
from io import BytesIO
import requests
import pandas as pd

app = Flask(__name__)

@app.route('/get_excel', methods=['GET'])
def get_excel():
    
    params = {}
    params['fecha_desde'] = date.today().strftime("%Y-%m-%d")
    params['fecha_hasta'] = date.today().strftime("%Y-%m-%d")
    
    if request.args.get('fecha_desde') and request.args.get('fecha_hasta'):
        params['fecha_desde'] = request.args.get('fecha_desde')
        params['fecha_hasta'] = request.args.get('fecha_hasta')
    
    url = 'http://localhost:3000/get_facturas_between/' + params['fecha_desde'] + "/" + params['fecha_hasta']
    
    # Hacer la solicitud GET
    response = requests.get(url)

    # Imprimir la respuesta del servidor
    json = response.json()
    
    df = pd.DataFrame(json)
    
    # Convertir la columna 'Fecha' a tipo datetime
    df['fecha'] = pd.to_datetime(df['fecha'])

    # Reformatear la fecha a 'día-mes-año'
    df['fecha'] = df['fecha'].dt.strftime('%d-%m-%Y')
           
    # Crear un buffer en memoria para el archivo Excel
    output = BytesIO()

    # Guardar el DataFrame en el buffer como un archivo Excel
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False)

    # Mover el puntero al inicio del buffer
    output.seek(0)

    # Enviar el archivo Excel como respuesta de descarga
    return send_file(output, download_name="archivo.xlsx", as_attachment=True, mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

if __name__ == '__main__':
    app.run(debug=True)
