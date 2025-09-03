var u = Object.defineProperty;
var h = (s, e, t) => e in s ? u(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var i = (s, e, t) => h(s, typeof e != "symbol" ? e + "" : e, t);
class p {
  constructor(e, t) {
    i(this, "connectionUrl");
    i(this, "runId");
    i(this, "queue", []);
    i(this, "flushing", !1);
    i(this, "maxRetries", 5);
    if (this.connectionUrl = t, this.runId = e, !this.connectionUrl)
      throw new Error("connectionUrl is required");
    if (!this.runId)
      throw new Error("runId is required");
  }
  async queueEvent(e) {
    return new Promise(
      (t, r) => {
        this.queue.push(
          {
            event: e,
            resolve: t,
            reject: r,
            attempts: 0
          }
        ), this._maybeFlushNext();
      }
    );
  }
  _maybeFlushNext() {
    if (this.flushing)
      return;
    const e = this.queue.shift();
    if (!e)
      return;
    this.flushing = !0, console.log(`Flushing event: ${e.event.event_type} (attempt ${e.attempts + 1})`), this._postEvent(e.event).then((r) => {
      e.resolve(r), this.flushing = !1, this._maybeFlushNext();
    }).catch((r) => {
      if (e.attempts += 1, e.attempts >= this.maxRetries)
        e.reject(new Error(`Retry limit exceeded after ${this.maxRetries} retries`));
      else {
        const n = Math.pow(2, e.attempts) * 100;
        setTimeout(
          () => {
            this.queue.unshift(e), this.flushing = !1, this._maybeFlushNext();
          },
          n
        );
      }
    });
  }
  async _postEvent(e) {
    const t = new AbortController(), r = setTimeout(() => t.abort(), 5e3);
    let n;
    try {
      n = await fetch(
        this.connectionUrl,
        {
          method: "POST",
          body: JSON.stringify(e),
          headers: { "Content-Type": "application/json" },
          keepalive: !0,
          signal: t.signal
        }
      );
    } catch (a) {
      throw new Error(`Fetch error: ${a}`);
    } finally {
      clearTimeout(r);
    }
    if (!n.ok)
      throw new Error(`Protocol error: got bad response: ${n.status} ${n.statusText}`);
    let o;
    if ((n.headers.get("content-type") || "").includes("application/json"))
      o = await n.json();
    else
      throw new Error(`Protocol error: expected Content-Type application/json: ${n.status} ${n.statusText}`);
    return o;
  }
  // Helper methods:
  getEventId() {
    return crypto.randomUUID();
  }
  getTimestamp() {
    return (/* @__PURE__ */ new Date()).toISOString();
  }
  // Public methods:
  async sendStartEvent() {
    let e = {
      run_id: this.runId,
      event_id: this.getEventId(),
      event_type: "StartEvent",
      event_payload: {},
      event_timestamp: this.getTimestamp()
    };
    return this.queueEvent(e);
  }
  async sendNodeResultEvent(e) {
    const t = {
      run_id: this.runId,
      event_id: this.getEventId(),
      event_type: "NodeResultEvent",
      event_payload: e,
      event_timestamp: this.getTimestamp()
    };
    return this.queueEvent(t);
  }
  async sendEndEvent() {
    let e = {
      run_id: this.runId,
      event_id: this.getEventId(),
      event_type: "EndEvent",
      event_payload: {},
      event_timestamp: this.getTimestamp()
    };
    return this.queueEvent(e);
  }
}
export {
  p as EventClient
};
