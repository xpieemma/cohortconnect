import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {apiClient} from '../clients/api'

export const useOrganizationCohorts = (orgId) => {
  return useQuery ({
    queryKey : ['cohorts', orgId],
    queryFn: async () => {
      const {data} = await apiClient.get(`/api/organizations/${orgId}/cohorts`)
      return data;
    },
    enabled: !!orgId,
  })
 }

 export const useCreateCohort = () => {
  const queryClient = useQueryClient();
  return useMutation ({
    mutationFn: async (newCohort) => {
      const {data} = await apiClient.post('/cohorts', newCohort);
      return data;
    },
    onSuccess: (data, variables) => {
      const orgId = variables.organizationId;
      if (orgId) {
        queryClient.invalidateQueries({queryKey: ['cohorts', orgId]});
      } else {
        queryClient.invalidateQueries({queryKey: ['cohorts']});
      }
    },
  });
 };