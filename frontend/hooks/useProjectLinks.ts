"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProjectLinksAction } from "@/app/actions/link";

export function useProjectLinks(projectSlug: string) {
  const queryClient = useQueryClient();

  const {
    data: links = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["links", projectSlug],
    queryFn: () => getProjectLinksAction(projectSlug),
    refetchInterval: 30000,
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["links", projectSlug] });

  return { links, loading, error, refresh };
}
