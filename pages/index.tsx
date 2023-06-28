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
  const [membership, setMembership] = useState('');

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
    

    const lightModePrefCredentials = data.creds.filter(
        (credential: { type: any; }) => credential.type[1] === 'DarkModePreferenceCredential');
    
    const membershipCredentials = data.creds.filter(
          (credential: { type: any; }) => credential.type[1] === 'MembershipCredential');
    
    setTShirtSize(tshirtSizeCredentials ? tshirtSizeCredentials[0].credentialSubject.tshirtSize : '');
    setLightModePreference(lightModePrefCredentials ? lightModePrefCredentials[0].credentialSubject.preference : '');
    setMembership(membershipCredentials ? membershipCredentials[0].credentialSubject.organization : '');

  }

  const renderContent = () => {
    if (loading) return <Loader size={8} />;
    return (
      <>
      </>
    );
  };

  const issueGmCredential = async (recipient: string): Promise<void> => {
    const schemaUrl = 'https://raw.githubusercontent.com/discoxyz/disco-schemas/main/json/GMCredential/1-0-0.json';
  
    try {
      console.log(`Issuing cred to: ${recipient}`);
      const credential = await issueCredential(schemaUrl, recipient, {});
      // console.log('Issued credential:', credential);
    } catch (error) {
      console.error('Failed to issue credential:', error);
    }
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
        membership={membership}
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
