let iconCart = document.querySelector('.iconCart');
let cart = document.querySelector('.cart');
let container = document.querySelector('.container');
let close = document.querySelector('.close');


iconCart.addEventListener('click', () => {
    if (cart.style.right == '-100%') {
        cart.style.right = '0';
        container.style.transform = 'translateX(-400px)';
    } else {
        cart.style.right = '-100%';
        container.style.transform = 'translateX(0px)';
    }
})

close.addEventListener('click', () => {
    cart.style.right = '-100%';
    container.style.transform = 'translateX(0px)';
})

let products = null;
//get data from file json
fetch('product.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();
    })

//show datas in list html
function addDataToHTML() {
    // remove datas default in html
    let listProductHTML = document.querySelector('.listProduct');
    listProductHTML.innerHTML = '';

    // add new data
    if (products != null) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.innerHTML =
                `<img src="${product.image}">
            <h2>${product.name}</h2>
            <div class="price">P${product.price}</div>
            <button onclick="addCart(${product.id})">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
}

let listCart = [];
// get cookie data cart
function checkCart() {
    var cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('listCart='));
    if (cookieValue) {
        listCart = JSON.parse(cookieValue.split('=')[1]);
    }
}
checkCart();
function addCart($idProduct) {
    let productCopy = JSON.parse(JSON.stringify(products));
    //if this product is not in the cart
    if (!listCart[$idProduct]) {
        let dataProduct = productCopy.filter(
            product => product.id == $idProduct
        )[0];
        // add data product in cart
        listCart[$idProduct] = dataProduct;
        listCart[$idProduct].quantity = 1;
    } else {
        // id this product is already in the cart
        // just increase the quantity
        listCart[$idProduct].quantity++;
    }
    // save datas cart in cookie
    // to save this datas cart when i turn of the computer
    let timeSave = "expires=thu, 31 dec 2025 23:59:59 UTC";
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; " + timeSave + "; path=/;";
    addCartToHTML();
}

addCartToHTML();
function addCartToHTML() {
    // clear data default;
    let listCartHTML = document.querySelector('.listCart');
    listCartHTML.innerHTML = '';

    let totalHTML = document.querySelector('.totalQuantity');
    let toalQuantity = 0;

    if (listCart) {
        listCart.forEach(product => {
            if (product) {
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML =
                    `<img src="${product.image}">
                <div class="content">
                    <div class="name">
                        ${product.name}
                    </div>
                    <div class="price">
                        P${product.price}/1 product
                    </div>
                </div>
                <div class="quantity">
                    <button onclick="changeQuantity(${product.id}, '-')">-</button>
                    <span class="value">
                    ${product.quantity}
                    </span>
                    <button onclick="changeQuantity(${product.id}, '+')">+</button>
                </div>`;
                listCartHTML.appendChild(newCart);
                toalQuantity = toalQuantity + product.quantity;
            }
        })
    }
    totalHTML.innerText = toalQuantity;
}

function changeQuantity($idProduct, $type) {
    switch ($type) {
        case '+':
            listCart[$idProduct].quantity++;
            break;
        case '-':
            listCart[$idProduct].quantity--;
            if(listCart[$idProduct].quantity <= 0){
                delete listCart[$idProduct];
            }
            break;
        default:
            break;
    
    }
    //save new data in cookie
    let timeSave = "expires=thu, 31 dec 2025 23:59:59 UTC";
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; " + timeSave + "; path=/;";
    addCartToHTML();

    // reload list cart in HTML
    addCartToHTML();
}



