import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchIssues, fetchRepairs, fetchVehicles, updateVehicle } from "../axios/UserServer";
import { updateVehicleAction } from "../redux/slices/VehicleSlice";


const Table = () => {

  const vehicles = useSelector((state) => state.vehicles.items); 
  const issues = useSelector((state) => state.issues.items); 
  const repairs = useSelector((state) => state.repairs.items); 

  const dispatch = useDispatch();
  const [checkedIssues, setCheckedIssues] = useState({});

  useEffect(() => {
    dispatch(fetchVehicles());
    dispatch(fetchIssues());
    dispatch(fetchRepairs());
  }, [dispatch]);

  const handleCheckboxChange = (vehicleId, issueId) => {
    setCheckedIssues((prevCheckedIssues) => {
      const vehicleIssues = prevCheckedIssues[vehicleId] || [];
      const updatedIssues = vehicleIssues.includes(issueId)
        ? vehicleIssues.filter(id => id !== issueId) 
        : [...vehicleIssues, issueId]; 
      return { ...prevCheckedIssues, [vehicleId]: updatedIssues };
    });
  };

  const allIssuesChecked = (vehicleId) => {
    const vehicleIssues = issues.filter(issue => issue.vehicle === vehicleId);
    const checkedIssuesForVehicle = checkedIssues[vehicleId] || [];
    return vehicleIssues.length === checkedIssuesForVehicle.length;
  };
  
  
  const handleStatusChange = async(id, status) => {
    const [selectedVehicle] = vehicles.filter((vehicle)=>vehicle.id === id)
    const vehicleData = {...selectedVehicle,status:status}
    try{
        const res = await dispatch(updateVehicle({id, vehicleData})); 
        dispatch(updateVehicleAction(res.payload))
        toast.success('Successfully Delivered the Vehicle!')
    }catch(error){
        console.log(error,'error while updating the Vehicle Status')
        toast.error('Error while updating status')
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen mx-10">
      <div className="container">
      <h1 className='text-white font-bold text-xl' id="service_history">Service History</h1>
        <table className="w-full  overflow-hidden my-5">
          <thead className="">
            <tr className="bg-gray-800 text-white border-gray-700 sm:table-row hidden rounded-lg">
              <th className="p-3 text-left">Sno</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Vehicle Registration Number</th>
              <th className="p-3 text-left">Issues</th>
              <th className="p-3 text-left">Total Cost</th>
              <th className="p-3 text-left" width="110px">Actions</th>
            </tr>
          </thead>
          <tbody className="sm:text-center text-sm font-semibold text-white">
          {[...vehicles]
                .sort((a, b) => (a.status === "pending" ? -1 : 1))
                .map((vehicle, index) => {
                const vehicleIssues = issues.filter((issue) => issue.vehicle === vehicle.id);
                const vehicleRepairs = repairs.filter((repair) =>
                  vehicleIssues.some((issue) => issue.id === repair.issue)
                );

                const totalRepairCost = vehicleRepairs.reduce((total, repair) => total + parseFloat(repair.total_cost), 0);

                return (
                <tr key={index} className="bg-zinc-700 rounded-lg sm:table-row flex flex-col sm:flex-row mb-2 sm:mb-0">
                    <td className="sm:border sm:border-grey-light hover:bg-gray-100 hover:text-zinc-600 p-3 max-sm:bg-gray-200 max-sm:text-black max-sm:hover:text-gray-900">{index + 1}</td>
                    <td className="sm:border sm:border-grey-light hover:bg-gray-100 hover:text-zinc-600 p-3 truncate">{new Date(vehicle.created_at).toLocaleDateString("en-GB")}</td>
                    <td className="sm:border sm:border-grey-light hover:bg-gray-100 hover:text-zinc-600 p-3 truncate">{vehicle.vin}</td>
                    <td className="sm:border sm:border-grey-light hover:bg-gray-100 hover:text-zinc-600 p-3 truncate"><ul>
                        {vehicleIssues.map((issue, issueIndex) => (
                          <li key={issueIndex}>
                            <input 
                              type="checkbox" 
                              checked={checkedIssues[vehicle.id]?.includes(issue.id) || vehicle.status === 'resolved'} 
                              onChange={() => handleCheckboxChange(vehicle.id, issue.id)} 
                              disabled={vehicle.status === 'resolved'}
                            />
                            {issue.description}
                          </li>
                        ))}
                      </ul></td>
                <td className="sm:border sm:border-grey-light hover:bg-gray-100 hover:text-zinc-600 p-3 truncate">₹ {totalRepairCost.toFixed(2)}</td>
                <td className="sm:border sm:border-grey-light hover:bg-gray-100 hover:text-zinc-600 p-3">
                    <select
                        className={`px-1 py-1 font-semibold border rounded-lg w-auto text-xs text-white ${allIssuesChecked(vehicle.id) ? 'bg-blue-500' : 'bg-gray-500'} ${vehicle.status === 'resolved' ? 'bg-green-500 appearance-none' : ''}`}
                        value={vehicle.status}
                        onChange={(e) => handleStatusChange(vehicle.id, e.target.value)}
                        disabled={vehicle.status === 'resolved'}
                        >
                        <option value="pending">Pending</option>
                        <option value="resolved">Delivered</option>
                    </select>
                  
                </td>
              </tr>
                );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
