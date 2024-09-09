import { ethers } from "ethers";
import Abi from '../src/Abi/abi.json';

export async function initializeContract() {
    try {
        if (typeof window.ethereum !== "undefined") {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const myContractAddress = "0x2F2D2d682734e62fFD7f70b7fd79aC698009F274";
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


  export async function getAllItems(contract) {
    const items = await contract.getAllItems();
    return items;
}

  export async function getMyPosts(contract) {
    const caritems = await contract.getMyPosts();
    return caritems   
  }


