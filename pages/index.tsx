import { useEffect, useState, } from "react";
import type { NextPage } from "next";
import { useAccount, useBalance, useProvider } from "wagmi";
import { Button, Layout, Loader, WalletOptionsModal } from "../components";
import axios from "axios"; // Import axios for making HTTP requests


const Home: NextPage = () => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [{ data: accountData, loading: accountLoading }] = useAccount();
  const [{ data: balanceData, loading: balanceLoading }] = useBalance({
    addressOrName: accountData?.address,
  });
  const provider = useProvider();

  const [lastTransactionHash, setLastTransactionHash] = useState("");
  const loading = (accountLoading || balanceLoading) && !balanceData;

  const fetchLastTransactionHash = async () => {
    const apiKey = process.env.ETHERSCAN_API_KEY;
    const address = accountData?.address;
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc&apikey=${apiKey}`;

    const response = await axios.get(url);
    const data = response.data;

    console.log(data);

    if (data.status === '1') {
      const latestTransactionHash = data.result[0].hash;
      console.log('Latest Transaction Hash:', latestTransactionHash);
      setLastTransactionHash(latestTransactionHash);
    } else {
      console.log('Error fetching data from Etherscan API');
      setLastTransactionHash("No previous transactions found.")
    }
    
  };  

  useEffect(() => {
    if (accountData?.address && provider) { // Check if provider is available
      fetchLastTransactionHash();
    }
  }, [accountData?.address, provider]); // Add provider to depedency


  const renderContent = () => {
    if (loading) return <Loader size={8} />;
    if (balanceData) {
      return (
        <>
          <h2 className="mb-8 text-4xl font-bold">Your Wallet</h2>

          <div className="ml-2">
            <h6> <strong>Account Address: </strong>{accountData?.address} </h6>
            <h6> <strong> Current Balance: </strong> 
              {`${Number(
                balanceData?.formatted
                ).toFixed(4)}`} ETH
            </h6>
            <h6>
              <strong>Last Transaction: </strong>
                {lastTransactionHash}
            </h6>
          </div>

        </>
      );
    }

    return (
      <>
        <Button
          loading={accountLoading}
          onClick={() => setShowWalletOptions(true)}
        >
          Connect to Wallet
        </Button>
      </>
    );
  };

  return (
    <>
      <WalletOptionsModal
        open={showWalletOptions}
        setOpen={setShowWalletOptions}
      />

      <Layout
        showWalletOptions={showWalletOptions}
        setShowWalletOptions={setShowWalletOptions}
      >
        <div className="grid h-screenr">
          <div className="grid place-items-center">{renderContent()}</div>
        </div>
      </Layout>
    </>
  );
};

export default Home;