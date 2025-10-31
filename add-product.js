const productData = {
  name: "Los Mobilis",
  price: 15990,
  category: "Мебель",
  image: "https://cdn.poehali.dev/projects/3eee5195-d890-4f4a-8a00-03d938b85694/files/9a839a69-06bd-4a27-a4f5-6e6986201e40.jpg",
  seller_email: "losmobilis@shop.ru",
  seller_name: "Los Mobilis Store"
};

fetch('https://functions.poehali.dev/84a3f103-fdda-416a-abf4-551410b16841', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(productData)
})
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
