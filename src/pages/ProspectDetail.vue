
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getProspect,
  updateProspect,
  deleteProspect,
} from "@/lib/api";
import type {
  Prospect,
  ProspectStatus,
} from "@/types/crm";

const route = useRoute();
const router = useRouter();

const prospect = ref<Prospect | null>(null);
const loading = ref(true);
const error = ref("");

const showEditDialog = ref(false);
const saving = ref(false);
const deleting = ref(false);

const editName = ref("");
const editCompany = ref("");
const editEmail = ref("");
const editPhone = ref("");
const editWebsite = ref("");
const editValue = ref("");
const editStatus = ref<ProspectStatus>("new");
const editNotes = ref("");

async function loadProspect(): Promise<void> {
  loading.value = true;
  error.value = "";

  try {
    const id = Number(route.params.id);

    if (!Number.isInteger(id)) {
      throw new Error("Invalid prospect ID.");
    }

    prospect.value = await getProspect(id);
  } catch (err) {
    console.error(err);
    error.value = "Failed to load prospect.";
  } finally {
    loading.value = false;
  }
}

function goBack(): void {
  void router.push("/prospects");
}

function statusVariant(
  status: ProspectStatus,
): "success" | "info" | "brand" | "default" {
  switch (status) {
    case "won":
      return "success";

    case "interested":
    case "meeting":
      return "info";

    case "proposal":
      return "brand";

    default:
      return "default";
  }
}

function formatCurrency(value: number): string {
  return `£${Number(value || 0).toLocaleString()}`;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString();
}

function openEditDialog(): void {
  if (!prospect.value) {
    return;
  }

  editName.value = prospect.value.contact_name;
  editCompany.value = prospect.value.business_name;
  editEmail.value = prospect.value.email ?? "";
  editPhone.value = prospect.value.phone ?? "";
  editWebsite.value = prospect.value.website ?? "";
  editValue.value = String(prospect.value.value ?? "");
  editStatus.value = prospect.value.status;
  editNotes.value = prospect.value.notes ?? "";

  showEditDialog.value = true;
}

function closeEditDialog(): void {
  showEditDialog.value = false;
}

async function saveChanges(): Promise<void> {
  if (!prospect.value) {
    return;
  }

  saving.value = true;
  error.value = "";

  try {
    const updatedProspect = await updateProspect(
      prospect.value.id,
      {
        contact_name: editName.value,
        business_name: editCompany.value,
        email: editEmail.value,
        phone: editPhone.value,
        website: editWebsite.value,
        value: Number(editValue.value) || 0,
        status: editStatus.value,
        notes: editNotes.value,
      },
    );

    prospect.value = updatedProspect;
    closeEditDialog();
  } catch (err) {
    console.error(err);
    error.value = "Failed to update prospect.";
  } finally {
    saving.value = false;
  }
}

async function removeProspect(): Promise<void> {
  if (!prospect.value) {
    return;
  }

  const confirmed = window.confirm(
    `Delete ${prospect.value.business_name}? This cannot be undone.`,
  );

  if (!confirmed) {
    return;
  }

  deleting.value = true;
  error.value = "";

  try {
    await deleteProspect(prospect.value.id);
    await router.push("/prospects");
  } catch (err) {
    console.error(err);
    error.value = "Failed to delete prospect.";
  } finally {
    deleting.value = false;
  }
}

onMounted(() => {
  void loadProspect();
});
</script>

<template>
  <main class="app-main">
    <Section>
      <Container>
        <Stack
          size="large"
          fullWidth
        >
          <!-- Back -->
          <Button
            variant="ghost"
            @click="goBack"
          >
            ← Back to prospects
          </Button>

          <!-- Loading -->
          <Card v-if="loading">
            <Stack
              size="large"
              fullWidth
            >
              <Skeleton variant="heading" />

              <Skeleton
                variant="text"
                width="40%"
              />

              <Grid
                :columns="2"
                size="medium"
              >
                <Skeleton />
                <Skeleton />
              </Grid>

              <Skeleton />
              <Skeleton />
            </Stack>
          </Card>

          <!-- Error -->
          <Card v-else-if="error && !prospect">
            <Stack size="medium">
              <Stack size="small">
                <Eyebrow>
                  Prospect
                </Eyebrow>

                <Heading level="h3">
                  Something went wrong
                </Heading>

                <Text tone="secondary">
                  {{ error }}
                </Text>
              </Stack>

              <Button
                variant="secondary"
                @click="loadProspect"
              >
                Try again
              </Button>
            </Stack>
          </Card>

          <template v-else-if="prospect">
            <!-- Header -->
            <Stack
              size="medium"
              fullWidth
            >
              <div class="page-header">
                <Stack size="small">
                  <Eyebrow>
                    Sales Pipeline
                  </Eyebrow>

                  <Heading level="h1">
                    {{ prospect.business_name }}
                  </Heading>

                  <Text tone="secondary">
                    {{ prospect.contact_name }}
                  </Text>
                </Stack>

                <ButtonGroup>
                  <Button
                    variant="secondary"
                    @click="openEditDialog"
                  >
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    :disabled="deleting"
                    @click="removeProspect"
                  >
                    {{
                      deleting
                        ? "Deleting..."
                        : "Delete"
                    }}
                  </Button>
                </ButtonGroup>
              </div>

              <Card
                v-if="error"
                variant="outlined"
              >
                <Text>
                  {{ error }}
                </Text>
              </Card>
            </Stack>

            <!-- Main workspace -->
            <Grid
            class="workspace-grid"
              :columns="2"
              size="large"
            >
              <!-- LEFT -->
              <Stack
                size="large"
                fullWidth
              >
                <!-- Opportunity -->
                <Card>
                  <Stack
                    size="large"
                    fullWidth
                  >
                    <Stack size="small">
                      <Eyebrow>
                        Opportunity
                      </Eyebrow>

                      <Heading level="h2">
                        {{ formatCurrency(prospect.value) }}
                      </Heading>

                      <Text tone="secondary">
                        Current opportunity in the sales pipeline.
                      </Text>
                    </Stack>

                    <Divider />

                    <div class="detail-grid">
                      <div class="detail-row">
                        <Label>
                          Pipeline status
                        </Label>

                        <Badge
                          :variant="
                            statusVariant(prospect.status)
                          "
                        >
                          {{ prospect.status }}
                        </Badge>
                      </div>

                      <div class="detail-row">
                        <Label>
                          Opportunity value
                        </Label>

                        <Text>
                          {{ formatCurrency(prospect.value) }}
                        </Text>
                      </div>
                    </div>
                  </Stack>
                </Card>

                <!-- Activity -->
                <Card>
                  <Stack
                    size="large"
                    fullWidth
                  >
                    <Stack size="small">
                      <Eyebrow>
                        Activity
                      </Eyebrow>

                      <Heading level="h3">
                        Sales activity
                      </Heading>

                      <Text tone="secondary">
                        Conversations and follow-ups for this prospect.
                      </Text>
                    </Stack>

                    <Divider />

                    <div class="activity-empty">
                      <Text tone="secondary">
                        No activity recorded yet.
                      </Text>

                      <Button
                        variant="secondary"
                        size="small"
                      >
                        Log call
                      </Button>
                    </div>
                  </Stack>
                </Card>

                <!-- Notes -->
                <Card>
                  <Stack
                    size="large"
                    fullWidth
                  >
                    <Stack size="small">
                      <Eyebrow>
                        Context
                      </Eyebrow>

                      <Heading level="h3">
                        Notes
                      </Heading>
                    </Stack>

                    <Divider />

                    <Text
                      v-if="prospect.notes"
                    >
                      {{ prospect.notes }}
                    </Text>

                    <Text
                      v-else
                      tone="secondary"
                    >
                      No notes have been added to this prospect yet.
                    </Text>
                  </Stack>
                </Card>
              </Stack>

              <!-- RIGHT -->
              <Stack
                size="large"
                fullWidth
              >
                <!-- Contact -->
                <Card>
                  <Stack
                    size="large"
                    fullWidth
                  >
                    <Stack size="small">
                      <Eyebrow>
                        Contact
                      </Eyebrow>

                      <Heading level="h3">
                        {{ prospect.contact_name }}
                      </Heading>

                      <Text tone="secondary">
                        Primary contact.
                      </Text>
                    </Stack>

                    <Divider />

                    <div class="detail-grid">
                      <div class="detail-row">
                        <Label>
                          Email
                        </Label>

                        <Text>
                          {{ prospect.email || "Not provided" }}
                        </Text>
                      </div>

                      <div class="detail-row">
                        <Label>
                          Phone
                        </Label>

                        <Text>
                          {{ prospect.phone || "Not provided" }}
                        </Text>
                      </div>
                    </div>
                  </Stack>
                </Card>

                <!-- Company -->
                <Card>
                  <Stack
                    size="large"
                    fullWidth
                  >
                    <Stack size="small">
                      <Eyebrow>
                        Company
                      </Eyebrow>

                      <Heading level="h3">
                        {{ prospect.business_name }}
                      </Heading>
                    </Stack>

                    <Divider />

                    <div class="detail-grid">
                      <div class="detail-row">
                        <Label>
                          Website
                        </Label>

                        <Text>
                          {{ prospect.website || "Not provided" }}
                        </Text>
                      </div>

                      <div class="detail-row">
                        <Label>
                          Contact
                        </Label>

                        <Text>
                          {{ prospect.contact_name }}
                        </Text>
                      </div>
                    </div>
                  </Stack>
                </Card>

                <!-- Record -->
                <Card variant="outlined">
                  <Stack
                    size="large"
                    fullWidth
                  >
                    <Stack size="small">
                      <Eyebrow>
                        Record
                      </Eyebrow>

                      <Heading level="h3">
                        Prospect information
                      </Heading>
                    </Stack>

                    <Divider />

                    <div class="detail-grid">
                      <div class="detail-row">
                        <Label>
                          Created
                        </Label>

                        <Text>
                          {{ formatDate(prospect.created_at) }}
                        </Text>
                      </div>

                      <div class="detail-row">
                        <Label>
                          Status
                        </Label>

                        <Badge
                          :variant="
                            statusVariant(prospect.status)
                          "
                        >
                          {{ prospect.status }}
                        </Badge>
                      </div>
                    </div>
                  </Stack>
                </Card>
              </Stack>
            </Grid>
          </template>
        </Stack>
      </Container>
    </Section>

    <!-- Edit dialog -->
    <Dialog v-model="showEditDialog">
      <Stack
        size="large"
        fullWidth
      >
        <Stack size="small">
          <Text tone="muted">
            Prospect
          </Text>

          <Heading level="h2">
            Edit prospect
          </Heading>

          <Text tone="secondary">
            Update the prospect's details.
          </Text>
        </Stack>

        <Stack
          size="medium"
          fullWidth
        >
          <div class="form-grid">
            <div class="form-field">
              <Label for="edit-name">
                Contact name
              </Label>

              <Input
                id="edit-name"
                v-model="editName"
                type="text"
              />
            </div>

            <div class="form-field">
              <Label for="edit-company">
                Business name
              </Label>

              <Input
                id="edit-company"
                v-model="editCompany"
                type="text"
              />
            </div>

            <div class="form-field">
              <Label for="edit-email">
                Email
              </Label>

              <Input
                id="edit-email"
                v-model="editEmail"
                type="email"
              />
            </div>

            <div class="form-field">
              <Label for="edit-phone">
                Phone
              </Label>

              <Input
                id="edit-phone"
                v-model="editPhone"
                type="tel"
              />
            </div>

            <div class="form-field">
              <Label for="edit-website">
                Website
              </Label>

              <Input
                id="edit-website"
                v-model="editWebsite"
                type="url"
              />
            </div>

            <div class="form-field">
              <Label for="edit-value">
                Opportunity value
              </Label>

              <Input
                id="edit-value"
                v-model="editValue"
                type="number"
              />
            </div>

            <div class="form-field form-field--full">
              <Label for="edit-status">
                Status
              </Label>

              <Select
                id="edit-status"
                v-model="editStatus"
              >
                <option value="new">
                  New
                </option>

                <option value="contacted">
                  Contacted
                </option>

                <option value="interested">
                  Interested
                </option>

                <option value="meeting">
                  Meeting
                </option>

                <option value="proposal">
                  Proposal
                </option>

                <option value="won">
                  Won
                </option>

                <option value="lost">
                  Lost
                </option>
              </Select>
            </div>

            <div class="form-field form-field--full">
              <Label for="edit-notes">
                Notes
              </Label>

              <Textarea
                id="edit-notes"
                v-model="editNotes"
                placeholder="Add internal notes"
              />
            </div>
          </div>
        </Stack>

        <ButtonGroup>
          <Button
            variant="secondary"
            :disabled="saving"
            @click="closeEditDialog"
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            :disabled="saving"
            @click="saveChanges"
          >
            {{
              saving
                ? "Saving..."
                : "Save changes"
            }}
          </Button>
        </ButtonGroup>
      </Stack>
    </Dialog>
  </main>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-6);
  width: 100%;
}

.detail-grid {
  display: grid;
  gap: var(--space-4);
  width: 100%;
}

.detail-row {
  display: grid;
  grid-template-columns: minmax(8rem, 0.7fr) minmax(0, 1.3fr);
  align-items: center;
  gap: var(--space-4);
  min-width: 0;
}

.activity-empty {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
  width: 100%;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 0;
}

.form-field--full {
  grid-column: 1 / -1;
}

/*
 * Tablet
 */
@media (max-width: 1024px) {
  .page-header {
    align-items: stretch;
    flex-direction: column;
  }

  .detail-row {
    grid-template-columns: 1fr;
    gap: var(--space-1);
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-field--full {
    grid-column: auto;
  }

  .activity-empty {
    align-items: stretch;
    flex-direction: column;
  }
}

/*
 * Mobile
 */
@media (max-width: 768px) {
  .page-header {
    gap: var(--space-4);
  }

  .detail-row {
    gap: var(--space-1);
  }

  .activity-empty {
    gap: var(--space-3);
  }
   .workspace-grid {
    grid-template-columns: 1fr;
  }
}
</style>