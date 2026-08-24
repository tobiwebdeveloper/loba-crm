
<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
} from "vue";

import {
  useRoute,
  useRouter,
} from "vue-router";

import {
  getFollowUps,
  getProspects,
  updateFollowUp,
  deleteFollowUp,
} from "@/lib/api";

import type {
  FollowUp,
  Prospect,
} from "@/types/crm";

const route = useRoute();
const router = useRouter();

const followUp = ref<FollowUp | null>(null);
const prospects = ref<Prospect[]>([]);

const loading = ref(true);
const error = ref("");

const showEditDialog = ref(false);
const saving = ref(false);
const deleting = ref(false);

const editProspectId = ref<number | "">("");
const editDueDate = ref("");
const editNotes = ref("");
const editCompleted = ref(false);

const prospect = computed(() => {
  if (!followUp.value) {
    return null;
  }

  return prospects.value.find(
    (item) => item.id === followUp.value?.prospect_id,
  );
});

const statusLabel = computed(() => {
  if (!followUp.value) {
    return "";
  }

  if (followUp.value.completed) {
    return "Completed";
  }

  return isOverdue(followUp.value)
    ? "Overdue"
    : "Upcoming";
});

const statusVariant = computed<
  "success" | "warning" | "default"
>(() => {
  if (!followUp.value) {
    return "default";
  }

  if (followUp.value.completed) {
    return "success";
  }

  if (isOverdue(followUp.value)) {
    return "warning";
  }

  return "default";
});

async function loadFollowUp(): Promise<void> {
  loading.value = true;
  error.value = "";

  try {
    const id = Number(route.params.id);

    if (!Number.isInteger(id)) {
      throw new Error("Invalid follow-up ID.");
    }

    const [
      loadedFollowUps,
      loadedProspects,
    ] = await Promise.all([
      getFollowUps(),
      getProspects(),
    ]);

    const foundFollowUp =
      loadedFollowUps.find(
        (item) => item.id === id,
      );

    if (!foundFollowUp) {
      throw new Error("Follow-up not found.");
    }

    followUp.value = foundFollowUp;
    prospects.value = loadedProspects;
  } catch (err) {
    console.error(err);
    error.value = "Failed to load follow-up.";
  } finally {
    loading.value = false;
  }
}

function goBack(): void {
  void router.push("/follow-ups");
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString(
    undefined,
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  );
}

function isOverdue(item: FollowUp): boolean {
  return (
    !item.completed &&
    new Date(item.due_date).getTime() < Date.now()
  );
}

function openProspect(): void {
  if (!followUp.value) {
    return;
  }

  void router.push(
    `/prospects/${followUp.value.prospect_id}`,
  );
}

function openEditDialog(): void {
  if (!followUp.value) {
    return;
  }

  editProspectId.value =
    followUp.value.prospect_id;

  editDueDate.value =
    followUp.value.due_date;

  editNotes.value =
    followUp.value.notes ?? "";

  editCompleted.value =
    followUp.value.completed;

  showEditDialog.value = true;
}

function closeEditDialog(): void {
  showEditDialog.value = false;
}

async function saveChanges(): Promise<void> {
  if (!followUp.value) {
    return;
  }

  saving.value = true;
  error.value = "";

  try {
    const updatedFollowUp =
      await updateFollowUp(
        followUp.value.id,
        {
          prospect_id:
            Number(editProspectId.value),
          due_date:
            editDueDate.value,
          notes:
            editNotes.value,
          completed:
            editCompleted.value,
        },
      );

    followUp.value = updatedFollowUp;
    closeEditDialog();
  } catch (err) {
    console.error(err);
    error.value =
      "Failed to update follow-up.";
  } finally {
    saving.value = false;
  }
}

async function removeFollowUp(): Promise<void> {
  if (!followUp.value) {
    return;
  }

  const confirmed = window.confirm(
    "Delete this follow-up? This cannot be undone.",
  );

  if (!confirmed) {
    return;
  }

  deleting.value = true;
  error.value = "";

  try {
    await deleteFollowUp(
      followUp.value.id,
    );

    await router.push("/follow-ups");
  } catch (err) {
    console.error(err);
    error.value =
      "Failed to delete follow-up.";
  } finally {
    deleting.value = false;
  }
}

onMounted(() => {
  void loadFollowUp();
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
            ← Back to follow-ups
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
            </Stack>
          </Card>

          <!-- Error -->
          <Card
            v-else-if="error && !followUp"
          >
            <Stack size="medium">
              <Heading level="h3">
                Something went wrong
              </Heading>

              <Text>
                {{ error }}
              </Text>

              <Button
                variant="secondary"
                @click="loadFollowUp"
              >
                Try again
              </Button>
            </Stack>
          </Card>

          <template v-else-if="followUp">
            <!-- Page header -->
            <Stack class="page-header"
              size="medium"
              fullWidth
            >
            <SectionHeader>
  <Stack size="small">
    <Eyebrow>Sales Activity</Eyebrow>

    <Heading level="h1">
      Follow-up
    </Heading>

    <Text tone="secondary">
      {{ prospect?.business_name ?? `Prospect #${followUp.prospect_id}` }}
    </Text>
  </Stack>

  <ButtonGroup class="actions-row">
    <Button
      variant="secondary"
      @click="openEditDialog"
    >
      Edit
    </Button>
  
    <Button
      variant="destructive"
      :disabled="deleting"
      @click="removeFollowUp"
    >
      {{ deleting ? "Deleting..." : "Delete" }}
    </Button>
  </ButtonGroup>
</SectionHeader>

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
              :columns="2"
              size="large"
            >
              <!-- LEFT -->
              <Stack
                size="large"
                fullWidth
              >
                <!-- Follow-up -->
                <Card>
                  <Stack
                    size="large"
                    fullWidth
                  >
                    <Stack size="small">
                      <Eyebrow>
                        Follow-up
                      </Eyebrow>

                      <Heading level="h2">
                        {{
                          formatDateTime(
                            followUp.due_date,
                          )
                        }}
                      </Heading>

                      <Text tone="secondary">
                        Scheduled sales activity
                        for this prospect.
                      </Text>
                    </Stack>

                    <Divider />

                    <Grid
                      :columns="2"
                      size="medium"
                    >
                      <Stack size="small">
                        <Text tone="muted">
                          Status
                        </Text>

                        <Badge
                          :variant="statusVariant"
                        >
                          {{ statusLabel }}
                        </Badge>
                      </Stack>

                      <Stack size="small">
                        <Text tone="muted">
                          Due
                        </Text>

                        <Text>
                          {{
                            formatDate(
                              followUp.due_date,
                            )
                          }}
                        </Text>
                      </Stack>
                    </Grid>
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

                      <Text tone="secondary">
                        Internal context for
                        this follow-up.
                      </Text>
                    </Stack>

                    <Divider />

                    <Text
                      v-if="followUp.notes"
                    >
                      {{ followUp.notes }}
                    </Text>

                    <Text
                      v-else
                      tone="secondary"
                    >
                      No notes have been added
                      to this follow-up yet.
                    </Text>
                  </Stack>
                </Card>
              </Stack>

              <!-- RIGHT -->
              <Stack
                size="large"
                fullWidth
              >
                <!-- Prospect -->
                <Card>
                  <Stack
                    size="large"
                    fullWidth
                  >
                    <Stack size="small">
                      <Eyebrow>
                        Prospect
                      </Eyebrow>

                      <Heading level="h3">
                        {{
                          prospect?.business_name ??
                          `Prospect #${followUp.prospect_id}`
                        }}
                      </Heading>

                      <Text tone="secondary">
                        {{
                          prospect?.contact_name ??
                          "Primary prospect"
                        }}
                      </Text>
                    </Stack>

                    <Divider />

                    <Button
                      variant="secondary"
                      @click="openProspect"
                    >
                      View prospect
                    </Button>
                  </Stack>
                </Card>
              </Stack>
            </Grid>
          </template>
        </Stack>
      </Container>
    </Section>

    <!-- Edit dialog -->
    <Dialog
      v-model="showEditDialog"
    >
      <Stack
        size="large"
        fullWidth
      >
        <Stack size="small">
          <Text tone="muted">
            Sales Activity
          </Text>

          <Heading level="h2">
            Edit follow-up
          </Heading>

          <Text tone="secondary">
            Update the scheduled activity.
          </Text>
        </Stack>

        <Divider />

        <Stack
          size="medium"
          fullWidth
        >
          <Stack size="small">
            <Label
              for="follow-up-prospect"
              required
            >
              Prospect
            </Label>

            <Select
              id="follow-up-prospect"
              v-model="editProspectId"
            >
              <option
                value=""
                disabled
              >
                Select prospect
              </option>

              <option
                v-for="item in prospects"
                :key="item.id"
                :value="item.id"
              >
                {{ item.business_name }}
              </option>
            </Select>
          </Stack>

          <Stack size="small">
            <Label
              for="follow-up-due"
              required
            >
              Due date
            </Label>

            <Input
              id="follow-up-due"
              v-model="editDueDate"
              type="datetime-local"
            />
          </Stack>

          <Stack size="small">
            <Label
              for="follow-up-notes"
              optional
            >
              Notes
            </Label>

            <Textarea
              id="follow-up-notes"
              v-model="editNotes"
              placeholder="Add context for this follow-up"
            />
          </Stack>

          <Stack size="small">
            <Label>
              Status
            </Label>

            <Select
              v-model="editCompleted"
            >
              <option :value="false">
                Pending
              </option>

              <option :value="true">
                Completed
              </option>
            </Select>
          </Stack>
        </Stack>

        <Divider />

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
    position: relative;
}
.actions-row{
    position: absolute;
    top: 0;
    right: 0;
}
</style>

