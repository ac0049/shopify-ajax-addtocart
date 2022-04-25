# shopify-ajax-addtocart

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
