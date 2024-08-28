import React, { useState, useEffect } from 'react';
import { initializeContract, getItemDetails } from '../Integration';
import { ethers } from 'ethers';

const CarCard = ({ carData }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [data, setData] = useState(null);

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
      if (carData) {
        setData(carData);
      } else {
        handlegetItems();
      }
    }
  }, [contract, carData]);

  const handlegetItems = async () => {
    try {
      if (!contract) {
        console.error('Contract is not initialized.');
        return;
      }
      const records = await getItemDetails(contract);
      setData(records);
      console.log('All Items Data:', records);
    } catch (error) {
      console.error('Error getting all Items data:', error);
    }
  };

  if (!data) return (
    <div className='backdrop-blur-md bg-white/30 p-6 border border-white/30 rounded-lg shadow-lg '>
      Loading
    </div>
  )
  

  const priceInWei = data[3];
  const priceInEther = ethers.utils.formatEther(priceInWei);

  const year = data.year ? data.year.toNumber() : data[1].toNumber();

  return (
    <div className="backdrop-blur-md bg-white/30 p-6 border border-white/30 rounded-lg shadow-lg max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-black">Car Details</h2>
      <div className="mb-4">
        <img
          src="https://gateway.pinata.cloud/ipfs/QmVZxY9ZEFFxkiAvKJqrULNkt3Cyf2NRbzbKxBY9QMmAt2"
          alt={data[0]}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      </div>
      <div className="space-y-2">
        <div>
          <span className="font-medium text-gray-600">Company:</span> {data[0]}
        </div>
        <div>
          <span className="font-medium text-gray-600">Price:</span> {priceInEther} <strong>ETH</strong>
        </div>
        <div>
          <span className="font-medium text-gray-600">Model:</span> {data[2]}
        </div>
        <div>
          <span className="font-medium text-gray-600">Year:</span> {year}
        </div>
      </div>
    </div>
  );
};

export default CarCard;
