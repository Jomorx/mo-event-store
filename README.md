## 基于事件订阅发布实现的store，用于管理不同组件中的数据
### EventBus
```ts
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

```
#### EventStore
```ts
it("test onState and emit", () => {
    let outName = ""
    let outHobby:any = []
    const store = new MoEventStore({
      state: {
        name: "Jomorx",
        hobby: ["coding", "play game"],
      },
    });
    store.onState("name",(name)=>{
        outName=name
    });
    store.state.name="Jomorx"
    expect(outName).to.equal("Jomorx")
    store.onState("hobby",(hobby)=>{
      outHobby=hobby
    })
    store.state.hobby[2]="basketball"
    expect(outHobby[1]).to.equal(store.state.hobby[1])
  });


  it("test onState and offState", () => {
    let outName = ""
    const store = new MoEventStore({
      state: {
        name: "Jomorx",
        hobby: ["coding", "play game"],
      }
    });
    const handleStateChange = (name:string)=>{
        outName=name
    }
    store.onState("name",handleStateChange);
    store.state.name="Jerry"
    store.offState("name",handleStateChange)
    store.state.name="Linxae"
    expect(outName).to.equal("Jerry")
  });


  it("test dispatch and onState", () => {
    let outName = ""
    const store = new MoEventStore({
      state: {
        name: "Jomorx",
        hobby: ["coding", "play game"],
      },
      actions:{
        changName(ctx){
          ctx.name="Linxae"
        }
      }
    });
    const handleStateChange = (name:string)=>{
        outName=name
    }
    store.onState("name",handleStateChange);
    store.dispatch("changName")
    expect(outName).to.equal("Linxae")
  });
```