const StateSelector = () => {
  return (
    <div className="flex items-center justify-between h-9 relative w-full border border-input bg-transparent rounded-md shadow-sm">
      <select
        className="text-sm w-full px-3 py-1 rounded-md border-none"
        defaultValue="Select a state"
        name="state"
        id="state-selector"
      >
        <option
          value="Select a state"
          disabled
          className="text-muted-foreground"
        >
          Select a state
        </option>
        <option value="NSW">NSW</option>
        <option value="VIC">VIC</option>
        <option value="QLD">QLD</option>
        <option value="ACT">ACT</option>
        <option value="SA">SA</option>
        <option value="WA">WA</option>
        <option value="TAS">TAS</option>
        <option value="NT">NT</option>
      </select>
    </div>
  );
};

export default StateSelector;
