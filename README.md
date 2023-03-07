# shopify-ajax-addtocart and add fee price on checkout step

## Shopify Ajax add to cart with selling_plan
```
<script>
  window.addEventListener('load', async () =>{
      const data = {
        "id": "{{ variant_id }}",
        "quantity": 1,
        "selling_plan": "{{ selling_plan }}"
      }
      
      await fetch("/cart/add.js", {
        method: 'POST',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(data)
      });

      window.location.href="/checkout";
  });
</script>
```

## Shopify swatch change event
```
document.addEventListener('DOMContentLoaded', function (){
  $('.swatch :radio').change(function() {
    var optionIndex = parseInt(jQuery(this).closest('.swatch').attr('data-option-index')) + 1;
    var optionValue = $(this).val();
    jQuery(this)
    .closest('form')
    .find('#Option'+optionIndex) 
    .val(optionValue)
    .trigger('change');
    var currencySelector = document.getElementById('Option'+optionIndex);
    currencySelector.value = optionValue;
    currencySelector.dispatchEvent(new Event("change"));
  });
}, false);
```

## Shopify form serialize using javascript
```
// see cart-drawer.js
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
```
