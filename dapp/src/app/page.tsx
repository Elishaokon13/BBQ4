"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, ExternalLink, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { WalletConnect } from "@/components/WalletConnect";
import { CoinDetails } from "@/components/CoinDetails";
import { IdeaInput } from "@/components/IdeaInput";
import { useAccount } from "wagmi";
import { CreateCoinArgs } from "@/types";
import { CoinButton } from "@/components/CoinButton";
import { Logo } from "@/components/Logo";
import Image from "next/image";

// Define the API response type based on the actual data
interface ApiCoin {
  _id: string;
  id: string;
  name: string;
  symbol: string;
  description: string;
  metadataUrl: string;
  ownerAddress: string;
  createdAt: string;
}

// Update CreateCoinArgs to align with API or create a new type for UI
const emptyCoinArgs: CreateCoinArgs = {
  name: "name",
  symbol: "symbol",
  uri: "uri",
  payoutRecipient: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  initialPurchaseWei: BigInt(1), // 0.01 ETH
};

const MAX_IDEA_LENGTH = 400;

function App() {
  const { status: accountStatus, address: accountAddress } = useAccount();
  const [tab, setTab] = useState<'create' | 'mycoins'>('create');
  const [coinParams, setCoinParams] = useState<CreateCoinArgs | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [myCoins, setMyCoins] = useState<ApiCoin[]>([]); // Use ApiCoin type

  // Reset state on disconnect
  useEffect(() => {
    if (accountStatus !== 'connected') {
      setCoinParams(null);
      setTxHash(null);
      setMyCoins([]);
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

  const handleTxHash = async (hash: string) => {
    setTxHash(hash);
    if (accountStatus === 'connected' && accountAddress) {
      try {
        const res = await fetch(`/api/my-coins?owner=${accountAddress}`);
        const data = await res.json();
        console.log('API Response (handleTxHash):', data);
        if (Array.isArray(data)) {
          setMyCoins(data);
          if (data.length === 0) {
            console.warn('No coins returned from API');
          }
        } else {
          console.error('API did not return an array:', data);
          setMyCoins([]);
          setApiError('Failed to load coins: Invalid API response');
        }
      } catch (e) {
        console.error('Failed to fetch updated coins:', e);
        setMyCoins([]);
        setApiError('Failed to load coins: Network error');
      }
    }
  };

  // Fetch My Coins when the My Coins tab is active
  useEffect(() => {
    if (accountStatus === 'connected' && tab === 'mycoins' && accountAddress) {
      fetch(`/api/my-coins?owner=${accountAddress}`)
        .then(res => res.json())
        .then(data => {
          console.log('API Response (useEffect):', data);
          if (Array.isArray(data)) {
            setMyCoins(data);
            if (data.length === 0) {
              console.warn('No coins returned from API');
            }
          } else {
            console.error('API did not return an array:', data);
            setMyCoins([]);
            setApiError('Failed to load coins: Invalid API response');
          }
        })
        .catch(e => {
          console.error('Failed to fetch coins:', e);
          setMyCoins([]);
          setApiError('Failed to load coins: Network error');
        });
    }
  }, [accountStatus, tab, accountAddress]);

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
          {/* Tab selector */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setTab('create')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                tab === 'create'
                  ? 'bg-accentPrimary text-white'
                  : 'text-textPrimary hover:bg-accentPrimary/10'
              }`}
            >
              Create
            </button>
            <button
              onClick={() => setTab('mycoins')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                tab === 'mycoins'
                  ? 'bg-accentPrimary text-white'
                  : 'text-textPrimary hover:bg-accentPrimary/10'
              }`}
            >
              My Coins
            </button>
          </div>

          {tab === 'create' ? (
            accountStatus === "connected" ? (
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
            )
          ) : (
            <Card className="w-full border-accentPrimary/20 bg-gradient-to-br from-background to-background/80 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-accentPrimary tracking-tight">
                  My Coins
                </CardTitle>
                <CardDescription className="text-accentPrimary/70 mt-1">
                  View all your created coins
                </CardDescription>
              </CardHeader>
              <CardContent>
                {myCoins.length === 0 ? (
                  <div className="text-center py-8 text-accentPrimary/60">
                    <p>No coins created yet. Start by creating a coin in the Create tab!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-accentPrimary/5">
                          <TableHead className="text-accentPrimary font-semibold">Name</TableHead>
                          <TableHead className="text-accentPrimary font-semibold">Symbol</TableHead>
                          <TableHead className="text-accentPrimary font-semibold hidden sm:table-cell">
                            Metadata URL
                          </TableHead>
                          <TableHead className="text-accentPrimary font-semibold hidden md:table-cell">
                            Owner Address
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {myCoins.map((coin, index) => (
                          <TableRow
                            key={coin._id || index} // Use _id for unique key
                            className="border-b border-accentPrimary/10 hover:bg-accentPrimary/5"
                          >
                            <TableCell className="text-accentPrimary/80">{coin.name || 'N/A'}</TableCell>
                            <TableCell className="text-accentPrimary/80">{coin.symbol || 'N/A'}</TableCell>
                            <TableCell className="text-accentPrimary/80 hidden sm:table-cell break-all">
                              {coin.metadataUrl || 'N/A'}
                            </TableCell>
                            <TableCell className="text-accentPrimary/80 hidden md:table-cell font-mono text-sm">
                              {coin.ownerAddress || 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;