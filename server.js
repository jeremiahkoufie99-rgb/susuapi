import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let groups = [{ id: 1, name: "Family Circle", amount: 100 }];
let members = [
    { id: 1, groupId: 1, name: "Ama", status: "paid" },
    { id: 2, groupId: 1, name: "Kofi", status: "pending" },
];
let contributions = [
    { id: 1, groupId: 1, memberId: 1, amount: 100, date: "2026-11-01" },
];
let nextId = { groups: 2, members: 3, contributions: 2 };

const valid = (s) => typeof s === "string" && s.trim() !== "";

// GROUPS
app.get("/groups", (req, res) => res.json(groups));

app.get("/groups/:id", (req, res) => {
    const g = groups.find((x) => x.id === Number(req.params.id));
    if (!g) return res.status(404).json({ error: "Group not found" });
    res.json(g);
});

app.post("/groups", (req, res) => {
    const { name, amount } = req.body;
    if (!valid(name)) return res.status(400).json({ error: "Name required" });
    if (!(Number(amount) > 0))
        return res.status(400).json({ error: "Amount must be greater than 0" });
    const g = { id: nextId.groups++, name, amount: Number(amount) };
    groups.push(g);
    res.status(201).json(g);
});

app.delete("/groups/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!groups.some((g) => g.id === id))
        return res.status(404).json({ error: "Group not found" });
    groups = groups.filter((g) => g.id !== id);
    members = members.filter((m) => m.groupId !== id);
    contributions = contributions.filter((c) => c.groupId !== id);
    res.status(204).send();
});

// MEMBERS
app.get("/members", (req, res) => {
    const { groupId } = req.query;
    res.json(groupId ? members.filter((m) => m.groupId === Number(groupId)) : members);
});

app.post("/members", (req, res) => {
    const { name, groupId } = req.body;
    if (!valid(name)) return res.status(400).json({ error: "Name required" });
    if (!groups.some((g) => g.id === Number(groupId)))
        return res.status(404).json({ error: "Group not found" });
    const m = { id: nextId.members++, groupId: Number(groupId), name, status: "pending" };
    members.push(m);
    res.status(201).json(m);
});

app.patch("/members/:id", (req, res) => {
    const m = members.find((x) => x.id === Number(req.params.id));
    if (!m) return res.status(404).json({ error: "Member not found" });
    const { status } = req.body;
    if (status !== "paid" && status !== "pending")
        return res.status(400).json({ error: "Status must be paid or pending" });
    m.status = status;
    res.json(m);
});

app.delete("/members/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!members.some((m) => m.id === id))
        return res.status(404).json({ error: "Member not found" });
    members = members.filter((m) => m.id !== id);
    res.status(204).send();
});

// CONTRIBUTIONS
app.get("/contributions", (req, res) => {
    const { groupId } = req.query;
    res.json(
        groupId ? contributions.filter((c) => c.groupId === Number(groupId)) : contributions
    );
});

app.post("/contributions", (req, res) => {
    const { groupId, memberId, amount } = req.body;
    if (!(Number(amount) > 0))
        return res.status(400).json({ error: "Amount must be greater than 0" });
    if (!groups.some((g) => g.id === Number(groupId)))
        return res.status(404).json({ error: "Group not found" });
    if (!members.some((m) => m.id === Number(memberId)))
        return res.status(404).json({ error: "Member not found" });
    const c = {
        id: nextId.contributions++,
        groupId: Number(groupId),
        memberId: Number(memberId),
        amount: Number(amount),
        date: new Date().toISOString().slice(0, 10),
    };
    contributions.push(c);
    res.status(201).json(c);
});

app.listen(5000, () => console.log("Susu Circle API running on port 5000"));