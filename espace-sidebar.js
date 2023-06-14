// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebar = {
  walletSidebar: [
    "index",
    {
      type: "category",
      label: "Get started",
      link: { type: "generated-index" },
      collapsed: false,
      items: [
        "get-started/set-up-dev-environment",
        // "get-started/run-development-network",
        "get-started/detect-fluent",
        "get-started/detect-network",
        "get-started/access-accounts",
      ],
    },
    {
      type: "category",
      label: "How to",
      link: { type: "generated-index" },
      items: [
        {
          type: "category",
          label: "Use JS-CONFLUX-SDK",
          link: {
            type: "doc",
            id: "how-to/use-sdk/index",
          },
          items: [
            {
              type: "category",
              label: "JavaScript",
              link: {
                type: "doc",
                id: "how-to/use-sdk/javascript/index",
              },
              items: [
                "how-to/use-sdk/javascript/react",
                "how-to/use-sdk/javascript/pure-js",
                "how-to/use-sdk/javascript/other-web-frameworks",
              ],
            },
          ],
        },
        "how-to/interact-with-smart-contracts",
        "how-to/send-transactions",
        "how-to/sign-data",
        "how-to/register-token",
        "how-to/secure-dapp",
        "how-to/set-icon",
      ],
    },
    {
      type: "category",
      label: "Concepts",
      link: { type: "generated-index" },
      items: [
        "concepts/convenience-libraries",
      ],
    },
    {
      type: "category",
      label: "Tutorials",
      link: { type: "generated-index" },
      items: [
        "tutorials/react-dapp-local-state",
        "tutorials/react-dapp-global-state",
      ],
    },
    {
      type: "category",
      label: "Reference",
      link: { type: "generated-index" },
      items: [
        "reference/provider-api",
        "reference/rpc-api",
      ],
    },
  ],
};

module.exports = sidebar;
