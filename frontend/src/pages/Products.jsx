import { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Product List</h2>
      <ul className="space-y-3">
        {products.map((product, index) => (
          <li key={index} className="bg-white shadow p-4 rounded">
            <strong>{product.name}</strong> <br />
            Category: {product.category} <br />
            Quantity: {product.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}
