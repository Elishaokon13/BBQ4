"use client";

import { useState, useEffect } from "react";
import { Coins, CheckCircle, AlertCircle, ExternalLink, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { WalletConnect } from "@/components/WalletConnect";
import { CoinDetails } from "@/components/CoinDetails";
import { IdeaInput } from "@/components/IdeaInput";
import { useAccount } from "wagmi";
import { CreateCoinArgs } from "@/types";
import { CoinButton } from "@/components/CoinButton";
import { Logo } from "@/components/Logo";
import Image from 'next/image';

const emptyCoinArgs: CreateCoinArgs = {
  name: "name",
  symbol: "symbol",
  uri: "uri",
  payoutRecipient: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  initialPurchaseWei: BigInt(1), // 0.01 ETH
}

const MAX_IDEA_LENGTH = 400;

function App() {
  const { status: accountStatus } = useAccount();
  const [coinParams, setCoinParams] = useState<CreateCoinArgs | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Load persisted data when user connects
  useEffect(() => {
    if (accountStatus === 'connected') {
      const stored = localStorage.getItem('coinParams');
      if (stored) {
        try { setCoinParams(JSON.parse(stored)); } catch {}
      }
      const hash = localStorage.getItem('txHash');
      if (hash) {
        setTxHash(hash);
      }
    }
  }, [accountStatus]);

  const handleIdeaGenerated = (params: CreateCoinArgs) => {
    setCoinParams(params);
    setApiError(null);
    try { localStorage.setItem('coinParams', JSON.stringify(params)); } catch {}
  };

  const handleError = (error: Error) => {
    setApiError(error.message);
    setCoinParams(null);
  };

  const handleTxHash = (hash: string) => {
    setTxHash(hash);
    try { localStorage.setItem('txHash', hash); } catch {}
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getEtherscanLink = (hash: string) => {
    return `https://basescan.org/tx/${hash}`;
  };

  return (
    <main className="min-h-screen relative">
      <Image
        src="/hero-bg.svg"
        alt="Background"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full sm:w-auto gap-2 sm:gap-3">
            <Logo className="h-8 w-8 text-accentPrimary" />
            <h1 className="text-2xl sm:text-3xl md:text-xl lg:text-4xl font-heading text-accentPrimary">
              CoinSpark
            </h1>
          </div>
          <WalletConnect />
        </div>
        
        {apiError && (
          <Alert variant="destructive" className="mb-6 slide-in-from-top animate-in">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6 w-full">
          {accountStatus === "connected" ? (
            <>
              <div className="w-full">
                <IdeaInput onIdeaGenerated={handleIdeaGenerated} />
              </div>

              {coinParams && (
                <div className="space-y-4 w-full">
                  <CoinDetails coinParams={coinParams} />
                  <CoinButton
                    name={coinParams.name}
                    symbol={coinParams.symbol}
                    uri={coinParams.uri}
                    initialPurchaseWei={coinParams.initialPurchaseWei}
                    onSuccess={handleTxHash}
                    onError={handleError}
                    className="w-full"
                  />
                </div>
              )}

              {txHash && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      Congratulations! Your coin is now live
                    </CardTitle>
                    <CardDescription className="text-green-600">
                      Your idea has been immortalized on the blockchain
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg bg-white p-3 flex flex-col gap-2">
                      <p className="text-xs text-slate-500">Transaction Hash</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-slate-100 p-2 rounded flex-1 overflow-auto">{txHash}</code>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(txHash)} className="text-[#1453EE]">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => window.open(getEtherscanLink(txHash), '_blank')}
                            className="text-[#1453EE]"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full text-[#1453EE] border-[#1453EE] hover:bg-[#1453EE] hover:text-white"
                      onClick={() => {
                        setCoinParams(null);
                        setTxHash(null);
                        try { localStorage.removeItem('coinParams'); } catch {}
                        try { localStorage.removeItem('txHash'); } catch {}
                      }}
                    >
                      Create Another Coin
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center">
              <Logo className="h-16 w-16 text-accentPrimary mb-4" />
              <h2 className="text-2xl font-bold text-center mb-2 text-accentPrimary font-heading">CoinSpark</h2>
              <p className="text-center text-accentPrimary/80 max-w-md mb-6">
                Never let an idea go to waste. Coin it! 
                <br />
                Connect your wallet to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
