var NodeKit = (function(exports) {
  "use strict";
  class EventClient {
    constructor(runId, connectionUrl) {
      this.queue = [];
      this.flushing = false;
      this.maxRetries = 5;
      this.connectionUrl = connectionUrl;
      this.runId = runId;
      if (!this.connectionUrl) {
        throw new Error("connectionUrl is required");
      }
      if (!this.runId) {
        throw new Error("runId is required");
      }
    }
    async queueEvent(event) {
      return new Promise(
        (resolve, reject) => {
          this.queue.push(
            {
              event,
              resolve,
              reject,
              attempts: 0
            }
          );
          this._maybeFlushNext();
        }
      );
    }
    _maybeFlushNext() {
      if (this.flushing) {
        return;
      }
      const nextQueuedEvent = this.queue.shift();
      if (!nextQueuedEvent) {
        return;
      }
      this.flushing = true;
      console.log(`Flushing event: ${nextQueuedEvent.event.event_type} (attempt ${nextQueuedEvent.attempts + 1})`);
      let postEventPromise = this._postEvent(nextQueuedEvent.event);
      postEventPromise.then((result) => {
        nextQueuedEvent.resolve(result);
        this.flushing = false;
        this._maybeFlushNext();
      }).catch((_err) => {
        nextQueuedEvent.attempts += 1;
        if (nextQueuedEvent.attempts >= this.maxRetries) {
          nextQueuedEvent.reject(new Error(`Retry limit exceeded after ${this.maxRetries} retries`));
        } else {
          const backoffTimeMsec = Math.pow(2, nextQueuedEvent.attempts) * 100;
          setTimeout(
            () => {
              this.queue.unshift(nextQueuedEvent);
              this.flushing = false;
              this._maybeFlushNext();
            },
            backoffTimeMsec
          );
        }
      });
    }
    async _postEvent(event) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5e3);
      let response;
      try {
        response = await fetch(
          this.connectionUrl,
          {
            method: "POST",
            body: JSON.stringify(event),
            headers: { "Content-Type": "application/json" },
            keepalive: true,
            signal: controller.signal
          }
        );
      } catch (error) {
        throw new Error(`Fetch error: ${error}`);
      } finally {
        clearTimeout(timeout);
      }
      if (!response.ok) {
        throw new Error(`Protocol error: got bad response: ${response.status} ${response.statusText}`);
      }
      let postEventResponse;
      const ct = response.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        postEventResponse = await response.json();
      } else {
        throw new Error(`Protocol error: expected Content-Type application/json: ${response.status} ${response.statusText}`);
      }
      return postEventResponse;
    }
    // Helper methods:
    getEventId() {
      return crypto.randomUUID();
    }
    getTimestamp() {
      const now = /* @__PURE__ */ new Date();
      return now.toISOString();
    }
    // Public methods:
    async sendStartEvent() {
      let startEvent = {
        run_id: this.runId,
        event_id: this.getEventId(),
        event_type: "StartEvent",
        event_payload: {},
        event_timestamp: this.getTimestamp()
      };
      return this.queueEvent(startEvent);
    }
    async sendNodeResultEvent(nodeResult) {
      const reportEvent = {
        run_id: this.runId,
        event_id: this.getEventId(),
        event_type: "NodeResultEvent",
        event_payload: nodeResult,
        event_timestamp: this.getTimestamp()
      };
      return this.queueEvent(reportEvent);
    }
    async sendEndEvent() {
      let endEvent = {
        run_id: this.runId,
        event_id: this.getEventId(),
        event_type: "EndEvent",
        event_payload: {},
        event_timestamp: this.getTimestamp()
      };
      return this.queueEvent(endEvent);
    }
  }
  exports.EventClient = EventClient;
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
  return exports;
})({});
