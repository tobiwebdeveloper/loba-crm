
<script setup lang="ts">
import {
  computed,
  ref
} from "vue";
import { useAppearance } from "@/composables/useAppearance";

const {
  appearance,
  setAppearance,
} = useAppearance();



const showDeleteDialog = ref(false);
const deleteConfirmation = ref("");
const deleteError = ref("");
const exporting = ref(false);
const deleting = ref(false);

const canDelete = computed(
  () =>
    deleteConfirmation.value === "DELETE",
);




function openDeleteDialog(): void {
  deleteConfirmation.value = "";
  deleteError.value = "";
  showDeleteDialog.value = true;
}

function closeDeleteDialog(): void {
  if (deleting.value) {
    return;
  }

  showDeleteDialog.value = false;
  deleteConfirmation.value = "";
  deleteError.value = "";
}

async function exportData(
  format: "json" | "csv",
): Promise<void> {
  exporting.value = true;

  try {
    const response = await fetch(
      `/api/crm/export?format=${format}`,
    );

    if (!response.ok) {
      throw new Error(
        "Failed to export CRM data.",
      );
    }

    const blob = await response.blob();

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download =
      format === "json"
        ? "loba-crm-export.json"
        : "loba-crm-export.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
  } finally {
    exporting.value = false;
  }
}

async function deleteAllData(): Promise<void> {
  if (!canDelete.value) {
    return;
  }

  deleting.value = true;
  deleteError.value = "";

  try {
    const response = await fetch(
      "/api/crm/data",
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      throw new Error(
        "Failed to delete CRM data.",
      );
    }

    closeDeleteDialog();
  } catch (error) {
    console.error(error);

    deleteError.value =
      "Failed to delete CRM data.";
  } finally {
    deleting.value = false;
  }
}

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
              Workspace
            </Eyebrow>

            <Heading level="h1">
              Settings
            </Heading>

            <Text tone="secondary">
              Manage your CRM preferences
              and data.
            </Text>
          </SectionHeader>

          <!-- Appearance -->
          <Stack
            size="large"
            fullWidth
          >
            <Stack size="small">
              <Heading level="h2">
                Appearance
              </Heading>

              <Text tone="secondary">
                Choose how the CRM looks on
                this device.
              </Text>
            </Stack>

            <Divider />

            <Stack
              size="medium"
              fullWidth
            >
              <Stack size="small">
                <Label for="appearance">
                  Theme
                </Label>

                <Select
                :model-value="appearance"
                @update:model-value="
                    setAppearance($event)
                "
                >
                <option value="system">
                    System
                </option>

                <option value="light">
                    Light
                </option>

                <option value="dark">
                    Dark
                </option>
                </Select>
              </Stack>
            </Stack>
          </Stack>

          <!-- Data -->
          <Stack
            size="large"
            fullWidth
          >
            <Stack size="small">
              <Heading level="h2">
                Data
              </Heading>

              <Text tone="secondary">
                Export or permanently remove
                your CRM data.
              </Text>
            </Stack>

            <Divider />

            <Stack
              size="medium"
              fullWidth
            >
              <Stack size="small">
                <Heading level="h3">
                  Export CRM data
                </Heading>

                <Text tone="secondary">
                  Download your CRM records
                  for backup or use elsewhere.
                </Text>
              </Stack>

              <ButtonGroup>
                <Button
                  variant="secondary"
                  :disabled="exporting"
                  @click="exportData('json')"
                >
                  Export JSON
                </Button>

                <Button
                  variant="secondary"
                  :disabled="exporting"
                  @click="exportData('csv')"
                >
                  Export CSV
                </Button>
              </ButtonGroup>
            </Stack>

            <Divider />

            <Stack
              size="medium"
              fullWidth
            >
              <Stack size="small">
                <Heading level="h3">
                  Delete CRM data
                </Heading>

                <Text tone="secondary">
                  Permanently remove your
                  prospects, calls and
                  follow-ups.
                </Text>
              </Stack>

              <Button
                variant="destructive"
                @click="openDeleteDialog"
              >
                Delete all CRM data
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Section>

    <!-- Delete confirmation -->
    <Dialog
      v-model="showDeleteDialog"
    >
      <Stack
        size="large"
        fullWidth
      >
        <Stack size="small">
          <Text tone="muted">
            Destructive action
          </Text>

          <Heading level="h2">
            Delete all CRM data
          </Heading>

          <Text tone="secondary">
            This permanently removes your
            prospects, calls and follow-ups.
            This action cannot be undone.
          </Text>
        </Stack>

        <Divider />

        <Stack
          size="medium"
          fullWidth
        >
          <Stack size="small">
            <Label
              for="delete-confirmation"
              required
            >
              Type DELETE to confirm
            </Label>

            <Input
              id="delete-confirmation"
              v-model="deleteConfirmation"
              type="text"
              placeholder="DELETE"
              autocomplete="off"
            />
          </Stack>

          <Text
            v-if="deleteError"
            tone="secondary"
          >
            {{ deleteError }}
          </Text>
        </Stack>

        <Divider />

        <ButtonGroup>
          <Button
            variant="secondary"
            :disabled="deleting"
            @click="closeDeleteDialog"
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            :disabled="
              !canDelete || deleting
            "
            @click="deleteAllData"
          >
            {{
              deleting
                ? "Deleting..."
                : "Delete everything"
            }}
          </Button>
        </ButtonGroup>
      </Stack>
    </Dialog>
  </main>
</template>

<style scoped>
</style>

