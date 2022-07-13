import { h, Component, tw } from "quickdraw/client";
import { Loader } from "@app/common/ui/loader.tsx";
import { RefreshButton } from "@app/common/ui/button.tsx";

type NameRes = { name: string };

const fetchname = async () => {
  const res = await fetch("/api/names/random");
  const json: NameRes = await res.json();
  const name = json.name;
  return name;
};

export class Names extends Component {
  didMount() {
    this.get();
  }

  async get() {
    const name = await fetchname();
    this.update(name);
  }

  list(name: string) {
    return (
      <div class={tw`border border-[#eee] drop-shadow-sm p-4 mt-2 rounded-lg`}>
        <h1 class={tw`font-medium`}>CSR Example</h1>
        <p class={tw`text-md mt-4`}>
          I'm a randomly generated name fetching in CSR land: <br />
        </p>
        <strong class={tw`text-md mt-2 mb-4 inline-block`}>{name}</strong>
        {name !== "" && (
          <RefreshButton onClick={this.get.bind(this)}>Refresh</RefreshButton>
        )}
      </div>
    );
  }

  render(name: string) {
    if (name) return this.list(name);
    else
      return (
        <div id="names">
          <Loader />
        </div>
      );
  }
}
