const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type LeadPayload = {
  name: string;
  phone: string;
  email?: string;
  source?: string;
  interestedUnitType?: string;
  notes?: string;
};

export type KprPayload = {
  price: number;
  dpPercent: number;
  tenorYears: number;
  interestPercent: number;
};

export async function submitLead(payload: LeadPayload): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/public/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Gagal mengirim leads. Coba lagi.");
  }
}

export async function simulateKpr(payload: KprPayload): Promise<{
  dpAmount: number;
  principal: number;
  monthlyInstallment: number;
  installments: number;
}> {
  const response = await fetch(`${apiBaseUrl}/public/kpr/simulate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Gagal menghitung simulasi KPR");
  }

  const body = (await response.json()) as {
    data: {
      dpAmount: number;
      principal: number;
      monthlyInstallment: number;
      installments: number;
    };
  };

  return body.data;
}
