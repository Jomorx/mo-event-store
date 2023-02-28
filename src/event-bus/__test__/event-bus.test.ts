import { describe, expect, it } from "vitest";
import { MoEventBus } from "..";

describe("eventBus", () => {
  it("test on and emit", () => {
    const bus = new MoEventBus();
    let count = 1;
    bus.on("event1", () => {
      count++;
    });
    bus.emit("event1");
    expect(count).to.equal(2);
  });

  it("test once and emit", () => {
    const bus = new MoEventBus();
    let count = 1;
    bus.once("event1", () => {
      count++;
    });
    bus.emit("event1");
    bus.emit("event1");
    expect(count).to.equal(2);
  });

  
});
