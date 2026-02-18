import React, { useState } from "react";
import "../styles/AgentPage.css"; // Separate CSS file

export default function AgentPage() {
  const [agents, setAgents] = useState([
    { id: 1, name: "Alice Smith", role: "Mentor", status: "Active" },
    { id: 2, name: "Bob Johnson", role: "Support", status: "Inactive" },
  ]);

  const [newAgent, setNewAgent] = useState({ name: "", role: "", status: "Active" });

  const handleAdd = () => {
    if (!newAgent.name || !newAgent.role) return;
    setAgents([...agents, { ...newAgent, id: Date.now() }]);
    setNewAgent({ name: "", role: "", status: "Active" });
  };

  const handleDelete = (id) => {
    setAgents(agents.filter((agent) => agent.id !== id));
  };

  return (
    <div className="agent-page-wrapper">
      <h2>Agents</h2>

      {/* Add Agent Form */}
      <div className="agent-page-form">
        <input
          type="text"
          placeholder="Agent Name"
          value={newAgent.name}
          onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Role"
          value={newAgent.role}
          onChange={(e) => setNewAgent({ ...newAgent, role: e.target.value })}
        />
        <select
          value={newAgent.status}
          onChange={(e) => setNewAgent({ ...newAgent, status: e.target.value })}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button onClick={handleAdd}>+ Add</button>
      </div>

      {/* Agents List */}
      <div className="agent-page-list">
        {agents.map((agent) => (
          <div key={agent.id} className="agent-page-card">
            <div>
              <h4>{agent.name}</h4>
              <p className="agent-page-role">{agent.role}</p>
            </div>
            <div className="agent-page-action">
              <span className={`agent-page-status ${agent.status.toLowerCase()}`}>
                {agent.status}
              </span>
              <button
                className="agent-page-delete-btn"
                onClick={() => handleDelete(agent.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
