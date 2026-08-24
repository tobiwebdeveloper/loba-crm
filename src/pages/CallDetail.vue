<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getCall,
  getProspect,
  updateCall,
  deleteCall,
} from "@/lib/api";
import type { Call, Prospect } from "@/types/crm";

const route = useRoute();
const router = useRouter();

const call = ref<Call | null>(null);
const prospect = ref<Prospect | null>(null);

const loading = ref(true);
const error = ref("");

const showEditDialog = ref(false);
const saving = ref(false);
const deleting = ref(false);

const editProspectId = ref("");
const editDate = ref("");
const editDuration = ref("");
const editOutcome = ref("");
const editNotes = ref("");

async function loadCall(): Promise<void> {
  loading.value = true;
  error.value = "";

  try {
    const id = Number(route.params.id);

    if (!Number.isInteger(id)) {
      throw new Error("Invalid call ID.");
    }

    const loadedCall = await getCall(id);

    call.value = loadedCall;

    try {
      prospect.value = await getProspect(
        loadedCall.prospect_id,
      );
    } catch (prospectError) {
      console.error(prospectError);
      prospect.value = null;
    }
  } catch (err) {
    console.error(err);
    error.value = "Failed to load call.";
  } finally {
    loading.value = false;
  }
}

function goBack(): void {
  void router.push("/calls");
}

function openProspect(): void {
  if (!call.value) {
    return;
  }

  void router.push(
    `/prospects/${call.value.prospect_id}`,
  );
}



function formatDateTime(value: string): string {
  return new Date(value).toLocaleString();
}

function formatDuration(value: number): string {
  if (value < 60) {
    return `${value} min`;
  }

  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}

function outcomeVariant(
  outcome: string,
): "success" | "info" | "brand" | "default" {
  switch (outcome.toLowerCase()) {
    case "completed":
      return "success";

    case "meeting":
      return "info";

    case "interested":
      return "brand";

    default:
      return "default";
  }
}

function openEditDialog(): void {
  if (!call.value) {
    return;
  }

  editProspectId.value = String(
    call.value.prospect_id,
  );

  editDate.value = call.value.date;
  editDuration.value = String(
    call.value.duration,
  );
  editOutcome.value = call.value.outcome;
  editNotes.value = call.value.notes ?? "";

  showEditDialog.value = true;
}

function closeEditDialog(): void {
  showEditDialog.value = false;
}

async function saveChanges(): Promise<void> {
  if (!call.value) {
    return;
  }

  saving.value = true;
  error.value = "";

  try {
    const updatedCall = await updateCall(
      call.value.id,
      {
        prospect_id: Number(
          editProspectId.value,
        ),
        date: editDate.value,
        duration:
          Number(editDuration.value) || 0,
        outcome: editOutcome.value,
        notes: editNotes.value,
      },
    );

    call.value = updatedCall;

    if (
      prospect.value?.id !==
      updatedCall.prospect_id
    ) {
      try {
        prospect.value = await getProspect(
          updatedCall.prospect_id,
        );
      } catch (prospectError) {
        console.error(prospectError);
        prospect.value = null;
      }
    }

    closeEditDialog();
  } catch (err) {
    console.error(err);
    error.value = "Failed to update call.";
  } finally {
    saving.value = false;
  }
}

async function removeCall(): Promise<void> {
  if (!call.value) {
    return;
  }

  const confirmed = window.confirm(
    "Delete this call? This cannot be undone.",
  );

  if (!confirmed) {
    return;
  }

  deleting.value = true;
  error.value = "";

  try {
    await deleteCall(call.value.id);
    await router.push("/calls");
  } catch (err) {
    console.error(err);
    error.value = "Failed to delete call.";
  } finally {
    deleting.value = false;
  }
}

onMounted(() => {
  void loadCall();
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
          <Button
            variant="ghost"
            @click="goBack"
          >
            ← Back to calls
          </Button>

          <Card
            v-if="loading"
            variant="elevated"
          >
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
              class=""
                :columns="2"
                size="medium"
              >
                <Skeleton />
                <Skeleton />
              </Grid>

              <Skeleton />
            </Stack>
          </Card>

          <Card
            v-else-if="error && !call"
            variant="outlined"
          >
            <Stack size="medium">
              <Text>
                {{ error }}
              </Text>

              <Button
                variant="secondary"
                @click="loadCall"
              >
                Try again
              </Button>
            </Stack>
          </Card>

          <template v-else-if="call">
            <!-- Header surface -->
            <Card variant="elevated">
              <Stack
                size="large"
                fullWidth
              >
                <Stack size="small">
                  <Eyebrow>
                    Sales Activity
                  </Eyebrow>

                  <Heading level="h1">
                    {{ prospect?.business_name ?? "Call" }}
                  </Heading>

                  <Text tone="secondary">
                    {{ prospect?.contact_name ?? "Unknown prospect" }}
                  </Text>
                </Stack>

                <Divider />

                <Grid
                class="workspace-grid"
                  :columns="3"
                  size="medium"
                >
                  <Stack size="small">
                    <Text tone="muted">
                      Outcome
                    </Text>

                    <Badge
                      :variant="
                        outcomeVariant(call.outcome)
                      "
                    >
                      {{ call.outcome }}
                    </Badge>
                  </Stack>

                  <Stack size="small">
                    <Text tone="muted">
                      Date
                    </Text>

                    <Text>
                      {{ formatDateTime(call.date) }}
                    </Text>
                  </Stack>

                  <Stack size="small">
                    <Text tone="muted">
                      Duration
                    </Text>

                    <Text>
                      {{ formatDuration(call.duration) }}
                    </Text>
                  </Stack>
                </Grid>

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
                    @click="removeCall"
                  >
                    {{
                      deleting
                        ? "Deleting..."
                        : "Delete"
                    }}
                  </Button>
                </ButtonGroup>
              </Stack>
            </Card>

            <!-- Main content -->
            <Grid
            class="workspace-grid"
              :columns="2"
              size="large"
            >
              <!-- Left -->
              <Stack
                size="large"
                fullWidth
              >
                <Card>
                  <Stack
                    size="large"
                    fullWidth
                  >
                    <Stack size="small">
                      <Text tone="muted">
                        Conversation
                      </Text>

                      <Heading level="h2">
                        Notes
                      </Heading>
                    </Stack>

                    <Text
                      v-if="call.notes"
                    >
                      {{ call.notes }}
                    </Text>

                    <Text
                      v-else
                      tone="secondary"
                    >
                      No notes were recorded
                      for this call.
                    </Text>
                  </Stack>
                </Card>
              </Stack>

              <!-- Right -->
              <Stack
                size="large"
                fullWidth
              >
                <Card variant="outlined">
                  <Stack
                    size="large"
                    fullWidth
                  >
                    <Stack size="small">
                      <Text tone="muted">
                        Prospect
                      </Text>

                      <Heading level="h2">
                        {{
                          prospect?.business_name ??
                          "Unknown prospect"
                        }}
                      </Heading>

                      <Text
                        v-if="prospect"
                        tone="secondary"
                      >
                        {{ prospect.contact_name }}
                      </Text>
                    </Stack>

                    <Divider />

                    <Stack size="small">
                      <Text
                        v-if="prospect?.email"
                      >
                        {{ prospect.email }}
                      </Text>

                      <Text
                        v-if="prospect?.phone"
                      >
                        {{ prospect.phone }}
                      </Text>

                      <Text
                        v-if="prospect?.website"
                      >
                        {{ prospect.website }}
                      </Text>

                      <Text
                        v-if="
                          prospect &&
                          !prospect.email &&
                          !prospect.phone &&
                          !prospect.website
                        "
                        tone="secondary"
                      >
                        No contact details
                        available.
                      </Text>
                    </Stack>

                    <Button
                      v-if="prospect"
                      variant="secondary"
                      @click="openProspect"
                    >
                      View prospect
                    </Button>
                  </Stack>
                </Card>
              </Stack>
            </Grid>

            <!-- Error -->
            <Card
              v-if="error"
              variant="outlined"
            >
              <Text>
                {{ error }}
              </Text>
            </Card>
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
            Sales Activity
          </Text>

          <Heading level="h2">
            Edit call
          </Heading>

          <Text tone="secondary">
            Update the details of this
            conversation.
          </Text>
        </Stack>

        <Stack
          size="medium"
          fullWidth
        >
          <Input
            v-model="editDate"
            type="datetime-local"
            placeholder="Date"
          />

          <Input
            v-model="editDuration"
            type="number"
            placeholder="Duration in minutes"
          />

          <Input
            v-model="editOutcome"
            type="text"
            placeholder="Outcome"
          />

          <Textarea
            v-model="editNotes"
            placeholder="Notes"
          />
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

</style>