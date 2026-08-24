
import { ref } from "vue";
import {
  getCalls,
  createCall,
  updateCall,
  deleteCall,
} from "@/lib/api";
import type { Call } from "@/types/crm";

export function useCall() {
  const calls = ref<Call[]>([]);
  const loading = ref(false);
  const error = ref("");

  const showCreateDialog = ref(false);
  const showToast = ref(false);

  const prospectId = ref("");
  const callDate = ref("");
  const callDuration = ref("");
  const callOutcome = ref("");
  const callNotes = ref("");

  async function loadCalls(): Promise<void> {
    loading.value = true;
    error.value = "";

    try {
      calls.value = await getCalls();
    } catch (err) {
      console.error(err);
      error.value = "Failed to load calls.";
    } finally {
      loading.value = false;
    }
  }

  function openCreateDialog(): void {
    prospectId.value = "";
    callDate.value = "";
    callDuration.value = "";
    callOutcome.value = "";
    callNotes.value = "";

    showCreateDialog.value = true;
  }

  function closeCreateDialog(): void {
    showCreateDialog.value = false;
  }

  async function saveCall(): Promise<void> {
    try {
      const createdCall = await createCall({
        prospect_id: Number(prospectId.value),
        date: callDate.value,
        duration: Number(callDuration.value) || 0,
        outcome: callOutcome.value,
        notes: callNotes.value,
      });
      

      calls.value.unshift(createdCall);

      closeCreateDialog();

      showToast.value = true;
    } catch (err) {
      console.error(err);
      error.value = "Failed to create call.";
    }
  }

  async function editCall(
    id: number,
    data: Partial<Call>,
  ): Promise<void> {
    try {
      const updatedCall = await updateCall(id, data);

      const index = calls.value.findIndex(
        (call) => call.id === id,
      );

      if (index !== -1) {
        calls.value[index] = updatedCall;
      }
    } catch (err) {
      console.error(err);
      error.value = "Failed to update call.";
    }
  }

  async function removeCall(id: number): Promise<void> {
    try {
      await deleteCall(id);

      calls.value = calls.value.filter(
        (call) => call.id !== id,
      );
    } catch (err) {
      console.error(err);
      error.value = "Failed to delete call.";
    }
  }

  return {
    calls,
    loading,
    error,

    showCreateDialog,
    showToast,

    prospectId,
    callDate,
    callDuration,
    callOutcome,
    callNotes,

    loadCalls,
    saveCall,
    editCall,
    removeCall,

    openCreateDialog,
    closeCreateDialog,
  };
}
