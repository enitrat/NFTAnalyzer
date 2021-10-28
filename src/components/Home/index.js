import ContractForm from "../ContractForm";
import './home.css';
function Home() {
  return (
    <div>
      <div className="centeredTitle">
        <h1 className="welcomeTitle">NFT Analyzer</h1>
      </div>
      <ContractForm />
    </div>
  );
}

export default Home;
