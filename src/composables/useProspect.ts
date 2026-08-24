
import { ref } from "vue";
import {
  getProspects,
  createProspect,
  updateProspect,
  deleteProspect,
} from "@/lib/api";
import type {
  Prospect,
  ProspectStatus,
} from "@/types/crm";

export function useProspect() {
  const prospects = ref<Prospect[]>([]);
  const loading = ref(false);
  const error = ref("");

  const showCreateDialog = ref(false);
  const showToast = ref(false);

  const prospectName = ref("");
  const prospectCompany = ref("");
  const prospectEmail = ref("");
  const prospectPhone = ref("");
  const prospectWebsite = ref("");
  const prospectValue = ref("");
  const prospectStatus = ref<ProspectStatus>("new");
  const prospectNotes = ref("");

  async function loadProspects(): Promise<void> {
    loading.value = true;
    error.value = "";

    try {
      prospects.value = await getProspects();
    } catch (err) {
      console.error(err);
      error.value = "Failed to load prospects.";
    } finally {
      loading.value = false;
    }
  }

  function openCreateDialog(): void {
    prospectName.value = "";
    prospectCompany.value = "";
    prospectEmail.value = "";
    prospectPhone.value = "";
    prospectWebsite.value = "";
    prospectValue.value = "";
    prospectStatus.value = "new";
    prospectNotes.value = "";

    showCreateDialog.value = true;
  }

  function closeCreateDialog(): void {
    showCreateDialog.value = false;
  }

  async function saveProspect(): Promise<void> {
    try {
      console.log("BEFORE CREATE:", {
      company: prospectCompany.value,
      name: prospectName.value,
      email: prospectEmail.value,
      phone: prospectPhone.value,
      website: prospectWebsite.value,
      value: prospectValue.value,
      status: prospectStatus.value,
      notes: prospectNotes.value,
    });
    
      const createdProspect = await createProspect({
        contact_name: prospectName.value,
        business_name: prospectCompany.value,
        email: prospectEmail.value,
        phone: prospectPhone.value,
        website: prospectWebsite.value,
        status: prospectStatus.value,
        value: Number(prospectValue.value) || 0,
        notes: prospectNotes.value,
      });

      prospects.value.unshift(createdProspect);

      closeCreateDialog();

      showToast.value = true;
    } catch (err) {
      console.error(err);
      error.value = "Failed to create prospect.";
    }
  }

  async function editProspect(
    id: number,
    data: Partial<Prospect>,
  ): Promise<void> {
    try {
      const updatedProspect = await updateProspect(id, data);

      const index = prospects.value.findIndex(
        (prospect) => prospect.id === id,
      );

      if (index !== -1) {
        prospects.value[index] = updatedProspect;
      }
    } catch (err) {
      console.error(err);
      error.value = "Failed to update prospect.";
    }
  }

  async function removeProspect(id: number): Promise<void> {
    try {
      await deleteProspect(id);

      prospects.value = prospects.value.filter(
        (prospect) => prospect.id !== id,
      );
    } catch (err) {
      console.error(err);
      error.value = "Failed to delete prospect.";
    }
  }

  return {
    prospects,
    loading,
    error,

    showCreateDialog,
    showToast,

    prospectName,
    prospectCompany,
    prospectEmail,
    prospectPhone,
    prospectWebsite,
    prospectValue,
    prospectStatus,
    prospectNotes,

    loadProspects,
    saveProspect,
    editProspect,
    removeProspect,

    openCreateDialog,
    closeCreateDialog,
  };
}

