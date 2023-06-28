import Head from "next/head";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { Button, MenuDropdown, WalletOptionsModal } from "..";
import { useAccount } from "wagmi";
import { issueCredential, fetchCreds } from "../../utils/discoClient";

interface Props {
  children: ReactNode;
  showWalletOptions: boolean;
  setShowWalletOptions: (showWalletOptions: boolean) => void;
  username: string;
  address: string;
  tShirtSize: string;
  lightModePreference: string;
  membership: string;
}

export default function Layout(props: Props) {
  const { children, showWalletOptions, setShowWalletOptions, username, address, tShirtSize, lightModePreference, membership } = props;
  
  const [{ data: accountData, loading }, disconnect] = useAccount({
    fetchEns: true,
  });

  const renderLabel = () => {
    if (accountData?.ens) {
      return (
        <>
        Wallet not connected.
        </>
      );
    }

    return (
      <span className="truncate max-w-[150px]">{accountData?.address}</span>
    );
  };

  const renderButton = () => {
    if (accountData) {
      return (
        <MenuDropdown
          label={renderLabel()}
          options={[{ label: "Disconnect", onClick: disconnect }]}
        />
      );
    }

    return (
      <Button
        loading={loading || showWalletOptions}
        onClick={() => setShowWalletOptions(true)}
      >
        Connect Wallet and Import Data
      </Button>
    );
  };

  return (
    <div>
      <Head>
        <title>Disco Form Fill Demo </title>
        <meta name="description" content="Disco Wagmi Template" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WalletOptionsModal
        open={showWalletOptions}
        setOpen={setShowWalletOptions}
      />

  <div className="relative">
        <div className="flex items-center justify-between p-4">
          <div className="text-2xl font-bold cursor-default">
            <h2> Welcome {username}!</h2>
          </div>
          {renderButton()}
        </div>
        <div className="pl-4 mt-4">
          <p className="block text-gray-700 font-bold mb-2">
            We get it, you hate forms. We fill out the same party stuff all the time.<br />
            If this were an RSVP form, we&lsquo;d fill it out for you.<br /> <br /> < br /> 
            
            Your address is <strong className="border border-blue-500 px-2 py-1 rounded-lg"> {address}. </strong><br />
            We see that you are a Member of: <strong className="border border-blue-500 px-2 py-1 rounded-lg"> {membership}.</strong> <br/>
            If we were throwing a party, we&lsquo;d save you a t-shirt that&lsquo;s size: <strong className="border border-blue-500 px-2 py-1 rounded-lg"> {tShirtSize} </strong>.<br />
            With aesthetics, we&lsquo;ll remember that you&lsquo;re partial to: <strong className="border border-blue-500 px-2 py-1 rounded-lg"> {lightModePreference} </strong> mode.<br />
            Collect a GM, like an RSVP but better.<br />
          </p>
        </div>
        </div>
    </div>
  );
}
