import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateCoinArgs } from "@/types";

interface CoinDetailsProps {
  coinParams: CreateCoinArgs;
}

export function CoinDetails({ coinParams }: CoinDetailsProps) {
  return (
    <Card className="border-accentPrimary/20">
      <CardHeader>
        <CardTitle className="text-accentPrimary">Coin Details</CardTitle>
        <CardDescription className="text-accentPrimary/80">
          Review your coin details before creating
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1 text-accentPrimary">Name</h3>
            <p className="text-accentPrimary/80">{coinParams.name}</p>
          </div>
          <div>
            <h3 className="font-medium mb-1 text-accentPrimary">Symbol</h3>
            <p className="text-accentPrimary/80">{coinParams.symbol}</p>
          </div>
          <div>
            <h3 className="font-medium mb-1 text-accentPrimary">URI</h3>
            <p className="text-accentPrimary/80 break-all">{coinParams.uri}</p>
          </div>
          <div>
            <h3 className="font-medium mb-1 text-accentPrimary">Payout Recipient</h3>
            <p className="text-accentPrimary/80 font-mono">{coinParams.payoutRecipient}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 