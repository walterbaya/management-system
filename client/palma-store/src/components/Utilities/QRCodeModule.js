import QRCode from "qrcode";
import { useState } from "react";

function QRCodeModule(props) {
    const [qr, setQr] = useState("");


    const GenerateQRCode = () => {
        QRCode.toDataURL([{ data: props.url, mode: 'numeric' }], function (err, url) {
            if (err) return console.error(err);
            setQr(url);
        });
    }

    return (
        <div className="app">
            <button onClick={GenerateQRCode} className="btn btn-secondary btn-large text-white">Bajar QR</button>
            {qr && (
                <>
                    <img src={qr} alt="qr" />
                    <a className="btn btn-success btn-primary" href={qr} download={props.data}>Descargar</a>
                </>
            )}
        </div>


    );


}

export default QRCodeModule;