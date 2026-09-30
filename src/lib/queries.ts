"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Guardian, Plan, RecordInput } from "@/entities";
import * as api from "@/lib/api";

export const keys = {
  institution: ["institution"] as const,
  residents: ["residents"] as const,
  guardians: ["guardians"] as const,
  records: ["records"] as const,
  record: (id: string) => ["records", id] as const,
  guardian: (id: string) => ["guardian", id] as const,
  guardianFeed: (id: string) => ["guardian", id, "feed"] as const,
  replies: ["replies"] as const,
};

export const useInstitution = () =>
  useQuery({ queryKey: keys.institution, queryFn: api.getInstitution });

export const useResidents = () => useQuery({ queryKey: keys.residents, queryFn: api.listResidents });

export const useGuardians = () => useQuery({ queryKey: keys.guardians, queryFn: api.listGuardians });

export const useReplies = () => useQuery({ queryKey: keys.replies, queryFn: api.listReplies });

export const useRecords = () => useQuery({ queryKey: keys.records, queryFn: api.listRecords });

export const useRecord = (id: string) =>
  useQuery({ queryKey: keys.record(id), queryFn: () => api.getRecord(id) });

export const useGuardian = (id: string) =>
  useQuery({ queryKey: keys.guardian(id), queryFn: () => api.getGuardian(id) });

export const useGuardianFeed = (id: string) =>
  useQuery({ queryKey: keys.guardianFeed(id), queryFn: () => api.listGuardianFeed(id) });

export function useSetPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (plan: Plan) => api.setPlan(plan),
    onSuccess: (inst) => qc.setQueryData(keys.institution, inst),
  });
}

export function useCreateRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ input, authorName }: { input: RecordInput; authorName: string }) =>
      api.createRecord(input, authorName),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.records }),
  });
}

export function useUpdateOutput(recordId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) => api.updateOutput(id, content),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.record(recordId) }),
  });
}

export function useApproveOutput() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reviewer }: { id: string; reviewer: string }) => api.approveOutput(id, reviewer),
    onSuccess: () => {
      // ["records"] 접두어로 목록과 개별 기록을 함께 갱신한다.
      qc.invalidateQueries({ queryKey: keys.records });
      qc.invalidateQueries({ queryKey: ["guardian"] });
    },
  });
}

export function useMarkNoticeRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (outputId: string) => api.markNoticeRead(outputId),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.records }),
  });
}

export function useAddReply(guardianId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ outputId, text }: { outputId: string; text: string }) =>
      api.addReply(outputId, guardianId, text),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.guardianFeed(guardianId) });
      qc.invalidateQueries({ queryKey: keys.replies });
    },
  });
}

export function useUpdateConsents(guardianId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (consents: Partial<Guardian["consents"]>) => api.updateConsents(guardianId, consents),
    onSuccess: (g) => {
      qc.setQueryData(keys.guardian(guardianId), g);
      qc.invalidateQueries({ queryKey: keys.guardians });
    },
  });
}

export function useSubmitInquiry() {
  return useMutation({ mutationFn: api.submitInquiry });
}
