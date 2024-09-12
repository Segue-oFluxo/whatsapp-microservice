# Whatsapp Microservice

<div align="center">

[![Postman Collection](https://img.shields.io/badge/Postman-Collection-orange)](https://elements.getpostman.com/redirect?entityId=38307468-c099a9ab-4ee9-4815-859e-c3d3e80f453c&entityType=collection) 
[![Documentation](https://img.shields.io/badge/Documentation-Official-green)](https://documenter.getpostman.com/view/38307468/2sAXqndizM)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](./LICENSE)

</div>

## How to run
You are gonna need docker to run this :)

1. Clone the repo
```bash
git clone https://github.com/Segue-oFluxo/whatsapp-microservice.git
cd whatsapp-microservice
```

2. Create .env file
```bash
cp .env.example .env
```

3. Create your token and replace in the "AUTHENTICATION_API_KEY" in your `.env` file

    A Good way to generate a good token is:
```bash
openssl rand -base64 36
```

4. Start the containers
```bash
docker compose up -d
```

That's it, now the API is running on port 8000 (default). You can the port change in the `.env` file