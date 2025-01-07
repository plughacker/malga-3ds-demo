# Example to help test 3DS

Project created to help test 3DS in the Malga

## How to run this demo?

1. Copy the contents of the .env.example file
2. Paste into a new file called .env

```
HOST=localhost
PORT=3000

# Malga config
MERCHANT_ID=YOUR_MERCHANT_ID
API_KEY=YOUR_API_KEY
CLIENT_ID=YOUR_CLIENT_ID
BASE_URL_CHARGES=https://sandbox-api.malga.io
BASE_URL_TOKENS=https://sandbox-api.malga.io


# Proxy
# do not use in production
NODE_TLS_REJECT_UNAUTHORIZED=0

# debug requests to malga.io
# if you want to debug, uncomment
# HTTP_PROXY=http://127.0.0.1:18080

```

3. Install the project dependencies

```sh
npm i
```

4. Start the server
```sh
npm run serve
```

5. Open http://localhost:3000, fill the fields
6. Click in "pay"
