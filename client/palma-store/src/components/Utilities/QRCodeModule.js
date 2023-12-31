import QRCode from "qrcode";
import { useState, useEffect } from "react";

function QRCodeModule(props) {
    const [qr, setQr] = useState("");


    useEffect(() => {
        generateQRCode();
    });

    const generateQRCode = () => {
        QRCode.toDataURL([{ data: props.url, mode: 'numeric' }], function (err, url) {
            if (err) return console.error(err);
            setQr(url);
        });
    }


    return (
        <div className="app">
            {qr && (
                <div className="justify-content-center d-flex">
                    <a className="btn btn-secondary btn-large" href={qr} download={props.data}>Bajar Código QR</a>
                </div>
            )}
        </div>


    );


}

export default QRCodeModule;