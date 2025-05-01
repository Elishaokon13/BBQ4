import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CreateCoinArgs } from "@/types";

const MAX_IDEA_LENGTH = 400;

interface IdeaInputProps {
  onIdeaGenerated: (params: CreateCoinArgs) => void;
}

export function IdeaInput({ onIdeaGenerated }: IdeaInputProps) {
  const [idea, setIdea] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleIdeaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const singleLineValue = value.replace(/\n/g, '');
    if (singleLineValue.length <= MAX_IDEA_LENGTH) {
      setIdea(singleLineValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const generateCoinParams = async (ideaText: string) => {
    if (!ideaText) return;
    setLoading(true);
    
    try {
      const response = await fetch('/api/generate-coin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea: ideaText }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate coin parameters');
      }
      
      const data = await response.json();
      
      let metadataUrl = data.metadataUrl;
      if (metadataUrl.startsWith('/') && typeof window !== 'undefined') {
        metadataUrl = window.location.origin + metadataUrl;
      }
      
      onIdeaGenerated({
        name: data.name,
        symbol: data.symbol,
        uri: metadataUrl,
        payoutRecipient: "0x0000000000000000000000000000000000000000" as `0x${string}`,
        initialPurchaseWei: BigInt(0)
      });
      
      toast.success("Generated coin parameters successfully!");
      
    } catch (e) {
      const errorMessage = `Error: ${(e as Error).message}`;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-[#1453EE] shadow-sm hover-scale">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-[#1453EE]">Turn Your Idea into a Coin</CardTitle>
        <CardDescription className="text-[#1453EE]/80">
          Enter your idea and coin it! (Max {MAX_IDEA_LENGTH} characters)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <textarea
            value={idea}
            onChange={handleIdeaChange}
            onKeyDown={handleKeyDown}
            placeholder="We can clone a wolf that's been dead for 13,000 years but we still have to approve the same token to swap it on each individual L2"
            className="w-full px-3 py-2 border border-[#1453EE] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1453EE] min-h-[100px] resize-none"
            rows={1}
          />
          <div className="text-right text-sm text-[#1453EE]/80">
            {idea.length}/{MAX_IDEA_LENGTH} characters
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => generateCoinParams(idea)}
          disabled={!idea || loading}
          className="w-full bg-[#1453EE] hover:bg-[#1453EE]/90 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating your coin...
            </>
          ) : 'Coin it!'}
        </Button>
      </CardFooter>
    </Card>
  );
} 