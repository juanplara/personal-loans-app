# personal-loans-app

API para registrar y calcular préstamos personales, incluyendo intereses perdidos y costos adicionales, basados en la tasa efectiva anual (E.A).

---

## 🚀 Tecnologías

- Node.js
- Express
- MongoDB con Mongoose

---

## ⚙️ Configuración del entorno

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu_usuario/personal-loans-app.git```

2. Crea un archivo .env en la raíz del backend con el siguiente contenido:
    ```
    PORT=5000 (El que se requiera utilizar)
    MONGODB_URI=<tu cadena de conexión de MongoDB>
    ```

3. Instala las dependencias:
    ```Bash
    cd backend
    npm install```

4. Inicia el servidor:
    ```Bash
    npm run dev```

5. Estructura del proyecto:
personal-loans-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.js
│   ├── .env
│   └── package.json
├── frontend/                  # (por implementar)
├── docs/                      # Documentación adicional (por implementar)
├── LICENSE
└── README.md

6. Endpoint principal:
POST /api/loans
Crea un nuevo préstamo y calcula:
- Interés perdido por no tener el dinero en la cuenta
- Interés adicional definido por el usuario
- Total a pagar

JSON de entrada:
{
  "amount": 100000,
  "reason": "Préstamo para emergencia",
  "startDate": "2025-08-01",
  "endDate": "2025-08-15",
  "accountBalanceAtLoan": 3000000,
  "interestExtra": 5000
}

Respuesta esperada:
{
  "amount": 100000,
  "reason": "Préstamo para emergencia",
  "startDate": "2025-08-01T00:00:00.000Z",
  "endDate": "2025-08-15T00:00:00.000Z",
  "accountBalanceAtLoan": 3000000,
  "interestLost": 339.98,
  "interestExtra": 5000,
  "totalToPay": 105339.98,
  "_id": "68911ddbfbd20c20665074ee",
  "createdAt": "2025-08-04T20:53:47.942Z",
  "__v": 0
}

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](./LICENSE) para más detalles.