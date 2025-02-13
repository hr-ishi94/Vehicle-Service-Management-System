import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIssues, fetchRepairs, fetchVehicles, updateVehicle, updateVehicleStatus } from '../axios/UserServer';
import { updateVehicleAction } from '../redux/slices/VehicleSlice';
import { toast } from 'react-toastify';

const Home = () => {
  const vehicles = useSelector((state) => state.vehicles.items); 
  const issues = useSelector((state) => state.issues.items); 
  const repairs = useSelector((state) => state.repairs.items); 

  const dispatch = useDispatch();
  const [checkedIssues, setCheckedIssues] = useState({});
  const [selectedVehicle, setSelectedVehicle] = useState(null);

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
        : [...vehicleIssues, issueId]; // Check
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
        setSelectedVehicle(null); 
        toast.success('Successfully Delivered the Vehicle!')
    }catch(error){
        console.log(error,'error while updating the Vehicle Status')
        toast.error('Error while updating status')
    }
  };

  return (
    <div className='w-screen h-screen overflow-auto'>
      <NavBar />
      <Hero />
      <div className='h-screen bg-zinc-900 p-5' id="service_history">
        <h1 className='text-white font-bold text-xl mt-16 mb-5'>Service History</h1>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 w">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Sno</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Vehicle Registration Number</th>
                <th scope="col" className="px-6 py-3">Issues</th>
                <th scope="col" className="px-6 py-3">Total Cost</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle, index) => {
                const vehicleIssues = issues.filter((issue) => issue.vehicle === vehicle.id);
                const vehicleRepairs = repairs.filter((repair) =>
                  vehicleIssues.some((issue) => issue.id === repair.issue)
                );

                const totalRepairCost = vehicleRepairs.reduce((total, repair) => total + parseFloat(repair.total_cost), 0);

                return (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                    <th scope="row" className="px-6 py-4">{index + 1}</th>
                    <th scope="row" className="px-6 py-4">{new Date(vehicle.created_at).toLocaleDateString()}</th>
                    <th scope="row" className="px-6 py-4">{vehicle.vin}</th>
                    <td className="px-6 py-4">
                      <ul>
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
                      </ul>
                    </td>
                    <td className="px-6 py-4">₹ {totalRepairCost.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button 
                          className={`px-4 py-2 uppercase text-xs font-bold text-white rounded-md ${allIssuesChecked(vehicle.id) ? 'bg-blue-500' : 'bg-gray-500'} ${vehicle.status === 'resolved' ? 'bg-green-500' : ''}`} // Add green color if resolved
                          onClick={() => setSelectedVehicle(selectedVehicle === vehicle.id ? null : vehicle.id)}
                          disabled={!allIssuesChecked(vehicle.id)}
                        >
                          {vehicle.status}
                        </button>

                        {selectedVehicle === vehicle.id && (
                          <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                            <select 
                              id="status" 
                              className="block p-2 w-full bg-white rounded-md "
                              value={vehicle.status}
                              onChange={(e) => handleStatusChange(vehicle.id, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="resolved">Delivered</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;