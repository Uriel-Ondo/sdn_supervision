function loadSwitches() {
    fetch('/api/switches')
        .then(res => res.json())
        .then(data => {
            const sel = document.getElementById('switchSelect');
            sel.innerHTML = '';
            data.forEach(dpid => {
                const opt = document.createElement('option');
                opt.value = dpid;
                opt.textContent = dpid;
                sel.appendChild(opt);
            });
            if (data.length > 0) fetchPorts();
        });
}

function fetchPorts() {
    const dpid = document.getElementById('switchSelect').value;
    fetch(`/api/ports/${dpid}`)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('portData');
            tbody.innerHTML = '';
            data.forEach(port => {
                const row = tbody.insertRow();
                row.insertCell().textContent = port.port_no;
                row.insertCell().textContent = port.rx_packets;
                row.insertCell().textContent = port.tx_packets;
                row.insertCell().textContent = port.rx_bytes;
                row.insertCell().textContent = port.tx_bytes;
            });
        });
}

document.addEventListener('DOMContentLoaded', () => {
    loadSwitches();
    document.getElementById('switchSelect').addEventListener('change', fetchPorts);
    setInterval(fetchPorts, 5000);
});
