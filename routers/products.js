const express = require('express');
const {checkSchema, validationResult} = require('express-validator');
const {Router} = express;
const {getProductId, getProductById} = require('../utils/productUtils');
const router = Router();

const productSchema = {
    id: {
        in: ['params'],
        optional: true,
        errorMessage: 'Id del producto debe ser entero',
        isInt: { options: { min: 1 } },
        toInt: true
    },
    title: {
        notEmpty: true,
        errorMessage: "El titulo no puede estar vacio"
    },
    price: {
        errorMessage: "El precio debe ser un decimal positivo",
        exists: true,
        isFloat: { options: { min: 0 } },
        toFloat: true
    },
    thumbnail: {
        notEmpty: true,
        errorMessage: "Thumbnail no puede estar vacio"
    }
};

let productsDB = [];

router.get('/', (request, response) => {
    response.json(productsDB);
});

router.get('/:id', (request, response) => {
    const {id} = request.params;
    const product = getProductById(productsDB, id);

    if(!product){
        response.status(404).json({"error": "Producto no encontrado"});
    }

    response.json(product);
});

router.post('/', checkSchema(productSchema), (request, response) => {
    const id = getProductId(productsDB);
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(400).json({errors: errors.array()});
    }

    productsDB.push({id, ...request.body});
    response.status(200).json({success: true, message: 'Producto registrado', id});
});

router.put('/:id', checkSchema(productSchema), (request, response) => {
    const {id} = request.params;
    const errors = validationResult(request);

    if (!errors.isEmpty()){
        return response.status(400).json({errors: errors.array()});
    }

    const {title, price, thumbnail} = request.body;
    const product = getProductById(productsDB, id);

    if(!product){
        response.status(404).json({"error": "Producto no encontrado"});
    }

    product.title = title;
    product.price = price;
    product.thumbnail = thumbnail;

    response.status(200).json({success: true, message: 'Producto actualizado'});
});

router.delete('/:id', (request, response) => {
    const {id} = request.params;
    const product = getProductById(productsDB, id);

    if(!product){
        response.status(404).json({"error": "Producto no encontrado"});
    }

    productsDB = productsDB.filter(({id: productId}) => productId !== Number(id));
    response.status(200).json({success: true, message: 'Producto eliminado'});
});

module.exports = router;