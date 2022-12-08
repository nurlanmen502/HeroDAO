import React, { useState, useEffect } from 'react';
import { getContract } from '../Main';
// import { ethers, BigNumber } from 'ethers'
import { Button, Input, Row, Col } from 'antd';
import { ArrowDownOutlined } from '@ant-design/icons';
import eth from "../../assets/images/eth.png"
import gold from "../../assets/images/gold.png"

const Bank = (props) => {
    const { walletAddress, setStatus, setTxLoading } = props
    const [ goldamount, setGlodAmount ] =  useState(0)

    const swapGoldToEth = async () => {
        const contract = await getContract()
        setTxLoading(true)
        try {
            let tx = await contract.swapGoldToEth(goldamount);
            let res = await tx.wait()
            if (res.transactionHash) {
                setStatus(`You swaped $Gold to ETH in your wallet`)
            }

        } catch(err) {
            console.log(err)
            setStatus(`Swap failed`)
        }
        setTxLoading(false)
    }
    useEffect(() => {
        async function setBankDataHook()
          {
            setTxLoading(true)
            const contract = await getContract()
            console.log("address",walletAddress)
            try {
                let ids = await contract.getGoldbalanceof(walletAddress);
                setGlodAmount(parseInt(ids));

            } catch(err) {
              console.log(err)
            }
            setTxLoading(false)
          }
        if(walletAddress) {
            setBankDataHook()
        }
    },[walletAddress]);

    return (
        <div id="first">
        {
            !walletAddress ? 
            <h1 style={{ paddingTop: "200px"}}>Connect your wallet account to the site</h1>
            :
            <Row justify="center" style={{ alignItems: "center" }}>
                <Col xs={20} sm={12} md={10} >
                    <div className='swapdiv'>
                        <div className='swapmodal'>
                            <p id="swapheader">Exchange</p>
                            {/* <Input className="eggamount" size="large" placeholder="50.0"  readOnly value={goldamount}  suffix={<HeroSuffix />} />  */}
                            <Input className="eggamount" size="large" placeholder="25.00" readOnly value={goldamount} suffix={<HeroSuffix />} /> 
                            <div className='arrowdiv'><ArrowDownOutlined className='arrowdown'/></div>
                            <Input className="ethamount" size="large" placeholder="25.00" readOnly value={(goldamount/2600).toFixed(4)} suffix={<EthSuffix />} /> 
                            <Button className='swapbtn' type="primary" shape="round" size="large" disabled={goldamount === 0} onClick={swapGoldToEth}>
                                Swap
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
            
        }
        
        </div>
    )
}

const HeroSuffix = () => {
    return (
        <div className='sufdiv1'>

            <img className='ethsuf' src={gold} alt="gold"></img>
        </div>
    )
}
const EthSuffix = () => {
    return (
        <div className='sufdiv'>

            <img className='ethsuf' src={eth} alt="ETH"></img>
        </div>
    )
}

export default Bank;