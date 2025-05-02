import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { CreateCoinArgs } from "@/lib/types";
import { cn } from "@/lib/utils"; // Assuming you have a utility for classNames

interface CoinDetailsProps {
  coinParams: CreateCoinArgs;
}

export function CoinDetails({ coinParams }: CoinDetailsProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-accentPrimary/10 via-background/50 to-background/80 p-1 rounded-2xl hover:shadow-2xl transition-shadow duration-300">
      <div className="bg-background rounded-lg p-6">
        <CardHeader className="bg-accentPrimary/10 border-b border-accentPrimary/20 p-4">
          <CardTitle className="text-2xl font-bold text-accentPrimary tracking-tight">
            Coin Details
          </CardTitle>
          <CardDescription className="text-accentPrimary/70 mt-1">
            Review your coin specifications before creation
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { label: "Name", value: coinParams.name },
              { label: "Symbol", value: coinParams.symbol },
              { label: "URI", value: coinParams.uri },
              { label: "Payout Recipient", value: coinParams.payoutRecipient },
            ].map((item, index) => (
              <div
                key={item.label}
                className={cn(
                  "group rounded-lg p-4 hover:bg-accentPrimary/5 transition-all duration-200",
                  item.label === "URI" && "md:col-span-2"
                )}
              >
                <h3 className="text-sm font-semibold text-accentPrimary uppercase tracking-wide mb-2">
                  {item.label}
                </h3>
                <p
                  className={cn(
                    "text-accentPrimary/80",
                    item.label === "Payout Recipient" && "font-mono text-sm",
                    item.label === "URI" && "break-all"
                  )}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}