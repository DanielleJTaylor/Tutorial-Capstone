// ch3/src/test/globalTeardown.js
export default async function globalTeardown() {
  if (global.__MONGOINSTANCE) await global.__MONGOINSTANCE.stop();
}
