<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { useProspect } from "@/composables/useProspect";

import {
  filterProspectsByStatus,
  searchProspects,
  sortProspectsByDate,
  sortProspectsByName,
  sortProspectsByValue,
} from "@/functions";

import type { ProspectStatus } from "@/types/crm";

import { useRouter } from "vue-router";

const {
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
  openCreateDialog,
  closeCreateDialog,
} = useProspect();

const search = ref("");
const statusFilter = ref<ProspectStatus | "">("");
const sortBy = ref<"newest" | "name" | "value">("newest");

const page = ref(1);
const pageSize = 10;

const columns = [
  {
    key: "contact_name",
    label: "Contact",
    sortable: true,
  },
  {
    key: "business_name",
    label: "Business",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },
  {
    key: "value",
    label: "Value",
    sortable: true,
    align: "end" as const,
  },
  {
    key: "created_at",
    label: "Created",
    sortable: true,
  },
];

const filteredProspects = computed(() => {
  let result = searchProspects(
    prospects.value,
    search.value,
  );

  if (statusFilter.value !== "") {
    result = filterProspectsByStatus(
      result,
      statusFilter.value,
    );
  }

  switch (sortBy.value) {
    case "name":
      return sortProspectsByName(result);

    case "value":
      return sortProspectsByValue(result);

    case "newest":
    default:
      return sortProspectsByDate(result);
  }
});

const totalItems = computed(
  () => filteredProspects.value.length,
);

const currentPageProspects = computed(() => {
  const start = (page.value - 1) * pageSize;

  return filteredProspects.value.slice(
    start,
    start + pageSize,
  );
});

function resetPage(): void {
  page.value = 1;
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

    case "new":
    case "contacted":
    case "lost":
    default:
      return "default";
  }
}

const router = useRouter();

function openProspect(
  prospect: { id: number },
): void {
  console.log("CLICKED PROSPECT:", prospect);
  console.log("ID:", prospect.id);

  void router.push(
    `/prospects/${prospect.id}`,
  );
}

onMounted(() => {
  void loadProspects();
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
              Sales Pipeline
            </Eyebrow>

            <Heading level="h1">
              Prospects
            </Heading>

            <Text tone="secondary">
              Manage your prospects, track opportunities and
              keep your pipeline moving.
            </Text>
          </SectionHeader>

          <div class="controls">
            <Input
              v-model="search"
              type="text"
              placeholder="Search prospects"
            />

            <Select
              v-model="statusFilter"
              @update:model-value="resetPage"
            >
              <option value="">
                All statuses
              </option>

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

            <Select
              v-model="sortBy"
              @update:model-value="resetPage"
            >
              <option value="newest">
                Newest
              </option>

              <option value="name">
                Business name
              </option>

              <option value="value">
                Highest value
              </option>
            </Select>

            <Button
              variant="primary"
              class="new-prospect-button"
              @click="openCreateDialog"
            >
              New prospect
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
                @click="loadProspects"
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
            v-else-if="filteredProspects.length === 0"
          >
            <EmptyState>
              <Heading level="h3">
                No prospects found
              </Heading>

              <Text tone="secondary">
                Try changing your search or filters, or create
                a new prospect.
              </Text>

              <template #actions>
                <Button
                  variant="primary"
                  @click="openCreateDialog"
                >
                  New prospect
                </Button>
              </template>
            </EmptyState>
          </Card>

          <Card
            v-else
            class="prospects-card"
          >
            <Stack
              size="large"
              fullWidth
            >
              <div class="section-row">
                <Stack size="small">
                  <Text tone="muted">
                    Pipeline
                  </Text>

                  <Heading level="h2">
                    All prospects
                  </Heading>

                  <Text tone="secondary">
                    {{ totalItems }}
                    {{ totalItems === 1 ? "prospect" : "prospects" }}
                  </Text>
                </Stack>
              </div>

              <div class="table-wrapper">
                <Table
                  :columns="columns"
                  :rows="currentPageProspects"
                  row-key="id"
                  sortable
                  @row-click="openProspect"
                >
                  <template #cell-contact_name="{ value }">
                    <Text>
                      {{ String(value) }}
                    </Text>
                  </template>

                  <template #cell-business_name="{ value }">
                    <Text>
                      {{ String(value) }}
                    </Text>
                  </template>

                  <template #cell-status="{ value }">
                    <Badge
                      :variant="
                        statusVariant(value as ProspectStatus)
                      "
                    >
                      {{ String(value) }}
                    </Badge>
                  </template>

                  <template #cell-value="{ value }">
                    <Text>
                      £{{ Number(value).toLocaleString() }}
                    </Text>
                  </template>

                  <template #cell-created_at="{ value }">
                    <Text tone="muted">
                      {{
                        new Date(
                          String(value),
                        ).toLocaleDateString()
                      }}
                    </Text>
                  </template>
                </Table>
              </div>

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
            New record
          </Text>

          <Heading level="h2">
            Add prospect
          </Heading>

          <Text tone="secondary">
            Create a new opportunity in your sales pipeline.
          </Text>
        </Stack>

        <Stack
          size="medium"
          fullWidth
        >
          <Input
            v-model="prospectName"
            type="text"
            placeholder="Contact name"
          />

          <Input
            v-model="prospectCompany"
            type="text"
            placeholder="Business name"
          />

          <Input
            v-model="prospectEmail"
            type="email"
            placeholder="Email"
          />

          <Input
            v-model="prospectPhone"
            type="tel"
            placeholder="Phone"
          />

          <Input
            v-model="prospectWebsite"
            type="url"
            placeholder="Website"
          />

          <Input
            v-model="prospectValue"
            type="number"
            placeholder="Opportunity value"
          />

          <Select v-model="prospectStatus">
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

          <Input
            v-model="prospectNotes"
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
            @click="saveProspect"
          >
            Create prospect
          </Button>
        </ButtonGroup>
      </Stack>
    </Dialog>

    <Toast
      v-model="showToast"
      variant="success"
      title="Prospect created"
    >
      The prospect has been added to your pipeline.
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

.new-prospect-button {
  margin-left: auto;
}

.prospects-card {
  width: 100%;
}

.section-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-8);
  width: 100%;
}

.pagination-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  width: 100%;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Tablet */
@media (max-width: 56rem) {
  .controls {
    align-items: stretch;
    flex-direction: column;
  }

  .controls > * {
    width: 100%;
  }

  .new-prospect-button {
    margin-left: 0;
  }

  .pagination-row {
    align-items: stretch;
    flex-direction: column;
  }
}

/* Mobile */
@media (max-width: 40rem) {
  .section-row {
    gap: var(--space-4);
  }

  .prospects-card {
    width: 100%;
  }

  .table-wrapper {
    margin-inline: calc(var(--space-4) * -1);
    width: calc(100% + (var(--space-4) * 2));
    padding-inline: var(--space-4);
  }

  .pagination-row {
    gap: var(--space-4);
  }
}
</style>