import '@shopify/ui-extensions/preact';
import {h, render} from "preact";

// 1. Export the extension
export default async () => {
  render(h(Extension, null), document.body);
};

function Extension() {
  // 2. Check instructions for feature availability
  if (!shopify.instructions.value.metafields.canSetCartMetafields) {
    return h(
      "s-banner",
      {heading: "checkout-ui", tone: "warning"},
      shopify.i18n.translate("metafieldChangesAreNotSupported"),
    );
  }

  const freeGiftRequested = shopify.appMetafields.value.find(
    (appMetafield) =>
      appMetafield.target.type === "cart" &&
      appMetafield.metafield.namespace === "$app" &&
      appMetafield.metafield.key === "requestedFreeGift",
  );

  console.log("shopify", freeGiftRequested);

  // 3. Render a UI
  return h(
    "s-banner",
    {heading: "checkout-ui"},
    h("s-stack", {gap: "base"}, [
      h(
        "s-text",
        null,
        shopify.i18n.translate("welcome", {
          target: h("s-text", {type: "emphasis"}, shopify.extension.target),
        }),
      ),
      h("s-checkbox", {
        checked: freeGiftRequested?.metafield?.value === "true",
        onChange: onCheckboxChange,
        label: shopify.i18n.translate("iWouldLikeAFreeGiftWithMyOrder"),
      }),
    ]),
  );

  async function onCheckboxChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    // 4. Call the API to modify checkout
    const result = await shopify.applyMetafieldChange({
      type: "updateCartMetafield",
      metafield: {
        namespace: "$app",
        key: "requestedFreeGift",
        value: isChecked ? "true" : "false",
        type: "boolean",
      },
    });
    console.log("applyMetafieldChange result", result);
  }
}
