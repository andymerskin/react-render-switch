import { useState } from "react";
import { createRenderSwitch } from "react-render-switch";

type Contact = {
  id: string;
  name: string;
  email: string;
};

const contacts: Contact[] = [
  { id: "1", name: "Ada Lovelace", email: "ada@example.com" },
  { id: "2", name: "Alan Turing", email: "alan@example.com" },
  { id: "3", name: "Grace Hopper", email: "grace@example.com" },
  { id: "4", name: "Katherine Johnson", email: "katherine@example.com" },
  { id: "5", name: "Tim Berners-Lee", email: "tim@example.com" },
  { id: "6", name: "Linus Torvalds", email: "linus@example.com" },
];

function ContactList({
  items,
  onSelect,
}: {
  items: Contact[];
  onSelect: (id: string) => void;
}) {
  if (items.length === 0) {
    return <p>No contacts match your search.</p>;
  }

  return (
    <ul>
      {items.map((contact) => (
        <li key={contact.id}>
          <button type="button" onClick={() => onSelect(contact.id)}>
            {contact.name}
          </button>
        </li>
      ))}
    </ul>
  );
}

function ContactDetail({
  contact,
  onClear,
}: {
  contact: Contact;
  onClear: () => void;
}) {
  return (
    <div>
      <h3>{contact.name}</h3>
      <p>{contact.email}</p>
      <button type="button" onClick={onClear}>
        Back to list
      </button>
    </div>
  );
}

export function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedContact =
    contacts.find((contact) => contact.id === selectedId) ?? null;

  const filteredContacts = contacts.filter((contact) => {
    const needle = query.toLowerCase();
    return (
      contact.name.toLowerCase().includes(needle) ||
      contact.email.toLowerCase().includes(needle)
    );
  });

  const renderState = createRenderSwitch({
    selected: {
      test: selectedId !== null,
      render: () => (
        <ContactDetail
          contact={selectedContact!}
          onClear={() => setSelectedId(null)}
        />
      ),
    },
    searching: {
      test: query.length > 0,
      render: () => (
        <ContactList
          items={filteredContacts}
          onSelect={(id) => setSelectedId(id)}
        />
      ),
    },
    browsing: {
      test: true,
      render: () => (
        <ContactList
          items={contacts}
          onSelect={(id) => setSelectedId(id)}
        />
      ),
    },
  });

  return (
    <div>
      <h1>Contacts</h1>
      <label>
        Search
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter by name or email"
        />
      </label>
      <h2>Rendered state</h2>
      {renderState()}
    </div>
  );
}
