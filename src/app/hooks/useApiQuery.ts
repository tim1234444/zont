import { useQuery, type UseQueryResult } from '@tanstack/react-query';

interface UseApiQueryOptions<TData> {
  queryKey: string | readonly string[];
  queryFn: () => Promise<TData>;
  enabled?: boolean;
  staleTime?: number; 
}

export function useApiQuery<TData>({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 0,
}: UseApiQueryOptions<TData>): UseQueryResult<TData> {
  return useQuery<TData>({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn,
    enabled,
    staleTime,
  });
}
