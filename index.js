import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

const axiosInstance = createAxiosInstance();

const merchantId = process.env.MERCHANT_ID;
const apiKey = process.env.API_KEY;
const clientId = process.env.CLIENT_ID;
const baseUrl = process.env.BASE_URL_CHARGES;
const tokenBaseUrl = process.env.BASE_URL_TOKENS;

const headers = {
  'x-api-key': apiKey,
  'x-client-id': clientId,
  'accept': 'application/json', 
  'content-type': 'application/json'
};

const app = express();

app.use(express.json());
app.use(express.static('public'));

// POST /v1/charges/3ds/setup
// Initiate a setup
app.post('/v1/charges/3ds/setup', async (req, res) => {
  try {
    const response = await axiosInstance({
      method: 'post',
      url: `${baseUrl}/v1/charges/3ds/setup`,
      headers: headers,
      data: {
        ...req.body
      }
    })
    
    res.send(response.data);
  } catch (e) {
    res.send(e.response.data);
  }
})

// POST /v1/charges
// Initiate a payment
app.post('/v1/charges', async (req, res) => {
  try {
    const response = await axiosInstance({
      method: 'post',
      url: `${baseUrl}/v1/charges`,
      headers: headers,
      data: {
        merchantId: merchantId,
        
        ...req.body
      }
    })
    
    res.send(response.data);
  } catch (e) {
    res.send(e.response.data);
  }
})

// Get /v1/charges/:id
app.get('/v1/charges', async (req, res) => {
  const transactionId = req.query.transaction;

  try {
    const response = await axiosInstance({
      method: 'get',
      url: `${baseUrl}/v1/charges/${transactionId}`,
      headers: headers,
    })
    
    res.send(response.data);
  } catch (e) {
    res.send(e);
  }
});

// POST /v1/tokens
// Create a card token
app.post('/v1/tokens', async (req, res) => {
  try {
    const response = await axiosInstance({
      method: 'post',
      url: `${tokenBaseUrl}/v1/tokens`,
      headers: headers,
      data: {
        ...req.body
      }
    })
    
    res.send(response.data);
  } catch (e) {
    res.send('error');
  }
})

const host = process.env.HOST;
const port = process.env.PORT;

app.listen(port, host, () => {
  console.log(`running at http://${host}:${port}`);
});

function createAxiosInstance() {
  const httpProxy = process.env.HTTP_PROXY
  if (!httpProxy) {
    return axios.create()
  }
  const agent = new HttpsProxyAgent(httpProxy);
  const axiosInstance = axios.create({
    httpsAgent: agent
  });
  return axiosInstance;
}
