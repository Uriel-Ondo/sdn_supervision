from flask import Flask, jsonify, render_template
import requests

app = Flask(__name__)
RYU_REST_URL = 'http://127.0.0.1:8080'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/switches')
def get_switches():
    try:
        r = requests.get(f'{RYU_REST_URL}/stats/switches')
        r.raise_for_status()
        return jsonify(r.json())
    except:
        return jsonify([])

@app.route('/api/ports/<dpid>')
def get_ports(dpid):
    try:
        r = requests.get(f'{RYU_REST_URL}/stats/port/{dpid}')
        r.raise_for_status()
        data = r.json().get(str(dpid), [])
        filtered = [{
            'port_no': p['port_no'],
            'rx_packets': p['rx_packets'],
            'tx_packets': p['tx_packets'],
            'rx_bytes': p['rx_bytes'],
            'tx_bytes': p['tx_bytes']
        } for p in data]
        return jsonify(filtered)
    except:
        return jsonify([])

if __name__ == '__main__':
    app.run(debug=True)
