"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getProjectLinksAction } from "@/app/actions/link";

interface LinkQueryParams {
  tag: string;
  limit: number;
  offset: number;
}

export function useProjectLinks(
  projectSlug: string,
  filters?: Partial<LinkQueryParams>,
) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: links = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["links", projectSlug, filters],
    queryFn: () => getProjectLinksAction(projectSlug, filters),
    refetchInterval: 30000,
  });

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: ["links", projectSlug, filters],
    });
    router.refresh();
  };

  return { links, loading, error, refresh };
}
