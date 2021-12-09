import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useData } from "../contexts/dataContext";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  id: string;
  fundingRequired: string;
  fundingRaised: string;
}

export const AddFundsModal: React.FC<Props> = ({
  isOpen,
  closeModal,
  id,
  fundingRequired,
  fundingRaised,
}) => {
  const { provideFunds } = useData();
  const [amount, setAmount] = useState("");
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
                    Add Funds
                  </Dialog.Title>
                </div>
                <span className="my-2">
                  How much would you like to invest in this project?
                </span>
                <p className="mt-1">
                  Required Funding :{" "}
                  <strong>
                    {parseInt(fundingRequired) < 0 ? "-" : fundingRequired}{" "}
                    MATIC
                  </strong>
                </p>
                <p className="mt-1">
                  Funding Raised : <strong>{fundingRaised} MATIC</strong>
                </p>
                <div className="mt-4">
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="my-2 w-full py-3 px-3 text-base text-gray-700 bg-gray-100 rounded-md focus:outline-none"
                    placeholder="Amount in MATIC"
                    autoComplete="off"
                    required
                  />
                  <div className="flex flex-row justify-between mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center px-10 py-2 text-sm font text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 font-bold"
                      onClick={async () => {
                        await provideFunds(id, amount);
                        setAmount("");
                        closeModal();
                      }}
                    >
                      Pay
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={async () => {
                        closeModal();
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
