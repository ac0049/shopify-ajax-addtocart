function fetchConfig(type = 'json') {
    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
    };
  }

class CartDrawer extends HTMLElement {

    constructor(){
        super();
        document.addEventListener('keyup', (evt) => {
            if(evt.key === 'Escape' || evt.keyCode === 27){
                this.close();
            }
        });
        this.setCartAccessible();
        this.cartBucketDesk = document.querySelectorAll('[data-cart-btn] .cart_count')[0];
        this.cartBucketMobile = document.querySelectorAll('[data-cart-btn] .cart_count')[1];
        this.totalPrice = this.querySelector('[data-cart-total-price]');
        document.querySelector('body').addEventListener('submit', this.handleAddToCart.bind(this))
        document.addEventListener('scroll', this.handleScroll.bind(this));
    }

    close(){
        if(this.classList.contains('isActive')){
            this.classList.remove('isActive');
        }
    }

    setCartAccessible(){
        const cartLink = document.querySelectorAll('[data-cart-btn]');
        cartLink.forEach(btn=>{
            btn.addEventListener('click', (event) => {
                event.preventDefault();
                this.open()
              });
            btn.addEventListener('keydown', (event) => {
            if (event.code.toUpperCase() === 'SPACE') {
                event.preventDefault();
                this.open();
            }
            });
        })
        
        // cartLink.setAttribute('data-ajax-cart-bind-state', 'cart.item_count');
    }

    handleScroll(e){
        this.setCartAccessible();
    }

    open(){
        // let drawer = this.querySelector('[data-drawer-target]');
        if(!this.classList.contains('isActive')){
            this.classList.add('isActive');
        }
    }

    async updateQuantity(line, quantity, key){

        console.log(key);

        const body = JSON.stringify({
            id: key,
            quantity: Number(quantity),
            sections:[
                'cart-drawer'
            ],
            sections_url: window.location.pathname
        });
        let res = await fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } });
        let response = await res.text()
        let parsedState = JSON.parse(response);
        console.log(parsedState);

        if(Number(this.cartBucketDesk.innerText) == parsedState.item_count){
            console.log(this);
            this.querySelector(`[data-error-key="${key}"]`).innerText = 'no more items'
        }else{
            this.reRenderCart(parsedState);
        }


        this.cartBucketDesk.innerHTML = parsedState.item_count;
        this.cartBucketMobile.innerHTML = parsedState.item_count;

        if(parsedState.item_count == 0){
            this.classList.add('isEmpty');
        }
        
        // .then((response) => {
        //     return response.text();
        // })
        // .then((state) => {
        //     const parsedState = JSON.parse(state);

        //     console.log(state);
        // })
    }

    reRenderCart(parsedState){
        this.innerHTML = new DOMParser().parseFromString(parsedState.sections['cart-drawer'], 'text/html').querySelector('cart-drawer').innerHTML;
    }

    async handleAddToCart(e){
        
        let addToCartForm = e.srcElement;
        let addToCartBtn = e.srcElement.querySelector('.add_to_cart');
        if(!addToCartForm.classList.contains('shopify-product-form')){
            return ;
        }
        e.preventDefault();

    
        let formObj = this.serializeForm(addToCartForm);
        

        let body = {
            ...this.serializeForm(addToCartForm),
            sections:[
                'cart-drawer'
            ],
            sections_url: window.location.pathname
        };

        const itemProps = {};
  
        for (const key in body) {
          if(key.includes('properties')) {
            const propsName = key.replace('properties[', '').replace(']', '');
            itemProps[propsName] = body[key];
          }
        }

        body.properties = itemProps;

        body = JSON.stringify(body);

        addToCartBtn.setAttribute('disabled', 'disabled');

        let res = await fetch(`${routes.cart_add_url}`, { ...fetchConfig(), ...{ body } });
        let response = await res.text()
        let parsedState = JSON.parse(response);


        console.log(parsedState);



        this.reRenderCart(parsedState);

        addToCartBtn.removeAttribute('disabled');
        
        if(this.classList.contains('isEmpty')){
            this.classList.remove('isEmpty')
        }
        
        this.cartBucketDesk.innerHTML = Number(this.cartBucketDesk.innerText) + Number(formObj.quantity);
        this.cartBucketMobile.innerHTML = Number(this.cartBucketMobile.innerText) + Number(formObj.quantity);
        $.fancybox.close();
        this.open();
    }

    serializeForm(form){
        var obj = {};
        var formData = new FormData(form);
        for (var key of formData.keys()) {
            obj[key] = formData.get(key);
        }
        return obj;
    }

}

class PlusButton extends HTMLElement{
    constructor(){
        super();
        this.cartIndex = this.getAttribute('data-index');
        this.cartKey = this.getAttribute('data-key');
        this.addEventListener('click', this.handlePlus);
        this.qty = this.getAttribute('data-qty-value');
    }

    handlePlus(e){
        console.log(this.qty);
        const cartItems = this.closest('cart-drawer');
        cartItems.updateQuantity(this.dataset.index, this.qty, this.cartKey);
    }
}

class MinusButton extends HTMLElement{
    constructor(){
        super();
        this.cartKey = this.getAttribute('data-key');
        this.cartIndex = this.getAttribute('data-index');
        this.addEventListener('click', this.handleMinus);
        this.qty = this.getAttribute('data-qty-value');
    }
    handleMinus(e){
        const cartItems = this.closest('cart-drawer');
        cartItems.updateQuantity(this.dataset.index, this.qty, this.cartKey);
    }
}

class CartRemoveButton extends HTMLElement {
    constructor() {
      super();
      this.addEventListener('click', (event) => {
        event.preventDefault();
        const cartItems = this.closest('cart-drawer');
        cartItems.updateQuantity(this.dataset.index, 0, this.getAttribute('data-key'));
      });
    }
}


customElements.define('cart-drawer', CartDrawer);
customElements.define('plus-button', PlusButton);
customElements.define('minus-button', MinusButton);
customElements.define('remove-cart-button', CartRemoveButton);
