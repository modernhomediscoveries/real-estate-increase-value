import { useEffect, useState } from "react";

import { Input } from "./components/ui/input";
import { Slider } from "./components/ui/slider";
import { formatNumberInput, numberInterpret } from "./lib/number-formatter";
function App() {
  const initialData = {
    units: [16],
    rentIncrease: [150],
    occupancy: [90],
    capRate: [6],
  };
  const [formData, setFormData] = useState(initialData);
  const [valueIncrease, setValueIncrease] = useState(0);

  useEffect(() => {
    let currentDocumentHeight = 0;

    const sendMessageUpdatingHeight = (height: number) => {
      window.parent.postMessage(
        { eventName: "SET_HEIGHT", payload: { height } },
        "*"
      );
    };

    const handleDocumentMutation = () => {
      const documentHeight = document.body.scrollHeight;

      if (documentHeight && documentHeight !== currentDocumentHeight) {
        currentDocumentHeight = documentHeight;
        sendMessageUpdatingHeight(documentHeight);
      }
    };

    const observer = new MutationObserver(handleDocumentMutation);

    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      childList: true,
      characterData: true,
    });

    setTimeout(() => {
      const documentHeight = document.body.scrollHeight;
      sendMessageUpdatingHeight(documentHeight);
    }, 1000);
  }, []);

  useEffect(() => {
    const unitValue = numberInterpret(formData?.units[0] || 0);
    const rentIncreaseValue = numberInterpret(formData?.rentIncrease[0] || 0);
    const occupancyValue = numberInterpret(formData?.occupancy[0] || 0);
    const capRateValue = numberInterpret(formData?.capRate[0] || 1);

    const annualRent =
      unitValue * rentIncreaseValue * 12 * (occupancyValue / 100);
    const estimatedPropertyValue = annualRent / (capRateValue / 100);

    setValueIncrease(Math.round(estimatedPropertyValue));
  }, [formData]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    // Allow empty input to handle clearing the field
    const parsedValue = formatNumberInput(value);

    // Check if parsedValue is a number and greater than 0
    setFormData((prev) => ({
      ...prev,
      [name]: [
        parsedValue[parsedValue.length - 1] === "." ? parsedValue : parsedValue,
      ],
    }));
  }

  return (
    <div className="grid md:grid-cols-2 w-[1200px] max-w-full mx-auto text-[#2e3746]">
      <form className="bg-white p-5 rounded-t-[15px] md:rounded-none md:rounded-l-[15px]">
        <div>
          <div className="flex font-bold justify-between items-center mb-4">
            <p className="text-lg">Number Of Units:</p>
            <div className="relative">
              <Input
                name="units"
                value={formData.units[0]}
                onChange={handleChange}
                maxValue={999999}
              />
              <p className="absolute right-2 top-1/2  transform -translate-y-1/2">
                Units
              </p>
            </div>
          </div>
          <Slider
            name="units"
            onValueChange={(value: number[]) =>
              setFormData({ ...formData, units: value })
            }
            value={[Number(formData.units)]}
            defaultValue={[Number(formData.units)]}
            max={500}
            min={1}
            step={1}
          />
          <p className="text-start mt-2">
            Enter the total number of units in the property
          </p>
        </div>

        {/* 2 */}
        <hr className="my-3" />
        <div>
          <div className="flex font-bold justify-between items-center mb-4">
            <p className="text-lg">Number Of Units:</p>
            <div className="relative">
              <Input
                name="rentIncrease"
                value={formData.rentIncrease[0]}
                onChange={handleChange}
                maxValue={999999}
              />
              <p className="absolute right-2 top-1/2  transform -translate-y-1/2">
                USD
              </p>
            </div>
          </div>
          <Slider
            name="rentIncrease"
            onValueChange={(value: number[]) =>
              setFormData({ ...formData, rentIncrease: value })
            }
            value={[Number(formData.rentIncrease)]}
            defaultValue={[Number(formData.rentIncrease)]}
            max={2000}
            min={1}
            step={25}
          />
          <p className="text-start mt-2">
            Enter increase in rent charged per unit monthly
          </p>
        </div>

        {/* 3 */}
        <hr className="my-3" />
        <div>
          <div className="flex font-bold justify-between items-center mb-4">
            <p className="text-lg">Occupancy:</p>
            <div className="relative">
              <Input
                name="occupancy"
                value={formData.occupancy[0]}
                onChange={handleChange}
                maxValue={100}
              />
              <p className="absolute right-2 top-1/2  transform -translate-y-1/2">
                %
              </p>
            </div>
          </div>
          <Slider
            name="occupancy"
            onValueChange={(value: number[]) =>
              setFormData({ ...formData, occupancy: value })
            }
            value={[Number(formData.occupancy)]}
            defaultValue={[Number(formData.occupancy)]}
            max={100}
            min={0}
            step={1}
          />
          <p className="text-start mt-2">
            Enter the rate at which units will be occupied overall
          </p>
        </div>

        {/* 4 */}
        <hr className="my-3" />
        <div>
          <div className="flex font-bold justify-between items-center mb-4">
            <p className="text-lg">Capitalization Rate:</p>
            <div className="relative">
              <Input
                name="capRate"
                type="text"
                value={formData.capRate[0]}
                maxValue={100}
                onChange={handleChange}
              />
              <p className="absolute right-2 top-1/2  transform -translate-y-1/2">
                %
              </p>
            </div>
          </div>
          <Slider
            name="capRate"
            onValueChange={(value: number[]) =>
              setFormData({ ...formData, capRate: value })
            }
            value={[Number(formData.capRate)]}
            defaultValue={[Number(formData.capRate)]}
            max={100}
            min={1}
            step={0.25}
          />
          <p className="text-start mt-2">
            Enter the Cap Rate you're willing to pay
          </p>
        </div>
      </form>
      <div className="bg-black flex justify-center items-center py-16 px-8 rounded-b-[15px] md:rounded-none md:rounded-r-[15px] rounded-bl-[15px] md:rounded-bl-none">
        <div className="bg-white w-full py-3 rounded border-l-4 border-l-[#2ab499] text-center">
          <p>Property Value Increase</p>
          <p className="text-4xl font-semibold text-primary_green">
            ${" "}
            {isNaN(Number(valueIncrease))
              ? 0
              : Number(valueIncrease.toFixed(0)).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
