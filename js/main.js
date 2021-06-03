
window.addEventListener("DOMContentLoaded",  ()=> {

    const url="https://afternoon-falls-30227.herokuapp.com/api/v1/products/";

    /* ---------------------------------------------------
     ----------- get all products from API ---------------
     ------------------ Home Page (index) ----------------
    */
    if(document.title =="Home"){

        console.log("hi from Home");

        // check if the local storage exist get the data to add on it, else return empty array.
        let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
        console.log(itemsArray);

        localStorage.setItem('items', JSON.stringify(itemsArray));

        let productList = document.querySelector(".product-list");
        
        const xhr = new XMLHttpRequest();
        xhr.open("GET",url);
        xhr.send();
        
        xhr.onload=()=>{
            if (xhr.status == 200){

                const response = xhr.response;
                const productsArr = JSON.parse(response);

                let temp='';

                productsArr.data.forEach( (item,iterator) => {
                    
                    //while looping on all items, if the item exist at the local storage, disable add-to-cart button.
                    let itemExist= itemsArray.some(v=> v.productID == item.ProductId)

                    temp+=
                        `<div class="product">
                            <span id="hiddenPoductID-${iterator}" style="display:none">${item.ProductId}</span>
                            <div class="img-container">
                                <a href="product.html?ProductId=${item.ProductId}"><img id="img-${iterator}" src="${item.ProductPicUrl}" alt='${item.Name}'></a>
                            </div>

                            <p id="productPrice-${iterator}" class="p-price">$${item.Price}</p>
                            <p class="p-name"><a id="productName-${iterator}" href="product.html?ProductId=${item.ProductId}">${item.Name}</a></p>
                            <p class="p-descrition" title='${item.Description}'>${item.Description.length>80? item.Description.substr(0,80).concat(' ...') : item.Description}</p>`;
                            
                            if(itemExist){
                                temp+=`<button data-value="${iterator}" onclick="addToCart(this)" class="to-cart" disabled style="background-Color:green;color:#fff;cursor:not-allowed"><i class='fas fa-shopping-cart'></i> Added to cart</button>`; 
                            }
                            else{
                                temp+=`<button data-value="${iterator}" onclick="addToCart(this)" class="to-cart"><i class="fas fa-cart-plus"></i> Add to cart </button>`;
                            }
                            
                    temp+=` <input id="productQTY-${iterator}" type="text" value="1" style="display:none">
                        </div>`;
                });

                productList.innerHTML=temp;

            }
            else{
                productList.innerHTML='<h3><i class="fas fa-bug"></i> Oops, somethign went wrong. </h3>';
            }
            

        }

    }

    /* ---------------------------------------------------
     ----------- get single product from API -------------
     ------------------ product page ---------------------
    */
    else if (document.title =="Product"){
        
        console.log("hi from product");
        let productWrapper = document.querySelector('#product-wrapper');

        let queryString = window.location.search;
        let productID = new URLSearchParams(queryString).get('ProductId');

        let productURL = url + productID ;

        const xhr = new XMLHttpRequest();
        xhr.open('get',productURL);
        xhr.send();

        xhr.onload= function(){
            if(xhr.status=200){

                const response = xhr.response;
                const product = JSON.parse(response);

                let temp = `
                    <div class="single-product">
                        <span id="hiddenPoductID-0" style="display:none">${product.data.ProductId}</span>

                        <div class="product-img">
                            <img id="img-0" src="${product.data.ProductPicUrl}" alt="${product.data.Name}">
                        </div>

                        <div class="product-content">
                            <h3 id="productName-0">${product.data.Name}</h3>
                            <p>${product.data.Description}</p>
                            <p class="cat"> Cat: ${product.data.Category}</p>                                                                  
                        </div>

                        <div class="Product-Availability">
                            <p class="Avability">Availability: <span> ${product.data.Status}</span></p>
                            
                            <p id="productPrice-0" class="Price">$${product.data.Price}</p>

                            <div class="qty">
                                <p>quantity</p>
                                <input id="productQTY-0" type="text" value="1">
                            </div>
                           
                            <button id="add-to-cart" data-value="0" onclick="addToCart(this)" class="btn-primary"><i class="fas fa-cart-plus"></i> Add to cart </button>
                        </div> 

                    </div>
                
                `;
                productWrapper.innerHTML = temp;

                // simple check if(this product exist in your local storage (shopping cart), so disable adding it again)
                let itemsArray = JSON.parse(localStorage.getItem('items'));
                let itemExist = itemsArray.some(item =>item.productID == product.data.ProductId );
                
                let cartButton = document.querySelector("#add-to-cart");
                if(itemExist){
                    cartButton.setAttribute("disabled","true");
                    cartButton.style.backgroundColor="green";
                    cartButton.style.color="#fff";
                    cartButton.style.cursor="not-allowed";
                    cartButton.innerHTML ="<i class='fas fa-shopping-cart fa-sm'></i> Already in cart";
                }
            }
            else{
                productWrapper.innerHTML='<i class="fas fa-bug"></i> <h3> Oops, somethign went wrong.</h3>';
            }
        }
    }
    
    /* ---------------------------------------------------
     --------------- post message to API -----------------
     ----------------  contact-us page -------------------
     */
    else if(document.title == "Contact-Us"){
        
        console.log("hi from contact-us");
        
        const contactApi = "https://afternoon-falls-30227.herokuapp.com/api/v1/contact_us";

        // select submit button
        const btnContact =document.querySelector("#btnContact");

        // add submit Event listener
        btnContact.addEventListener("click", (ev) => {
        
            // prevent default
            ev.preventDefault();

            // Get form data
            let Name=document.querySelector("#Name").value;
            let Email=document.querySelector("#Email").value;
            let Subject=document.querySelector("#Subject").value;
            let Message=document.querySelector("#Message").value;

            const userMessage={
                name: Name,
                email: Email,
                subject: Subject,
                message: Message
            }

            // Send request (post)
            const xhr = new XMLHttpRequest();
            xhr.open('post',contactApi);
            // it took me 2 hours to config that the problem was here (it was was sending in plain text not json type) 
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.send(JSON.stringify(userMessage));

            // Recieve Response and reset the form (if the post success)
            xhr.onload= () =>{

                if (xhr.status == 201 || xhr.status == 200) {
                    alert(`posted successfully, ${JSON.parse(xhr.responseText).message}`);
                    formMessage.reset();
                }
                else{
                    alert(`something wrong, ${xhr.responseText}`);
                }

            }

            xhr.onerror= () => alert("Oops: Something Went Wrong, please check your api data");

        });
    }

    /* ----------------------------------------------------------
     ------------------ shopping Cart page ----------------------
     ------------------------------------------------------------
     */

     else if(document.title == "Shopping-Cart"){
        
        fillingCart();
        
    }

     /* ----------------------------------------------------------
     ------------------ fixed Side Cart ( in all pages except shopping-cart page )
     -------------------------------------------------------------
     */
     if(document.title != "Shopping-Cart"){

        // Updating the fixed side cart with data.
        updateFixedSideCart();
    }

});

// Updating the fixed side cart with data.
function updateFixedSideCart(){

    // check if the local storage exist get the data to add on it, else return empty array.
    let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
    console.log(itemsArray);

    localStorage.setItem('items', JSON.stringify(itemsArray));
    
    let cartCount = document.querySelector(`#cart-items-count`);
    let cartTotalPrice = document.querySelector(`#cart-total-price`);
    let totalPrice=0;

    // the prices are stored as string preceded by $ (dollar sign), so we have to remove the dollar sign then convert to number 
    itemsArray.forEach(v =>{
        totalPrice += v.qty * Number(v.productPrice.substr(1));
    });

    cartCount.innerHTML = itemsArray.length;
    cartTotalPrice.innerHTML = `$${totalPrice}`;
}

// display the items of the shopping cart page
function fillingCart(){
         
    console.log("hi from Shopping-Cart");

    // check if the local storage exist get the data to add on it, else return empty array.
    let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
    console.log(itemsArray);

    localStorage.setItem('items', JSON.stringify(itemsArray));
    
    let totalPrice=0;
    let temp =`<div class="pro-head"> 
                    Product
                </div>

                <div class="price-head">
                    Price
                </div>

                <div class="qty-head">
                    Quantity
                </div>

                <div class="total-head">
                    Total
                </div>

                <div class="remove-head">
                    Remove
                </div>
                `;
    
    // the prices are stored as string preceded by $ (dollar sign), so we have to remove the dollar sign then convert to number 
    itemsArray.forEach((item,i )=>{
        temp+=`
            <div class="pro">
                <div class="img-container">
                    <a href="product.html?ProductId=${item.productID}"><img src="${item.ProductPicUrl}" alt="${item.productName}"></a>
                </div>
                <a href="product.html?ProductId=${item.productID}"><span>${item.productName}</span></a>                      
            </div>
            
            <div id="price-${i}" class="price">
            ${item.productPrice}
            </div>
            
            <div class="qty">
                <input id="qty-${i}" data-value="${i}" type="text" value="${item.qty}" onkeyup="CalcTotal(this)">
            </div>

            <div id="item-total-${i}" class="total">
                $${item.qty * item.productPrice.substr(1)}
            </div>

            <div class="remove">
                <i id="remove-${i}" data-value="${i}" onclick="removeItem(this)" class="fas fa-trash-alt"></i>
            </div>
            <span id="hiddenPoductID-${i}" style="display:none">${item.productID}</span>
        `;

        totalPrice += item.qty * Number(item.productPrice.substr(1));
    });
    document.querySelector("#cart-list-items").innerHTML= temp;
    document.querySelector("#grandTotal").innerHTML = `$${totalPrice}`;
};

// remove item from cart 
function removeItem(element){
    let catcher = element.getAttribute('data-value');
    let pID = document.querySelector(`#hiddenPoductID-${catcher}`).innerHTML;
    
    let itemsArray = JSON.parse(localStorage.getItem('items'));

    // filter the itemsArray to return items (that does not have the deleted product Id). 
    let updatedArr = itemsArray.filter(v =>v.productID != pID );
    localStorage.setItem('items', JSON.stringify(updatedArr));

    // update the shopping-cart page
    fillingCart();
}

// remove all items from the shopping cart
function removeAllItems(){
   
    if(confirm("Are you Sure you want to delete all items in your shopping cart"))
    {
        localStorage.clear();

        // update the shopping-cart page
        fillingCart();
    }
    else{
        console.log("not sure");
    }
   
}

// add products to the local storage, and updates the fixed cart on the right.
function addToCart(element){
    let catcher = element.getAttribute('data-value');

    let productID = document.querySelector(`#hiddenPoductID-${catcher}`).innerHTML;
    let ProductPicUrl = document.querySelector(`#img-${catcher}`).getAttribute('src');
    let productPrice = document.querySelector(`#productPrice-${catcher}`).innerHTML;
    let productName = document.querySelector(`#productName-${catcher}`).innerHTML;
    let qty = document.querySelector(`#productQTY-${catcher}`).value;

    let product={
        productID,
        ProductPicUrl,
        productPrice,
        productName,
        qty
    }

    console.log("from addtoCart number: " + catcher);
    
    // if the local storage exist then get the data to add on it, if not then i have an empty array to push on it.
    let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
    console.log(itemsArray);

    itemsArray.push(product);
    localStorage.setItem('items', JSON.stringify(itemsArray));
    

    // updates the fixed cart on the right
    updateFixedSideCart();

    // disable the button
    //let cartButton = document.querySelector("#add-to-cart");
    element.setAttribute("disabled","true");
    element.innerHTML ="<i class='fas fa-shopping-cart'></i> Added to cart";
    element.style.backgroundColor="green";
    element.style.color="#fff";
    element.style.cursor="not-allowed";
}
