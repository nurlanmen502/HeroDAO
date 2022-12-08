import React, { useState, useEffect } from 'react';
import { getContract } from '../Main';
import { Button } from 'antd';
import { loglevel } from "../../constants/loglevel"
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

const Hero = (props) => {
    const history = useHistory();
    const { walletAddress, setStatus, setTxLoading } = props
    const [ Herodata, setHeroData ] =  useState([])
    const [ HeroTimer, setHeroTimer ] =  useState([])
    const [ test, settest ] =  useState(0)
    const totalarr = loglevel.split(",")

    const findRare = (num) => {
        if(num === 1) return (
            <span className="rare">Rare</span>
        )
        if(num === 2) return (
            <span className="uncommon">Uncommon</span>
        )
        if(num === 3) return (
            <span className="common">Common</span>
        )
    }
    const findGold = (num) => {
        if(num === 1) return (
            <span className="rare">50</span>
        )
        if(num === 2) return (
            <span className="uncommon">20</span>
        )
        if(num === 3) return (
            <span className="common">10</span>
        )
    }
    const getCollectAllGold = async () => {
        const contract = await getContract()
        setTxLoading(true)
        try {
            let tx = await contract.collectAll();
            let res = await tx.wait()
            if (res.transactionHash) {
                setStatus(`You collected All $Gold Successfully`)
            }

        } catch(err) {
            setStatus("$Gold collection is failed.")
        }
        setTxLoading(false)
        window.location.reload();
    }
    const getCollectGold = async (tokenid) => {
        const contract = await getContract()
        setTxLoading(true)
        try {
            let tx = await contract.collectGold(tokenid);
            let res = await tx.wait()
            if (res.transactionHash) {
                setStatus(`You collected $Gold Successfully`)
            }

        } catch(err) {
            if(err.toString().search("gold already collected.") !== -1) setStatus("$Gold for this Hero already collected.")
        }
        setTxLoading(false)
        window.location.reload();
    }
    useEffect(() => {
        async function setHeroDataHook()
          {
            setTxLoading(true)
            const contract = await getContract()
            console.log("address",walletAddress)
            try {
                const result = await contract.getTokenids(walletAddress);
                const {0: ids, 1: canflag} = result;
                console.log("token",[ids,canflag])
                setHeroData(ids);
                setHeroTimer(canflag);
                setInterval()

            } catch(err) {
              console.log(err)
            }
            setTxLoading(false)
          }
        if(walletAddress) {
            setHeroDataHook()
        }
    }, [walletAddress]);

    useEffect(() => {
        if(!HeroTimer.every((timer) => timer === 0)) {
            const interval = window.setInterval(() => {
            //   settest((test) => test + 1)
            setHeroTimer((timedata) => timedata.map((eachtime) => {
                if(eachtime === 0) return 0;
                else {
                    if((eachtime - 1) < 0) return 0;
                    else return eachtime - 1;
                }
            }))
            console.log(HeroTimer)
            }, 1000);
            return () => window.clearInterval(interval);
          }
    });
    const timeshow = (d) => {
            d = Number(d);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);
        
            var hDisplay = h > 0 ? h + (h === 1 ? "h " : "h ") : "0h";
            var mDisplay = m > 0 ? m + (m === 1 ? "m " : "m ") : "0m";
            var sDisplay = s > 0 ? s + (s === 1 ? "s" : "s") : "0s";
            return hDisplay + mDisplay + sDisplay; 
    }

    return (
        <div id="first">
        {
            
            !walletAddress ? 
            <h1 style={{ paddingTop: "200px"}}>Connect your wallet account to the site</h1>
            : 
            <div>
                <div>
                <h1 className='totaltitle'> Total : { Herodata.length } Tokens  </h1>
                <Button type="primary" size='large' className='collectall' disabled={ (Herodata.length === 0) || (HeroTimer.every((can) => can !== 0))} onClick={getCollectAllGold}>Collect All</Button>
                </div>
                <div className='imgBox'>
                    {
                        
                        Herodata.map((hero, index) => {
                            let number = parseInt(hero) + 1
                            return (
                                <div className="card imgDiv" key={index}>
                                    <img src={"https://ipfs.io/ipfs/QmcYqC5Gu88q1pon1EfoyJ3xsHqR2yEFyFfwqXAnzvnzfa/" + number + ".png"}  alt={"https://ipfs.io/ipfs/QmcYqC5Gu88q1pon1EfoyJ3xsHqR2yEFyFfwqXAnzvnzfa/" + number + ".png"} />
                                    <center id="herocenter">
                                    <h3 id="raretitle">{findRare(parseInt(totalarr[number]))}</h3>
                                    <p>{findGold(parseInt(totalarr[number]))} $gold per 24 hours</p>
                                    {/* <div> */}
                                        {/* <Spin indicator={antIcon} style={{ visibility: (parseInt(HeroTimer[index]) === 0) ? "hidden" : "visible"}}/> */}
                                        <p id="timetitle" style={{ visibility: (parseInt(HeroTimer[index]) === 0) ? "hidden" : "visible"}} >{timeshow(parseInt(HeroTimer[index]))}</p>

                                    {/* </div> */}
                                    <Button type="primary" className='collectbtn'  disabled={parseInt(HeroTimer[index]) !== 0} onClick={() => getCollectGold(number-1)}>Collect</Button>
                                    </center>
                                </div>
                            
                            )
                        })
                    }
                </div>
            </div>
        }
        
        </div>
    )
}

export default Hero;