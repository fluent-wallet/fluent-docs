// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const codeTheme = require("prism-react-renderer/themes/dracula");
const remarkCodesandbox = require("remark-codesandbox");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Fluent Wallet docs",
  // tagline: '',
  url: "https://docs.fluent.wallet",
  baseUrl: process.env.DEST || "/", // overwritten in github action for staging / latest
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/fluent-icon.svg",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "fluent-wallet", // Usually your GitHub org/user name.
  projectName: "fluent-docs", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  scripts: [
    { src: "https://plausible.io/js/script.js", defer: true, "data-domain": "docs.fluent.wallet" },
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: "conflux",
          routeBasePath: "conflux",
          sidebarPath: require.resolve("./conflux-sidebar.js"),
          breadcrumbs: false,
          remarkPlugins: [
            require("remark-docusaurus-tabs"),
            [remarkCodesandbox, {
              mode: "iframe",
              autoDeploy: process.env.NODE_ENV === "production",
            }],
          ],
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],
  plugins: [
    [
      "content-docs",
      /** @type {import('@docusaurus/plugin-content-docs').PluginOptions} */
      ({
        id: "espace",
        path: "espace",
        routeBasePath: "espace",
        sidebarPath: require.resolve("./espace-sidebar.js"),
        breadcrumbs: false,
        remarkPlugins: [
          require("remark-docusaurus-tabs"),
        ],
      }),
    ],
    [
      "@docusaurus/plugin-client-redirects",
      {
        fromExtensions: ["html", "htm"],
        redirects: [
          {
            from: "/guide/",
            to: "/conflux/",
          },
          {
            from: "/guide/getting-started",
            to: "/conflux/get-started/set-up-dev-environment",
          },
          {
            from: "/guide/common-terms",
            to: "/conflux/",
          },
          {
            from: "/guide/initializing-dapps",
            to: "/conflux/how-to/interact-with-smart-contracts",
          },
          {
            from: "/guide/accessing-accounts",
            to: "/conflux/get-started/access-accounts",
          },
          {
            from: "/guide/sending-transactions",
            to: "/conflux/how-to/send-transactions",
          },
          {
            from: "/guide/ethereum-provider",
            to: "/conflux/reference/provider-api",
          },
          {
            from: "/guide/rpc-api",
            to: "/conflux/reference/rpc-api",
          },
          {
            from: "/guide/signing-data",
            to: "/conflux/how-to/sign-data",
          },
          {
            from: "/guide/registering-function-names",
            to: "/conflux/how-to/register-method-names",
          },
          {
            from: "/guide/registering-your-token",
            to: "/conflux/how-to/register-token",
          },
          {
            from: "/guide/defining-your-icon",
            to: "/conflux/how-to/set-icon",
          },
          {
            from: "/guide/onboarding-library",
            to: "/conflux/how-to/use-onboarding-library",
          },
          {
            from: "/guide/metamask-extension-provider",
            to: "/conflux/how-to/access-provider",
          },
          {
            from: "/guide/espace",
            to: "/espace/",
          },
          {
            from: "/guide/espace-concepts",
            to: "/espace/category/concepts",
          },
          {
            from: "/guide/espace-rpc-api",
            to: "/espace/reference/rpc-api",
          },
          {
            from: "/guide/create-dapp",
            to: "/conflux/get-started/set-up-dev-environment",
          },
          {
            from: "/guide/contributors",
            to: "/conflux/",
          },
          {
            from: "/conflux/tutorials/simple-react-dapp",
            to: "/conflux/tutorials/react-dapp-local-state",
          },
        ].reduce((acc, item) => {
          acc.push(item);
          acc.push({ from: item.from + ".html", to: item.to });
          return acc;
        }, []),
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: " │ ‎ Documentation",
        logo: {
          alt: "Fluent logo",
          src: "img/fluent-logo.svg",
          srcDark: "img/fluent-logo-dark.svg",
          href: "/conflux/",
          width: 150,
        },
        items: [
          {
            type: "doc",
            docId: "index",
            label: "Conflux",
          },
          {
            type: "doc",
            docId: "index",
            docsPluginId:"espace",
            label: "eSpace",
          },
        ],
      },
      footer: {
        logo: {
          alt: "Fluent logo",
          src: "img/fluent-logo.svg",
          srcDark: "img/fluent-icon.svg",
          href: "https://fluent.wallet/",
          width: 250,
        },
        links: [
          {
            title: "Conflux",
            items: [
              {
                label: "Introduction",
                to: "/conflux",
              },
              {
                label: "Get started",
                to: "/conflux/category/get-started",
              },
              {
                label: "How to guides",
                to: "/conflux/category/how-to",
              },
              {
                label: "Tutorials",
                to: "/conflux/category/tutorials",
              },
              {
                label: "Reference",
                to: "/conflux/category/reference",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Fluent Twitter",
                href: "https://twitter.com/FluentWallet",
              },
              {
                label: "Documentation GitHub",
                href: "https://github.com/fluent-wallet/fluent-docs",
              },
              {
                label: "Fluent wallet GitHub",
                href: "https://github.com/Conflux-Chain/helios",
              },
            ],
          },
          // {
          //   title: "Legal",
          //   items: [
          //     {
          //       label: "Privacy Policy",
          //       href: "https://consensys.net/privacy-policy/",
          //     },
          //     {
          //       label: "Terms of Use",
          //       href: "https://consensys.net/terms-of-use/",
          //     },
          //     {
          //       label: "Contributor License Agreement",
          //       href: "https://metamask.io/cla/",
          //     },
          //   ],
          // },
        ],
        copyright: `© ${new Date().getFullYear()} Fluent Wallet • A Conflux Formation`,
      },
      prism: {
        theme: codeTheme,
        additionalLanguages: ["csharp","swift"],
      },
      algolia: {
        // The application ID provided by Algolia
        appId: "AWX4QVM59R",

        // Public API key: it is safe to commit it
        apiKey: "6095a25a6824bfa909fa0692e6847ec4",

        indexName: "mm--v2-staging",

        // Optional: see doc section below
        contextualSearch: true,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: "external\\.com|domain\\.com",

        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        replaceSearchResultPathname: {
          from:  "/",
          to: process.env.DEST || "/",
        },

        // Optional: Algolia search parameters
        searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: "search",

        //... other Algolia params
      },
    }),
};

module.exports = config;
