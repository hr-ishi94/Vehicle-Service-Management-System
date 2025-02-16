import React from 'react'

const Table1 = () => {
  return (
    <div className='h-screen bg-zinc-900 p-5' id="service_history">
        <h1 className='text-white font-bold text-xl mt-16 mb-5'>Service History</h1>
        <div className="relative overflow-x-auto">
          <table className=" w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 w">
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
                  <tr key={index} className="bg-white border-b border-gray-200">
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
  )
}

export default Table1