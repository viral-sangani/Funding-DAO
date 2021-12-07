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
  currentBal: string;
  allVotes: string[];
  allInvestedProposal: Proposal[];
  createStakeholder: (amount: string) => Promise<void>;
  provideFunds: (id: string, amount: string) => Promise<void>;
  getProposal: (id: string) => Promise<Proposal>;
  vote: (id: string, vote: boolean) => Promise<void>;
  releaseFunding: (id: string) => Promise<void>;
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
  currentBal: "",
  allVotes: [],
  allInvestedProposal: [],
  createStakeholder: async (val) => {},
  provideFunds: async (id, amount) => {},
  createProposal: async () => {},
  vote: async () => {},
  releaseFunding: async () => {},
  getProposal: async (val) => {
    return {} as Proposal;
  },
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
  const [currentBal, setCurrentBal] = useState("");
  const [allVotes, setAllVotes] = useState<string[]>([]);
  const [allInvestedProposal, setAllInvestedProposal] = useState<Proposal[]>(
    []
  );

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
    const fundingDaoData = FundingDAO.networks["1638870705645"];
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
        var tempProposals: Proposal[] = [];
        totalProposals.forEach((item: Proposal) => {
          console.log(`item`, item);
          tempProposals.push(item);
        });
        setAllProposals(tempProposals);
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
        if (isMember && !isStakeholder) {
          var memberBal = await fundingDaoContract.methods.getMemberBal().call({
            from: account,
          });
          setCurrentBal(Web3.utils.fromWei(memberBal, "ether"));
        } else if (isMember && isStakeholder) {
          var stakeholderBal = await fundingDaoContract.methods
            .getStakeholderBal()
            .call({
              from: account,
            });
          setCurrentBal(Web3.utils.fromWei(stakeholderBal, "ether"));
          var votes = await fundingDaoContract.methods.getVotes().call({
            from: account,
          });
          var res = tempProposals.filter((proposal) => {
            const vote = votes.find((vote: string) => vote === proposal.id);
            if (vote) {
              return true;
            }
            return false;
          });
          setAllInvestedProposal(res);
          setAllVotes(votes);
        } else {
          setCurrentBal("");
        }
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
    loadBlockchainData();
  };

  const getProposal = async (id: string) => {
    var data = await fundingDao.methods.getProposal(id).call({
      from: account,
    });
    var proposal: Proposal = data;
    return proposal;
  };

  const vote = async (id: string, vote: boolean) => {
    await fundingDao.methods.vote(id, vote).send({
      from: account,
    });
    loadBlockchainData();
  };

  const provideFunds = async (id: string, amount: string) => {
    await fundingDao.methods
      .provideFunds(id, Web3.utils.toWei(amount, "ether"))
      .send({
        from: account,
        value: Web3.utils.toWei(amount, "ether"),
      });
    loadBlockchainData();
  };

  const releaseFunding = async (id: string) => {
    await fundingDao.methods.releaseFunding(id).send({
      from: account,
    });
    loadBlockchainData();
  };

  return {
    account,
    fundingDao,
    loading,
    allProposals,
    isStakeholder,
    isMember,
    currentBal,
    allVotes,
    allInvestedProposal,
    connect,
    createStakeholder,
    createProposal,
    getProposal,
    provideFunds,
    releaseFunding,
    vote,
  };
};
