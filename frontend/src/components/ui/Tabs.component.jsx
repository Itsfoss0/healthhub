import { useState, createContext, useContext } from 'react';

const TabsContext = createContext({
  selectedTab: '',
  setSelectedTab: () => {}
});

export function Tabs ({ defaultValue, onValueChange, children, ...props }) {
  const [selectedTab, setSelectedTab] = useState(defaultValue || '');

  const handleValueChange = (value) => {
    setSelectedTab(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <TabsContext.Provider
      value={{ selectedTab, setSelectedTab: handleValueChange }}
    >
      <div {...props}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList ({ className, ...props }) {
  return (
    <div
      role='tablist'
      className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${
        className || ''
      }`}
      {...props}
    />
  );
}

export function TabsTrigger ({ className, value, children, ...props }) {
  const { selectedTab, setSelectedTab } = useContext(TabsContext);
  const isActive = selectedTab === value;

  return (
    <button
      role='tab'
      data-state={isActive ? 'active' : 'inactive'}
      onClick={() => setSelectedTab(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm ${
        className || ''
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent ({ className, value, children, ...props }) {
  const { selectedTab } = useContext(TabsContext);
  const isActive = selectedTab === value;

  if (!isActive) return null;

  return (
    <div
      role='tabpanel'
      data-state={isActive ? 'active' : 'inactive'}
      className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 ${
        className || ''
      }`}
      {...props}
    >
      {children}
    </div>
  );
}
