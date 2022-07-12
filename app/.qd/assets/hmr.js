(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // deno:https://deno.land/std@0.92.0/async/deferred.ts
  function deferred() {
    let methods;
    const promise = new Promise((resolve, reject) => {
      methods = { resolve, reject };
    });
    return Object.assign(promise, methods);
  }

  // deno:https://deno.land/std@0.92.0/async/mux_async_iterator.ts
  var MuxAsyncIterator = class {
    iteratorCount = 0;
    yields = [];
    throws = [];
    signal = deferred();
    add(iterator) {
      ++this.iteratorCount;
      this.callIteratorNext(iterator);
    }
    async callIteratorNext(iterator) {
      try {
        const { value, done } = await iterator.next();
        if (done) {
          --this.iteratorCount;
        } else {
          this.yields.push({ iterator, value });
        }
      } catch (e) {
        this.throws.push(e);
      }
      this.signal.resolve();
    }
    async *iterate() {
      while (this.iteratorCount > 0) {
        await this.signal;
        for (let i = 0; i < this.yields.length; i++) {
          const { iterator, value } = this.yields[i];
          yield value;
          this.callIteratorNext(iterator);
        }
        if (this.throws.length) {
          for (const e of this.throws) {
            throw e;
          }
          this.throws.length = 0;
        }
        this.yields.length = 0;
        this.signal = deferred();
      }
    }
    [Symbol.asyncIterator]() {
      return this.iterate();
    }
  };

  // deno:https://deno.land/std@0.92.0/fmt/colors.ts
  var noColor = globalThis.Deno?.noColor ?? true;
  var ANSI_PATTERN = new RegExp([
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
  ].join("|"), "g");

  // deno:https://deno.land/std@0.92.0/_util/assert.ts
  var DenoStdInternalError = class extends Error {
    constructor(message) {
      super(message);
      this.name = "DenoStdInternalError";
    }
  };
  function assert(expr, msg = "") {
    if (!expr) {
      throw new DenoStdInternalError(msg);
    }
  }

  // deno:https://deno.land/std@0.92.0/io/buffer.ts
  var MIN_READ = 32 * 1024;
  var MAX_SIZE = 2 ** 32 - 2;
  function copyBytes(src, dst, off = 0) {
    const r = dst.byteLength - off;
    if (src.byteLength > r) {
      src = src.subarray(0, r);
    }
    dst.set(src, off);
    return src.byteLength;
  }
  var Buffer2 = class {
    #buf;
    #off = 0;
    constructor(ab) {
      if (ab === void 0) {
        this.#buf = new Uint8Array(0);
        return;
      }
      this.#buf = new Uint8Array(ab);
    }
    bytes(options = { copy: true }) {
      if (options.copy === false)
        return this.#buf.subarray(this.#off);
      return this.#buf.slice(this.#off);
    }
    empty() {
      return this.#buf.byteLength <= this.#off;
    }
    get length() {
      return this.#buf.byteLength - this.#off;
    }
    get capacity() {
      return this.#buf.buffer.byteLength;
    }
    truncate(n) {
      if (n === 0) {
        this.reset();
        return;
      }
      if (n < 0 || n > this.length) {
        throw Error("bytes.Buffer: truncation out of range");
      }
      this.#reslice(this.#off + n);
    }
    reset() {
      this.#reslice(0);
      this.#off = 0;
    }
    #tryGrowByReslice = (n) => {
      const l = this.#buf.byteLength;
      if (n <= this.capacity - l) {
        this.#reslice(l + n);
        return l;
      }
      return -1;
    };
    #reslice = (len) => {
      assert(len <= this.#buf.buffer.byteLength);
      this.#buf = new Uint8Array(this.#buf.buffer, 0, len);
    };
    readSync(p) {
      if (this.empty()) {
        this.reset();
        if (p.byteLength === 0) {
          return 0;
        }
        return null;
      }
      const nread = copyBytes(this.#buf.subarray(this.#off), p);
      this.#off += nread;
      return nread;
    }
    read(p) {
      const rr = this.readSync(p);
      return Promise.resolve(rr);
    }
    writeSync(p) {
      const m = this.#grow(p.byteLength);
      return copyBytes(p, this.#buf, m);
    }
    write(p) {
      const n = this.writeSync(p);
      return Promise.resolve(n);
    }
    #grow = (n) => {
      const m = this.length;
      if (m === 0 && this.#off !== 0) {
        this.reset();
      }
      const i = this.#tryGrowByReslice(n);
      if (i >= 0) {
        return i;
      }
      const c = this.capacity;
      if (n <= Math.floor(c / 2) - m) {
        copyBytes(this.#buf.subarray(this.#off), this.#buf);
      } else if (c + n > MAX_SIZE) {
        throw new Error("The buffer cannot be grown beyond the maximum size.");
      } else {
        const buf = new Uint8Array(Math.min(2 * c + n, MAX_SIZE));
        copyBytes(this.#buf.subarray(this.#off), buf);
        this.#buf = buf;
      }
      this.#off = 0;
      this.#reslice(Math.min(m + n, MAX_SIZE));
      return m;
    };
    grow(n) {
      if (n < 0) {
        throw Error("Buffer.grow: negative count");
      }
      const m = this.#grow(n);
      this.#reslice(m);
    }
    async readFrom(r) {
      let n = 0;
      const tmp = new Uint8Array(MIN_READ);
      while (true) {
        const shouldGrow = this.capacity - this.length < MIN_READ;
        const buf = shouldGrow ? tmp : new Uint8Array(this.#buf.buffer, this.length);
        const nread = await r.read(buf);
        if (nread === null) {
          return n;
        }
        if (shouldGrow)
          this.writeSync(buf.subarray(0, nread));
        else
          this.#reslice(this.length + nread);
        n += nread;
      }
    }
    readFromSync(r) {
      let n = 0;
      const tmp = new Uint8Array(MIN_READ);
      while (true) {
        const shouldGrow = this.capacity - this.length < MIN_READ;
        const buf = shouldGrow ? tmp : new Uint8Array(this.#buf.buffer, this.length);
        const nread = r.readSync(buf);
        if (nread === null) {
          return n;
        }
        if (shouldGrow)
          this.writeSync(buf.subarray(0, nread));
        else
          this.#reslice(this.length + nread);
        n += nread;
      }
    }
  };

  // deno:https://deno.land/std@0.92.0/io/util.ts
  async function writeAll(w, arr) {
    let nwritten = 0;
    while (nwritten < arr.length) {
      nwritten += await w.write(arr.subarray(nwritten));
    }
  }

  // deno:https://deno.land/std@0.92.0/node/_utils.ts
  function validateIntegerRange(value, name, min = -2147483648, max = 2147483647) {
    if (!Number.isInteger(value)) {
      throw new Error(`${name} must be 'an integer' but was ${value}`);
    }
    if (value < min || value > max) {
      throw new Error(`${name} must be >= ${min} && <= ${max}. Value was ${value}`);
    }
  }

  // deno:https://deno.land/std@0.92.0/node/events.ts
  function createIterResult(value, done) {
    return { value, done };
  }
  var defaultMaxListeners = 10;
  var _EventEmitter = class {
    static get defaultMaxListeners() {
      return defaultMaxListeners;
    }
    static set defaultMaxListeners(value) {
      defaultMaxListeners = value;
    }
    maxListeners;
    _events;
    constructor() {
      this._events = /* @__PURE__ */ new Map();
    }
    _addListener(eventName, listener, prepend) {
      this.emit("newListener", eventName, listener);
      if (this._events.has(eventName)) {
        const listeners = this._events.get(eventName);
        if (prepend) {
          listeners.unshift(listener);
        } else {
          listeners.push(listener);
        }
      } else {
        this._events.set(eventName, [listener]);
      }
      const max = this.getMaxListeners();
      if (max > 0 && this.listenerCount(eventName) > max) {
        const warning = new Error(`Possible EventEmitter memory leak detected.
         ${this.listenerCount(eventName)} ${eventName.toString()} listeners.
         Use emitter.setMaxListeners() to increase limit`);
        warning.name = "MaxListenersExceededWarning";
        console.warn(warning);
      }
      return this;
    }
    addListener(eventName, listener) {
      return this._addListener(eventName, listener, false);
    }
    emit(eventName, ...args) {
      if (this._events.has(eventName)) {
        if (eventName === "error" && this._events.get(_EventEmitter.errorMonitor)) {
          this.emit(_EventEmitter.errorMonitor, ...args);
        }
        const listeners = this._events.get(eventName).slice();
        for (const listener of listeners) {
          try {
            listener.apply(this, args);
          } catch (err) {
            this.emit("error", err);
          }
        }
        return true;
      } else if (eventName === "error") {
        if (this._events.get(_EventEmitter.errorMonitor)) {
          this.emit(_EventEmitter.errorMonitor, ...args);
        }
        const errMsg = args.length > 0 ? args[0] : Error("Unhandled error.");
        throw errMsg;
      }
      return false;
    }
    eventNames() {
      return Array.from(this._events.keys());
    }
    getMaxListeners() {
      return this.maxListeners || _EventEmitter.defaultMaxListeners;
    }
    listenerCount(eventName) {
      if (this._events.has(eventName)) {
        return this._events.get(eventName).length;
      } else {
        return 0;
      }
    }
    static listenerCount(emitter, eventName) {
      return emitter.listenerCount(eventName);
    }
    _listeners(target, eventName, unwrap) {
      if (!target._events.has(eventName)) {
        return [];
      }
      const eventListeners = target._events.get(eventName);
      return unwrap ? this.unwrapListeners(eventListeners) : eventListeners.slice(0);
    }
    unwrapListeners(arr) {
      const unwrappedListeners = new Array(arr.length);
      for (let i = 0; i < arr.length; i++) {
        unwrappedListeners[i] = arr[i]["listener"] || arr[i];
      }
      return unwrappedListeners;
    }
    listeners(eventName) {
      return this._listeners(this, eventName, true);
    }
    rawListeners(eventName) {
      return this._listeners(this, eventName, false);
    }
    off(eventName, listener) {
      return this.removeListener(eventName, listener);
    }
    on(eventName, listener) {
      return this._addListener(eventName, listener, false);
    }
    once(eventName, listener) {
      const wrapped = this.onceWrap(eventName, listener);
      this.on(eventName, wrapped);
      return this;
    }
    onceWrap(eventName, listener) {
      const wrapper = function(...args) {
        this.context.removeListener(this.eventName, this.rawListener);
        this.listener.apply(this.context, args);
      };
      const wrapperContext = {
        eventName,
        listener,
        rawListener: wrapper,
        context: this
      };
      const wrapped = wrapper.bind(wrapperContext);
      wrapperContext.rawListener = wrapped;
      wrapped.listener = listener;
      return wrapped;
    }
    prependListener(eventName, listener) {
      return this._addListener(eventName, listener, true);
    }
    prependOnceListener(eventName, listener) {
      const wrapped = this.onceWrap(eventName, listener);
      this.prependListener(eventName, wrapped);
      return this;
    }
    removeAllListeners(eventName) {
      if (this._events === void 0) {
        return this;
      }
      if (eventName) {
        if (this._events.has(eventName)) {
          const listeners = this._events.get(eventName).slice();
          this._events.delete(eventName);
          for (const listener of listeners) {
            this.emit("removeListener", eventName, listener);
          }
        }
      } else {
        const eventList = this.eventNames();
        eventList.map((value) => {
          this.removeAllListeners(value);
        });
      }
      return this;
    }
    removeListener(eventName, listener) {
      if (this._events.has(eventName)) {
        const arr = this._events.get(eventName);
        assert(arr);
        let listenerIndex = -1;
        for (let i = arr.length - 1; i >= 0; i--) {
          if (arr[i] == listener || arr[i] && arr[i]["listener"] == listener) {
            listenerIndex = i;
            break;
          }
        }
        if (listenerIndex >= 0) {
          arr.splice(listenerIndex, 1);
          this.emit("removeListener", eventName, listener);
          if (arr.length === 0) {
            this._events.delete(eventName);
          }
        }
      }
      return this;
    }
    setMaxListeners(n) {
      if (n !== Infinity) {
        if (n === 0) {
          n = Infinity;
        } else {
          validateIntegerRange(n, "maxListeners", 0);
        }
      }
      this.maxListeners = n;
      return this;
    }
    static once(emitter, name) {
      return new Promise((resolve, reject) => {
        if (emitter instanceof EventTarget) {
          emitter.addEventListener(name, (...args) => {
            resolve(args);
          }, { once: true, passive: false, capture: false });
          return;
        } else if (emitter instanceof _EventEmitter) {
          const eventListener = (...args) => {
            if (errorListener !== void 0) {
              emitter.removeListener("error", errorListener);
            }
            resolve(args);
          };
          let errorListener;
          if (name !== "error") {
            errorListener = (err) => {
              emitter.removeListener(name, eventListener);
              reject(err);
            };
            emitter.once("error", errorListener);
          }
          emitter.once(name, eventListener);
          return;
        }
      });
    }
    static on(emitter, event) {
      const unconsumedEventValues = [];
      const unconsumedPromises = [];
      let error = null;
      let finished = false;
      const iterator = {
        next() {
          const value = unconsumedEventValues.shift();
          if (value) {
            return Promise.resolve(createIterResult(value, false));
          }
          if (error) {
            const p = Promise.reject(error);
            error = null;
            return p;
          }
          if (finished) {
            return Promise.resolve(createIterResult(void 0, true));
          }
          return new Promise(function(resolve, reject) {
            unconsumedPromises.push({ resolve, reject });
          });
        },
        return() {
          emitter.removeListener(event, eventHandler);
          emitter.removeListener("error", errorHandler);
          finished = true;
          for (const promise of unconsumedPromises) {
            promise.resolve(createIterResult(void 0, true));
          }
          return Promise.resolve(createIterResult(void 0, true));
        },
        throw(err) {
          error = err;
          emitter.removeListener(event, eventHandler);
          emitter.removeListener("error", errorHandler);
        },
        [Symbol.asyncIterator]() {
          return this;
        }
      };
      emitter.on(event, eventHandler);
      emitter.on("error", errorHandler);
      return iterator;
      function eventHandler(...args) {
        const promise = unconsumedPromises.shift();
        if (promise) {
          promise.resolve(createIterResult(args, false));
        } else {
          unconsumedEventValues.push(args);
        }
      }
      function errorHandler(err) {
        finished = true;
        const toError = unconsumedPromises.shift();
        if (toError) {
          toError.reject(err);
        } else {
          error = err;
        }
        iterator.return();
      }
    }
  };
  var EventEmitter = _EventEmitter;
  __publicField(EventEmitter, "captureRejectionSymbol", Symbol.for("nodejs.rejection"));
  __publicField(EventEmitter, "errorMonitor", Symbol("events.errorMonitor"));
  var events_default = Object.assign(EventEmitter, { EventEmitter });
  var captureRejectionSymbol = EventEmitter.captureRejectionSymbol;
  var errorMonitor = EventEmitter.errorMonitor;
  var listenerCount = EventEmitter.listenerCount;
  var on = EventEmitter.on;
  var once = EventEmitter.once;

  // deno:https://deno.land/std@0.92.0/bytes/mod.ts
  function concat(...buf) {
    let length = 0;
    for (const b of buf) {
      length += b.length;
    }
    const output = new Uint8Array(length);
    let index = 0;
    for (const b of buf) {
      output.set(b, index);
      index += b.length;
    }
    return output;
  }
  function copy(src, dst, off = 0) {
    off = Math.max(0, Math.min(off, dst.byteLength));
    const dstBytesAvailable = dst.byteLength - off;
    if (src.byteLength > dstBytesAvailable) {
      src = src.subarray(0, dstBytesAvailable);
    }
    dst.set(src, off);
    return src.byteLength;
  }

  // deno:https://deno.land/std@0.92.0/io/bufio.ts
  var DEFAULT_BUF_SIZE = 4096;
  var MIN_BUF_SIZE = 16;
  var MAX_CONSECUTIVE_EMPTY_READS = 100;
  var CR = "\r".charCodeAt(0);
  var LF = "\n".charCodeAt(0);
  var BufferFullError = class extends Error {
    constructor(partial) {
      super("Buffer full");
      this.partial = partial;
    }
    name = "BufferFullError";
  };
  var PartialReadError = class extends Error {
    name = "PartialReadError";
    partial;
    constructor() {
      super("Encountered UnexpectedEof, data only partially read");
    }
  };
  var BufReader = class {
    buf;
    rd;
    r = 0;
    w = 0;
    eof = false;
    static create(r, size = DEFAULT_BUF_SIZE) {
      return r instanceof BufReader ? r : new BufReader(r, size);
    }
    constructor(rd, size = DEFAULT_BUF_SIZE) {
      if (size < MIN_BUF_SIZE) {
        size = MIN_BUF_SIZE;
      }
      this._reset(new Uint8Array(size), rd);
    }
    size() {
      return this.buf.byteLength;
    }
    buffered() {
      return this.w - this.r;
    }
    async _fill() {
      if (this.r > 0) {
        this.buf.copyWithin(0, this.r, this.w);
        this.w -= this.r;
        this.r = 0;
      }
      if (this.w >= this.buf.byteLength) {
        throw Error("bufio: tried to fill full buffer");
      }
      for (let i = MAX_CONSECUTIVE_EMPTY_READS; i > 0; i--) {
        const rr = await this.rd.read(this.buf.subarray(this.w));
        if (rr === null) {
          this.eof = true;
          return;
        }
        assert(rr >= 0, "negative read");
        this.w += rr;
        if (rr > 0) {
          return;
        }
      }
      throw new Error(`No progress after ${MAX_CONSECUTIVE_EMPTY_READS} read() calls`);
    }
    reset(r) {
      this._reset(this.buf, r);
    }
    _reset(buf, rd) {
      this.buf = buf;
      this.rd = rd;
      this.eof = false;
    }
    async read(p) {
      let rr = p.byteLength;
      if (p.byteLength === 0)
        return rr;
      if (this.r === this.w) {
        if (p.byteLength >= this.buf.byteLength) {
          const rr2 = await this.rd.read(p);
          const nread = rr2 ?? 0;
          assert(nread >= 0, "negative read");
          return rr2;
        }
        this.r = 0;
        this.w = 0;
        rr = await this.rd.read(this.buf);
        if (rr === 0 || rr === null)
          return rr;
        assert(rr >= 0, "negative read");
        this.w += rr;
      }
      const copied = copy(this.buf.subarray(this.r, this.w), p, 0);
      this.r += copied;
      return copied;
    }
    async readFull(p) {
      let bytesRead = 0;
      while (bytesRead < p.length) {
        try {
          const rr = await this.read(p.subarray(bytesRead));
          if (rr === null) {
            if (bytesRead === 0) {
              return null;
            } else {
              throw new PartialReadError();
            }
          }
          bytesRead += rr;
        } catch (err) {
          err.partial = p.subarray(0, bytesRead);
          throw err;
        }
      }
      return p;
    }
    async readByte() {
      while (this.r === this.w) {
        if (this.eof)
          return null;
        await this._fill();
      }
      const c = this.buf[this.r];
      this.r++;
      return c;
    }
    async readString(delim) {
      if (delim.length !== 1) {
        throw new Error("Delimiter should be a single character");
      }
      const buffer = await this.readSlice(delim.charCodeAt(0));
      if (buffer === null)
        return null;
      return new TextDecoder().decode(buffer);
    }
    async readLine() {
      let line;
      try {
        line = await this.readSlice(LF);
      } catch (err) {
        let { partial } = err;
        assert(partial instanceof Uint8Array, "bufio: caught error from `readSlice()` without `partial` property");
        if (!(err instanceof BufferFullError)) {
          throw err;
        }
        if (!this.eof && partial.byteLength > 0 && partial[partial.byteLength - 1] === CR) {
          assert(this.r > 0, "bufio: tried to rewind past start of buffer");
          this.r--;
          partial = partial.subarray(0, partial.byteLength - 1);
        }
        return { line: partial, more: !this.eof };
      }
      if (line === null) {
        return null;
      }
      if (line.byteLength === 0) {
        return { line, more: false };
      }
      if (line[line.byteLength - 1] == LF) {
        let drop = 1;
        if (line.byteLength > 1 && line[line.byteLength - 2] === CR) {
          drop = 2;
        }
        line = line.subarray(0, line.byteLength - drop);
      }
      return { line, more: false };
    }
    async readSlice(delim) {
      let s = 0;
      let slice;
      while (true) {
        let i = this.buf.subarray(this.r + s, this.w).indexOf(delim);
        if (i >= 0) {
          i += s;
          slice = this.buf.subarray(this.r, this.r + i + 1);
          this.r += i + 1;
          break;
        }
        if (this.eof) {
          if (this.r === this.w) {
            return null;
          }
          slice = this.buf.subarray(this.r, this.w);
          this.r = this.w;
          break;
        }
        if (this.buffered() >= this.buf.byteLength) {
          this.r = this.w;
          const oldbuf = this.buf;
          const newbuf = this.buf.slice(0);
          this.buf = newbuf;
          throw new BufferFullError(oldbuf);
        }
        s = this.w - this.r;
        try {
          await this._fill();
        } catch (err) {
          err.partial = slice;
          throw err;
        }
      }
      return slice;
    }
    async peek(n) {
      if (n < 0) {
        throw Error("negative count");
      }
      let avail = this.w - this.r;
      while (avail < n && avail < this.buf.byteLength && !this.eof) {
        try {
          await this._fill();
        } catch (err) {
          err.partial = this.buf.subarray(this.r, this.w);
          throw err;
        }
        avail = this.w - this.r;
      }
      if (avail === 0 && this.eof) {
        return null;
      } else if (avail < n && this.eof) {
        return this.buf.subarray(this.r, this.r + avail);
      } else if (avail < n) {
        throw new BufferFullError(this.buf.subarray(this.r, this.w));
      }
      return this.buf.subarray(this.r, this.r + n);
    }
  };
  var AbstractBufBase = class {
    buf;
    usedBufferBytes = 0;
    err = null;
    size() {
      return this.buf.byteLength;
    }
    available() {
      return this.buf.byteLength - this.usedBufferBytes;
    }
    buffered() {
      return this.usedBufferBytes;
    }
  };
  var BufWriter = class extends AbstractBufBase {
    constructor(writer, size = DEFAULT_BUF_SIZE) {
      super();
      this.writer = writer;
      if (size <= 0) {
        size = DEFAULT_BUF_SIZE;
      }
      this.buf = new Uint8Array(size);
    }
    static create(writer, size = DEFAULT_BUF_SIZE) {
      return writer instanceof BufWriter ? writer : new BufWriter(writer, size);
    }
    reset(w) {
      this.err = null;
      this.usedBufferBytes = 0;
      this.writer = w;
    }
    async flush() {
      if (this.err !== null)
        throw this.err;
      if (this.usedBufferBytes === 0)
        return;
      try {
        await writeAll(this.writer, this.buf.subarray(0, this.usedBufferBytes));
      } catch (e) {
        this.err = e;
        throw e;
      }
      this.buf = new Uint8Array(this.buf.length);
      this.usedBufferBytes = 0;
    }
    async write(data) {
      if (this.err !== null)
        throw this.err;
      if (data.length === 0)
        return 0;
      let totalBytesWritten = 0;
      let numBytesWritten = 0;
      while (data.byteLength > this.available()) {
        if (this.buffered() === 0) {
          try {
            numBytesWritten = await this.writer.write(data);
          } catch (e) {
            this.err = e;
            throw e;
          }
        } else {
          numBytesWritten = copy(data, this.buf, this.usedBufferBytes);
          this.usedBufferBytes += numBytesWritten;
          await this.flush();
        }
        totalBytesWritten += numBytesWritten;
        data = data.subarray(numBytesWritten);
      }
      numBytesWritten = copy(data, this.buf, this.usedBufferBytes);
      this.usedBufferBytes += numBytesWritten;
      totalBytesWritten += numBytesWritten;
      return totalBytesWritten;
    }
  };

  // deno:https://deno.land/std@0.92.0/textproto/mod.ts
  var decoder = new TextDecoder();
  var invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/g;
  function str(buf) {
    if (buf == null) {
      return "";
    } else {
      return decoder.decode(buf);
    }
  }
  function charCode(s) {
    return s.charCodeAt(0);
  }
  var TextProtoReader = class {
    constructor(r) {
      this.r = r;
    }
    async readLine() {
      const s = await this.readLineSlice();
      if (s === null)
        return null;
      return str(s);
    }
    async readMIMEHeader() {
      const m = new Headers();
      let line;
      let buf = await this.r.peek(1);
      if (buf === null) {
        return null;
      } else if (buf[0] == charCode(" ") || buf[0] == charCode("	")) {
        line = await this.readLineSlice();
      }
      buf = await this.r.peek(1);
      if (buf === null) {
        throw new Deno.errors.UnexpectedEof();
      } else if (buf[0] == charCode(" ") || buf[0] == charCode("	")) {
        throw new Deno.errors.InvalidData(`malformed MIME header initial line: ${str(line)}`);
      }
      while (true) {
        const kv = await this.readLineSlice();
        if (kv === null)
          throw new Deno.errors.UnexpectedEof();
        if (kv.byteLength === 0)
          return m;
        let i = kv.indexOf(charCode(":"));
        if (i < 0) {
          throw new Deno.errors.InvalidData(`malformed MIME header line: ${str(kv)}`);
        }
        const key = str(kv.subarray(0, i));
        if (key == "") {
          continue;
        }
        i++;
        while (i < kv.byteLength && (kv[i] == charCode(" ") || kv[i] == charCode("	"))) {
          i++;
        }
        const value = str(kv.subarray(i)).replace(invalidHeaderCharRegex, encodeURI);
        try {
          m.append(key, value);
        } catch {
        }
      }
    }
    async readLineSlice() {
      let line;
      while (true) {
        const r = await this.r.readLine();
        if (r === null)
          return null;
        const { line: l, more } = r;
        if (!line && !more) {
          if (this.skipSpace(l) === 0) {
            return new Uint8Array(0);
          }
          return l;
        }
        line = line ? concat(line, l) : l;
        if (!more) {
          break;
        }
      }
      return line;
    }
    skipSpace(l) {
      let n = 0;
      for (let i = 0; i < l.length; i++) {
        if (l[i] === charCode(" ") || l[i] === charCode("	")) {
          continue;
        }
        n++;
      }
      return n;
    }
  };

  // deno:https://deno.land/std@0.92.0/http/http_status.ts
  var STATUS_TEXT = /* @__PURE__ */ new Map([
    [100 /* Continue */, "Continue"],
    [101 /* SwitchingProtocols */, "Switching Protocols"],
    [102 /* Processing */, "Processing"],
    [103 /* EarlyHints */, "Early Hints"],
    [200 /* OK */, "OK"],
    [201 /* Created */, "Created"],
    [202 /* Accepted */, "Accepted"],
    [203 /* NonAuthoritativeInfo */, "Non-Authoritative Information"],
    [204 /* NoContent */, "No Content"],
    [205 /* ResetContent */, "Reset Content"],
    [206 /* PartialContent */, "Partial Content"],
    [207 /* MultiStatus */, "Multi-Status"],
    [208 /* AlreadyReported */, "Already Reported"],
    [226 /* IMUsed */, "IM Used"],
    [300 /* MultipleChoices */, "Multiple Choices"],
    [301 /* MovedPermanently */, "Moved Permanently"],
    [302 /* Found */, "Found"],
    [303 /* SeeOther */, "See Other"],
    [304 /* NotModified */, "Not Modified"],
    [305 /* UseProxy */, "Use Proxy"],
    [307 /* TemporaryRedirect */, "Temporary Redirect"],
    [308 /* PermanentRedirect */, "Permanent Redirect"],
    [400 /* BadRequest */, "Bad Request"],
    [401 /* Unauthorized */, "Unauthorized"],
    [402 /* PaymentRequired */, "Payment Required"],
    [403 /* Forbidden */, "Forbidden"],
    [404 /* NotFound */, "Not Found"],
    [405 /* MethodNotAllowed */, "Method Not Allowed"],
    [406 /* NotAcceptable */, "Not Acceptable"],
    [407 /* ProxyAuthRequired */, "Proxy Authentication Required"],
    [408 /* RequestTimeout */, "Request Timeout"],
    [409 /* Conflict */, "Conflict"],
    [410 /* Gone */, "Gone"],
    [411 /* LengthRequired */, "Length Required"],
    [412 /* PreconditionFailed */, "Precondition Failed"],
    [413 /* RequestEntityTooLarge */, "Request Entity Too Large"],
    [414 /* RequestURITooLong */, "Request URI Too Long"],
    [415 /* UnsupportedMediaType */, "Unsupported Media Type"],
    [416 /* RequestedRangeNotSatisfiable */, "Requested Range Not Satisfiable"],
    [417 /* ExpectationFailed */, "Expectation Failed"],
    [418 /* Teapot */, "I'm a teapot"],
    [421 /* MisdirectedRequest */, "Misdirected Request"],
    [422 /* UnprocessableEntity */, "Unprocessable Entity"],
    [423 /* Locked */, "Locked"],
    [424 /* FailedDependency */, "Failed Dependency"],
    [425 /* TooEarly */, "Too Early"],
    [426 /* UpgradeRequired */, "Upgrade Required"],
    [428 /* PreconditionRequired */, "Precondition Required"],
    [429 /* TooManyRequests */, "Too Many Requests"],
    [431 /* RequestHeaderFieldsTooLarge */, "Request Header Fields Too Large"],
    [451 /* UnavailableForLegalReasons */, "Unavailable For Legal Reasons"],
    [500 /* InternalServerError */, "Internal Server Error"],
    [501 /* NotImplemented */, "Not Implemented"],
    [502 /* BadGateway */, "Bad Gateway"],
    [503 /* ServiceUnavailable */, "Service Unavailable"],
    [504 /* GatewayTimeout */, "Gateway Timeout"],
    [505 /* HTTPVersionNotSupported */, "HTTP Version Not Supported"],
    [506 /* VariantAlsoNegotiates */, "Variant Also Negotiates"],
    [507 /* InsufficientStorage */, "Insufficient Storage"],
    [508 /* LoopDetected */, "Loop Detected"],
    [510 /* NotExtended */, "Not Extended"],
    [511 /* NetworkAuthenticationRequired */, "Network Authentication Required"]
  ]);

  // deno:https://deno.land/std@0.92.0/http/_io.ts
  var encoder = new TextEncoder();
  function emptyReader() {
    return {
      read(_) {
        return Promise.resolve(null);
      }
    };
  }
  function bodyReader(contentLength, r) {
    let totalRead = 0;
    let finished = false;
    async function read(buf) {
      if (finished)
        return null;
      let result;
      const remaining = contentLength - totalRead;
      if (remaining >= buf.byteLength) {
        result = await r.read(buf);
      } else {
        const readBuf = buf.subarray(0, remaining);
        result = await r.read(readBuf);
      }
      if (result !== null) {
        totalRead += result;
      }
      finished = totalRead === contentLength;
      return result;
    }
    return { read };
  }
  function chunkedBodyReader(h, r) {
    const tp = new TextProtoReader(r);
    let finished = false;
    const chunks = [];
    async function read(buf) {
      if (finished)
        return null;
      const [chunk] = chunks;
      if (chunk) {
        const chunkRemaining = chunk.data.byteLength - chunk.offset;
        const readLength = Math.min(chunkRemaining, buf.byteLength);
        for (let i = 0; i < readLength; i++) {
          buf[i] = chunk.data[chunk.offset + i];
        }
        chunk.offset += readLength;
        if (chunk.offset === chunk.data.byteLength) {
          chunks.shift();
          if (await tp.readLine() === null) {
            throw new Deno.errors.UnexpectedEof();
          }
        }
        return readLength;
      }
      const line = await tp.readLine();
      if (line === null)
        throw new Deno.errors.UnexpectedEof();
      const [chunkSizeString] = line.split(";");
      const chunkSize = parseInt(chunkSizeString, 16);
      if (Number.isNaN(chunkSize) || chunkSize < 0) {
        throw new Deno.errors.InvalidData("Invalid chunk size");
      }
      if (chunkSize > 0) {
        if (chunkSize > buf.byteLength) {
          let eof = await r.readFull(buf);
          if (eof === null) {
            throw new Deno.errors.UnexpectedEof();
          }
          const restChunk = new Uint8Array(chunkSize - buf.byteLength);
          eof = await r.readFull(restChunk);
          if (eof === null) {
            throw new Deno.errors.UnexpectedEof();
          } else {
            chunks.push({
              offset: 0,
              data: restChunk
            });
          }
          return buf.byteLength;
        } else {
          const bufToFill = buf.subarray(0, chunkSize);
          const eof = await r.readFull(bufToFill);
          if (eof === null) {
            throw new Deno.errors.UnexpectedEof();
          }
          if (await tp.readLine() === null) {
            throw new Deno.errors.UnexpectedEof();
          }
          return chunkSize;
        }
      } else {
        assert(chunkSize === 0);
        if (await r.readLine() === null) {
          throw new Deno.errors.UnexpectedEof();
        }
        await readTrailers(h, r);
        finished = true;
        return null;
      }
    }
    return { read };
  }
  function isProhibidedForTrailer(key) {
    const s = /* @__PURE__ */ new Set(["transfer-encoding", "content-length", "trailer"]);
    return s.has(key.toLowerCase());
  }
  async function readTrailers(headers, r) {
    const trailers = parseTrailer(headers.get("trailer"));
    if (trailers == null)
      return;
    const trailerNames = [...trailers.keys()];
    const tp = new TextProtoReader(r);
    const result = await tp.readMIMEHeader();
    if (result == null) {
      throw new Deno.errors.InvalidData("Missing trailer header.");
    }
    const undeclared = [...result.keys()].filter((k) => !trailerNames.includes(k));
    if (undeclared.length > 0) {
      throw new Deno.errors.InvalidData(`Undeclared trailers: ${Deno.inspect(undeclared)}.`);
    }
    for (const [k, v] of result) {
      headers.append(k, v);
    }
    const missingTrailers = trailerNames.filter((k) => !result.has(k));
    if (missingTrailers.length > 0) {
      throw new Deno.errors.InvalidData(`Missing trailers: ${Deno.inspect(missingTrailers)}.`);
    }
    headers.delete("trailer");
  }
  function parseTrailer(field) {
    if (field == null) {
      return void 0;
    }
    const trailerNames = field.split(",").map((v) => v.trim().toLowerCase());
    if (trailerNames.length === 0) {
      throw new Deno.errors.InvalidData("Empty trailer header.");
    }
    const prohibited = trailerNames.filter((k) => isProhibidedForTrailer(k));
    if (prohibited.length > 0) {
      throw new Deno.errors.InvalidData(`Prohibited trailer names: ${Deno.inspect(prohibited)}.`);
    }
    return new Headers(trailerNames.map((key) => [key, ""]));
  }
  async function writeChunkedBody(w, r) {
    for await (const chunk of Deno.iter(r)) {
      if (chunk.byteLength <= 0)
        continue;
      const start = encoder.encode(`${chunk.byteLength.toString(16)}\r
`);
      const end = encoder.encode("\r\n");
      await w.write(start);
      await w.write(chunk);
      await w.write(end);
      await w.flush();
    }
    const endChunk = encoder.encode("0\r\n\r\n");
    await w.write(endChunk);
  }
  async function writeTrailers(w, headers, trailers) {
    const trailer = headers.get("trailer");
    if (trailer === null) {
      throw new TypeError("Missing trailer header.");
    }
    const transferEncoding = headers.get("transfer-encoding");
    if (transferEncoding === null || !transferEncoding.match(/^chunked/)) {
      throw new TypeError(`Trailers are only allowed for "transfer-encoding: chunked", got "transfer-encoding: ${transferEncoding}".`);
    }
    const writer = BufWriter.create(w);
    const trailerNames = trailer.split(",").map((s) => s.trim().toLowerCase());
    const prohibitedTrailers = trailerNames.filter((k) => isProhibidedForTrailer(k));
    if (prohibitedTrailers.length > 0) {
      throw new TypeError(`Prohibited trailer names: ${Deno.inspect(prohibitedTrailers)}.`);
    }
    const undeclared = [...trailers.keys()].filter((k) => !trailerNames.includes(k));
    if (undeclared.length > 0) {
      throw new TypeError(`Undeclared trailers: ${Deno.inspect(undeclared)}.`);
    }
    for (const [key, value] of trailers) {
      await writer.write(encoder.encode(`${key}: ${value}\r
`));
    }
    await writer.write(encoder.encode("\r\n"));
    await writer.flush();
  }
  async function writeResponse(w, r) {
    const protoMajor = 1;
    const protoMinor = 1;
    const statusCode = r.status || 200;
    const statusText = STATUS_TEXT.get(statusCode);
    const writer = BufWriter.create(w);
    if (!statusText) {
      throw new Deno.errors.InvalidData("Bad status code");
    }
    if (!r.body) {
      r.body = new Uint8Array();
    }
    if (typeof r.body === "string") {
      r.body = encoder.encode(r.body);
    }
    let out = `HTTP/${protoMajor}.${protoMinor} ${statusCode} ${statusText}\r
`;
    const headers = r.headers ?? new Headers();
    if (r.body && !headers.get("content-length")) {
      if (r.body instanceof Uint8Array) {
        out += `content-length: ${r.body.byteLength}\r
`;
      } else if (!headers.get("transfer-encoding")) {
        out += "transfer-encoding: chunked\r\n";
      }
    }
    for (const [key, value] of headers) {
      out += `${key}: ${value}\r
`;
    }
    out += `\r
`;
    const header = encoder.encode(out);
    const n = await writer.write(header);
    assert(n === header.byteLength);
    if (r.body instanceof Uint8Array) {
      const n2 = await writer.write(r.body);
      assert(n2 === r.body.byteLength);
    } else if (headers.has("content-length")) {
      const contentLength = headers.get("content-length");
      assert(contentLength != null);
      const bodyLength = parseInt(contentLength);
      const n2 = await Deno.copy(r.body, writer);
      assert(n2 === bodyLength);
    } else {
      await writeChunkedBody(writer, r.body);
    }
    if (r.trailers) {
      const t = await r.trailers();
      await writeTrailers(writer, headers, t);
    }
    await writer.flush();
  }
  function parseHTTPVersion(vers) {
    switch (vers) {
      case "HTTP/1.1":
        return [1, 1];
      case "HTTP/1.0":
        return [1, 0];
      default: {
        const Big = 1e6;
        if (!vers.startsWith("HTTP/")) {
          break;
        }
        const dot = vers.indexOf(".");
        if (dot < 0) {
          break;
        }
        const majorStr = vers.substring(vers.indexOf("/") + 1, dot);
        const major = Number(majorStr);
        if (!Number.isInteger(major) || major < 0 || major > Big) {
          break;
        }
        const minorStr = vers.substring(dot + 1);
        const minor = Number(minorStr);
        if (!Number.isInteger(minor) || minor < 0 || minor > Big) {
          break;
        }
        return [major, minor];
      }
    }
    throw new Error(`malformed HTTP version ${vers}`);
  }
  async function readRequest(conn, bufr) {
    const tp = new TextProtoReader(bufr);
    const firstLine = await tp.readLine();
    if (firstLine === null)
      return null;
    const headers = await tp.readMIMEHeader();
    if (headers === null)
      throw new Deno.errors.UnexpectedEof();
    const req = new ServerRequest();
    req.conn = conn;
    req.r = bufr;
    [req.method, req.url, req.proto] = firstLine.split(" ", 3);
    [req.protoMajor, req.protoMinor] = parseHTTPVersion(req.proto);
    req.headers = headers;
    fixLength(req);
    return req;
  }
  function fixLength(req) {
    const contentLength = req.headers.get("Content-Length");
    if (contentLength) {
      const arrClen = contentLength.split(",");
      if (arrClen.length > 1) {
        const distinct = [...new Set(arrClen.map((e) => e.trim()))];
        if (distinct.length > 1) {
          throw Error("cannot contain multiple Content-Length headers");
        } else {
          req.headers.set("Content-Length", distinct[0]);
        }
      }
      const c = req.headers.get("Content-Length");
      if (req.method === "HEAD" && c && c !== "0") {
        throw Error("http: method cannot contain a Content-Length");
      }
      if (c && req.headers.has("transfer-encoding")) {
        throw new Error("http: Transfer-Encoding and Content-Length cannot be send together");
      }
    }
  }

  // deno:https://deno.land/std@0.92.0/http/server.ts
  var ServerRequest = class {
    url;
    method;
    proto;
    protoMinor;
    protoMajor;
    headers;
    conn;
    r;
    w;
    #done = deferred();
    #contentLength = void 0;
    #body = void 0;
    #finalized = false;
    get done() {
      return this.#done.then((e) => e);
    }
    get contentLength() {
      if (this.#contentLength === void 0) {
        const cl = this.headers.get("content-length");
        if (cl) {
          this.#contentLength = parseInt(cl);
          if (Number.isNaN(this.#contentLength)) {
            this.#contentLength = null;
          }
        } else {
          this.#contentLength = null;
        }
      }
      return this.#contentLength;
    }
    get body() {
      if (!this.#body) {
        if (this.contentLength != null) {
          this.#body = bodyReader(this.contentLength, this.r);
        } else {
          const transferEncoding = this.headers.get("transfer-encoding");
          if (transferEncoding != null) {
            const parts = transferEncoding.split(",").map((e) => e.trim().toLowerCase());
            assert(parts.includes("chunked"), 'transfer-encoding must include "chunked" if content-length is not set');
            this.#body = chunkedBodyReader(this.headers, this.r);
          } else {
            this.#body = emptyReader();
          }
        }
      }
      return this.#body;
    }
    async respond(r) {
      let err;
      try {
        await writeResponse(this.w, r);
      } catch (e) {
        try {
          this.conn.close();
        } catch {
        }
        err = e;
      }
      this.#done.resolve(err);
      if (err) {
        throw err;
      }
    }
    async finalize() {
      if (this.#finalized)
        return;
      const body = this.body;
      const buf = new Uint8Array(1024);
      while (await body.read(buf) !== null) {
      }
      this.#finalized = true;
    }
  };
  var Server = class {
    constructor(listener) {
      this.listener = listener;
    }
    #closing = false;
    #connections = [];
    close() {
      this.#closing = true;
      this.listener.close();
      for (const conn of this.#connections) {
        try {
          conn.close();
        } catch (e) {
          if (!(e instanceof Deno.errors.BadResource)) {
            throw e;
          }
        }
      }
    }
    async *iterateHttpRequests(conn) {
      const reader = new BufReader(conn);
      const writer = new BufWriter(conn);
      while (!this.#closing) {
        let request;
        try {
          request = await readRequest(conn, reader);
        } catch (error) {
          if (error instanceof Deno.errors.InvalidData || error instanceof Deno.errors.UnexpectedEof) {
            try {
              await writeResponse(writer, {
                status: 400,
                body: new TextEncoder().encode(`${error.message}\r
\r
`)
              });
            } catch {
            }
          }
          break;
        }
        if (request === null) {
          break;
        }
        request.w = writer;
        yield request;
        const responseError = await request.done;
        if (responseError) {
          this.untrackConnection(request.conn);
          return;
        }
        try {
          await request.finalize();
        } catch {
          break;
        }
      }
      this.untrackConnection(conn);
      try {
        conn.close();
      } catch {
      }
    }
    trackConnection(conn) {
      this.#connections.push(conn);
    }
    untrackConnection(conn) {
      const index = this.#connections.indexOf(conn);
      if (index !== -1) {
        this.#connections.splice(index, 1);
      }
    }
    async *acceptConnAndIterateHttpRequests(mux) {
      if (this.#closing)
        return;
      let conn;
      try {
        conn = await this.listener.accept();
      } catch (error) {
        if (error instanceof Deno.errors.BadResource || error instanceof Deno.errors.InvalidData || error instanceof Deno.errors.UnexpectedEof || error instanceof Deno.errors.ConnectionReset) {
          return mux.add(this.acceptConnAndIterateHttpRequests(mux));
        }
        throw error;
      }
      this.trackConnection(conn);
      mux.add(this.acceptConnAndIterateHttpRequests(mux));
      yield* this.iterateHttpRequests(conn);
    }
    [Symbol.asyncIterator]() {
      const mux = new MuxAsyncIterator();
      mux.add(this.acceptConnAndIterateHttpRequests(mux));
      return mux.iterate();
    }
  };

  // deno:https://deno.land/std@0.92.0/io/ioutil.ts
  var DEFAULT_BUFFER_SIZE = 32 * 1024;
  async function readShort(buf) {
    const high = await buf.readByte();
    if (high === null)
      return null;
    const low = await buf.readByte();
    if (low === null)
      throw new Deno.errors.UnexpectedEof();
    return high << 8 | low;
  }
  async function readInt(buf) {
    const high = await readShort(buf);
    if (high === null)
      return null;
    const low = await readShort(buf);
    if (low === null)
      throw new Deno.errors.UnexpectedEof();
    return high << 16 | low;
  }
  var MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);
  async function readLong(buf) {
    const high = await readInt(buf);
    if (high === null)
      return null;
    const low = await readInt(buf);
    if (low === null)
      throw new Deno.errors.UnexpectedEof();
    const big = BigInt(high) << 32n | BigInt(low);
    if (big > MAX_SAFE_INTEGER) {
      throw new RangeError("Long value too big to be represented as a JavaScript number.");
    }
    return Number(big);
  }
  function sliceLongToBytes(d, dest = new Array(8)) {
    let big = BigInt(d);
    for (let i = 0; i < 8; i++) {
      dest[7 - i] = Number(big & 0xffn);
      big >>= 8n;
    }
    return dest;
  }

  // deno:https://deno.land/std@0.92.0/hash/sha1.ts
  var HEX_CHARS = "0123456789abcdef".split("");
  var EXTRA = [-2147483648, 8388608, 32768, 128];
  var SHIFT = [24, 16, 8, 0];
  var blocks = [];
  var Sha1 = class {
    #blocks;
    #block;
    #start;
    #bytes;
    #hBytes;
    #finalized;
    #hashed;
    #h0 = 1732584193;
    #h1 = 4023233417;
    #h2 = 2562383102;
    #h3 = 271733878;
    #h4 = 3285377520;
    #lastByteIndex = 0;
    constructor(sharedMemory = false) {
      this.init(sharedMemory);
    }
    init(sharedMemory) {
      if (sharedMemory) {
        blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
        this.#blocks = blocks;
      } else {
        this.#blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
      this.#h0 = 1732584193;
      this.#h1 = 4023233417;
      this.#h2 = 2562383102;
      this.#h3 = 271733878;
      this.#h4 = 3285377520;
      this.#block = this.#start = this.#bytes = this.#hBytes = 0;
      this.#finalized = this.#hashed = false;
    }
    update(message) {
      if (this.#finalized) {
        return this;
      }
      let msg;
      if (message instanceof ArrayBuffer) {
        msg = new Uint8Array(message);
      } else {
        msg = message;
      }
      let index = 0;
      const length = msg.length;
      const blocks2 = this.#blocks;
      while (index < length) {
        let i;
        if (this.#hashed) {
          this.#hashed = false;
          blocks2[0] = this.#block;
          blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
        }
        if (typeof msg !== "string") {
          for (i = this.#start; index < length && i < 64; ++index) {
            blocks2[i >> 2] |= msg[index] << SHIFT[i++ & 3];
          }
        } else {
          for (i = this.#start; index < length && i < 64; ++index) {
            let code = msg.charCodeAt(index);
            if (code < 128) {
              blocks2[i >> 2] |= code << SHIFT[i++ & 3];
            } else if (code < 2048) {
              blocks2[i >> 2] |= (192 | code >> 6) << SHIFT[i++ & 3];
              blocks2[i >> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
            } else if (code < 55296 || code >= 57344) {
              blocks2[i >> 2] |= (224 | code >> 12) << SHIFT[i++ & 3];
              blocks2[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[i++ & 3];
              blocks2[i >> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
            } else {
              code = 65536 + ((code & 1023) << 10 | msg.charCodeAt(++index) & 1023);
              blocks2[i >> 2] |= (240 | code >> 18) << SHIFT[i++ & 3];
              blocks2[i >> 2] |= (128 | code >> 12 & 63) << SHIFT[i++ & 3];
              blocks2[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[i++ & 3];
              blocks2[i >> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
            }
          }
        }
        this.#lastByteIndex = i;
        this.#bytes += i - this.#start;
        if (i >= 64) {
          this.#block = blocks2[16];
          this.#start = i - 64;
          this.hash();
          this.#hashed = true;
        } else {
          this.#start = i;
        }
      }
      if (this.#bytes > 4294967295) {
        this.#hBytes += this.#bytes / 4294967296 >>> 0;
        this.#bytes = this.#bytes >>> 0;
      }
      return this;
    }
    finalize() {
      if (this.#finalized) {
        return;
      }
      this.#finalized = true;
      const blocks2 = this.#blocks;
      const i = this.#lastByteIndex;
      blocks2[16] = this.#block;
      blocks2[i >> 2] |= EXTRA[i & 3];
      this.#block = blocks2[16];
      if (i >= 56) {
        if (!this.#hashed) {
          this.hash();
        }
        blocks2[0] = this.#block;
        blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
      }
      blocks2[14] = this.#hBytes << 3 | this.#bytes >>> 29;
      blocks2[15] = this.#bytes << 3;
      this.hash();
    }
    hash() {
      let a = this.#h0;
      let b = this.#h1;
      let c = this.#h2;
      let d = this.#h3;
      let e = this.#h4;
      let f;
      let j;
      let t;
      const blocks2 = this.#blocks;
      for (j = 16; j < 80; ++j) {
        t = blocks2[j - 3] ^ blocks2[j - 8] ^ blocks2[j - 14] ^ blocks2[j - 16];
        blocks2[j] = t << 1 | t >>> 31;
      }
      for (j = 0; j < 20; j += 5) {
        f = b & c | ~b & d;
        t = a << 5 | a >>> 27;
        e = t + f + e + 1518500249 + blocks2[j] >>> 0;
        b = b << 30 | b >>> 2;
        f = a & b | ~a & c;
        t = e << 5 | e >>> 27;
        d = t + f + d + 1518500249 + blocks2[j + 1] >>> 0;
        a = a << 30 | a >>> 2;
        f = e & a | ~e & b;
        t = d << 5 | d >>> 27;
        c = t + f + c + 1518500249 + blocks2[j + 2] >>> 0;
        e = e << 30 | e >>> 2;
        f = d & e | ~d & a;
        t = c << 5 | c >>> 27;
        b = t + f + b + 1518500249 + blocks2[j + 3] >>> 0;
        d = d << 30 | d >>> 2;
        f = c & d | ~c & e;
        t = b << 5 | b >>> 27;
        a = t + f + a + 1518500249 + blocks2[j + 4] >>> 0;
        c = c << 30 | c >>> 2;
      }
      for (; j < 40; j += 5) {
        f = b ^ c ^ d;
        t = a << 5 | a >>> 27;
        e = t + f + e + 1859775393 + blocks2[j] >>> 0;
        b = b << 30 | b >>> 2;
        f = a ^ b ^ c;
        t = e << 5 | e >>> 27;
        d = t + f + d + 1859775393 + blocks2[j + 1] >>> 0;
        a = a << 30 | a >>> 2;
        f = e ^ a ^ b;
        t = d << 5 | d >>> 27;
        c = t + f + c + 1859775393 + blocks2[j + 2] >>> 0;
        e = e << 30 | e >>> 2;
        f = d ^ e ^ a;
        t = c << 5 | c >>> 27;
        b = t + f + b + 1859775393 + blocks2[j + 3] >>> 0;
        d = d << 30 | d >>> 2;
        f = c ^ d ^ e;
        t = b << 5 | b >>> 27;
        a = t + f + a + 1859775393 + blocks2[j + 4] >>> 0;
        c = c << 30 | c >>> 2;
      }
      for (; j < 60; j += 5) {
        f = b & c | b & d | c & d;
        t = a << 5 | a >>> 27;
        e = t + f + e - 1894007588 + blocks2[j] >>> 0;
        b = b << 30 | b >>> 2;
        f = a & b | a & c | b & c;
        t = e << 5 | e >>> 27;
        d = t + f + d - 1894007588 + blocks2[j + 1] >>> 0;
        a = a << 30 | a >>> 2;
        f = e & a | e & b | a & b;
        t = d << 5 | d >>> 27;
        c = t + f + c - 1894007588 + blocks2[j + 2] >>> 0;
        e = e << 30 | e >>> 2;
        f = d & e | d & a | e & a;
        t = c << 5 | c >>> 27;
        b = t + f + b - 1894007588 + blocks2[j + 3] >>> 0;
        d = d << 30 | d >>> 2;
        f = c & d | c & e | d & e;
        t = b << 5 | b >>> 27;
        a = t + f + a - 1894007588 + blocks2[j + 4] >>> 0;
        c = c << 30 | c >>> 2;
      }
      for (; j < 80; j += 5) {
        f = b ^ c ^ d;
        t = a << 5 | a >>> 27;
        e = t + f + e - 899497514 + blocks2[j] >>> 0;
        b = b << 30 | b >>> 2;
        f = a ^ b ^ c;
        t = e << 5 | e >>> 27;
        d = t + f + d - 899497514 + blocks2[j + 1] >>> 0;
        a = a << 30 | a >>> 2;
        f = e ^ a ^ b;
        t = d << 5 | d >>> 27;
        c = t + f + c - 899497514 + blocks2[j + 2] >>> 0;
        e = e << 30 | e >>> 2;
        f = d ^ e ^ a;
        t = c << 5 | c >>> 27;
        b = t + f + b - 899497514 + blocks2[j + 3] >>> 0;
        d = d << 30 | d >>> 2;
        f = c ^ d ^ e;
        t = b << 5 | b >>> 27;
        a = t + f + a - 899497514 + blocks2[j + 4] >>> 0;
        c = c << 30 | c >>> 2;
      }
      this.#h0 = this.#h0 + a >>> 0;
      this.#h1 = this.#h1 + b >>> 0;
      this.#h2 = this.#h2 + c >>> 0;
      this.#h3 = this.#h3 + d >>> 0;
      this.#h4 = this.#h4 + e >>> 0;
    }
    hex() {
      this.finalize();
      const h0 = this.#h0;
      const h1 = this.#h1;
      const h2 = this.#h2;
      const h3 = this.#h3;
      const h4 = this.#h4;
      return HEX_CHARS[h0 >> 28 & 15] + HEX_CHARS[h0 >> 24 & 15] + HEX_CHARS[h0 >> 20 & 15] + HEX_CHARS[h0 >> 16 & 15] + HEX_CHARS[h0 >> 12 & 15] + HEX_CHARS[h0 >> 8 & 15] + HEX_CHARS[h0 >> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h1 >> 28 & 15] + HEX_CHARS[h1 >> 24 & 15] + HEX_CHARS[h1 >> 20 & 15] + HEX_CHARS[h1 >> 16 & 15] + HEX_CHARS[h1 >> 12 & 15] + HEX_CHARS[h1 >> 8 & 15] + HEX_CHARS[h1 >> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h2 >> 28 & 15] + HEX_CHARS[h2 >> 24 & 15] + HEX_CHARS[h2 >> 20 & 15] + HEX_CHARS[h2 >> 16 & 15] + HEX_CHARS[h2 >> 12 & 15] + HEX_CHARS[h2 >> 8 & 15] + HEX_CHARS[h2 >> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h3 >> 28 & 15] + HEX_CHARS[h3 >> 24 & 15] + HEX_CHARS[h3 >> 20 & 15] + HEX_CHARS[h3 >> 16 & 15] + HEX_CHARS[h3 >> 12 & 15] + HEX_CHARS[h3 >> 8 & 15] + HEX_CHARS[h3 >> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h4 >> 28 & 15] + HEX_CHARS[h4 >> 24 & 15] + HEX_CHARS[h4 >> 20 & 15] + HEX_CHARS[h4 >> 16 & 15] + HEX_CHARS[h4 >> 12 & 15] + HEX_CHARS[h4 >> 8 & 15] + HEX_CHARS[h4 >> 4 & 15] + HEX_CHARS[h4 & 15];
    }
    toString() {
      return this.hex();
    }
    digest() {
      this.finalize();
      const h0 = this.#h0;
      const h1 = this.#h1;
      const h2 = this.#h2;
      const h3 = this.#h3;
      const h4 = this.#h4;
      return [
        h0 >> 24 & 255,
        h0 >> 16 & 255,
        h0 >> 8 & 255,
        h0 & 255,
        h1 >> 24 & 255,
        h1 >> 16 & 255,
        h1 >> 8 & 255,
        h1 & 255,
        h2 >> 24 & 255,
        h2 >> 16 & 255,
        h2 >> 8 & 255,
        h2 & 255,
        h3 >> 24 & 255,
        h3 >> 16 & 255,
        h3 >> 8 & 255,
        h3 & 255,
        h4 >> 24 & 255,
        h4 >> 16 & 255,
        h4 >> 8 & 255,
        h4 & 255
      ];
    }
    array() {
      return this.digest();
    }
    arrayBuffer() {
      this.finalize();
      const buffer = new ArrayBuffer(20);
      const dataView = new DataView(buffer);
      dataView.setUint32(0, this.#h0);
      dataView.setUint32(4, this.#h1);
      dataView.setUint32(8, this.#h2);
      dataView.setUint32(12, this.#h3);
      dataView.setUint32(16, this.#h4);
      return buffer;
    }
  };
  var HmacSha1 = class extends Sha1 {
    #sharedMemory;
    #inner;
    #oKeyPad;
    constructor(secretKey, sharedMemory = false) {
      super(sharedMemory);
      let key;
      if (typeof secretKey === "string") {
        const bytes = [];
        const length = secretKey.length;
        let index = 0;
        for (let i = 0; i < length; i++) {
          let code = secretKey.charCodeAt(i);
          if (code < 128) {
            bytes[index++] = code;
          } else if (code < 2048) {
            bytes[index++] = 192 | code >> 6;
            bytes[index++] = 128 | code & 63;
          } else if (code < 55296 || code >= 57344) {
            bytes[index++] = 224 | code >> 12;
            bytes[index++] = 128 | code >> 6 & 63;
            bytes[index++] = 128 | code & 63;
          } else {
            code = 65536 + ((code & 1023) << 10 | secretKey.charCodeAt(++i) & 1023);
            bytes[index++] = 240 | code >> 18;
            bytes[index++] = 128 | code >> 12 & 63;
            bytes[index++] = 128 | code >> 6 & 63;
            bytes[index++] = 128 | code & 63;
          }
        }
        key = bytes;
      } else {
        if (secretKey instanceof ArrayBuffer) {
          key = new Uint8Array(secretKey);
        } else {
          key = secretKey;
        }
      }
      if (key.length > 64) {
        key = new Sha1(true).update(key).array();
      }
      const oKeyPad = [];
      const iKeyPad = [];
      for (let i = 0; i < 64; i++) {
        const b = key[i] || 0;
        oKeyPad[i] = 92 ^ b;
        iKeyPad[i] = 54 ^ b;
      }
      this.update(iKeyPad);
      this.#oKeyPad = oKeyPad;
      this.#inner = true;
      this.#sharedMemory = sharedMemory;
    }
    finalize() {
      super.finalize();
      if (this.#inner) {
        this.#inner = false;
        const innerHash = this.array();
        super.init(this.#sharedMemory);
        this.update(this.#oKeyPad);
        this.update(innerHash);
        super.finalize();
      }
    }
  };

  // deno:https://deno.land/std@0.92.0/ws/mod.ts
  function unmask(payload, mask) {
    if (mask) {
      for (let i = 0, len = payload.length; i < len; i++) {
        payload[i] ^= mask[i & 3];
      }
    }
  }
  async function writeFrame(frame, writer) {
    const payloadLength = frame.payload.byteLength;
    let header;
    const hasMask = frame.mask ? 128 : 0;
    if (frame.mask && frame.mask.byteLength !== 4) {
      throw new Error("invalid mask. mask must be 4 bytes: length=" + frame.mask.byteLength);
    }
    if (payloadLength < 126) {
      header = new Uint8Array([128 | frame.opcode, hasMask | payloadLength]);
    } else if (payloadLength < 65535) {
      header = new Uint8Array([
        128 | frame.opcode,
        hasMask | 126,
        payloadLength >>> 8,
        payloadLength & 255
      ]);
    } else {
      header = new Uint8Array([
        128 | frame.opcode,
        hasMask | 127,
        ...sliceLongToBytes(payloadLength)
      ]);
    }
    if (frame.mask) {
      header = concat(header, frame.mask);
    }
    unmask(frame.payload, frame.mask);
    header = concat(header, frame.payload);
    const w = BufWriter.create(writer);
    await w.write(header);
    await w.flush();
  }
  async function readFrame(buf) {
    let b = await buf.readByte();
    assert(b !== null);
    let isLastFrame = false;
    switch (b >>> 4) {
      case 8:
        isLastFrame = true;
        break;
      case 0:
        isLastFrame = false;
        break;
      default:
        throw new Error("invalid signature");
    }
    const opcode = b & 15;
    b = await buf.readByte();
    assert(b !== null);
    const hasMask = b >>> 7;
    let payloadLength = b & 127;
    if (payloadLength === 126) {
      const l = await readShort(buf);
      assert(l !== null);
      payloadLength = l;
    } else if (payloadLength === 127) {
      const l = await readLong(buf);
      assert(l !== null);
      payloadLength = Number(l);
    }
    let mask;
    if (hasMask) {
      mask = new Uint8Array(4);
      assert(await buf.readFull(mask) !== null);
    }
    const payload = new Uint8Array(payloadLength);
    assert(await buf.readFull(payload) !== null);
    return {
      isLastFrame,
      opcode,
      mask,
      payload
    };
  }
  var WebSocketImpl = class {
    conn;
    mask;
    bufReader;
    bufWriter;
    sendQueue = [];
    constructor({
      conn,
      bufReader,
      bufWriter,
      mask
    }) {
      this.conn = conn;
      this.mask = mask;
      this.bufReader = bufReader || new BufReader(conn);
      this.bufWriter = bufWriter || new BufWriter(conn);
    }
    async *[Symbol.asyncIterator]() {
      const decoder2 = new TextDecoder();
      let frames = [];
      let payloadsLength = 0;
      while (!this._isClosed) {
        let frame;
        try {
          frame = await readFrame(this.bufReader);
        } catch {
          this.ensureSocketClosed();
          break;
        }
        unmask(frame.payload, frame.mask);
        switch (frame.opcode) {
          case 1 /* TextFrame */:
          case 2 /* BinaryFrame */:
          case 0 /* Continue */:
            frames.push(frame);
            payloadsLength += frame.payload.length;
            if (frame.isLastFrame) {
              const concat2 = new Uint8Array(payloadsLength);
              let offs = 0;
              for (const frame2 of frames) {
                concat2.set(frame2.payload, offs);
                offs += frame2.payload.length;
              }
              if (frames[0].opcode === 1 /* TextFrame */) {
                yield decoder2.decode(concat2);
              } else {
                yield concat2;
              }
              frames = [];
              payloadsLength = 0;
            }
            break;
          case 8 /* Close */: {
            const code = frame.payload[0] << 8 | frame.payload[1];
            const reason = decoder2.decode(frame.payload.subarray(2, frame.payload.length));
            await this.close(code, reason);
            yield { code, reason };
            return;
          }
          case 9 /* Ping */:
            await this.enqueue({
              opcode: 10 /* Pong */,
              payload: frame.payload,
              isLastFrame: true
            });
            yield ["ping", frame.payload];
            break;
          case 10 /* Pong */:
            yield ["pong", frame.payload];
            break;
          default:
        }
      }
    }
    dequeue() {
      const [entry] = this.sendQueue;
      if (!entry)
        return;
      if (this._isClosed)
        return;
      const { d, frame } = entry;
      writeFrame(frame, this.bufWriter).then(() => d.resolve()).catch((e) => d.reject(e)).finally(() => {
        this.sendQueue.shift();
        this.dequeue();
      });
    }
    enqueue(frame) {
      if (this._isClosed) {
        throw new Deno.errors.ConnectionReset("Socket has already been closed");
      }
      const d = deferred();
      this.sendQueue.push({ d, frame });
      if (this.sendQueue.length === 1) {
        this.dequeue();
      }
      return d;
    }
    send(data) {
      const opcode = typeof data === "string" ? 1 /* TextFrame */ : 2 /* BinaryFrame */;
      const payload = typeof data === "string" ? new TextEncoder().encode(data) : data;
      const isLastFrame = true;
      const frame = {
        isLastFrame,
        opcode,
        payload,
        mask: this.mask
      };
      return this.enqueue(frame);
    }
    ping(data = "") {
      const payload = typeof data === "string" ? new TextEncoder().encode(data) : data;
      const frame = {
        isLastFrame: true,
        opcode: 9 /* Ping */,
        mask: this.mask,
        payload
      };
      return this.enqueue(frame);
    }
    _isClosed = false;
    get isClosed() {
      return this._isClosed;
    }
    async close(code = 1e3, reason) {
      try {
        const header = [code >>> 8, code & 255];
        let payload;
        if (reason) {
          const reasonBytes = new TextEncoder().encode(reason);
          payload = new Uint8Array(2 + reasonBytes.byteLength);
          payload.set(header);
          payload.set(reasonBytes, 2);
        } else {
          payload = new Uint8Array(header);
        }
        await this.enqueue({
          isLastFrame: true,
          opcode: 8 /* Close */,
          mask: this.mask,
          payload
        });
      } catch (e) {
        throw e;
      } finally {
        this.ensureSocketClosed();
      }
    }
    closeForce() {
      this.ensureSocketClosed();
    }
    ensureSocketClosed() {
      if (this.isClosed)
        return;
      try {
        this.conn.close();
      } catch (e) {
        console.error(e);
      } finally {
        this._isClosed = true;
        const rest = this.sendQueue;
        this.sendQueue = [];
        rest.forEach((e) => e.d.reject(new Deno.errors.ConnectionReset("Socket has already been closed")));
      }
    }
  };

  // deno:https://deno.land/x/websocket@v0.1.4/lib/errors.ts
  var WebSocketError = class extends Error {
    constructor(e) {
      super(e);
      Object.setPrototypeOf(this, WebSocketError.prototype);
    }
  };

  // deno:https://deno.land/x/websocket@v0.1.4/lib/websocket.ts
  var GenericEventEmitter = class extends EventEmitter {
    on(...params) {
      return super.on(...params);
    }
    emit(...params) {
      return super.emit(...params);
    }
  };
  var StandardWebSocketClient = class extends GenericEventEmitter {
    constructor(endpoint) {
      super();
      this.endpoint = endpoint;
      if (this.endpoint !== void 0) {
        this.webSocket = new WebSocket(endpoint);
        this.webSocket.onopen = () => this.emit("open");
        this.webSocket.onmessage = (message) => this.emit("message", message);
        this.webSocket.onclose = () => this.emit("close");
        this.webSocket.onerror = () => this.emit("error");
      }
    }
    webSocket;
    async ping(message) {
      if (this.webSocket?.readyState === 0 /* CONNECTING */) {
        throw new WebSocketError("WebSocket is not open: state 0 (CONNECTING)");
      }
      return this.webSocket.send("ping");
    }
    async send(message) {
      if (this.webSocket?.readyState === 0 /* CONNECTING */) {
        throw new WebSocketError("WebSocket is not open: state 0 (CONNECTING)");
      }
      return this.webSocket.send(message);
    }
    async close(code = 1e3, reason) {
      if (this.webSocket.readyState === 2 /* CLOSING */ || this.webSocket.readyState === 3 /* CLOSED */) {
        return;
      }
      return this.webSocket.close(code, reason);
    }
    closeForce() {
      throw new Error("Method not implemented.");
    }
    get isClosed() {
      return this.webSocket.readyState === 2 /* CLOSING */ || this.webSocket.readyState === 3 /* CLOSED */;
    }
  };

  // deno:file:///C:/Users/NoahD/Workspace/ecom//lib/options.ts
  var HMR_PORT = 5555;
  var HMR_PATH = "ws://localhost:" + HMR_PORT;

  // deno:file:///C:/Users/NoahD/Workspace/ecom//lib/hmr/client.ts
  function main() {
    const ws = new StandardWebSocketClient(HMR_PATH);
    ws.on("message", function(message) {
      if (message.data === "RELOAD") {
        window.location.reload();
      }
    });
  }
  main();
})();
/*
 * [js-sha1]{@link https://github.com/emn178/js-sha1}
 *
 * @version 0.6.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
