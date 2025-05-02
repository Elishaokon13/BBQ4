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
import Image from "next/image";

const emptyCoinArgs: CreateCoinArgs = {
  name: "name",
  symbol: "symbol",
  uri: "uri",
  payoutRecipient: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  initialPurchaseWei: BigInt(1), // 0.01 ETH
};

const MAX_IDEA_LENGTH = 400;

function App() {
  const { status: accountStatus } = useAccount();
  const [coinParams, setCoinParams] = useState<CreateCoinArgs | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Load persisted data when user connects
  useEffect(() => {
    if (accountStatus === "connected") {
      const stored = localStorage.getItem("coinParams");
      if (stored) {
        try {
          setCoinParams(JSON.parse(stored));
        } catch {}
      }
      const hash = localStorage.getItem("txHash");
      if (hash) {
        setTxHash(hash);
      }
    }
  }, [accountStatus]);

  const handleIdeaGenerated = (params: CreateCoinArgs) => {
    setCoinParams(params);
    setApiError(null);
    try {
      localStorage.setItem("coinParams", JSON.stringify(params));
    } catch {}
  };

  const handleError = (error: Error) => {
    setApiError(error.message);
    setCoinParams(null);
  };

  const handleTxHash = (hash: string) => {
    setTxHash(hash);
    try {
      localStorage.setItem("txHash", hash);
    } catch {}
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
        quality={75}
        sizes="100vw"
      />
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 max-w-full sm:max-w-lg md:max-w-3xl lg:max-w-5xl">
        {/* Header with logo and WalletConnect on the same line */}
        <div className="flex flex-row items-center justify-between mb-6 gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6 sm:h-7 sm:w-7 text-accentPrimary" />
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading text-accentPrimary">
              CoinSpark
            </h1>
          </div>
          <div className="flex-shrink-0">
            <WalletConnect />
          </div>
        </div>

        {apiError && (
          <Alert variant="destructive" className="mb-6 slide-in-from-top animate-in">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {accountStatus === "connected" ? (
            <>
              <div>
                <IdeaInput onIdeaGenerated={handleIdeaGenerated} />
              </div>

              {coinParams && (
                <div className="space-y-4">
                  <CoinDetails coinParams={coinParams} />
                  <CoinButton
                    name={coinParams.name}
                    symbol={coinParams.symbol}
                    uri={coinParams.uri}
                    initialPurchaseWei={coinParams.initialPurchaseWei}
                    onSuccess={handleTxHash}
                    onError={handleError}
                    className="w-full sm:w-auto"
                  />
                </div>
              )}

              {txHash && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700 text-base sm:text-lg">
                      <CheckCircle className="h-5 w-5" />
                      Congratulations! Your coin is now live
                    </CardTitle>
                    <CardDescription className="text-green-600 text-sm sm:text-base">
                      Your idea has been immortalized on the blockchain
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg bg-white p-3 flex flex-col gap-2">
                      <p className="text-xs text-slate-500">Transaction Hash</p>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <code className="text-xs bg-slate-100 p-2 rounded flex-1 overflow-x-auto whitespace-nowrap">
                          {txHash}
                        </code>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(txHash)}
                            className="text-accentPrimary"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(getEtherscanLink(txHash), "_blank")}
                            className="text-accentPrimary"
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
                      className="w-full text-accentPrimary border-accentPrimary hover:bg-accentPrimary hover:text-white text-sm sm:text-base"
                      onClick={() => {
                        setCoinParams(null);
                        setTxHash(null);
                        try {
                          localStorage.removeItem("coinParams");
                        } catch {}
                        try {
                          localStorage.removeItem("txHash");
                        } catch {}
                      }}
                    >
                      Create Another Coin
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </>
          ) : (
            <div className="py-12 sm:py-16 flex flex-col items-center justify-center">
              <Logo className="h-12 w-12 sm:h-16 sm:w-16 text-accentPrimary mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 text-accentPrimary font-heading">
                CoinSpark
              </h2>
              <p className="text-center text-accentPrimary/80 text-sm sm:text-base max-w-xs sm:max-w-md mb-6">
                Never let an idea go to waste. Coin it! <br />
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