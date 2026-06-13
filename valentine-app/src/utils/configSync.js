export const exportConfig = async (sectionKey, data) => {
  try {
    const configStr = JSON.stringify({ section: sectionKey, data }, null, 2);
    await navigator.clipboard.writeText(configStr);
    window.alert(`Section config copied to clipboard!`);
  } catch (err) {
    window.alert("Failed to copy configuration.");
  }
};

export const importConfig = async (sectionKey, updateFn) => {
  try {
    const text = await navigator.clipboard.readText();
    const parsed = JSON.parse(text);
    if (parsed && parsed.section === sectionKey && parsed.data) {
      updateFn(parsed.data);
      window.alert("Config imported successfully!");
    } else {
      window.alert("Invalid configuration data.");
    }
  } catch (err) {
    window.alert("Failed to read or parse clipboard data.");
  }
};
