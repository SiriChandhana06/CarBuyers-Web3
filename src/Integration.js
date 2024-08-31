import { ethers } from "ethers";
import Abi from '../src/Abi/abi.json';

export async function initializeContract() {
    try {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const myContractAddress = "0x909499f495bF9cBC6265482AF978A10504aB0603";
            const contract = new ethers.Contract(
                myContractAddress,
                Abi,
                signer
            );
            console.log(contract);
            return { provider, signer, address, contract };
        } else {
            throw new Error("MetaMask not found");
        }
    } catch (error) {
        console.error('Error initializing contract:', error);
        throw error;
    }
}


export async function setItemDetails(contract, title,year,model,price,image) {
    const submitTx = await contract.setItemDetails( title,year,model,price,image, { gasLimit: 300000 });
    await submitTx.wait();
  }


//   export async function getAllItems(contract) {
//     const items = await contract.getAllItems();
//     return items;
// }

export async function getAllItems(contract) {
    const items = await contract.getAllItems();
    return items.map((item) => ({
      title: item.title,
      year: item.year,
      model: item.model,
      price: item.price,
      image: item.image,
    }));
  }
