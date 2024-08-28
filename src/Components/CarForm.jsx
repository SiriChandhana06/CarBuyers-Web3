import React, { useState, useEffect } from 'react';
import { initializeContract, setItemDetails } from '../Integration';
import { ethers } from 'ethers';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CarForm = () => {
  const { transactionId } = useParams();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [model, setModel] = useState('');
  const [image, setImage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    model: '',
    year: '',
    image: '',
  });

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const uploadImageToPinata = async () => {
    try {
      // Check if the image is provided
      if (!formData.image) {
        toast.warning("Please upload an image before submitting.");
        return;
      }

      // Prepare the form data for Pinata
      const formDataToUpload = new FormData();
      formDataToUpload.append('file', formData.image);

      // Pinata API credentials (Use your own API key and secret)
      const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyMjczNWZmOS04OTQ5LTRmMjQtYjhlZi01NjNiYTdhNWMwNWMiLCJlbWFpbCI6InNpcmlzaXJpMzAwNkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYTQ1YTBlMmEwODE4NmZmZTg4NTQiLCJzY29wZWRLZXlTZWNyZXQiOiIxOTQ4ODgwM2M4MjY3YjhmY2Q0ZWU2YmVjMmJiMjJiMWY5YTJmNTU4YzQ2MzVmODhkYjk0MDhlYTE2NzA5YjljIiwiZXhwIjoxNzU2MTg5ODA2fQ.VO4iwUm49W6fsn-DC4dG42BlGro5hrgc3Ohh3Kr7i7M';

      // Upload the image to Pinata
      const imageUploadResponse = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formDataToUpload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      // Check if the upload was successful
      if (imageUploadResponse.status !== 200) {
        throw new Error('Failed to upload image to Pinata');
      }

      // Get the IPFS hash from the response
      const ipfsHash = imageUploadResponse.data.IpfsHash;
      const tokenURI = `https://ipfs.io/ipfs/${ipfsHash}`;

      // Update the formData with the IPFS hash
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: tokenURI,
      }));

      // Notify the user
      toast.success("Image uploaded to Pinata successfully!");
      return tokenURI;
    } catch (error) {
      toast.error("Error uploading image to Pinata!");
      console.error(error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Upload the image and get the hash
      const tokenURI = await uploadImageToPinata();
      console.log("IPFS Hash:", tokenURI);

      const title = formData.title.trim();
      const year = Number(formData.year);
      const model = formData.model.trim();
      const price = ethers.utils.parseUnits(formData.price, 'ether');  
      const image = formData.image;

      if (!title || isNaN(year) || !model || !price || !image) {
        throw new Error('Invalid input values');
      }

      // Log the form data with the IPFS hash
      console.log("Form Data:", {
        ...formData,
        image: tokenURI,
      });
      await setItemDetails(contract, title, year, model, price, image);
      console.log('Details submitted successfully.');
    } catch (error) {
      console.error('Error submitting details:', error);
    }
  };

  return (
    <div>
      <div className="backdrop-blur-md bg-white/30 p-10 border border-white/30 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Product Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white">Company Name</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full p-3 bg-transparent border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-white"
              placeholder="Enter company name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full p-3 bg-transparent border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-white"
              placeholder="Enter price"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="mt-1 block w-full p-3 bg-transparent border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-white"
              placeholder="Enter model"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-white">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="mt-1 block w-full p-3 bg-transparent border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-white"
              placeholder="Enter year"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Upload Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="mt-1 block w-full p-3 bg-transparent border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-white"
              accept="image/*"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        theme="colored"
      />
    </div>
  );
};

export default CarForm;
