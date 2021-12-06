declare let window: any;
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import Web3 from "web3";
import FundingDAO from "../abis/FundingDAO.json";
import { Proposal } from "../utils/interface";

interface DataContextProps {
  account: string;
  loading: boolean;
  connect: () => Promise<void>;
  fundingDao: any;
  allProposals: Proposal[];
  isStakeholder: boolean;
  isMember: boolean;
  createStakeholder: (amount: string) => Promise<void>;
  createProposal: ({
    title,
    description,
    amount,
    recipient,
  }: {
    title: string;
    description: string;
    amount: string;
    recipient: string;
  }) => Promise<void>;
}

const DataContext = createContext<DataContextProps>({
  account: "",
  loading: true,
  connect: async () => {},
  fundingDao: null,
  allProposals: [],
  isStakeholder: false,
  isMember: false,
  createStakeholder: async (val) => {},
  createProposal: async () => {},
});

export const DataProvider: React.FC = ({ children }) => {
  const data = useProviderData();

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useData = () => useContext<DataContextProps>(DataContext);

export const useProviderData = () => {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");
  const [fundingDao, setFundingDao] = useState<any>();
  const [allProposals, setAllProposals] = useState<Proposal[]>([]);
  const [isStakeholder, setIsStakeholder] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    connect();
  }, []);

  const connect = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-Eth browser detected. Please consider using MetaMask.");
      return;
    }
    var allAccounts = await window.web3.eth.getAccounts();
    setAccount(allAccounts[0]);
    await loadBlockchainData();
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const fundingDaoData = FundingDAO.networks["1638702976684"];
    if (fundingDaoData) {
      var fundingDaoContract = await new web3.eth.Contract(
        FundingDAO.abi,
        fundingDaoData.address
      );
      setFundingDao(fundingDaoContract);
      console.log(`fundingDaoContract`, fundingDaoContract);
      setTimeout(async () => {
        var totalProposals = await fundingDaoContract.methods
          .getAllProposals()
          .call({ from: account });
        totalProposals.forEach((item: Proposal) => {
          setAllProposals((prevState) => [...prevState, item]);
        });
        var isStakeholder = await fundingDaoContract.methods
          .isStakeholder()
          .call({
            from: account,
          });
        console.log(`isStakeholder`, isStakeholder);
        setIsStakeholder(isStakeholder);
        var isMember = await fundingDaoContract.methods.isMember().call({
          from: account,
        });
        setIsMember(isMember);
        console.log(`isMember`, isMember);
        setLoading(false);
      }, 500);
    } else {
      window.alert("TestNet not found");
    }
  };

  const createStakeholder = async (amount: string) => {
    if (amount === "" || amount === "0") {
      toast.error("Please enter valid amount", {});
    }
    console.log(`fundingDao`, fundingDao);
    await fundingDao.methods
      .createStakeholder()
      .send({ from: account, value: Web3.utils.toWei(amount, "ether") });
    loadBlockchainData();
  };

  const createProposal = async ({
    title,
    description,
    amount,
    recipient,
  }: {
    title: string;
    description: string;
    amount: string;
    recipient: string;
  }) => {
    if (amount === "" || amount === "0") {
      toast.error("Please enter valid amount", {});
    }
    console.log(`fundingDao`, fundingDao);
    console.log(title, description, amount, recipient);
    await fundingDao.methods
      .createProposal(
        title,
        description,
        recipient,
        Web3.utils.toWei(amount, "ether")
        // 500
      )
      .send({ from: account, value: Web3.utils.toWei("5", "ether") });
  };

  return {
    account,
    fundingDao,
    loading,
    connect,
    allProposals,
    isStakeholder,
    isMember,
    createStakeholder,
    createProposal,
  };
};
