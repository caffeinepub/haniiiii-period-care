import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PeriodEntry } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllPeriodEntries() {
  const { actor, isFetching } = useActor();
  return useQuery<PeriodEntry[]>({
    queryKey: ["periodEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPeriodEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPeriodEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      startDate,
      endDate,
      notes,
      symptoms,
    }: {
      startDate: string;
      endDate: string;
      notes: string;
      symptoms: Array<{ name: string; severity: bigint }>;
    }) => {
      if (!actor) throw new Error("No actor available");
      const id = await actor.addPeriodEntry(startDate, endDate, notes);
      // Add symptoms in parallel
      if (symptoms.length > 0) {
        await Promise.all(
          symptoms.map((s) => actor.addSymptomToEntry(id, s.name, s.severity)),
        );
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["periodEntries"] });
    },
  });
}

export function useDeletePeriodEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor available");
      return actor.deletePeriodEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["periodEntries"] });
    },
  });
}
