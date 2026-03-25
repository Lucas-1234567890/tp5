import { useEffect } from "react";

const BASE_URL = "http://ec2-3-20-227-42.us-east-2.compute.amazonaws.com:3000";
const username = "leilao_test_api";
const password = "Ftwj029E";
const url = `${BASE_URL}/login`;
const headers = {"Content-Type": "application/json"};
const body = JSON.stringify({username: username, password: password})

export default function Login({ onToken }) {
  useEffect(() => {
    fetch(url, {method: "POST",headers: headers, body: body})
        .then(r => r.json())
        .then(r => onToken(r.accessToken))
  }, [onToken]);        

  return null;
}
