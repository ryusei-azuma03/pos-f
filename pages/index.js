import { useState } from 'react';

export default function POSApp() {
  const [productCode, setProductCode] = useState('');
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const handleSearch = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/products/search', { // ← カンマを正しく修正
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: productCode }),
        });
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
    } catch (error) {
        alert(error.message);
        setProduct(null);
    }
};

  const addToCart = () => {
    if (product) {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      setTotal((prevTotal) => prevTotal + product.price);
      setProduct(null);
      setProductCode('');
    }
  };

  const handlePurchase = async () => {
    try {
      const productIds = cart.map((item) => item.id);
      const quantities = cart.map((item) => item.quantity);

      const response = await fetch('/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_ids: productIds, quantities }),
      });

      if (!response.ok) throw new Error('Purchase failed');
      const data = await response.json();
      alert(`Purchase successful! Total: ${data.total_amount}`);
      setCart([]);
      setTotal(0);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <h1 style={{ color: '#007bff' }}>POS Application</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter Product Code"
          value={productCode}
          onChange={(e) => setProductCode(e.target.value)}
          style={{ padding: '10px', marginRight: '10px' }}
        />
        <button onClick={handleSearch} style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>
          Search
        </button>
      </div>

      {product && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Product Found:</h3>
          <p>Name: {product.name}</p>
          <p>Price: {product.price}円</p>
          <button onClick={addToCart} style={{ padding: '10px', backgroundColor: '#28a745', color: '#fff' }}>
            Add to Cart
          </button>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h3>Cart:</h3>
        {cart.length > 0 ? (
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} x {item.quantity} = {item.price * item.quantity}円
              </li>
            ))}
          </ul>
        ) : (
          <p>Cart is empty</p>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Total: {total}円</h3>
        <button onClick={handlePurchase} style={{ padding: '10px', backgroundColor: '#dc3545', color: '#fff' }}>
          Purchase
        </button>
      </div>
    </div>
  );
}
