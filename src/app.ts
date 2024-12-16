import express from 'express';
import dotenv from 'dotenv';
import {getProductInfo} from "./productRepository";
import {ProductNotFound} from "./errors/notfound";

// TODO: Create AppConfig and pass parts of it into constructors
dotenv.config();
const app = express();

app.get('/getProductInfo', async (req, res) => {
    if (!req.query || !req.query.query || !req.query.query.length) {
        res.status(400).send('query param is required');
    }
    try {
        const productInfo = await getProductInfo(req.query.query as string);
        res.json(productInfo);
    } catch (error: any) {
        if (error instanceof ProductNotFound) {
            res.sendStatus(404);
        }
        res.status(500).send(error.message);
        console.error("Error:", error.message);
    }
});

// start the server
app.listen(process.env.BACK_PORT, () => {
    console.log(
        `server running : http://${process.env.BACK_HOST}:${process.env.BACK_PORT}`
    );
});