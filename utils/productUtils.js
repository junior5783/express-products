const getProductId = (productsDB) => {
    if(productsDB?.length){
        const {id} = productsDB[productsDB.length - 1];

        return id + 1;
    }

    return 1;
}

const getProductById = (productsDB, id) => {
    return productsDB.find(({id: productId}) => productId === Number(id));
};

module.exports = {
    getProductById: getProductById,
    getProductId: getProductId
}