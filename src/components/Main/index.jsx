import React, { useEffect, useState } from 'react';
import onepng from "../../assets/images/Scroller/1.png"
import twopng from "../../assets/images/Scroller/2.png"
import threepng from "../../assets/images/Scroller/3.png"
import fourpng from "../../assets/images/Scroller/4.png"
import fivepng from "../../assets/images/Scroller/5.png"
import sevenpng from "../../assets/images/Scroller/7.png"
import eightpng from "../../assets/images/Scroller/8.png"
import ninepng from "../../assets/images/Scroller/9.png"
import tenpng from "../../assets/images/Scroller/10.png"
import outonepng from "../../assets/images/1.png"
import outtwopng from "../../assets/images/2.png"
import outthreepng from "../../assets/images/3.png"
import backgroundimage from "../../assets/images/background_image.jpg"
import largeimage from "../../assets/images/largeimageright.png"
import logoimage from "../../assets/images/logo.png"
import teamimage from "../../assets/images/team.png"
import vladimage from "../../assets/images/vlad.png"
import Discord from "../../assets/images/discord.svg"
import { Button, Row, Col } from 'antd';
import { TwitterOutlined } from '@ant-design/icons'

// import gif from "../../assets/images/chicken.gif"
import Slider from "react-slick";
import { loglevel } from "../../constants/loglevel"
import { ethers, BigNumber } from 'ethers'
import { contractAddress } from '../../constants/address';
import { useHistory } from 'react-router-dom';

export const getContract = async () => {
  await window.ethereum.enable()
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contractABI = require("../../constants/contract.json")
  const contract = new ethers.Contract(contractAddress, contractABI, signer)
  return contract
}

const Main = (props)  =>{
    const { walletAddress, setStatus, setTxLoading, totalSupply, maxTokens } = props
    console.log("here",totalSupply);
    const [mintedcount, setMintedCount] = useState(totalSupply);
    const [mintCount, setMintCount] = useState(0);
    const history = useHistory();
    useEffect(() => {
        setMintedCount(props.totalSupply)
      }, [props.totalSupply])
    const increase = () => {
        if(mintCount<10000) {
          let newCount = mintCount + 1;
          setMintCount(newCount);
        }
      }
    const decrease = () => {
        if(mintCount>0) {
          let newCount = mintCount - 1;
          setMintCount(newCount);
        }
      }
    const mintToken = async () => {
        if (mintCount === 0) return
        if (!walletAddress) {

            setStatus('Please connect with Metamask')
            return
        }
    
        if ( mintCount > (maxTokens - totalSupply) ) {
            setStatus(`We are reached already max supply, You can mint less than ${maxTokens - totalSupply}`)
            return 
        }
        const contract = await getContract()
        setTxLoading(true)
        try {
            var totalarr = loglevel.split(",")
            var levelarr = [];
            for(var i=1; i< mintCount+1; i++)
            {
                levelarr.push(totalarr[totalSupply + i])
            }
            let tokenprice = 5;
            if(totalSupply <= 1000 ) {
                tokenprice = 5;
            }
            else if(totalSupply <= 3000) {
                tokenprice = 7;
            }
            else if(totalSupply <= 6000) {
                tokenprice = 8;
            }
            else {
                tokenprice = 9;
            }
            let tx = await contract.mintToken(mintCount, levelarr, { value: BigNumber.from(1e9).mul(BigNumber.from(1e9)).mul(tokenprice).div(100).mul(mintCount), from: walletAddress })
            let res = await tx.wait()
            if (res.transactionHash) {
                setStatus(`You minted ${mintCount} Hero Successfully`)
                setTxLoading(false)
                history.push("/");
            }
        } catch (err) {
            let errorContainer =  (err.data && err.data.message)  ? err.data.message : ''
            let errorBody = errorContainer.substr(errorContainer.indexOf(":")+1)
            let status = "Transaction failed because you have insufficient funds or sales not started"
            errorContainer.indexOf("execution reverted") === -1 ? setStatus(status) : setStatus(errorBody)
            setTxLoading(false)
            history.push("/");
        }
          
    }

    const settings = {
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        centerPadding: '40px',
        autoplaySpeed: 1000,
        arrows: false,
        dots: false,
        pauseOnHover: false,
        responsive: [{
            breakpoint: 768,
            settings: {
            slidesToShow: 2
            }
            }, {
            breakpoint: 520,
            settings: {
            slidesToShow: 1
            }
            }]
    }
    const IconSVG = () => <img src={Discord} id="discordsvg" alt={""}/>
    return (
        <div>
            <main>
                <div className="hero">
                    <img alt={""} src={backgroundimage} />
                    <img alt={""} className="overlay" src={largeimage} />
                </div>
            </main>
            <section className="sp" id="heros">
                <div className="container">
                    <center>
                    <h1 className="title mt-5">
                        Hero DAO is a collection of 10,000 Unique NFTs on the Ethereum
                        Blockchain
                    </h1>
                    <h4 className="sub-title">
                        Holders rewarded with $Gold tokens every day backed by 70% of the
                        mint sale with liquidity locked.
                    </h4>
                    </center>
                    <div className="logos-slider">
                        <Slider {...settings}>
                            <div className="slide">
                                <img alt={""} src={onepng} />
                            </div>
                            <div className="slide">
                                <img alt={""} src={twopng} />
                            </div>
                            <div className="slide">
                                <img alt={""} src={threepng} />
                            </div>
                            <div className="slide">
                                <img alt={""} src={fourpng} />
                            </div>
                            <div className="slide">
                                <img alt={""} src={fivepng} />
                            </div>
                            <div className="slide">
                                <img alt={""} src={sevenpng} />
                            </div>
                            <div className="slide">
                                <img alt={""} src={eightpng} />
                            </div>
                            <div className="slide">
                                <img alt={""} src={ninepng} />
                            </div>
                            <div className="slide">
                                <img alt={""} src={tenpng} />
                            </div>
                        </Slider>
                    </div>
                    <div className="container">
                        <div className="des-sec mintdiv">
                            <p id="mint_label_1">Minting April 2022</p>
                            {/* <p id="mint_label">Minting is now live!</p>
                            <h1 id="mint_count">{mintedcount}/{maxTokens}</h1>
                            <p>Use the + and - buttons below to select how many NFTs to mint. </p>
                            <Row justify="center" style={{ alignItems: "center" }}>
                                <Col xs={20} sm={3} md={4} >
                                    <Button id="incbtn" onClick={decrease}>-</Button>
                                </Col>
                                <Col xs={20} sm={6} md={6} >
                                    <img id="img_gif"src={logoimage} alt=""/>
                                </Col>
                                <Col xs={20} sm={3} md={4} >
                                    <Button id="decbtn" onClick={increase}>+</Button>
                                </Col>
                            </Row>
                            <p><b>{mintCount}</b> Hero DAO</p>
                            <p>0.05 ETH Each</p>
                            <p id="tokencosts">Total: {parseFloat(0.05 * mintCount).toFixed(2)}ETH</p>
                            {
                                props.loading ?
                                <Button id="mintbtn"> Minting ... </Button>
                                :
                                <Button id="mintbtn" onClick={mintToken}> Mint! </Button>
                            } */}
                        </div>
                    </div>
                </div>
                
                
            </section>
            <section className="sp" id="roadmap" >
                <div className="container">
                    <h1 className="main-title">How It Works</h1>

                    <div className="des-sec">
                    <div className="point">
                        <div className="square"></div>
                        <p className="des">
                        10,000 Hero NFTs will be available at launch starting at 0.05 ETH
                        each.
                        </p>
                    </div>
                    <div className="point">
                        <div className="square"></div>
                        <p className="des">
                        Unlike most NFTs, owning a Hero rewards you daily with $gold which
                        can be converted to ETH at a fixed rate.
                        </p>
                    </div>
                    <div className="point">
                        <div className="square"></div>
                        <p className="des">
                        Each Hero will have 1 of 3 different rarity levels which determine
                        how much $gold they produce. The rarer the Hero the more $gold you
                        get per day.
                        </p>
                    </div>
                    <div className="point">
                        <div className="square"></div>
                        <p className="des">
                        70% of the funds from mint purchases automatically get sent to a
                        locked liquidity pool contract called the Bank. 30% of the funds
                        will go towards the dev team for ongoing updates, competitions,
                        marketing and future development.
                        </p>
                    </div>
                    <div className="note">
                        <p className="des">
                        10,000 Hero NFTs will be available at launch starting at 0.05 ETH
                        each.
                        </p>
                    </div>
                    </div>
                </div>
            </section>
            <section className="sp" id="exchange">
                <div className="container">
                    <h1 className="main-title">Rarity = Rewards</h1>

                    <div className="des-sec">
                    <p className="des ts" id="raritytitle">
                        Every one of the 10,000 Hero NFT is unique and made from over 150
                        traits. The rarity of each NFT is determined by how often each of
                        its traits appear in the collection. Some are rarer than others -
                        for example a character with a hat or helmet has less chance of
                        appearing than one without. Each NFT is classified into one of 3
                        different rarities. These rarities are Common, Uncommon and Rare.
                        The rarer the category a Hero NFT is in, the fewer of them there are
                        but the more $gold they produce per 24-hour period.
                    </p>
                    </div>
                    <div className="wraper">
                    <div className="card">
                        <img alt={""} src={outonepng} />
                        <center>
                        <h3>Common</h3>
                        <p>10 $gold per 24 hours</p>
                        </center>
                    </div>
                    <div className="card">
                        <img alt={""} src={outtwopng} />
                        <center>
                        <h3>Uncommon</h3>
                        <p>20 $gold per 24 hours</p>
                        </center>
                    </div>
                    <div className="card">
                        <img alt={""} src={outthreepng} />
                        <center>
                        <h3>Rare</h3>
                        <p>50 $gold per 24 hours</p>
                        </center>
                    </div>
                    </div>
                </div>
            </section>
            <section className="sp" >
                <div className="container">
                    <h1 className="main-title">Fair Launch and Early Minter Rewards</h1>
                    <p className="des dis">
                    Fair launch, no whitelist – straight to public mint. Get a faster ROI
                    and longer period earning rewards by being the first to mint.
                    </p>

                    <table id="customers">
                    <tr>
                        <th>Mint Number</th>
                        <th>Price in ETH (+ Gas fees)</th>
                    </tr>
                    <tr>
                        <td>1-1000</td>
                        <td>0.05</td>
                    </tr>
                    <tr>
                        <td>1001-3000</td>
                        <td>0.07</td>
                    </tr>
                    <tr>
                        <td>3001-6000</td>
                        <td>0.08</td>
                    </tr>
                    <tr>
                        <td>6001-10000</td>
                        <td>0.09</td>
                    </tr>
                    </table>
                </div>
            </section>
            <section className="sp" id="tokenomics">
                <div className="container">
                    <h1 className="main-title">Liquidity Protected</h1>
                    <div className="des-sec">
                    <p className="des ts" id="raritytitle">
                        Fully rug-proof, the Hero NFT bank is financed by both 70% of the
                        mint sales and 10% of secondary sales and has a locked liquidity
                        contract backing $gold with ETH. Our contracts are freely viewable
                        at any time on the Ethereum Blockchain via Etherscan. Marketing,
                        development fees and platform fees are all paid from a separate fund
                        financed by the other 30% of mint sales.
                    </p>
                    </div>
                </div>
            </section>
            <section className="sp">
                <div className="container">
                    <h1 className="main-title">Community</h1>
                    <div className="des-sec">
                    <p className="des" id="raritytitle">
                        Community is the heart of any successful project and Hero DAO is no
                        different. For the latest news and updates on features find us on
                        Twitter and Discord
                    </p>
                    <div className="row">
                        <Button type="primary" icon={<TwitterOutlined />} size="large" id="socialbtn" >
                            <a href="https://twitter.com/HeroDAONFT" target="_blank" rel="noreferrer" style={{ color: 'white' }}> Twitter</a>
                        </Button>
                        <Button type="primary" icon={<IconSVG />} size="large" id="socialbtn" style={{ backgroundColor: "#1e2f79" }}>
                            Discord
                        </Button>
                    </div>
                    </div>
                </div>
            </section>
            <section className="sp">
                <div className="container">
                    <h1 className="main-title">The Team</h1>

                    <div className="row2">
                    <div className="card">
                        <div className="img"><img alt={""} src={teamimage} /></div>

                        <center>
                        <h3>MetaMan - <span>Chief Hero</span></h3>
                        <p>
                            A long-term crypto enthusiast with a professional IT
                            Infrastructure and Project Management background I build
                            communities and technology in Web3.
                        </p>
                        </center>
                    </div>
                    <div className="card">
                        <div className="img"><img alt={""} src={vladimage} /></div>

                        <center>
                        <h3>Vlad – <span>2D Artist</span></h3>
                        <p>
                            Artist extraordinaire I create 2D and 3D designs in Blender and
                            Photoshop. Currently in final year of Financial Studies at
                            University.
                        </p>
                        </center>
                    </div>
                    </div>
                </div>
            </section>
            <footer>
                <div className="container">
                    <center>
                    <div className="logo">HeroDAO</div>
                    <div className="social-links">
                        <a href="/#" target="_blank" ><i className="fab fa-discord"></i></a>
                        <a href="https://twitter.com/HeroDAONFT" target="_blank" rel="noreferrer"><i className="fab fa-twitter"></i></a>
                    </div>
                    <div className="links">
                        <a href="/#top">Home</a>
                        <a href="/hero" >My Heroes</a>
                        <a href="https://docs.herodao.app/roadmap" rel="noreferrer" target="_blank" >Roadmap</a>
                        <a href="/bank" >Exchange</a>
                        <a href="https://docs.herodao.app/tokenomics" rel="noreferrer" target="_blank" >Tokenomics</a>
                    </div>
                    </center>
                </div>
            </footer>
        </div>
    );
}

export default Main;