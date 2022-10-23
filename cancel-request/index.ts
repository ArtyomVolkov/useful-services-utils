class RequestAbort {
  private readonly requests: Map<string, AbortController[]>;

  constructor() {
    this.requests = new Map();
  }

  private cancelRequests = (name: string) => {
    if (!this.requests.get(name)) {
      return;
    }

    this.requests.get(name).forEach((item) => {
      item.abort();
    });
    this.clear(name);
  };

  public onCancelRequest = (name: string) => {
    this.cancelRequests(name);
  };

  public setRequest = (name: string): AbortController => {
    const abortController = new AbortController();

    if (!this.requests.get(name)) {
      this.requests.set(name, [abortController]);
    } else {
      this.requests.get(name).push(abortController);
    }

    return abortController;
  };

  public cancelPendingRequests = (name: string) => {
    const requests = this.requests.get(name);

    if (!requests?.length) {
      return;
    }

    requests.forEach((item, index) => {
      if (index < requests.length) {
        item.abort();
      }
    });
  };

  public clear = (name: string, full: boolean = true) => {
    if (!this.requests.get(name)) {
      return;
    }

    if (full) {
      this.requests.clear();
      return;
    }

    if (this.requests.get(name).length > 1) {
      this.requests.get(name).shift();
    } else {
      this.requests.delete(name);
    }
  };
}

// usage
const requestAbort = new RequestAbort();

requestAbort.setRequest('some-request-name');
setTimeout(() => {
  // cancel for the request is pending
  requestAbort.cancelPendingRequests('some-request-name');
}, 5000);
// cancel for unmount case
requestAbort.onCancelRequest('some-request-name');
