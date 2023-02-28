import { describe, expect, it } from "vitest";
import { MoEventStore } from "..";

describe("eventBus", () => {
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
    store.state.name="asd"
    expect(outName).to.equal("asd")
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
});
