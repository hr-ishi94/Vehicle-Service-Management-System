import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createComponent } from '../axios/OperationsServer';
import { addComponent } from '../redux/slices/ComponentSlice';
import { toast } from 'react-toastify';

const AddComponentModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [repairPrice, setRepairPrice] = useState('');
  const [stock, setStock] = useState('');

  const handleAddComponent = async (e) => {
    e.preventDefault();
    
    const componentData = {
      name,
      price: parseFloat(price),
      repair_price: repairPrice ? parseFloat(repairPrice) : null,
      stock: parseInt(stock),
    };

    try {
      const response = await dispatch(createComponent(componentData));
      console.log(response,'kl')
      if (response.payload) {
        dispatch(addComponent(response.payload));
        toast.success("Component Created Successfully")
      }
      setName("")
      setPrice("")
      setRepairPrice("")
      setStock("")
  
      onClose();
    } catch (error) {
      console.error("Error adding component:", error);
    }
  };

  return (
    isOpen && (
      <div className="fixed z-50 inset-0 flex items-center justify-center bg-[rgb(255,255,255,0.1)]">
        <div className="bg-zinc-900 rounded-xl p-6 max-w-lg w-full">
          <h2 className="text-2xl font-bold text-gray-300 mb-4">Add Component</h2>

          <form onSubmit={handleAddComponent} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Component Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter component name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">Price</label>
              <input
                type="number"
                id="price"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="repairPrice" className="text-sm font-medium">Repair Price (optional)</label>
              <input
                type="number"
                id="repairPrice"
                placeholder="Enter repair price"
                value={repairPrice}
                onChange={(e) => setRepairPrice(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="stock" className="text-sm font-medium">Stock</label>
              <input
                type="number"
                id="stock"
                placeholder="Enter stock quantity"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-amber-500 text-white px-6 py-2 rounded-lg"
              >
                Add Component
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddComponentModal;
