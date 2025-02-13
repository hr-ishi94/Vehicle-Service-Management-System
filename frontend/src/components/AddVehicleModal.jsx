import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createIssue, createRepair, fetchComponents } from "../axios/UserServer";
import { createVehicle } from "../axios/UserServer"; 
import { addVehicle } from "../redux/slices/VehicleSlice";
import { toast } from "react-toastify";
import { addIssueAction } from "../redux/slices/IssueSlice";
import { addRepairAction } from "../redux/slices/RepairSlice";

const AddVehicleModal = ({ isOpen, toggleModal }) => {
  const dispatch = useDispatch();
  const { items: components, loading } = useSelector((state) => state.components);
  const user = useSelector((state) => state.auth.user);

  const [vehicleReg, setVehicleReg] = useState("");
  const [issues, setIssues] = useState([
    { id: 1, description: "", component: "", repairType: "", isOpen: true, price: 0 }
  ]);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchComponents());
    }
  }, [isOpen, dispatch]);

  const handleVehicleRegChange = (e) => setVehicleReg(e.target.value);

  const handleIssueChange = (id, e) => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === id ? { ...issue, description: e.target.value } : issue
      )
    );
  };

  const handleComponentChange = (id, e) => {
    const selectedComponent = components.find(comp => comp.name === e.target.value);
  
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === id ? { ...issue, component: selectedComponent, repairType: "", price: 0 } : issue
      )
    );
  };

  const handleRepairTypeChange = (id, repairType, price) => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === id ? { ...issue, repairType, price } : issue
      )
    );
  };

  const addNewIssue = () => {
    setIssues([...issues, { id: issues.length + 1, description: "", component: "", repairType: "", isOpen: true, price: 0 }]);
  };

  const removeIssue = (id) => {
    setIssues((prevIssues) => prevIssues.filter((issue) => issue.id !== id));
  };

  const toggleIssueSection = (id) => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === id ? { ...issue, isOpen: !issue.isOpen } : issue
      )
    );
  };

  const calculateTotalPrice = () => {
    return issues.reduce((acc, issue) => {
      const issuePrice = issue.repairType === "replace" 
        ? Number(issue.component?.price || 0)
        : Number(issue.component?.repair_price || 0);
  
      return acc + issuePrice;
    }, 500);  
  };
  
const handleSubmit = async (e) => {
  e.preventDefault();

  const vehicleData = {
    vin: vehicleReg,
    staff: user.user_id,
    total_repair_cost: calculateTotalPrice(),
  };  

  try {
    
    const vehicleResponse = await dispatch(createVehicle(vehicleData));
    const newVehicle = vehicleResponse.payload;

    await new Promise((resolve) => setTimeout(resolve, 2000)); 
    
    for (const issue of issues) {
      
      const issueResponse = await dispatch(
        createIssue({
          vehicle: newVehicle.id,
          description: issue.description,
          status: "pending",
        })
      );
      const newIssue = issueResponse.payload;
      
      dispatch(addIssueAction(newIssue));

      // await new Promise((resolve) => setTimeout(resolve, 2000)); 
      
      const repairData = {
        issue: newIssue.id,
        component: issue.component?.id || null,
        labor_cost: issue.price,
        total_cost: issue.price, 
        status: "pending",
      };
      
      const repairResponse = await dispatch(createRepair(repairData));
      const newRepair = repairResponse.payload;

      dispatch(addRepairAction(newRepair));
    }

    dispatch(addVehicle(newVehicle));
    setVehicleReg("");
    setIssues([
      { id: 1, description: "", component: "", repairType: "", isOpen: true, price: 0 },
    ]);
    toggleModal();
    toast.success("Vehicle, issues, and repairs added successfully");
  } catch (error) {
    console.error("Error creating vehicle, issues, or repairs:", error);
    toast.error("Failed to add vehicle. Please try again.");
  }
};

return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgb(0,0,0,0.8)]">
        <div className="relative rounded-lg shadow-lg bg-zinc-900 w-full max-w-md p-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-lg font-semibold text-white">Add New Vehicle</h3>
            <button onClick={toggleModal} className="text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg text-sm w-8 h-8 flex justify-center items-center">&#x2715;</button>
          </div>

          <div className="border-b-2 border-zinc-400 py-2">
            <label className="block text-sm font-medium text-white">Vehicle Reg Number</label>
            <input type="text" value={vehicleReg} onChange={handleVehicleRegChange} className="w-full mt-1 px-2 py-1 border rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-white" required />
          </div>

          <form onSubmit={handleSubmit} className="mt-2">
            {issues.map((issue) => (
              <div key={issue.id} className="mb-4 border-2 px-3 rounded-xl border-zinc-400 pb-1 bg-zinc-800">
                <div className="flex justify-between items-center">
                  <button type="button" onClick={() => toggleIssueSection(issue.id)} className="flex justify-between text-white text-sm font-semibold p-2 rounded-lg flex-1 uppercase">
                    Issue {issue.id} {issue.isOpen ? <Icon icon="ooui:collapse" width="20" height="20" /> : <Icon icon="uiw:down" width="20" height="20" />}
                  </button>
                  {issues.length > 1 && <button type="button" onClick={() => removeIssue(issue.id)} className="text-red-500 hover:text-red-700 ml-2">✖</button>}
                </div>
                {issue.isOpen && (
                  <div className="mt-2 mb-2">
                    <label className="block text-sm font-medium text-white">Issue Description</label>
                    <textarea rows="1" value={issue.description} onChange={(e) => handleIssueChange(issue.id, e)} className="w-full mt-1 p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 text-white" />
                    
                    <label className="block text-sm font-medium text-white">Add Component</label>
                    <select value={issue.component.name} onChange={(e) => handleComponentChange(issue.id, e)} className="w-full px-2 py-1 border rounded-lg bg-gray-600 border-gray-500 text-white text-sm">
                      <option value="">Select Component</option>
                      {loading ? (
                        <option>Loading...</option>
                      ) : (
                        components.map((comp) => (
                          <option key={comp.id} value={comp.name}>{comp.name}</option>
                        ))
                      )}
                    </select>

                    {issue.component && (
                      <div className="flex my-2">
                        <div className="flex items-center me-4">
                          <input type="radio" name={`repair-replace-${issue.id}`} onChange={() => handleRepairTypeChange(issue.id,"replace" ,issue.component.replace)} className="w-4 h-4 text-blue-600" />
                          <label className="ms-2 text-sm font-medium text-white">Replace ₹{issue.component.price}</label>
                        </div>
                        {issue.component.repair_price && <div className="flex items-center me-4">
                          <input type="radio" name={`repair-replace-${issue.id}`} onChange={() => handleRepairTypeChange(issue.id, "repair" ,issue.component.repair)} className="w-4 h-4 text-blue-600" />
                          <label className="ms-2 text-sm font-medium text-white">Repair ₹{issue.component.repair_price}</label>
                        </div>
                        }
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col items-end text-white">
              <h1>Service Price: 500</h1>
              <h1>Total Price: {calculateTotalPrice()}</h1>
            </div>
            <button type="button" onClick={addNewIssue} className="w-full mt-2 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2">+ Add More Issues</button>
            <button type="submit" className="w-full mt-4 text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-4 py-2">Submit</button>
          </form>
        </div>
      </div>
    )
  );
};

export default AddVehicleModal;
