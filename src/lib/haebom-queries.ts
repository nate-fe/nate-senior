"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ExperienceCategory, PurchaseRequestInput } from "@/entities/haebom";
import * as api from "@/lib/haebom-api";

export const haebomKeys = {
  experiences: (category?: ExperienceCategory) => ["haebom", "experiences", category ?? "all"] as const,
  experience: (id: string) => ["haebom", "experience", id] as const,
  inbox: (sellerId: string) => ["haebom", "inbox", sellerId] as const,
};

export const useExperiences = (category?: ExperienceCategory) =>
  useQuery({ queryKey: haebomKeys.experiences(category), queryFn: () => api.listExperiences(category) });

export const useExperience = (id: string) =>
  useQuery({ queryKey: haebomKeys.experience(id), queryFn: () => api.getExperience(id) });

export const useSellerInbox = (sellerId: string) =>
  useQuery({ queryKey: haebomKeys.inbox(sellerId), queryFn: () => api.getSellerInbox(sellerId) });

export function useCreatePurchaseRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: PurchaseRequestInput) => api.createPurchaseRequest(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["haebom", "inbox"] }),
  });
}

export function useRespondToRequest(sellerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, accept }: { id: string; accept: boolean }) => api.respondToRequest(id, accept),
    onSuccess: () => qc.invalidateQueries({ queryKey: haebomKeys.inbox(sellerId) }),
  });
}
