import { ethers } from "ethers";
import Abi from '../src/Abi/abi.json';

export async function initializeContract() {
    try {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const myContractAddress = "0xA171a0C64C0AF50F33b7952603aFE7764EC8EB01";
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
    const submitTx = await contract.setItemDetails( title,year,model,price,image, { gasLimit: 100000 });
    await submitTx.wait();
  }


  export async function getItemDetails(contract) {
    const carDetails = await contract.getItemDetails();
    return carDetails;
}
