<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { useCall } from "@/composables/useCall";
import { useProspect } from "@/composables/useProspect";
import type { Call } from "@/types/crm";

const router = useRouter();

const {
  calls,
  loading: callsLoading,
  error: callsError,
  showCreateDialog,
  showToast,
  prospectId,
  callDate,
  callDuration,
  callOutcome,
  callNotes,
  loadCalls,
  saveCall,
  openCreateDialog,
  closeCreateDialog,
} = useCall();

const {
  prospects,
  loadProspects,
} = useProspect();

const search = ref("");
const page = ref(1);
const pageSize = 10;

const columns = [
  {
    key: "prospect_id",
    label: "Prospect",
    sortable: true,
  },
  {
    key: "date",
    label: "Date",
    sortable: true,
  },
  {
    key: "duration",
    label: "Duration",
    sortable: true,
    align: "end" as const,
  },
  {
    key: "outcome",
    label: "Outcome",
    sortable: true,
  },
];

const filteredCalls = computed(() => {
  const query = search.value.trim().toLowerCase();

  if (!query) {
    return calls.value;
  }

  return calls.value.filter((call) => {
    const prospect = prospects.value.find(
      (item) => item.id === call.prospect_id,
    );

    const businessName =
      prospect?.business_name.toLowerCase() ?? "";

    const contactName =
      prospect?.contact_name.toLowerCase() ?? "";

    const outcome = call.outcome.toLowerCase();

    return (
      businessName.includes(query) ||
      contactName.includes(query) ||
      outcome.includes(query)
    );
  });
});

const totalItems = computed(
  () => filteredCalls.value.length,
);

const currentPageCalls = computed(() => {
  const start = (page.value - 1) * pageSize;

  return filteredCalls.value.slice(
    start,
    start + pageSize,
  );
});

function resetPage(): void {
  page.value = 1;
}

function openCall(call: Call): void {
  void router.push(`/calls/${call.id}`);
}

function prospectName(prospectId: number): string {
  const prospect = prospects.value.find(
    (item) => item.id === prospectId,
  );

  return (
    prospect?.business_name ??
    `Prospect #${prospectId}`
  );
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString();
}

function formatDuration(duration: number): string {
  if (duration < 60) {
    return `${duration} min`;
  }

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

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

const loading = computed(
  () => callsLoading.value,
);

const error = computed(
  () => callsError.value,
);

onMounted(() => {
  void Promise.all([
    loadCalls(),
    loadProspects(),
  ]);
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
          <SectionHeader width="wide">
            <Eyebrow>
              Sales Activity
            </Eyebrow>

            <Heading level="h1">
              Calls
            </Heading>

            <Text tone="secondary">
              Track conversations, outcomes and activity
              across your sales pipeline.
            </Text>
          </SectionHeader>

          <div class="controls">
            <Input
              v-model="search"
              type="text"
              placeholder="Search calls"
              @update:model-value="resetPage"
            />

            <Button
              variant="primary"
              class="new-call-button"
              @click="openCreateDialog"
            >
              Log call
            </Button>
          </div>

          <Card
            v-if="error"
            variant="outlined"
          >
            <Stack size="medium">
              <Text>
                {{ error }}
              </Text>

              <Button
                variant="secondary"
                @click="loadCalls"
              >
                Try again
              </Button>
            </Stack>
          </Card>

          <Card v-else-if="loading">
            <Stack
              size="medium"
              fullWidth
            >
              <Skeleton variant="heading" />

              <Skeleton
                variant="text"
                width="80%"
              />

              <Skeleton
                variant="text"
                width="65%"
              />

              <Skeleton />
              <Skeleton />
              <Skeleton />
            </Stack>
          </Card>

          <Card
            v-else-if="filteredCalls.length === 0"
          >
            <EmptyState>
              <Heading level="h3">
                No calls found
              </Heading>

              <Text tone="secondary">
                Log a call to start building your
                activity history.
              </Text>

              <template #actions>
                <Button
                  variant="primary"
                  @click="openCreateDialog"
                >
                  Log call
                </Button>
              </template>
            </EmptyState>
          </Card>

          <Card
            v-else
            class="calls-card"
          >
            <Stack
              size="large"
              fullWidth
            >
              <Stack size="small">
                <Text tone="muted">
                  Activity
                </Text>

                <Heading level="h2">
                  Call history
                </Heading>

                <Text tone="secondary">
                  {{ totalItems }}
                  {{ totalItems === 1 ? "call" : "calls" }}
                </Text>
              </Stack>

              <Table
                :columns="columns"
                :rows="currentPageCalls"
                row-key="id"
                sortable
                @row-click="openCall"
              >
                <template #cell-prospect_id="{ value }">
                  <Text>
                    {{ prospectName(Number(value)) }}
                  </Text>
                </template>

                <template #cell-date="{ value }">
                  <Text tone="muted">
                    {{ formatDate(String(value)) }}
                  </Text>
                </template>

                <template #cell-duration="{ value }">
                  <Text>
                    {{ formatDuration(Number(value)) }}
                  </Text>
                </template>

                <template #cell-outcome="{ value }">
                  <Badge
                    :variant="
                      outcomeVariant(String(value))
                    "
                  >
                    {{ String(value) }}
                  </Badge>
                </template>
              </Table>

              <div class="pagination-row">
                <Pagination
                  v-model:current-page="page"
                  :total-items="totalItems"
                  :page-size="pageSize"
                />
              </div>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </Section>

    <Dialog v-model="showCreateDialog">
      <Stack
        size="large"
        fullWidth
      >
        <Stack size="small">
          <Text tone="muted">
            New activity
          </Text>

          <Heading level="h2">
            Log call
          </Heading>

          <Text tone="secondary">
            Record a conversation with a prospect.
          </Text>
        </Stack>

        <Stack
          size="medium"
          fullWidth
        >
          <Select v-model="prospectId">
            <option
              v-for="prospect in prospects"
              :key="prospect.id"
              :value="prospect.id"
            >
              {{ prospect.business_name }}
            </option>
          </Select>

          <Input
            v-model="callDate"
            type="datetime-local"
            placeholder="Date"
          />

          <Input
            v-model="callDuration"
            type="number"
            placeholder="Duration in minutes"
          />

          <Input
            v-model="callOutcome"
            type="text"
            placeholder="Outcome"
          />

          <Input
            v-model="callNotes"
            type="text"
            placeholder="Notes"
          />
        </Stack>

        <ButtonGroup>
          <Button
            variant="secondary"
            @click="closeCreateDialog"
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            @click="saveCall"
          >
            Save call
          </Button>
        </ButtonGroup>
      </Stack>
    </Dialog>

    <Toast
      v-model="showToast"
      variant="success"
      title="Call logged"
    >
      The call has been added to your activity history.
    </Toast>
  </main>
</template>

<style scoped>
.controls {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
}

.new-call-button {
  margin-left: auto;
}

.calls-card {
  width: 100%;
}

.pagination-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  width: 100%;
}

@media (max-width: 56rem) {
  .controls,
  .pagination-row {
    align-items: stretch;
    flex-direction: column;
  }

  .new-call-button {
    margin-left: 0;
  }
}
</style>