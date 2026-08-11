import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DataContext from "@/context/DataContext";
import { useContext, useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { checkIp } from "@/helpers/util";

export function AddressDialog() {
  const { nodeWallet, setNodeWallet, useZel } = useContext(DataContext);
  const [walletList, setWalletList] = useState([]);
  const walletInputRef = useRef();

  const addWallet = () => {
    const newWallet = walletInputRef.current.value;
    if ((newWallet.length < 33 || newWallet.length > 35) && !checkIp(newWallet)) return;
    else if (walletList.some((address) => address === newWallet)) return;
    let checkValid = walletList.filter((address) => address !== "");
    checkValid.push(newWallet);
    setWalletList(checkValid);
    walletInputRef.current.value = "";
  };

  const removeWallet = (index) => {
    const removeWallet = walletList.filter((address) => address !== walletList[index]);
    setWalletList(removeWallet);
  };

  const handleSubmit = (e) => {
    const walletString = walletList.join(",");
    setNodeWallet(walletString);
    e.preventDefault();
  };

  useEffect(() => {
    const wallets = nodeWallet.split(",");
    console.log(wallets);
    setWalletList(wallets);
  }, [nodeWallet]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="focus-ring w-[250px] py-2 px-2 bg-blue-gradient font-poppins ml-4 mb-5 font-medium text-[18px] text-white rounded-[10px]">CONFIGURE ADDRESSES</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[75%]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Configure</DialogTitle>
            <DialogDescription>{useZel ? "Update ZelID" : "Update Wallet or IPv4 Address"}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input id="address" defaultValue="t1x..." ref={walletInputRef} className="col-span-3" />
              <Button type="button" onClick={() => addWallet()} variant="default">
                Add
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            {walletList.map((wallet, index) => {
              if (wallet !== "") {
                return (
                  <div key={wallet} className="flex flex-row gap-2 items-center">
                    <div className="font-poppins text-blue mm:text-[12px] xs:text-sm ss:text-lg">{wallet}</div>
                    <IoClose onClick={() => removeWallet(index)} color="white" className="bg-black rounded-md cursor-pointer" />
                  </div>
                );
              }
            })}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button className={"my-2"} type="submit" variant="outline">
                Save changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
