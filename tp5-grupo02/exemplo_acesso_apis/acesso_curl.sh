#HOST='localhost'
HOST='ec2-3-20-227-42.us-east-2.compute.amazonaws.com'
PORT='3000'
USER='leilao_test_api'
PASS='Ftwj029E'

echo curl --silent -X POST $HOST:$PORT/login -H 'Content-Type: application/json'      -d "{\"username\": \"$USER\", \"password\": \"$PASS\"}"


auth_output=$(curl --silent -X POST $HOST:$PORT/login -H 'Content-Type: application/json'      -d "{\"username\": \"$USER\", \"password\": \"$PASS\"}")

bearer=$(echo $auth_output | grep -o '"accessToken":"[^"]*"' | sed 's/"accessToken":"\([^"]*\)"/\1/')
echo "Host      : $HOST"
echo "Port      : $PORT"
echo "User      : $USER"
echo "Pass      : $PASS"
echo "Bearer is : $bearer"


curl -X GET $HOST:$PORT/leiloes -H "Authorization: Bearer $bearer"
read -p ""

curl -X GET http://$HOST:$PORT/leiloes/intervalo_data/2024-01-10/2024-01-20 -H "Authorization: Bearer $bearer"
read -p ""

curl -X GET http://$HOST:$PORT/leiloes/tipo/SEGURADORA -H "Authorization: Bearer $bearer"
read -p ""

curl -X GET http://$HOST:$PORT/leiloes/localidade?cidade=RIO\%20DE\%20JANEIRO\&estado=RJ -H "Authorization: Bearer $bearer"
read -p ""

curl -X GET http://$HOST:$PORT/leiloes/leiloeiro/ROGERIO%20MENEZES -H "Authorization: Bearer $bearer"
read -p ""

curl -X GET http://$HOST:$PORT/leiloes/leiloeiros -H "Authorization: Bearer $bearer"
read -p ""

curl -X GET http://$HOST:$PORT/leiloes/cidades_estados -H "Authorization: Bearer $bearer"
read -p ""

curl -X GET http://$HOST:$PORT/leiloes/tipos -H "Authorization: Bearer $bearer"
read -p ""

curl -X GET http://$HOST:$PORT/lotes/busca?tipo_veiculo=MOTO -H "Authorization: Bearer $bearer"
read -p ""

curl -X GET http://$HOST:$PORT/lotes/busca?combustivel=ALCOOL -H "Authorization: Bearer $bearer"
read -p ""

curl -X GET http://$HOST:$PORT/leiloes/10/lotes -H "Authorization: Bearer $bearer"
read -p ""

curl -X GET http://$HOST:$PORT/leiloes/135/lotes/tipos -H "Authorization: Bearer $bearer"
read -p ""

curl -X GET http://$HOST:$PORT/leiloes/135/lotes/tipos_veiculos -H "Authorization: Bearer $bearer"
read -p ""

curl -X GET http://$HOST:$PORT/leiloes/135/lotes/anos_fabricacao -H "Authorization: Bearer $bearer"


