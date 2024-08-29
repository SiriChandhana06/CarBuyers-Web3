import React, { useState, useEffect } from 'react';
import { initializeContract, getAllItems } from '../Integration';
import { ethers } from 'ethers';

const CarCard = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    async function initialize() {
      try {
        const { provider, signer, address, contract } = await initializeContract();
        setProvider(provider);
        setSigner(signer);
        setAddress(address);
        setContract(contract);
      } catch (error) {
        console.error('Error initializing contract:', error);
      }
    }
    initialize();
  }, []);

  useEffect(() => {
    if (contract) {
      fetchItems();
    }
  }, [contract]);

  const fetchItems = async () => {
    try {
      const records = await getAllItems(contract);
      setData(records);
      setFilteredData(records); // Initially, set filtered data to all items
      console.log('All Items Data:', records);
    } catch (error) {
      console.error('Error getting all items data:', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query === '') {
      setFilteredData(data); // If the search query is empty, reset to show all data
    } else {
      const filtered = data.filter(item => {
        const priceInEther = ethers.utils.formatEther(item.price);
        const year = item.year ? item.year.toNumber() : item[1].toNumber();
        
        return (
          item.title.toLowerCase().includes(query) ||
          item.model.toLowerCase().includes(query) ||
          year.toString().includes(query) ||
          priceInEther.includes(query)
        );
      });
      setFilteredData(filtered);
    }
  };

  if (!data.length) return (
    <div className='backdrop-blur-md bg-white/30 p-6 border border-white/30 rounded-lg shadow-lg '>
      Loading...
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex justify-center">
  <div className="relative w-80">
    <input
      type="text"
      value={searchQuery}
      onChange={handleSearch}
      placeholder="Search Here"
      className="px-4 py-2 pl-12 border border-white/30 backdrop-blur-md bg-white/30 text-black placeholder:text-black rounded-full shadow-sm w-full"
    />
    <div className="absolute inset-y-0 left-4 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="black"
      >
        <path d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" />
      </svg>
    </div>
  </div>
</div>
      
      {filteredData.length === 0 ? (
        <div className="text-center text-gray-500">No results found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item, index) => {
            const priceInEther = ethers.utils.formatEther(item.price);
            const year = item.year ? item.year.toNumber() : item[1].toNumber();
            return (
              <div key={index} className="backdrop-blur-md bg-white/30 p-6 border border-white/30 rounded-lg shadow-lg max-w-sm mx-auto">
                <h2 className="text-xl font-semibold mb-4 text-black">Car Details</h2>
                <div className="mb-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-gray-600">Company:</span> {item.title}
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Model:</span> {item.model}
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Year:</span> {year}
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Price:</span> {priceInEther} ETH
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CarCard;
