import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from '../Utils/axios'; 

interface CreateDuelPayload {
  player1Id: string;
  player2Id: string;
  player1Score: number;
  player2Score: number;
  duelTime: string; // ISO string format or Date depending on your backend expectation
}

export const useCreateDuel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateDuelPayload) => {
        console.log(payload);
      const response = await axios.post("/api/duel/create", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status !== 201) {
        throw new Error(response.data.message || "Failed to create duel");
      }

      return response.data.duel;
    },
    onSuccess: (data) => {
      console.log("Duel created:", data);
      queryClient.invalidateQueries({ queryKey: ["duels"] }); // Optional: if you fetch duels
    },
    onError: (error: any) => {
      console.error("Error creating duel:", error);
    },
  });
};
