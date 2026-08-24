
import { ref } from "vue";
import {
  getFollowUps,
  createFollowUp,
  updateFollowUp,
  deleteFollowUp,
} from "@/lib/api";
import type { FollowUp } from "@/types/crm";

export function useFollowUp() {
  const followUps = ref<FollowUp[]>([]);
  const loading = ref(false);
  const error = ref("");

  const showCreateDialog = ref(false);
  const showToast = ref(false);

  const prospectId = ref("");
  const dueDate = ref("");
  const followUpNotes = ref("");
  const completed = ref(false);

  async function loadFollowUps(): Promise<void> {
    loading.value = true;
    error.value = "";

    try {
      followUps.value = await getFollowUps();
    } catch (err) {
      console.error(err);
      error.value = "Failed to load follow-ups.";
    } finally {
      loading.value = false;
    }
  }

  function openCreateDialog(): void {
    prospectId.value = "";
    dueDate.value = "";
    followUpNotes.value = "";
    completed.value = false;

    showCreateDialog.value = true;
  }

  function closeCreateDialog(): void {
    showCreateDialog.value = false;
  }

  async function saveFollowUp(): Promise<void> {
    try {
      const createdFollowUp = await createFollowUp({
        prospect_id: Number(prospectId.value),
        due_date: dueDate.value,
        notes: followUpNotes.value,
        completed: completed.value,
      });

      followUps.value.unshift(createdFollowUp);

      closeCreateDialog();

      showToast.value = true;
    } catch (err) {
      console.error(err);
      error.value = "Failed to create follow-up.";
    }
  }

  async function editFollowUp(
    id: number,
    data: Partial<FollowUp>,
  ): Promise<void> {
    try {
      const updatedFollowUp = await updateFollowUp(id, data);

      const index = followUps.value.findIndex(
        (followUp) => followUp.id === id,
      );

      if (index !== -1) {
        followUps.value[index] = updatedFollowUp;
      }
    } catch (err) {
      console.error(err);
      error.value = "Failed to update follow-up.";
    }
  }

  async function removeFollowUp(id: number): Promise<void> {
    try {
      await deleteFollowUp(id);

      followUps.value = followUps.value.filter(
        (followUp) => followUp.id !== id,
      );
    } catch (err) {
      console.error(err);
      error.value = "Failed to delete follow-up.";
    }
  }

  async function toggleFollowUp(
    followUp: FollowUp,
  ): Promise<void> {
    await editFollowUp(followUp.id, {
      completed: !followUp.completed,
    });
  }

  return {
    followUps,
    loading,
    error,

    showCreateDialog,
    showToast,

    prospectId,
    dueDate,
    followUpNotes,
    completed,

    loadFollowUps,
    saveFollowUp,
    editFollowUp,
    removeFollowUp,
    toggleFollowUp,

    openCreateDialog,
    closeCreateDialog,
  };
}

