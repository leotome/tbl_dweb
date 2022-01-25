const express = require('express');
const cookieParser = require('cookie-parser')

const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

require("./services/v1.0/routes")(app);

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
    console.log(`The server is running on ${PORT}`);
})

app.use(express.static("public_html"));