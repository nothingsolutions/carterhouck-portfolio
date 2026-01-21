import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.NEXT_PUBLIC_TINA_BRANCH || "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  schema: {
    collections: [
      {
        label: "Projects",
        name: "projects",
        path: "data",
        format: "json",
        ui: {
          router: () => "/",
          filename: {
            readonly: true,
            slugify: () => "projects",
          },
        },
        fields: [
          {
            type: "object",
            label: "Projects List",
            name: "projects",
            list: true,
            ui: {
              itemProps: (item: any) => {
                return { label: item?.item || `Project ${item?.id || ""}` };
              },
            },
            fields: [
              {
                type: "string",
                label: "ID",
                name: "id",
                required: true,
              },
              {
                type: "string",
                label: "Item",
                name: "item",
                required: true,
              },
              {
                type: "string",
                label: "Client",
                name: "client",
              },
              {
                type: "string",
                label: "Category",
                name: "category",
              },
              {
                type: "string",
                label: "Role",
                name: "role",
              },
              {
                type: "string",
                label: "Date",
                name: "date",
              },
              {
                type: "string",
                label: "Program",
                name: "program",
              },
              {
                type: "string",
                label: "Supplier",
                name: "supplier",
              },
              {
                type: "string",
                label: "Notes",
                name: "notes",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                label: "Status",
                name: "status",
                options: ["Complete", "In Progress", "Archived", "Public"],
              },
              {
                type: "string",
                label: "Images",
                name: "images",
                list: true,
              },
            ],
          },
        ],
      },
    ],
  },
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "public",
      publicFolder: "public",
    },
  },
});

