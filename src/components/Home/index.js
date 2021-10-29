import ContractForm from "../ContractForm";
import "./home.css";

function Home() {
  return (
    <div>
      <div className="centeredTitle">
        <h1 className="welcomeTitle">NFT Analyzer</h1>
      </div>
      <ContractForm />
      <div className="bottomText">
        <a href="https://docs.ipfs.io/install/ipfs-companion/">
          Make sure that your IPFS node is running to load the data faster.
        </a>
      </div>
    </div>
  );
}

export default Home;
