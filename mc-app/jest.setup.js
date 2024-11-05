import { ReadableStream } from "node:stream/web";

// Polyfill `ReadableStream` in the Jest environment
global.ReadableStream = ReadableStream;
