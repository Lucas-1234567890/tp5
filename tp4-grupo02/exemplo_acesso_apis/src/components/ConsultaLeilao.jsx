import { useEffect, useState } from "react";
import Login from "./Login";

const BASE_URL = "http://ec2-3-20-227-42.us-east-2.compute.amazonaws.com:3000";

export default function ConsultaLeilao() {
  const [token, setToken] = useState(null);
  const [dados, setDados] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch(`${BASE_URL}/leiloes`, {headers:{Authorization: `Bearer ${token}`}})
        .then(r => r.json())
        .then(setDados)
  }, [token]);

  return (
    <div>
        {!token && <Login onToken={setToken} />}
        <pre>{dados && JSON.stringify(dados, null, 2)}</pre>
    </div>
  );
}
