import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Web3 from "web3";
import Img from "next/image";
import { useData } from "../contexts/dataContext";
import { Proposal } from "../utils/interface";
import Arweave from "arweave";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  proposal: Proposal | null;
}

export const VoteModal: React.FC<Props> = ({
  isOpen,
  closeModal,
  proposal,
}) => {
  const { allVotes, vote } = useData();
  const [image, setImage] = useState<string>("");
  useEffect(() => {
    var arweave = Arweave.init({
      host: "arweave.net", // Hostname or IP address for a Arweave host
      port: 443, // Port
      protocol: "https", // Network protocol http or https
    });
    if (proposal?.imageId) {
      arweave.transactions
        .getData(proposal?.imageId, {
          decode: true,
          string: true,
        })
        .then((data) => {
          setImage(data as string);
        });
    }
  });
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl border-4">
                <div className="mt-2 flex flex-row justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {proposal?.title}
                  </Dialog.Title>
                  <span
                    className="text-xl font-bold cursor-pointer"
                    onClick={() => {
                      closeModal();
                    }}
                  >
                    X
                  </span>
                </div>
                <div className="my-5">
                  <p className="text-sm text-gray-500 line-clamp-5">
                    {proposal?.desc}
                  </p>
                </div>
                {image && (
                  <Img
                    src={`data:image/png;base64,${image}`}
                    width={100}
                    height={100}
                  />
                )}
                <div className="my-5">
                  <p className="text-sm text-gray-500 line-clamp-5">
                    Funding Amount -{" "}
                    <span className="font-bold text-black">
                      {Web3.utils.fromWei(proposal?.amount ?? "0")} MATIC
                    </span>
                  </p>
                </div>
                <div className="my-5">
                  <p className="text-sm text-gray-500 line-clamp-5">
                    Proposer -{" "}
                    <span className="bg-gray-200 text-blue-500 00 p-1 rounded-lg">
                      {proposal?.proposer}
                    </span>
                  </p>
                </div>
                {!allVotes.includes(proposal?.id ?? "") ? (
                  <div className="flex flex-row justify-between mt-5">
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-green-900 bg-green-100 border border-transparent rounded-md hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={async () => {
                          await vote(proposal?.id ?? "", true);
                          closeModal();
                        }}
                      >
                        Vote In Favor 👍🏻
                      </button>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={async () => {
                          await vote(proposal?.id ?? "", false);
                          closeModal();
                        }}
                      >
                        Vote Against 👎🏻
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center my-3 text-lg font-bold p-3 border-2 border-black rounded-2xl">
                    You have already voted on this proposal.
                  </div>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
