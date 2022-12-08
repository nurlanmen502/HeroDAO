
import { Button } from 'antd';

export const Navigation = ({ onClickConnectWallet, onClickDisconnectWallet, walletAddress }) => {
  const menu = () => {
    let links = document.querySelector('.links')
    links.classList.toggle('active')
}
  return (
    <header>
    <div className="containerheader">
        <div className="logo">HeroDAO</div>
        <div className="links">
            <a href="/#top" onClick={menu}>Home</a>
            <a href="/hero" >My Heroes</a>
            <a href="https://docs.herodao.app/roadmap" rel="noreferrer" target="_blank" onClick={menu}>Roadmap</a>
            <a href="/bank" >Exchange</a>
            <a href="https://docs.herodao.app/tokenomics" rel="noreferrer" target="_blank" onClick={menu}>Tokenomics</a>
            
            {
              walletAddress ? 
              <Button className="defult-btn" onClick={onClickDisconnectWallet} type='primary'>{ walletAddress.slice(0, 11) }... </Button>
              :
              <Button className="defult-btn" onClick={onClickConnectWallet} type='primary'>Connect Wallet</Button>
            }
        </div>
        <div className="bar" onClick={menu}>
        <span></span>
        <span></span>
        <span></span>
        </div>
    </div>
    </header>
  )
}
