import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useAccount, useBalance } from "wagmi";
import { Button, FormLayout, Loader, WalletOptionsModal } from "../components";
import { fetchCreds, issueCredential } from "../utils/discoClient";


const Home: NextPage = () => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [{ data: accountData, loading: accountLoading }] = useAccount();


  const [tShirtSize, setTShirtSize] = useState('');
  const [username, setUserName] = useState('');
  const [address, setAddress] = useState('');
  const [lightModePreference, setLightModePreference] = useState('');

  const loading = (accountLoading);

  const fetchDataBackpackCreds = async () => {
    const data = await fetchCreds(accountData?.address);

    console.log("response: ", data);
    if (data.profile) {
      setUserName(data.profile.name);
      setAddress(data.profile.ethAddress);
    }

    const tshirtSizeCredentials = data.creds.filter(
      (credential: { type: any; }) => credential.type[1] === 'TshirtSizeCredential');
    
    console.log(tshirtSizeCredentials);

    const lightModePrefCredentials = data.creds.filter(
        (credential: { type: any; }) => credential.type[1] === 'DarkModePreferenceCredential');
    
    console.log(lightModePrefCredentials);


    setTShirtSize(tshirtSizeCredentials[0].credentialSubject.tshirtSize);
    setLightModePreference(lightModePrefCredentials[0].credentialSubject.preference);
  }

  const renderContent = () => {
    if (loading) return <Loader size={8} />;
    return (
      <>
      </>
    );
  };

  return (
    <>
      <WalletOptionsModal
        open={showWalletOptions}
        setOpen={setShowWalletOptions}
      />

      <FormLayout
        showWalletOptions={showWalletOptions}
        setShowWalletOptions={setShowWalletOptions}
        username={username}
        address={address}
        tShirtSize={tShirtSize}
        lightModePreference={lightModePreference}
      >
        <div className="grid h-screen place-items-center">
          <div className="grid place-items-center">{renderContent()}</div>
        </div>
      </FormLayout>

      <Button loading={false} onClick={() => fetchDataBackpackCreds()}>Click to fill in Data </Button>
      <Button loading={false} onClick={() => issueCredential(accountData?.address)}>Collect a GM </Button>
    </>
  );
};

export default Home;
