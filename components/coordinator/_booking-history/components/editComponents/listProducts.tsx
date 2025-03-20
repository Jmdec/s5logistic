import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface Product {
  name: string;
  unit: string;
  quantity: string;
}

interface ProductsDetailsProps {
  updatedData: {
    id: any;
    products: string;
  };
  closeModal: () => void;
}

const ProductsDetails: React.FC<ProductsDetailsProps> = ({ updatedData, closeModal }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // Parse JSON on component mount
  useEffect(() => {
    try {
      const parsedProducts = JSON.parse(updatedData.products);
      setProducts(Array.isArray(parsedProducts) ? parsedProducts : []);
    } catch (error) {
      console.error("Error parsing products:", error);
    }
  }, [updatedData.products]);

  // Handle input change
  const handleInputChange = (index: number, field: keyof Product, value: string) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  // Add a new product
  const handleAddProduct = () => {
    setProducts([...products, { name: "", unit: "", quantity: "" }]);
  };

  // Delete a product
  const handleDeleteProduct = (index: number) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  // Save changes
  const handleSave = async () => {
    console.log("Saved Products Data:", products);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/bookinghistory/updateProducts/${updatedData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
  body: JSON.stringify({ products: products }),
      });

      if (response.ok) {
        toast.success("Products updated successfully!");
        closeModal();
      } else {
        toast.error("Error updating products.");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
return (
 <div className="mb-4 max-sm:h-96 overflow-auto">
  <div className="flex justify-between items-center">
    <h2 className="text-lg font-semibold mb-2">Edit Products</h2>
    <button
      onClick={handleAddProduct}
      className="bg-blue-500 text-white py-2 px-4 rounded-md -mt-2"
    >
      + Add Product
    </button>
  </div>

  {products.map((product, index) => (
    <div key={index} className="border p-4 mb-4 rounded-lg bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Product Name</label>
          <input
            type="text"
            placeholder="Product Name"
            value={product.name}
            onChange={(e) => handleInputChange(index, "name", e.target.value)}
            className="border p-3 w-full rounded-md bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <input
            type="text"
            placeholder="Quantity"
            value={product.quantity}
            onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
            className="border p-3 w-full sm:w-24 rounded-md bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Unit</label>
          <input
            type="text"
            placeholder="Unit"
            value={product.unit}
            onChange={(e) => handleInputChange(index, "unit", e.target.value)}
            className="border p-3 w-full sm:w-24 rounded-md bg-white"
          />
        </div>
        <div className="flex justify-center items-center mt-6 sm:mt-0">
          <button
            onClick={() => handleDeleteProduct(index)}
            className="bg-red-500 text-white px-4 py-2 rounded-md w-full sm:w-auto"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ))}

  <div className="mt-4 flex flex-col sm:flex-row space-x-0 sm:space-x-4">
    <button onClick={handleSave} className="bg-green-600 text-white py-2 px-4 rounded-md w-full sm:w-auto">
      Save Changes
    </button>
    <button onClick={closeModal} className="bg-gray-600 text-white py-2 px-4 rounded-md w-full sm:w-auto">
      Close
    </button>
  </div>
</div>

);

};

export default ProductsDetails;
