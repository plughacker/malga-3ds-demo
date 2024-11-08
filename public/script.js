
// .env
// HOST=localhost
// PORT=3000
const baseUrl = 'http://localhost:3000';

async function getCharge(id) {
  const response = await fetch(`${baseUrl}/v1/charges?transaction=${id}`);
  return await response.json();
}

async function setup(card) {
  const token = await createToken(card)
  
  const payload = {}
  payload['sourceType'] = 'token'
  payload['tokenId'] = token.tokenId

  const response = await fetch(`${baseUrl}/v1/charges/3ds/setup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  return {
    setup: await response.json(),
    tokenId: token.tokenId
  };
}

async function createToken(card) {
  const response = await fetch(`${baseUrl}/v1/tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(card)
  });

  return await response.json();
}

async function createCharge(setupId, amount, tokenId) {

  // minimum structure for 3DS
  const payload = {
    
    'amount': amount,
    'capture': true,
    'paymentSource': {
      'sourceType': 'token',
      'tokenId': tokenId
    },
    'paymentMethod': {
      'paymentType': 'credit',
      'installments': 1
    },
    'statementDescriptor': 'teste 3ds',
    "paymentFlow": {
      "metadata": {
        "value": "algum valor",
      }
    },

    // important data for 3DS
    'threeDSecure2': {
      'requiresLiabilityShift': true,
      'setupId': setupId,
      'redirectURL': 'http://localhost:3000/checkout.html',
      'requestorURL': 'http://localhost:3000',
      'billingAddress': {
        'city': 'Sao Paulo',
        'country': 'BR',
        'streetNumber': '10',
        'zipCode': '13219613',
        'state': 'SP',
        'street': 'Avenida Nami Azem'
      },
      'browser': {
        'acceptBrowserValue': '*/*',
        'acceptContent': '*/*,',
        'ip': '127.0.0.1', // put client IP
        'userAgent': navigator.userAgent,
        'acceptHeader': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'language': navigator.language,
        'colorDepth': screen.colorDepth,
        'screenHeight': screen.height,
        'screenWidth': screen.width,
        'timeZoneOffset': new Date().getTimezoneOffset().toString(),
        'javaEnabled': navigator.javaEnabled(),
        'javaScriptEnabled': true
      },
      'cardHolder': {
        'email': 'josedasilva@gmail.com',
        'mobilePhone': '5511999998888'
      }
    }
  }

  const response = await fetch(`${baseUrl}/v1/charges`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  return await response.json();
}
