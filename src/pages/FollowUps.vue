
<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
} from "vue";

import { useFollowUp } from "@/composables/useFollowUp";
import { useProspect } from "@/composables/useProspect";
import {
  getOverdueFollowUps,
  getUpcomingFollowUps,
} from "@/functions";
import type { FollowUp } from "@/types/crm";
import { useRouter } from "vue-router";

const {
  followUps,
  loading,
  error,
  showCreateDialog,
  showToast,
  prospectId,
  dueDate,
  followUpNotes,
  loadFollowUps,
  saveFollowUp,
  openCreateDialog,
  closeCreateDialog,
  toggleFollowUp,
} = useFollowUp();

const {
  prospects,
  loadProspects,
} = useProspect();

const router = useRouter();

const search = ref("");
const statusFilter = ref<
  "all" | "overdue" | "upcoming" | "completed"
>("all");

const page = ref(1);
const pageSize = 10;

const columns = [
  {
    key: "prospect_id",
    label: "Prospect",
    sortable: true,
  },
  {
    key: "due_date",
    label: "Due",
    sortable: true,
  },
  {
    key: "notes",
    label: "Notes",
  },
  {
    key: "completed",
    label: "Status",
    sortable: true,
  },
];

const searchedFollowUps = computed(() => {
  const query = search.value
    .trim()
    .toLowerCase();

  if (!query) {
    return followUps.value;
  }

  return followUps.value.filter(
    (followUp) => {
      const prospect =
        prospects.value.find(
          (item) =>
            item.id ===
            followUp.prospect_id,
        );

      const businessName =
        prospect?.business_name
          ?.toLowerCase() ?? "";

      const contactName =
        prospect?.contact_name
          ?.toLowerCase() ?? "";

      const notes =
        followUp.notes
          ?.toLowerCase() ?? "";

      return (
        businessName.includes(query) ||
        contactName.includes(query) ||
        notes.includes(query)
      );
    },
  );
});

const overdueFollowUps = computed(() =>
  getOverdueFollowUps(
    searchedFollowUps.value,
  ),
);

const upcomingFollowUps = computed(() =>
  getUpcomingFollowUps(
    searchedFollowUps.value,
  ),
);

const completedFollowUps = computed(() =>
  searchedFollowUps.value.filter(
    (followUp) =>
      followUp.completed,
  ),
);

const filteredFollowUps = computed(() => {
  switch (statusFilter.value) {
    case "overdue":
      return overdueFollowUps.value;

    case "upcoming":
      return upcomingFollowUps.value;

    case "completed":
      return completedFollowUps.value;

    case "all":
    default:
      return searchedFollowUps.value;
  }
});

const sortedFollowUps = computed(() => {
  return [...filteredFollowUps.value].sort(
    (a, b) => {
      if (
        a.completed !== b.completed
      ) {
        return a.completed ? 1 : -1;
      }

      return (
        new Date(a.due_date).getTime() -
        new Date(b.due_date).getTime()
      );
    },
  );
});

const totalItems = computed(
  () => sortedFollowUps.value.length,
);

const currentPageFollowUps =
  computed(() => {
    const start =
      (page.value - 1) *
      pageSize;

    return sortedFollowUps.value.slice(
      start,
      start + pageSize,
    );
  });

const overdueCount = computed(
  () => overdueFollowUps.value.length,
);

const upcomingCount = computed(
  () => upcomingFollowUps.value.length,
);

const completedCount = computed(
  () => completedFollowUps.value.length,
);

function resetPage(): void {
  page.value = 1;
}

function openFollowUp(
  followUp: FollowUp,
): void {
  void router.push(
    `/follow-ups/${followUp.id}`,
  );
}

function openProspect(
  prospectId: number,
): void {
  void router.push(
    `/prospects/${prospectId}`,
  );
}

function prospectName(
  id: number,
): string {
  const prospect =
    prospects.value.find(
      (item) => item.id === id,
    );

  return (
    prospect?.business_name ??
    `Prospect #${id}`
  );
}

function formatDate(
  date: string,
): string {
  return new Date(
    date,
  ).toLocaleDateString();
}

function statusVariant(
  followUp: FollowUp,
):
  | "success"
  | "default" {
  return followUp.completed
    ? "success"
    : "default";
}

function isOverdue(
  followUp: FollowUp,
): boolean {
  return (
    !followUp.completed &&
    new Date(
      followUp.due_date,
    ).getTime() < Date.now()
  );
}

onMounted(() => {
  void Promise.all([
    loadFollowUps(),
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
              Follow-ups
            </Heading>

            <Text tone="secondary">
              Stay on top of your next
              conversations and keep
              opportunities moving.
            </Text>
          </SectionHeader>

          <div class="controls">
            <Input
              v-model="search"
              type="text"
              placeholder="Search follow-ups"
              @update:model-value="
                resetPage
              "
            />

            <Select
              v-model="statusFilter"
              @update:model-value="
                resetPage
              "
            >
              <option value="all">
                All follow-ups
              </option>

              <option value="overdue">
                Overdue
              </option>

              <option value="upcoming">
                Upcoming
              </option>

              <option value="completed">
                Completed
              </option>
            </Select>

            <Button
              variant="primary"
              class="new-follow-up-button"
              @click="
                openCreateDialog
              "
            >
              New follow-up
            </Button>
          </div>

          <div class="summary-grid">
            <Card
              class="summary-card"
              @click="
                statusFilter = 'overdue';
                resetPage();
              "
            >
              <Stack size="small">
                <Text tone="muted">
                  Overdue
                </Text>

                <Heading level="h2">
                  {{ overdueCount }}
                </Heading>

                <Text tone="secondary">
                  Needs attention
                </Text>
              </Stack>
            </Card>

            <Card
              class="summary-card"
              @click="
                statusFilter = 'upcoming';
                resetPage();
              "
            >
              <Stack size="small">
                <Text tone="muted">
                  Upcoming
                </Text>

                <Heading level="h2">
                  {{ upcomingCount }}
                </Heading>

                <Text tone="secondary">
                  Still to do
                </Text>
              </Stack>
            </Card>

            <Card
              class="summary-card"
              @click="
                statusFilter = 'completed';
                resetPage();
              "
            >
              <Stack size="small">
                <Text tone="muted">
                  Completed
                </Text>

                <Heading level="h2">
                  {{ completedCount }}
                </Heading>

                <Text tone="secondary">
                  Finished
                </Text>
              </Stack>
            </Card>
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
                @click="
                  loadFollowUps
                "
              >
                Try again
              </Button>
            </Stack>
          </Card>

          <Card
            v-else-if="loading"
          >
            <Stack
              size="medium"
              fullWidth
            >
              <Skeleton
                variant="heading"
              />

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
            v-else-if="
              sortedFollowUps.length ===
              0
            "
          >
            <EmptyState>
              <Heading level="h3">
                No follow-ups found
              </Heading>

              <Text tone="secondary">
                Create a follow-up to
                keep track of your next
                sales conversation.
              </Text>

              <template #actions>
                <Button
                  variant="primary"
                  @click="
                    openCreateDialog
                  "
                >
                  New follow-up
                </Button>
              </template>
            </EmptyState>
          </Card>

          <Card
            v-else
            class="follow-ups-card"
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
                  Follow-up history
                </Heading>

                <Text tone="secondary">
                  {{ totalItems }}
                  {{
                    totalItems === 1
                      ? "follow-up"
                      : "follow-ups"
                  }}
                </Text>
              </Stack>

              <Table
                :columns="columns"
                :rows="
                  currentPageFollowUps
                "
                row-key="id"
                sortable
                @row-click="
                  openFollowUp
                "
              >
                <template
                  #cell-prospect_id="{
                    value,
                  }"
                >
                  <Button
                    variant="ghost"
                    @click.stop="
                      openProspect(
                        Number(value),
                      )
                    "
                  >
                    {{
                      prospectName(
                        Number(value),
                      )
                    }}
                  </Button>
                </template>

                <template
                  #cell-due_date="{
                    row,
                    value,
                  }"
                >
                  <Text
                    :tone="
                      isOverdue(row)
                        ? 'secondary'
                        : 'muted'
                    "
                  >
                    {{
                      formatDate(
                        String(value),
                      )
                    }}
                  </Text>
                </template>

                <template
                  #cell-notes="{
                    value,
                  }"
                >
                  <Text>
                    {{
                      String(value)
                    }}
                  </Text>
                </template>

                <template
                  #cell-completed="{
                    row,
                  }"
                >
                  <Button
                    variant="ghost"
                    @click.stop="
                      toggleFollowUp(row)
                    "
                  >
                    <Badge
                      :variant="
                        statusVariant(
                          row,
                        )
                      "
                    >
                      {{
                        row.completed
                          ? "Completed"
                          : "Pending"
                      }}
                    </Badge>
                  </Button>
                </template>
              </Table>

              <div
                class="pagination-row"
              >
                <Pagination
                  v-model:current-page="
                    page
                  "
                  :total-items="
                    totalItems
                  "
                  :page-size="
                    pageSize
                  "
                />
              </div>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </Section>

    <Dialog
      v-model="showCreateDialog"
    >
      <Stack
        size="large"
        fullWidth
      >
        <Stack size="small">
          <Text tone="muted">
            New activity
          </Text>

          <Heading level="h2">
            New follow-up
          </Heading>

          <Text tone="secondary">
            Schedule the next action
            for a prospect.
          </Text>
        </Stack>

        <Stack
          size="medium"
          fullWidth
        >
          <Select
            v-model="prospectId"
          >
            <option
              value=""
              disabled
            >
              Select prospect
            </option>

            <option
              v-for="prospect in prospects"
              :key="prospect.id"
              :value="prospect.id"
            >
              {{
                prospect.business_name
              }}
            </option>
          </Select>

          <Input
            v-model="dueDate"
            type="datetime-local"
            placeholder="Due date"
          />

          <Input
            v-model="followUpNotes"
            type="text"
            placeholder="Notes"
          />
        </Stack>

        <ButtonGroup>
          <Button
            variant="secondary"
            @click="
              closeCreateDialog
            "
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            @click="saveFollowUp"
          >
            Create follow-up
          </Button>
        </ButtonGroup>
      </Stack>
    </Dialog>

    <Toast
      v-model="showToast"
      variant="success"
      title="Follow-up created"
    >
      The follow-up has been added
      to your sales activity.
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

.new-follow-up-button {
  margin-left: auto;
}

.summary-grid {
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
  width: 100%;
}

.summary-card {
  cursor: pointer;
}

.follow-ups-card {
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
  .controls {
    align-items: stretch;
    flex-direction: column;
  }

  .new-follow-up-button {
    margin-left: 0;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .pagination-row {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>

