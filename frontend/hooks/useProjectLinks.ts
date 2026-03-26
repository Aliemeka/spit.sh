"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { getProjectLinksAction } from "@/app/actions/link";
import { revalidateCurrentPath } from "@/app/actions/revalidatePath";

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
  const pathname = usePathname();

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
    revalidateCurrentPath(pathname);
  };

  return { links, loading, error, refresh };
}
