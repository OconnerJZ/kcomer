import {
  useCancelBusinessInvitationMutation,
  useCreateOwnershipTransferMutation,
  useGetBusinessTeamQuery,
  useInviteBusinessMemberMutation,
  useRemoveBusinessMemberMutation,
  useUpdateBusinessMemberMutation,
} from "@Features/business/api/business.api";

export default function useBusinessTeam(businessId) {
  const { data, isLoading, error } = useGetBusinessTeamQuery({ businessId });
  const [inviteMutation, inviteState] = useInviteBusinessMemberMutation();
  const [cancelMutation] = useCancelBusinessInvitationMutation();
  const [updateMutation] = useUpdateBusinessMemberMutation();
  const [removeMutation] = useRemoveBusinessMemberMutation();
  const [transferMutation, transferState] = useCreateOwnershipTransferMutation();

  return {
    team: data || { members: [], invitations: [] },
    isLoading,
    error,
    isInviting: inviteState.isLoading,
    isTransferring: transferState.isLoading,
    invite: (email, role) => inviteMutation({ businessId, email, role }).unwrap(),
    cancelInvitation: (invitationId) => cancelMutation({ businessId, invitationId }).unwrap(),
    changeRole: (userId, role) => updateMutation({ businessId, userId, role }).unwrap(),
    removeMember: (userId) => removeMutation({ businessId, userId }).unwrap(),
    transferOwnership: (email, retainPreviousAsCoOwner) => transferMutation({ businessId, email, retainPreviousAsCoOwner }).unwrap(),
  };
}

