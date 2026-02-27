import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

// Map of tunnels to sets of connected clients: { "tunnelId": Set<ws> }
const tunnels = new Map();

wss.on("connection", (ws) => {
    console.log("Cliente conectado");

    // Track which tunnels this client is in
    ws.activeTunnels = new Set();

    ws.on("message", (rawMessage) => {
        try {
            const msg = JSON.parse(rawMessage);

            // 1. Join a tunnel
            if (msg.type === "join") {
                const tunnelId = msg.tunnel;
                if (!tunnelId) return;

                if (!tunnels.has(tunnelId)) {
                    tunnels.set(tunnelId, new Set());
                }

                tunnels.get(tunnelId).add(ws);
                ws.activeTunnels.add(tunnelId);
                console.log(`Cliente se unió al túnel: ${tunnelId}`);
                return;
            }

            // 2. Broadcast a message to everyone in the tunnel
            if (msg.type === "message") {
                const tunnelId = msg.tunnel;
                if (!tunnelId || !tunnels.has(tunnelId)) return;

                const clientsInTunnel = tunnels.get(tunnelId);

                // Send to everyone in the tunnel EXCEPT the sender
                for (const client of clientsInTunnel) {
                    if (client !== ws && client.readyState === ws.OPEN) {
                        client.send(JSON.stringify({
                            tunnel: tunnelId,
                            data: msg.data
                        }));
                    }
                }
                console.log(`Mensaje enviado al túnel ${tunnelId}: ${msg.data}`);
                return;
            }

        } catch (e) {
            console.log("Mensaje no es JSON válido o hubo un error:", e.message);
        }
    });

    ws.on("close", () => {
        console.log("Cliente desconectado");
        // Remove client from all tunnels they were in
        for (const tunnelId of ws.activeTunnels) {
            if (tunnels.has(tunnelId)) {
                const tunnelSet = tunnels.get(tunnelId);
                tunnelSet.delete(ws);
                // Clean up empty tunnels
                if (tunnelSet.size === 0) {
                    tunnels.delete(tunnelId);
                }
            }
        }
    });
});

export default wss;