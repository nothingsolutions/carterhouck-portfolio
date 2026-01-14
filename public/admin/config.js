window.CMS_MANUAL_INIT = true;

const config = {
  backend: {
    name: 'github',
    repo: 'nothingsolutions/carterhouck-portfolio',
    branch: 'main',
  },
  media_folder: 'public/uploads',
  public_folder: '/uploads',
  collections: [
    {
      name: 'projects',
      label: 'Projects',
      folder: 'content/projects',
      create: true,
      slug: '{{slug}}',
      editor: {
        preview: false,
      },
      fields: [
        { label: 'ID', name: 'id', widget: 'string', hint: 'Unique project ID' },
        { label: 'Title', name: 'item', widget: 'string' },
        { label: 'Client', name: 'client', widget: 'string', required: false },
        { label: 'Category', name: 'category', widget: 'string', required: false, hint: 'e.g., Event Flyers, Physical Goods, Website' },
        { label: 'Role', name: 'role', widget: 'string', required: false, hint: 'e.g., Graphic Design, Project Management' },
        { label: 'Date', name: 'date', widget: 'string', required: false, hint: 'Format: MM.YYYY or YYYY' },
        { label: 'Program', name: 'program', widget: 'string', required: false, hint: 'Software or tools used' },
        { label: 'Supplier', name: 'supplier', widget: 'string', required: false },
        { label: 'Status', name: 'status', widget: 'select', options: ['Public', 'Featured 1', 'Featured 2', 'Featured 3', 'Login Required', 'Archived'], default: 'Public' },
        { label: 'Notes', name: 'notes', widget: 'text', required: false },
        { label: 'Images', name: 'images', widget: 'list', field: { label: 'Image', name: 'image', widget: 'image' }, required: false },
      ],
    },
  ],
};

// Initialize CMS with config
window.CMS_CONFIG = config;

