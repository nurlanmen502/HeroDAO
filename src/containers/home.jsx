import { useState, useEffect } from "react";
import { ethers, BigNumber } from 'ethers'
import { ToastContainer, toast } from 'react-toastify';
import { contractAddress } from '../constants/address';
import { connectWallet, getCurrentWalletConnected } from '../util/interact';
import { Navigation } from "../components/navigation";
import SmoothScroll from "smooth-scroll";
import 'react-toastify/dist/ReactToastify.css';
import Hero from "../components/Hero/"
import Bank from "../components/Bank/"
import Main from "../components/Main/"
import { Spin } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

export const getContract = async () => {
  await window.ethereum.enable()
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contractABI = require("../constants/contract.json")
  const contract = new ethers.Contract(contractAddress, contractABI, signer)
  return contract
}

const Home = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [status, setStatusAlert] = useState(null); // setStatusAlert => setStatus
  const [_, setStatus] = useState(null); // will remove in the build open-mint version.
  const [loading, setTxLoading] = useState(false);
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxTokens, setMaxTokens] = useState(0);
  const [maxTokenPurchase, setMaxTokenPurchase] = useState(10);
  const notify = () => toast.info(status, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });

  useEffect(() => {
    async function setWalletAddressHook()
      {
        const { address, status } = await getCurrentWalletConnected()
        setWalletAddress(address)
        if(status !== "") setStatus(status)
      }
      setWalletAddressHook()
  }, []);
  useEffect( () => {
      async function setTotalSupplyHook() {
          if ( !loading && walletAddress ) {
            let contract = await getContract()
            let res = await contract.totalSupply()
            let mtb = await contract.MAX_TOKENS()
            setTotalSupply( parseInt(BigNumber.from(res).toString()) )
            setMaxTokens( parseInt(BigNumber.from(mtb).toString()) )
          }
        }
        setTotalSupplyHook()
  }, [loading, walletAddress])

  useEffect(() => {
    if (status) {
      notify()
      setStatus(null)
    }
  }, [status])

  const onClickConnectWallet = async () => {
    const walletResponse = await connectWallet();
    console.log(walletResponse);
    setStatus(walletResponse.status);
    setWalletAddress(walletResponse.address);
  }

  const onClickDisconnectWallet = async () => {
    setWalletAddress(null)
  }

  return (
    <div>
      <Spin id="spindiv" tip="Loading..." size="large" spinning={loading}>
        <Navigation  onClickDisconnectWallet={onClickDisconnectWallet} onClickConnectWallet={onClickConnectWallet} walletAddress={walletAddress}  />
        <Router>
          <Switch>
            <Route exact path="/">
              <Main totalSupply={totalSupply} maxTokenPurchase={maxTokenPurchase} maxTokens={maxTokens} 
            loading={loading} walletAddress={walletAddress} setStatus={setStatus} setTxLoading={setTxLoading}/>
            </Route>
            <Route path="/hero">
              <Hero walletAddress={walletAddress} setStatus={setStatus} setTxLoading={setTxLoading}/>
            </Route>
            <Route path="/bank">
              <Bank walletAddress={walletAddress} setStatus={setStatus} setTxLoading={setTxLoading}/>
            </Route>
          </Switch>
        </Router>
      </Spin>
      <ToastContainer />
    </div>
  );
};

export default Home;
