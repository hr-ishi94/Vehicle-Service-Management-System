import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComponents } from '../axios/UserServer';
import { deleteComponent, updateComponent } from '../axios/OperationsServer';
import AddComponentModal from './AddComponentModal';
import { deleteComponentAction, updateComponentAction } from '../redux/slices/ComponentSlice';
import { toast } from 'react-toastify';

const ComponentListView = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.components);
  const [editingComponent, setEditingComponent] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
    
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    dispatch(fetchComponents());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  
  const handleUpdate = async(id, componentData) => {
    try{
        const response = await dispatch(updateComponent({ id, componentData }));
        console.log(response)
        dispatch(updateComponentAction(response.payload))
        setEditingComponent(null); 
        toast.success("Updated Successfully")
    }catch(error){
        console.log("error: ",error)
        toast.error("Error Occured")
    }
  };

  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this component?")) {
      try{
         const res = await dispatch(deleteComponent(id));
         dispatch(deleteComponentAction(id)) 
         toast.success("Deleted Successfully!")
      }catch(error){
        console.log("error:",error)
        toast.error("Failed to Delete")
      } 
    }
  };

  return (
    <>
      <div className="p-4 sm:ml-64 bg-zinc-900 border-l-2 border-zinc-800 h-full py-10 mt-15 px-10 max-md:h-screen">
        <div className="flex text-gray-300 justify-between px-1 my-5">
          <h1 className="uppercase font-bold">Component</h1><button onClick={handleOpenModal} className="bg-amber-700 px-2 py-1 rounded-lg">
        Add Component
      </button>

      <AddComponentModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Component Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Repair Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((component) => (
                <tr key={component.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {component.name}
                  </th>
                  <td className="px-6 py-4">
                    ₹{component.price}
                  </td>
                  <td className="px-6 py-4">
                    {component.repair_price ? `₹${component.repair_price}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {component.stock}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(component.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                   
                    <button
                      className="bg-amber-500 text-white px-3 py-1 rounded-lg"
                      onClick={() => setEditingComponent(component)} 
                    >
                      Update
                    </button>

                    
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-lg"
                      onClick={() => handleDelete(component.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

       
        {editingComponent && (
           <div className="fixed z-50 inset-0  flex items-center justify-center max-sm:pl-5 bg-[rgb(255,255,255,0.1)]">
        <div className="bg-zinc-900 rounded-xl p-6 max-w-lg w-full text-gray-50 ">
              <h2 className="text-xl font-semibold mb-4">Update Component</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const updatedComponent = {
                    ...editingComponent,
                   
                  };
                  handleUpdate(editingComponent.id, updatedComponent); 
                }}
              >
                <label htmlFor="name" className="block mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  className="border p-2 mb-4 w-full rounded-lg"
                  value={editingComponent.name}
                  onChange={(e) => setEditingComponent({ ...editingComponent, name: e.target.value })}
                />

                <label htmlFor="price" className="block mb-2">Price</label>
                <input
                  type="number"
                  id="price"
                  className="border p-2 mb-4 w-full rounded-lg"
                  value={editingComponent.price}
                  onChange={(e) => setEditingComponent({ ...editingComponent, price: e.target.value })}
                />

                <label htmlFor="repair_price" className="block mb-2">Repair Price</label>
                <input
                  type="number"
                  id="repair_price"
                  className="border p-2 mb-4 w-full rounded-lg"
                  value={editingComponent.repair_price || ''}
                  onChange={(e) => setEditingComponent({ ...editingComponent, repair_price: e.target.value })}
                />

                <label htmlFor="stock" className="block mb-2">Stock</label>
                <input
                  type="number"
                  id="stock"
                  className="border p-2 mb-4 w-full rounded-lg"
                  value={editingComponent.stock}
                  onChange={(e) => setEditingComponent({ ...editingComponent, stock: e.target.value })}
                />

                <div className="flex justify-between">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => setEditingComponent(null)} // Close the form without saving
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-500 text-white px-4 py-2 rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ComponentListView;
