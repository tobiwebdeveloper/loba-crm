
<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
} from "vue";
import { useRouter } from "vue-router";
import {
  getProspects,
  getCalls,
  getFollowUps,
} from "@/lib/api";
import type {
  Prospect,
  Call,
  FollowUp,
} from "@/types/crm";
import {
  getUpcomingFollowUps,
  getOverdueFollowUps,
} from "@/functions/followUps";

const router = useRouter();

const prospects = ref<Prospect[]>([]);
const calls = ref<Call[]>([]);
const followUps = ref<FollowUp[]>([]);

const loading = ref(true);
const error = ref("");

async function loadDashboard(): Promise<void> {
  loading.value = true;
  error.value = "";

  try {
    const [
      loadedProspects,
      loadedCalls,
      loadedFollowUps,
    ] = await Promise.all([
      getProspects(),
      getCalls(),
      getFollowUps(),
    ]);

    prospects.value = loadedProspects;
    calls.value = loadedCalls;
    followUps.value = loadedFollowUps;
  } catch (err) {
    console.error(err);
    error.value = "Failed to load dashboard.";
  } finally {
    loading.value = false;
  }
}

const activeProspects = computed(() =>
  prospects.value.filter(
    (prospect) =>
      prospect.status !== "won" &&
      prospect.status !== "lost",
  ),
);

const pipelineValue = computed(() =>
  activeProspects.value.reduce(
    (total, prospect) =>
      total + Number(prospect.value || 0),
    0,
  ),
);

const wonValue = computed(() =>
  prospects.value
    .filter(
      (prospect) =>
        prospect.status === "won",
    )
    .reduce(
      (total, prospect) =>
        total + Number(prospect.value || 0),
      0,
    ),
);

const upcomingFollowUps = computed(() =>
  getUpcomingFollowUps(followUps.value),
);

const overdueFollowUps = computed(() =>
  getOverdueFollowUps(followUps.value),
);

const todayFollowUps = computed(() => {
  const now = new Date();

  return upcomingFollowUps.value.filter(
    (followUp) => {
      const date = new Date(
        followUp.due_date,
      );

      return (
        date.getFullYear() ===
          now.getFullYear() &&
        date.getMonth() ===
          now.getMonth() &&
        date.getDate() ===
          now.getDate()
      );
    },
  );
});

const recentProspects = computed(() =>
  [...prospects.value]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime(),
    )
    .slice(0, 5),
);

const recentCalls = computed(() =>
  [...calls.value]
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime(),
    )
    .slice(0, 5),
);

function openProspect(id: number): void {
  void router.push(`/prospects/${id}`);
}

function openProspects(): void {
  void router.push("/prospects");
}

function openCalls(): void {
  void router.push("/calls");
}

function openFollowUps(): void {
  void router.push("/follow-ups");
}

function formatCurrency(value: number): string {
  return `£${value.toLocaleString()}`;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString();
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

function statusVariant(
  status: Prospect["status"],
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

onMounted(() => {
  void loadDashboard();
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
              Dashboard
            </Heading>

            <Text tone="secondary">
              Your sales pipeline at a glance.
            </Text>
          </SectionHeader>

          <!-- Loading -->
          <Card v-if="loading">
            <Stack
              size="large"
              fullWidth
            >
              <Stack size="small">
                <Skeleton
                  variant="heading"
                  width="35%"
                />

                <Skeleton
                  variant="text"
                  width="50%"
                />
              </Stack>

              <Grid
                :columns="4"
                size="medium"
              >
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </Grid>

              <Divider />

              <Grid
                :columns="2"
                size="large"
              >
                <Skeleton />
                <Skeleton />
              </Grid>
            </Stack>
          </Card>

          <!-- Error -->
          <Card v-else-if="error">
            <Stack size="medium">
              <Stack size="small">
                <Heading level="h3">
                  Something went wrong
                </Heading>

                <Text tone="secondary">
                  {{ error }}
                </Text>
              </Stack>

              <Button
                variant="secondary"
                @click="loadDashboard"
              >
                Try again
              </Button>
            </Stack>
          </Card>

          <template v-else>
            <!-- Overview -->
            <Card>
              <Stack
                size="large"
                fullWidth
              >
                <Stack size="small">
                  <Text tone="muted">
                    Overview
                  </Text>

                  <Heading level="h2">
                    Pipeline performance
                  </Heading>

                  <Text tone="secondary">
                    A snapshot of your current sales activity.
                  </Text>
                </Stack>

                <Divider />

                <Grid
                class="workspace-grid"
                  :columns="4"
                  size="medium"
                >
                  <Stack size="small">
                    <Text tone="muted">
                      Prospects
                    </Text>

                    <Heading level="h2">
                      {{ prospects.length }}
                    </Heading>

                    <Text tone="secondary">
                      Total records
                    </Text>
                  </Stack>

                  <Stack size="small">
                    <Text tone="muted">
                      Pipeline value
                    </Text>

                    <Heading level="h2">
                      {{ formatCurrency(pipelineValue) }}
                    </Heading>

                    <Text tone="secondary">
                      Active opportunities
                    </Text>
                  </Stack>

                  <Stack size="small">
                    <Text tone="muted">
                      Follow-ups
                    </Text>

                    <Heading level="h2">
                      {{ upcomingFollowUps.length }}
                    </Heading>

                    <Text tone="secondary">
                      Upcoming actions
                    </Text>
                  </Stack>

                  <Stack size="small">
                    <Text tone="muted">
                      Won value
                    </Text>

                    <Heading level="h2">
                      {{ formatCurrency(wonValue) }}
                    </Heading>

                    <Text tone="secondary">
                      Closed opportunities
                    </Text>
                  </Stack>
                </Grid>
              </Stack>
            </Card>

            <!-- Attention -->
            <Grid class="workspace-grid"
              :columns="2"
              size="large"
            >
              <Card>
                <Stack
                  size="large"
                  fullWidth
                >
                  <Stack size="small">
                    <Eyebrow>
                      Attention
                    </Eyebrow>

                    <Heading level="h3">
                      Needs attention
                    </Heading>

                    <Text tone="secondary">
                      Follow-ups that need action.
                    </Text>
                  </Stack>

                  <Divider />

                  <Stack
                    v-if="overdueFollowUps.length"
                    size="small"
                    fullWidth
                  >
                    <Button
                      v-for="followUp in overdueFollowUps.slice(
                        0,
                        5,
                      )"
                      :key="followUp.id"
                      variant="ghost"
                      class="activity-row"
                      @click="
                        openProspect(
                          followUp.prospect_id,
                        )
                      "
                    >
                      <span>
                        {{ prospectName(
                          followUp.prospect_id,
                        ) }}
                      </span>

                      <Text tone="muted">
                        Overdue ·
                        {{ formatDate(
                          followUp.due_date,
                        ) }}
                      </Text>
                    </Button>
                  </Stack>

                  <Text
                    v-else
                    tone="secondary"
                  >
                    Nothing overdue.
                  </Text>

                  <Divider />

                  <Button
                    variant="secondary"
                    @click="openFollowUps"
                  >
                    View follow-ups
                  </Button>
                </Stack>
              </Card>

              <Card>
                <Stack
                  size="large"
                  fullWidth
                >
                  <Stack size="small">
                    <Eyebrow>
                      Today
                    </Eyebrow>

                    <Heading level="h3">
                      Today's activity
                    </Heading>

                    <Text tone="secondary">
                      Follow-ups due today.
                    </Text>
                  </Stack>

                  <Divider />

                  <Stack size="small">
                    <Text tone="muted">
                      Due today
                    </Text>

                    <Heading level="h2">
                      {{ todayFollowUps.length }}
                    </Heading>
                  </Stack>

                  <Text
                    v-if="todayFollowUps.length"
                    tone="secondary"
                  >
                    You have
                    {{ todayFollowUps.length }}
                    follow-up{{ todayFollowUps.length === 1 ? "" : "s" }}
                    to work through today.
                  </Text>

                  <Text
                    v-else
                    tone="secondary"
                  >
                    You're clear for today.
                  </Text>

                  <Divider />

                  <Button
                    variant="secondary"
                    @click="openFollowUps"
                  >
                    View follow-ups
                  </Button>
                </Stack>
              </Card>
            </Grid>

            <!-- Recent activity -->
            <Grid class="workspace-grid"
              :columns="2"
              size="large"
            >
              <!-- Recent prospects -->
              <Card>
                <Stack
                  size="large"
                  fullWidth
                >
                  <Stack size="small">
                    <Eyebrow>
                      Pipeline
                    </Eyebrow>

                    <Heading level="h3">
                      Recent prospects
                    </Heading>

                    <Text tone="secondary">
                      Your newest opportunities.
                    </Text>
                  </Stack>

                  <Divider />

                  <Stack
                    v-if="recentProspects.length"
                    size="small"
                    fullWidth
                  >
                    <Button
                      v-for="prospect in recentProspects"
                      :key="prospect.id"
                      variant="ghost"
                      class="activity-row"
                      @click="
                        openProspect(prospect.id)
                      "
                    >
                      <span>
                        {{ prospect.business_name }}
                      </span>

                      <Badge
                        :variant="
                          statusVariant(prospect.status)
                        "
                      >
                        {{ prospect.status }}
                      </Badge>
                    </Button>
                  </Stack>

                  <EmptyState
                    v-else
                    title="No prospects yet"
                    description="Add your first prospect to start building the pipeline."
                  />

                  <Divider />

                  <Button
                    variant="secondary"
                    @click="openProspects"
                  >
                    View all prospects
                  </Button>
                </Stack>
              </Card>

              <!-- Recent calls -->
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
                      Recent calls
                    </Heading>

                    <Text tone="secondary">
                      Your latest sales activity.
                    </Text>
                  </Stack>

                  <Divider />

                  <Stack
                    v-if="recentCalls.length"
                    size="small"
                    fullWidth
                  >
                    <Button
                      v-for="call in recentCalls"
                      :key="call.id"
                      variant="ghost"
                      class="activity-row"
                      @click="
                        router.push(
                          `/calls/${call.id}`,
                        )
                      "
                    >
                      <Stack
                        size="small"
                        class="activity-main"
                      >
                        <Text>
                          {{ prospectName(
                            call.prospect_id,
                          ) }}
                        </Text>

                        <Text tone="muted">
                          {{ formatDate(call.date) }}
                          ·
                          {{ call.duration }} min
                        </Text>
                      </Stack>

                      <Badge
                        :variant="
                          outcomeVariant(call.outcome)
                        "
                      >
                        {{ call.outcome }}
                      </Badge>
                    </Button>
                  </Stack>

                  <Text
                    v-else
                    tone="secondary"
                  >
                    No calls recorded yet.
                  </Text>

                  <Divider />

                  <Button
                    variant="secondary"
                    @click="openCalls"
                  >
                    View calls
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </template>
        </Stack>
      </Container>
    </Section>
  </main>
</template>

<style scoped>
.activity-row {
  width: 100%;
  justify-content: space-between;
  text-align: left;
}

.activity-main {
  align-items: flex-start;
}

@media (max-width: 56rem) {
  .activity-row {
    align-items: flex-start;
    gap: var(--space-3);
  }
}
</style>

