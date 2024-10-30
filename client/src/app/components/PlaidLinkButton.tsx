"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "@/components/ui/button";
import {
  useCreateLinkTokenMutation,
  useExchangePublicTokenMutation,
  useSetAccessTokenMutation,
} from "../redux/api/plaidApi";
import { useToast } from "@/hooks/use-toast";

export default function PlaidLinkButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [createLinkToken, { data: linkTokenData, isLoading: isCreatingToken }] =
    useCreateLinkTokenMutation();
  const [exchangePublicToken, { isLoading: isExchanging }] =
    useExchangePublicTokenMutation();
  const [setAccessToken] = useSetAccessTokenMutation();

  const onSuccess = useCallback(
    async (public_token: string, metadata: any) => {
      try {
        const { data } = await exchangePublicToken({ public_token });
        await setAccessToken({ access_token: data?.access_token ?? "" });
        toast({
          title: "Cuenta conectada con éxito",
          description: `Se ha conectado la cuenta de ${metadata.institution.name}`,
        });
        router.push("/dashboard");
      } catch (error) {
        console.error("Error al intercambiar el token público:", error);
        toast({
          title: "Error al conectar la cuenta",
          description: "Por favor, intenta de nuevo más tarde",
          variant: "destructive",
        });
      }
    },
    [exchangePublicToken, setAccessToken, router, toast]
  );

  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkTokenData?.link_token ?? null,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  const handleClick = () => {
    if (!linkTokenData) {
      createLinkToken();
    } else if (ready) {
      open();
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isCreatingToken || isExchanging}
      className="bg-primary text-primary-foreground hover:bg-primary/90"
    >
      {isCreatingToken || isExchanging
        ? "Conectando..."
        : "Conectar cuenta bancaria"}
    </Button>
  );
}
