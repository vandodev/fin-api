const { request } = require('express');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const customers = [];

// Middlewares
const verifyIfAccountExists = (req, res, next) => {
    const { cpf } = req.params;

    const customer = customers.find(customer => customer.cpf === cpf);

    if (!customer) {
        return res.status(400).json({error: "Customer not found!"});
    }
    req.customer = customer;
    return next();
    
}

app.post("/account", (req, res) => {

    const { cpf, name } = req.body;
     const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf);

    if (customerAlreadyExists) {
        return res.status(400).json({
            error: "Customer already exists!"
        });
    }   
    
    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });

    return res.status(201).send();
});

app.get("/statement/:cpf", verifyIfAccountExists, (req, res) => {
    const { customer } = req;
    return res.json(customer.statement);
});

app.post("/deposit/:cpf", verifyIfAccountExists, (req, res) => {
    const { description, amount } = req.body;
    const { customer } = req;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation);

    return res.status(201).send();
});

app.listen(3333, () => {
    console.log("Server is running! 🚀");
});