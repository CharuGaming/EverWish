const CUSTOM_CARD = { id: 'custom' };
const storefrontData = {
  templates: [
    { id: 'v1', category: 'valentine', isActive: true, description: 'desc1' },
    { id: 'v4', category: 'valentine', isActive: false, description: 'desc4' }
  ]
};
const activeTab = 'valentine';

const dbTemplates = storefrontData.templates || [];
const categoryTemplates = dbTemplates.filter(t => t.category === activeTab && t.isActive !== false);
const allTemplates = [...categoryTemplates, CUSTOM_CARD];

console.log(allTemplates.map(tpl => ({...tpl, desc: tpl.desc || tpl.description})));
