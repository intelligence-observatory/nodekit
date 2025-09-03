var l = Object.defineProperty;
var c = (n, s, a) => s in n ? l(n, s, {enumerable: !0, configurable: !0, writable: !0, value: a}) : n[s] = a;
var o = (n, s, a) => c(n, typeof s != "symbol" ? s + "" : s, a);
var NodeKit = (function (n) {
    "use strict";

    class s {
        constructor(e, r) {
            o(this, "connectionUrl");
            o(this, "runId");
            o(this, "queue", []);
            o(this, "flushing", !1);
            o(this, "maxRetries", 5);
            if (this.connectionUrl = r, this.runId = e, !this.connectionUrl) throw new Error("connectionUrl is required");
            if (!this.runId) throw new Error("runId is required")
        }

        async queueEvent(e) {
            return new Promise((r, i) => {
                this.queue.push({event: e, resolve: r, reject: i, attempts: 0}), this._maybeFlushNext()
            })
        }

        _maybeFlushNext() {
            if (this.flushing) return;
            const e = this.queue.shift();
            if (!e) return;
            this.flushing = !0, console.log(`Flushing event: ${e.event.event_type} (attempt ${e.attempts + 1})`), this._postEvent(e.event).then(i => {
                e.resolve(i), this.flushing = !1, this._maybeFlushNext()
            }).catch(i => {
                if (e.attempts += 1, e.attempts >= this.maxRetries) e.reject(new Error(`Retry limit exceeded after ${this.maxRetries} retries`)); else {
                    const t = Math.pow(2, e.attempts) * 100;
                    setTimeout(() => {
                        this.queue.unshift(e), this.flushing = !1, this._maybeFlushNext()
                    }, t)
                }
            })
        }

        async _postEvent(e) {
            const r = new AbortController, i = setTimeout(() => r.abort(), 5e3);
            let t;
            try {
                t = await fetch(this.connectionUrl, {method: "POST", body: JSON.stringify(e), headers: {"Content-Type": "application/json"}, keepalive: !0, signal: r.signal})
            } catch (h) {
                throw new Error(`Fetch error: ${h}`)
            } finally {
                clearTimeout(i)
            }
            if (!t.ok) throw new Error(`Protocol error: got bad response: ${t.status} ${t.statusText}`);
            let u;
            if ((t.headers.get("content-type") || "").includes("application/json")) u = await t.json(); else throw new Error(`Protocol error: expected Content-Type application/json: ${t.status} ${t.statusText}`);
            return u
        }

        getEventId() {
            return crypto.randomUUID()
        }

        getTimestamp() {
            return new Date().toISOString()
        }

        async sendStartEvent() {
            let e = {run_id: this.runId, event_id: this.getEventId(), event_type: "StartEvent", event_payload: {}, event_timestamp: this.getTimestamp()};
            return this.queueEvent(e)
        }

        async sendNodeResultEvent(e) {
            const r = {run_id: this.runId, event_id: this.getEventId(), event_type: "NodeResultEvent", event_payload: e, event_timestamp: this.getTimestamp()};
            return this.queueEvent(r)
        }

        async sendEndEvent() {
            let e = {run_id: this.runId, event_id: this.getEventId(), event_type: "EndEvent", event_payload: {}, event_timestamp: this.getTimestamp()};
            return this.queueEvent(e)
        }
    }

    return n.EventClient = s, Object.defineProperty(n, Symbol.toStringTag, {value: "Module"}), n
})({});
